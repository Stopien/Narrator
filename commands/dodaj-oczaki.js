const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dodaj-oczaki')
        .setDescription('Dodaje Oczaki do wybranej postaci (tylko admin)')
        .addStringOption(option =>
            option.setName('postac')
                .setDescription('Nazwa postaci')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('kwota')
                .setDescription('Kwota Oczaków do dodania')
                .setRequired(true)),
    async execute(interaction) {
        const character = interaction.options.getString('postac');
        const amount = interaction.options.getInteger('kwota');
        const data = JSON.parse(fs.readFileSync('./postacie.json', 'utf-8'));

        if (!data[character]) {
            await interaction.reply({ content: 'Podana postać nie istnieje.', ephemeral: true });
            return;
        }

        if (!interaction.member.roles.cache.some(role => role.id === '1294360602512457791')) { //ze rola admina wieicie bo zasrane gwiazdki na starcie ;-;
            await interaction.reply({ content: 'Nie masz uprawnień do tej komendy.', ephemeral: true });
            return;
        }

        data[character].oczaki += amount;
        fs.writeFileSync('./postacie.json', JSON.stringify(data, null, 2));
        await interaction.reply(`Dodano ${amount} Oczaków do **${character}**.`);
    }
};