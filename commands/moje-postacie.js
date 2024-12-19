const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moje-postacie')
        .setDescription('Pokazuje twoje postacie.'),
    async execute(interaction) {
        const postacie = JSON.parse(fs.readFileSync('./postacie.json', 'utf8'));
        const userId = interaction.user.id;

        const mojePostacie = Object.entries(postacie)
            .filter(([_, data]) => data.owner === userId);

        if (mojePostacie.length === 0) {
            return interaction.reply('Nie posiadasz żadnych postaci.');
        }

        let response = `Postacie użytkownika ${interaction.user.username}\n`;
        mojePostacie.forEach(([nazwa, data]) => {
            response += `-> ${nazwa} | ${data.oczaki} oczaków\n`;
        });
        response += `Liczba postaci: ${mojePostacie.length}`;

        interaction.reply(`\`\`\`\n${response}\n\`\`\``);
    },
};
