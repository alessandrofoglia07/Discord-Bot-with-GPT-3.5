import dotenv from 'dotenv';
import { Client, IntentsBitField, ActivityType } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";
import { log } from 'console';

dotenv.config();

const openAIConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAIConfig);

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
    ]
});

console.log('Starting bot...');

client.on('ready', (c) => {
    console.log(`Logged in as ${c.user.tag}!`);

    client.user?.setActivity({
        name: 'Alexxino',
        type: ActivityType.Watching
    }); 
});

type Chatlog = {role: string, content: string}[];

const gpt = async (messages: Chatlog) => {
    const res = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages as any,
    });
    console.log(res.data.choices[0].message?.content);
    return res;
}; 

let conversationLog: Chatlog = [{ role: 'system', content: 'Be nice. You are a frinedly bot.' }];

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.id !== process.env.CHANNEL_ID) return;

    conversationLog.push({
        role: 'user',
        content: msg.content
    });

    await msg.channel.sendTyping();

    const res = await gpt(conversationLog);
    const finalMessage = res.data.choices[0].message?.content;

    if (!finalMessage) return;
    msg.reply(finalMessage);
});

client.on('interactionCreate', (interaction) => {
    log('1')
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'clear') {
        conversationLog = [{ role: 'system', content: 'Be nice. You are a frinedly bot.' }];
        interaction.reply('Cleared conversation log.');
        log('Cleared conversation log.');
    }
});

client.login(process.env.BOT_TOKEN);