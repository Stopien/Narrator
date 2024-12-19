const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('walka')
        .setDescription('Rozpocznij walkę między dwiema postaciami')
        .addStringOption(option =>
            option.setName('postac1')
                .setDescription('Pierwsza postać')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('postac2')
                .setDescription('Druga postać')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('liczba_rund')
                .setDescription('Liczba rund do rozegrania')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)),
    async execute(interaction) {
        const postacieData = JSON.parse(fs.readFileSync('./postacie.json', 'utf-8'));
        const postac1 = interaction.options.getString('postac1');
        const postac2 = interaction.options.getString('postac2');
        const rounds = interaction.options.getInteger('liczba_rund') || 3;

        if (!postacieData[postac1] || !postacieData[postac2]) {
            return interaction.reply({ content: 'Jedna z podanych postaci nie istnieje.', ephemeral: true });
        }

        const attacker = postacieData[postac1];
        const defender = postacieData[postac2];

        // Walidacja ataków
        if (!validateCharacter(attacker, postac1, interaction) || !validateCharacter(defender, postac2, interaction)) {
            return;
        }

        let score1 = 0;
        let score2 = 0;
        const messages = [];

        for (let i = 0; i < rounds; i++) {
            const attack = randomChoice(attacker.attacks);
            const defense = randomChoice(defender.defenses);

            messages.push(`🔴 **${postac1}** ${attack} **${postac2}**!`);
            messages.push(`🟢 **${postac2}** ${defense} **${postac1}**!`);

            if (Math.random() < 0.3) {
                messages.push(`💥 **${postac2}** otrzymuje obrażenia!`);
                score1++;
            }

            const counterAttack = randomChoice(defender.attacks);
            const counterDefense = randomChoice(attacker.defenses);

            messages.push(`🔴 **${postac2}** ${counterAttack} **${postac1}**!`);
            messages.push(`🟢 **${postac1}** ${counterDefense} **${postac2}**!`);

            if (Math.random() < 0.3) {
                messages.push(`💥 **${postac1}** otrzymuje obrażenia!`);
                score2++;
            }
        }

        messages.push(`**Wynik walki:**`);
        messages.push(`**${postac1}**: ${score1} punktów`);
        messages.push(`**${postac2}**: ${score2} punktów`);

        if (score1 > score2) {
            messages.push(`Zwycięzcą jest **${postac1}**!`);
        } else if (score2 > score1) {
            messages.push(`Zwycięzcą jest **${postac2}**!`);
        } else {
            messages.push(`Doszło do **remisu**.`);
        }

        await interaction.reply(messages.join('\n'));
    },
};

function validateCharacter(character, name, interaction) {
    if (!character.attacks || !Array.isArray(character.attacks) || !character.attacks.length) {
        interaction.reply({ content: `Postać **${name}** nie ma zdefiniowanych ataków.`, ephemeral: true });
        return false;
    }
    if (!character.defenses || !Array.isArray(character.defenses) || !character.defenses.length) {
        interaction.reply({ content: `Postać **${name}** nie ma zdefiniowanych obron.`, ephemeral: true });
        return false;
    }
    return true;
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}
