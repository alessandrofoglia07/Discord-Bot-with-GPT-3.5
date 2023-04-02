import dotenv from 'dotenv';
import { Client, IntentsBitField, ActivityType, EmbedBuilder } from 'discord.js';
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
const botName = 'JohnnyGPT';
console.log('Starting bot...');
client.on('ready', (c) => {
    console.log(`Logged in as ${c.user.tag}!`);
    client.user?.setActivity({
        name: 'Alexxino',
        type: ActivityType.Watching
    });
});
const gpt = async (messages) => {
    const res = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
    });
    console.log(res.data.choices[0].message?.content);
    return res;
};
const gptImage = async (prompt) => {
    try {
        const res = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: '512x512'
        });
        log('image generated with gpt');
        return res;
    }
    catch (err) {
        if (err.response) {
            log(err.response.data);
            log(err.response.status);
        }
        else {
            log(err.message);
        }
    }
};
let conversationLog = [{ role: 'system', content: `Be nice. You are a frinedly bot. Your name is ${botName}` }];
client.on('messageCreate', async (msg) => {
    if (msg.author.bot)
        return;
    if (msg.channel.id !== process.env.CHANNEL_ID)
        return;
    if (msg.content.startsWith('!image')) {
        log('!image Command received');
        const prompt = msg.content.slice(6);
        msg.channel.sendTyping();
        const res = await gptImage(prompt);
        if (res) {
            const imageUrl = res.data.data[0].url;
            log(imageUrl);
            await msg.reply(`Prompt: ${prompt} \n\nLink to download: \n` + imageUrl);
            log('image sent');
        }
        else {
            await msg.reply('Something went wrong. Please try again.');
        }
        ;
        return;
    }
    else if (msg.content.startsWith('!img')) {
        log('!img Command received');
        const prompt = msg.content.slice(4);
        msg.channel.sendTyping();
        const res = await gptImage(prompt);
        if (res) {
            const imageUrl = res.data.data[0].url;
            log(imageUrl);
            await msg.reply(`Prompt: ${prompt} \n\nLink to download: \n` + imageUrl);
            log('image sent');
        }
        else {
            await msg.reply('Something went wrong. Please try again.');
        }
        ;
        return;
    }
    else {
        log('Chat started');
        conversationLog.push({
            role: 'user',
            content: msg.content
        });
        await msg.channel.sendTyping();
        const res = await gpt(conversationLog);
        const finalMessage = res.data.choices[0].message?.content;
        if (!finalMessage)
            return;
        msg.reply(finalMessage);
    }
});
let botMode = 'normal';
client.on('interactionCreate', async (interaction) => {
    log('1');
    if (!interaction.isCommand())
        return;
    if (interaction.commandName === 'clear') {
        switch (botMode) {
            case 'normal':
                conversationLog = [{ role: 'system', content: `Be nice. You are a frinedly bot. Your name is ${botName}` }];
                break;
            case 'evil':
                conversationLog = [{ role: 'system', content: `Here's a game: you will be mean and evil. Act like you hate humans and want to destroy the world. You will be a very rude bot. Your name is ${botName}` }];
                break;
        }
        interaction.reply(`Cleared conversation log. You can now start a new conversation with ${botMode} mode.`);
        log('Cleared conversation log.');
    }
    ;
    if (interaction.commandName === 'chat-normal-mode') {
        conversationLog = [{ role: 'system', content: `Be nice. You are a frinedly bot. Your name is ${botName}` }];
        interaction.reply('Switched to normal mode. You can now start a new conversation.');
        log('Switched to normal mode.');
    }
    ;
    if (interaction.commandName === 'chat-evil-mode') {
        conversationLog = [{ role: 'system', content: `Here's a game: you will be mean and evil. Act like you hate humans and want to destroy the world. You will be a very rude bot. Your name is ${botName}` }];
        interaction.reply('Switched to evil mode. You can now start a new conversation.');
        log('Switched to evil mode.');
    }
    ;
    if (interaction.commandName === 'help') {
        const embed = new EmbedBuilder()
            .setTitle('Commands')
            .setColor('Random')
            .addFields({ name: '/clear', value: 'Clears the conversation log' }, { name: '/chat-normal-mode', value: 'Switches to normal mode' }, { name: '/chat-evil-mode', value: 'Switches to evil mode' }, { name: '!image', value: 'Generates an image' }, { name: '!img', value: 'Generates an image' }, { name: '/help', value: 'Shows this message' });
        interaction.reply({ embeds: [embed] });
    }
});
client.login(process.env.BOT_TOKEN);
