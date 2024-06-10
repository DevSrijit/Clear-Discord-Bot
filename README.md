# CodeDay Kolkata Registration Count Bot

## Motivation

This project automates the process of tracking registration counts for CodeDay Kolkata, a 24 hour long Coding Event organized in Kolkata. It utilizes a Discord bot to notify server members whenever there is a new registration. Additionally, it provides a slash command `/tickets` to retrieve the current registration count on demand.

## Setup

Follow these steps to set up and deploy the CodeDay Registration Count Bot:

```bash
# Clone the Repository
git clone https://github.com/devsrijit/clear-discord-bot.git

# Navigate to the Project Directory
cd clear-discord-bot

# Install Dependencies
npm install
```

### Configure Bot Settings

Update the configuration files to include your Discord bot credentials and other necessary details:

#### `config.json`

```json
{
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_GUILD_ID",
  "token": "YOUR_BOT_TOKEN",
  "channelId": "YOUR_CHANNEL_ID",
  "api_key": "YOUR_CLEAR_API_TOKEN",
  "event_id": "YOUR_CODEDAY_EVENT_ID"
}
```

### Run the Bot

Start the bot by running the `bot.js` file:

```bash
npm start
```

## I hope this helps you keep track of the registrations at your event ! Happy hacking.
