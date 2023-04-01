import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';

dotenv.config();

const commands = [
    {
        name: 'clear',
        description: 'Clears messages and history',
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

(async () => {
    try {

        console.log('Registering commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands }
        )

        console.log('Successfully registered commands.');
    }
    catch (error) {
        console.error(error);
    }
})();