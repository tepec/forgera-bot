# FORGERA DISCORD BOT
A bot that looks every two hours for new maps, modes and prefabs posted on forge.xboxera.com and post them in given discord channels.

<img src="https://media.discordapp.net/attachments/718240290342830150/1108155521955008512/image.png" alt="an example of automatic post">

## SETUP

### Create the bot on Discord Developer Portal

1. Go to https://discord.com/developers/applications.
2. Click on "New Application" and create the bot's application.
3. Copy the `APPLICATION ID` in the "General Information" tab (in the left sidebar), and keep it for later use.
4. Go to the "Bot" tab (in the left sidebar).
5. Name the bot and give it an icon.
6. Click on `Reset Token`, then copy the token and keep it for later use.


### Setup the project
1. Install [Node JS](https://nodejs.org/) (LTS version recommended).
2. In a terminal, run `cp .env.dist .env`.
3. In the newly created `.env` file, fill the variables with the Application ID and Bot Token you got earlier.
4. In your terminal, run `npm install`.

### Run the bot
In the terminal, run `npm run start`.

### Add the bot to your discord server

In the following URL, replace `%APPLICATION_ID%` with the Application ID you got earlier, and paste it in your web browser.

`https://discord.com/api/oauth2/authorize?client_id=${APPLICATION_ID}&permissions=0&scope=bot%20applications.commands`

### Define the channels where to post

Once the bot is added to your server, you can run the slash command `/setup` to tell the bot where to post new maps, modes and prefabs.

### (Optional) If you want to host the bot on Docker

1. In your terminal, run `docker build -t forgera-bot .`.
2. Once it's completed, run `docker run -d forgera-bot`.