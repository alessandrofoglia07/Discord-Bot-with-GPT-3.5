import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';

dotenv.config();

const commands = [
    {
        name: 'clear',
        description: 'Clears messages and history',
    },
    {
        name: 'chat-normal-mode',
        description: 'Switches to normal chat mode. Kind and friendly',
    },
    {
        name: 'chat-evil-mode',
        description: 'Switches to evil chat mode. Mean and rude',
    },
    {
        name: 'help',
        description: 'Shows commands'
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