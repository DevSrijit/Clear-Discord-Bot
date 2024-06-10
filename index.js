const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const cron = require('node-cron');
const getRegistrations = require('./getRegistrations');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let lastCount = null;

// Register slash command
const commands = [
  {
    name: 'tickets',
    description: 'Get the current registration count',
  },
];

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log('Bot is online!');

  // Schedule a task to run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const count = await getRegistrations();

      if (lastCount === null) {
        lastCount = count;
      } else if (count !== lastCount) {
        lastCount = count;
        const channel = client.channels.cache.get(config.channelId);
        if (channel) {
          channel.send(`There is a new registration. Total registration count: ${count}`);
        }
      }
    } catch (error) {
      console.error('Error fetching registration count:', error);
    }
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'tickets') {
    await interaction.deferReply();
    try {
      const count = await getRegistrations();
      lastCount = count;
      await interaction.editReply(`Current registration count: ${count}`);
    } catch (error) {
      console.error('Error fetching registration count:', error);
      await interaction.editReply('Failed to fetch registration count.');
    }
  }
});

client.login(config.token); // Replace with your bot token
