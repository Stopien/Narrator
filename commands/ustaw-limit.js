const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ustaw-limit')
        .setDescription('Zmień limit postaci dla użytkownika.')
        .addUserOption(option =>
            option.setName('uzytkownik')
                .setDescription('Użytkownik, dla którego chcesz ustawić limit.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('Nowy limit postaci dla użytkownika.')
                .setRequired(true)),
    async execute(interaction) {
        const adminRole = interaction.guild.roles.cache.find(role => role.id === 1294360602512457791); // Nazwa roli admina
        if (!interaction.member.roles.cache.has(adminRole.id)) {
            return interaction.reply({
                content: 'Nie masz uprawnień do użycia tej komendy.',
                ephemeral: true
            });
        }

        const targetUser = interaction.options.getUser('uzytkownik');
        const newLimit = interaction.options.getInteger('limit');

        if (newLimit < 1) {
            return interaction.reply({
                content: 'Limit postaci musi być większy od zera.',
                ephemeral: true
            });
        }

        const limitsPath = './limits.json';
        let limits = {};

        if (fs.existsSync(limitsPath)) {
            limits = JSON.parse(fs.readFileSync(limitsPath, 'utf8'));
        }

        // Ustawienie nowego limitu dla użytkownika
        limits[targetUser.id] = newLimit;

        // Zapisanie zmian do pliku
        fs.writeFileSync(limitsPath, JSON.stringify(limits, null, 2));

        await interaction.reply(`Limit postaci dla użytkownika **${targetUser.username}** został ustawiony na **${newLimit}**.`);
    }
};
