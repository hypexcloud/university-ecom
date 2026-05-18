const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ''
const GUILD_ID = process.env.DISCORD_GUILD_ID || ''

// Role IDs configured in env (map plan codes to Discord role IDs)
const ROLE_MAP: Record<string, string | undefined> = {
  fast: process.env.DISCORD_ROLE_FAST,
  business: process.env.DISCORD_ROLE_BUSINESS,
  infinity: process.env.DISCORD_ROLE_INFINITY,
  tiktok: process.env.DISCORD_ROLE_TIKTOK,
  youtube: process.env.DISCORD_ROLE_YOUTUBE,
  affiliate: process.env.DISCORD_ROLE_AFFILIATE,
}

/**
 * Add a Discord role to a user.
 */
export async function addRole(discordUserId: string, roleKey: string): Promise<boolean> {
  const roleId = ROLE_MAP[roleKey]
  if (!BOT_TOKEN || !GUILD_ID || !roleId) return false

  const res = await fetch(
    `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordUserId}/roles/${roleId}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    },
  )

  return res.ok
}

/**
 * Remove a Discord role from a user.
 */
export async function removeRole(discordUserId: string, roleKey: string): Promise<boolean> {
  const roleId = ROLE_MAP[roleKey]
  if (!BOT_TOKEN || !GUILD_ID || !roleId) return false

  const res = await fetch(
    `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordUserId}/roles/${roleId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    },
  )

  return res.ok
}

/**
 * Send a DM to a Discord user via the bot.
 */
export async function sendDM(discordUserId: string, message: string): Promise<boolean> {
  if (!BOT_TOKEN) return false

  // Create DM channel
  const channelRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
    method: 'POST',
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipient_id: discordUserId }),
  })

  if (!channelRes.ok) return false
  const { id: channelId } = await channelRes.json()

  // Send message
  const msgRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: message }),
  })

  return msgRes.ok
}
