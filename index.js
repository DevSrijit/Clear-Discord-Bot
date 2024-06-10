const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const cron = require('node-cron');
const axios = require('axios'); // Ensure axios is installed
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

// New function to perform the GraphQL request using axios
async function getTicketDetails() {
  const query = `
    query {
      clear {
        event(where:{id:"${config.event_id}"}) {
          soldTickets
          remainingTickets
          tickets(
            orderBy:[{ createdAt: desc }],
            take: 1
          ) {
            firstName
            lastName
            age
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post("http://graph.codeday.org/", {
      query: query
    }, {
      headers: {
        "X-Clear-Authorization": `Bearer ${config.api_key}`,
        "Content-Type": "application/json"
      }
    });
    return response.data.data.clear.event;
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    throw error; // Rethrow to handle it in the calling context
  }
}

client.once('ready', () => {
  console.log('Bot is online!');

  // Schedule a task to run every 5 minutes
  cron.schedule('*/1 * * * *', async () => {
    try {
      const eventDetails = await getTicketDetails();
      const count = eventDetails.soldTickets;
      if (lastCount === null) {
        lastCount = count;
      } else if (count !== lastCount) {
        lastCount = count;
        const channel = client.channels.cache.get('1249638972335067156'); // Replace with your channel ID
        if (channel) {
          channel.send(`# There is a new registration. Total registration count: ${count}\n` + "\n## Ticket Details:\n" + `### Name: ${eventDetails.tickets[0].firstName} ${eventDetails.tickets[0].lastName}\n### Age: ${eventDetails.tickets[0].age}\n\n### Total Tickets Sold: ${eventDetails.soldTickets}\n### Remaining Tickets: ${eventDetails.remainingTickets}\n\nFor more details, visit [Clear](https://clear.codeday.org/).`);
        }
      }
    } catch (error) {
      console.error('Error in scheduled task:', error);
    }
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'tickets') {
    await interaction.deferReply();
    try {
      const eventDetails = await getTicketDetails();
      const replyMessage = "Here are the latest registration details:\n" + "Total Tickets Sold: " + eventDetails.soldTickets + "\nRemaining Tickets: " + eventDetails.remainingTickets + "\nLast Ticket Details:\n" + "Name: " + eventDetails.tickets[0].firstName + " " + eventDetails.tickets[0].lastName + "\nAge: " + eventDetails.tickets[0].age + "\n\nFor more details, visit [Clear](https://clear.codeday.org/).";
      await interaction.editReply(replyMessage);
    } catch (error) {
      console.error('Error handling /tickets command:', error);
      await interaction.editReply('Failed to fetch ticket details.');
    }
  }
});

client.login(config.token); // Replace with your bot token
