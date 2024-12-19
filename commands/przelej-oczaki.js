const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('przelej-oczaki')
        .setDescription('Przelewa Oczaki z jednej postaci na drugą')
        .addStringOption(option =>
            option.setName('od')
                .setDescription('Nazwa postaci, od której przelewasz')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('do')
                .setDescription('Nazwa postaci, do której przelewasz')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('kwota')
                .setDescription('Kwota Oczaków do przelania')
                .setRequired(true)),
    async execute(interaction) {
        const from = interaction.options.getString('od');
        const to = interaction.options.getString('do');
        const amount = interaction.options.getInteger('kwota');
        const data = JSON.parse(fs.readFileSync('./postacie.json', 'utf-8'));

        if (!data[from] || !data[to]) {
            await interaction.reply({ content: 'Jedna z postaci nie istnieje.', ephemeral: true });
            return;
        }

        if (data[from].owner !== interaction.user.id) {
            await interaction.reply({ content: 'Nie jesteś właścicielem tej postaci.', ephemeral: true });
            return;
        }

        if (data[from].oczaki < amount) {
            await interaction.reply({ content: 'Nie masz wystarczająco dużo Oczaków.', ephemeral: true });
            return;
        }

        data[from].oczaki -= amount;
        data[to].oczaki += amount;

        fs.writeFileSync('./postacie.json', JSON.stringify(data, null, 2));
        await interaction.reply(`Przelano ${amount} Oczaków z **${from}** do **${to}**.`);
    }
};