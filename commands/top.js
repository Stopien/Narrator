const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Pokazuje tabelę TOP 10 postaci z największą ilością oczaków.'),
    async execute(interaction) {
        const postacie = JSON.parse(fs.readFileSync('./postacie.json', 'utf8'));

        const top10 = Object.entries(postacie)
            .sort((a, b) => b[1].oczaki - a[1].oczaki)
            .slice(0, 10);

        if (top10.length === 0) {
            return interaction.reply('Brak postaci w bazie.');
        }

        let ranking = 'Top 10 najbogatszych postaci\n';
        top10.forEach(([nazwa, data], index) => {
            ranking += `${index + 1}. ${nazwa} | ${data.oczaki} oczaków\n`;
        });

        interaction.reply(`\`\`\`\n${ranking}\n\`\`\``);
    },
};
