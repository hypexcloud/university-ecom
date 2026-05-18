/**
 * Role management utilities for the Discord bot.
 * The main app handles role assignment via Discord REST API directly
 * (src/lib/server/discord.ts). This file is for bot-side logic if needed.
 */

const ROLE_MAP: Record<string, string | undefined> = {
  fast: process.env.DISCORD_ROLE_FAST,
  business: process.env.DISCORD_ROLE_BUSINESS,
  infinity: process.env.DISCORD_ROLE_INFINITY,
  tiktok: process.env.DISCORD_ROLE_TIKTOK,
  youtube: process.env.DISCORD_ROLE_YOUTUBE,
  affiliate: process.env.DISCORD_ROLE_AFFILIATE,
}

export function getRoleId(key: string): string | undefined {
  return ROLE_MAP[key]
}

export async function handleRoleSync() {
  // Role sync is handled by the main app via REST API calls.
  // The bot only needs to maintain its gateway connection for slash commands and DMs.
}
