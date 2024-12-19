const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;

console.log('Uruchamianie bota...');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = new Map();
fs.readdirSync('./commands').forEach(file => {
    const command = require(`./commands/${file}`);
    commands.set(command.data.name, command);
});

client.once('ready', () => {
    console.log(`Bot jest online jako ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Wystąpił błąd podczas wykonywania tej komendy!', ephemeral: true });
    }
});

client.login(TOKEN).catch(error => {
    console.error('Nie udało się zalogować bota:', error);
});
