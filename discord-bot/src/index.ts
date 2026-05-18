import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js'
import { handleRoleSync } from './roles.js'
import { handleStatusCommand } from './commands.js'

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!
const CLIENT_ID = process.env.DISCORD_CLIENT_ID!
const GUILD_ID = process.env.DISCORD_GUILD_ID!

if (!BOT_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('Missing DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, or DISCORD_GUILD_ID')
  process.exit(1)
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
})

// Register slash commands
async function registerCommands() {
  const rest = new REST().setToken(BOT_TOKEN)

  const commands = [
    new SlashCommandBuilder()
      .setName('status')
      .setDescription('Zeigt deinen aktuellen Zugang bei University Ecom')
      .toJSON(),
  ]

  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  console.log('Slash commands registered')
}

client.on('ready', () => {
  console.log(`Bot logged in as ${client.user?.tag}`)
  registerCommands().catch(console.error)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'status') {
    await handleStatusCommand(interaction)
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...')
  client.destroy()
  process.exit(0)
})

client.login(BOT_TOKEN)
