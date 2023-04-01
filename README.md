# OpenAI with NodeJS
Discord bot with gpt 3.5 turbo support.

-- You'll need a OpenAI API key
    Visit https://openai.com/blog/openai-api for more

-- You'll need an .env file with this structure
    OPENAI_API_KEY="YOUR-OPENAI-KEY"
    CHANNEL_ID="A_DISCORD_CHANNEL_ID"
    BOT_TOKEN="YOUR_DISCORD_BOT_TOKEN"
    CLIENT_ID="ID_OF_DISCORD_BOT"

### `npm start`
Runs the server (using concurrently, nodemon, and obviously tsc).

### `npm run registerCommands`
Runs registerCommands and update the commands.