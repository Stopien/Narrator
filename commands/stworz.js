const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stworz')
        .setDescription('Tworzy nową postać')
        .addStringOption(option =>
            option.setName('nazwa')
                .setDescription('Nazwa postaci')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ataki')
                .setDescription('Lista ataków (oddzielona przecinkami)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('obrony')
                .setDescription('Lista obron (oddzielona przecinkami)')
                .setRequired(true)),
    async execute(interaction) {
        const nazwa = interaction.options.getString('nazwa');
        const ataki = interaction.options.getString('ataki').split(',');
        const obrony = interaction.options.getString('obrony').split(',');
        const owner = interaction.user.id;

        const postacie = JSON.parse(fs.readFileSync('./postacie.json', 'utf-8'));
        const limits = JSON.parse(fs.readFileSync('./limits.json', 'utf-8') || '{}');

        //domyslny limit czy cus
        const defaultLimit = 5;
        const userLimit = limits[owner] || defaultLimit;

        //Limit
        const userPostacie = Object.values(postacie).filter(postac => postac.owner === owner);
        if (userPostacie.length >= userLimit) {
            await interaction.reply({
                content: `Nie możesz mieć więcej niż **${userLimit}** postaci. Skontaktuj się z administratorem, aby zwiększyć limit.`,
                ephemeral: true
            });
            return;
        }

        if (postacie[nazwa]) {
            await interaction.reply({ content: 'Postać o tej nazwie już istnieje.', ephemeral: true });
            return;
        }

        postacie[nazwa] = {
            owner,
            attacks: ataki,
            defenses: obrony,
            oczaki: 160
        };

        fs.writeFileSync('./postacie.json', JSON.stringify(postacie, null, 2));
        await interaction.reply(`Postać **${nazwa}** została stworzona!`);
    }
};
