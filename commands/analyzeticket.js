const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("analyzeticket")
        .setDescription("Check who was most active in a Ticket Tool transcript")
        .addAttachmentOption(option =>
            option.setName("transcript")
                .setDescription("Upload the Ticket Tool transcript HTML")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const file = interaction.options.getAttachment("transcript");
        const res = await fetch(file.url);
        const content = await res.text();

        // 1. Extract messages variable from transcript
        const match = content.match(/let messages = "(.*?)";/s);
        if (!match) {
            return interaction.editReply("❌ Could not find messages in the transcript.");
        }

        // 2. Decode Base64
        let decoded;
        try {
            decoded = Buffer.from(match[1], "base64").toString("utf8");
        } catch (err) {
            return interaction.editReply("❌ Failed to decode messages.");
        }

        // 3. Parse JSON
        let messages;
        try {
            messages = JSON.parse(decoded);
        } catch (err) {
            return interaction.editReply("❌ Failed to parse transcript JSON.");
        }

        // 4. Count messages per user
        const counts = {};
        for (const msg of messages) {
            const userId = msg.user_id || msg.userId || msg.userID || msg.username || "Unknown";
            counts[userId] = (counts[userId] || 0) + 1;
        }

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) {
            return interaction.editReply("No messages found in transcript.");
        }

        // 5. Build embed
        const embed = new EmbedBuilder()
            .setTitle("📊 Ticket Activity Report")
            .setColor(0x5865F2);

        let desc = "";
        for (const [user, count] of sorted) {
            if (/^\d+$/.test(user)) {
                desc += `<@${user}> — **${count}** messages\n`;
            } else {
                desc += `${user} — **${count}** messages\n`;
            }
        }

        embed.setDescription(desc);
        embed.setFooter({ text: `🏆 Most active: ${sorted[0][0]} with ${sorted[0][1]} messages` });

        await interaction.editReply({ embeds: [embed] });
    }
};
