import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://university-ecom.com'

/**
 * /status — shows the user's current roles (which = their entitlements).
 */
export async function handleStatusCommand(interaction: ChatInputCommandInteraction) {
  const member = interaction.member
  if (!member || !('roles' in member)) {
    await interaction.reply({ content: 'Konnte deine Rollen nicht lesen.', ephemeral: true })
    return
  }

  const roleNames = member.roles instanceof Array
    ? member.roles.map(String)
    : Array.from(member.roles.cache.values()).map((r) => r.name)

  const relevantRoles = roleNames.filter((r) =>
    ['Fast', 'Business', 'Infinity', 'TikTok Creator', 'YouTube Creator', 'Affiliate'].some(
      (plan) => r.toLowerCase().includes(plan.toLowerCase()),
    ),
  )

  const embed = new EmbedBuilder()
    .setTitle('Dein University Ecom Status')
    .setColor(0xd4af37) // Royal gold
    .setDescription(
      relevantRoles.length > 0
        ? `Aktive Zugänge:\n${relevantRoles.map((r) => `• ${r}`).join('\n')}`
        : 'Keine aktiven Zugänge gefunden.',
    )
    .setFooter({ text: `Dashboard: ${APP_URL}/student` })
    .setTimestamp()

  await interaction.reply({ embeds: [embed], ephemeral: true })
}
