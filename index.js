const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits, REST, Routes } = require("discord.js");
const config = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load commands
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Register commands
const rest = new REST({ version: "10" }).setToken(config.token);
(async () => {
    try {
        console.log("🔄 Refreshing application commands...");
        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands }
        );
        console.log("✅ Commands registered.");
    } catch (error) {
        console.error(error);
    }
})();

// Interaction handler
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "⚠️ There was an error executing this command!", ephemeral: true });
    }
});

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(config.token);
