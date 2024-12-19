const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ilosc-oczakow')
        .setDescription('Pokazuje ilość oczaków danej postaci.')
        .addStringOption(option =>
            option.setName('nazwa_postaci')
                .setDescription('Nazwa postaci')
                .setRequired(true)),
    async execute(interaction) {
        const postacie = JSON.parse(fs.readFileSync('./postacie.json', 'utf8'));
        const nazwaPostaci = interaction.options.getString('nazwa_postaci');

        if (!postacie[nazwaPostaci]) {
            return interaction.reply(`Postać **${nazwaPostaci}** nie istnieje.`);
        }

        const oczaki = postacie[nazwaPostaci].oczaki;
        interaction.reply(`Postać **${nazwaPostaci}** posiada **${oczaki} oczaków**.`);
    },
};
