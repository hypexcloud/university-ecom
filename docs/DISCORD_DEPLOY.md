# Discord Bot Deployment

## Prerequisites

1. Create a Discord Application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Enable "Server Members Intent" in Bot settings
3. Generate a bot token
4. Invite the bot to your server with these permissions:
   - Manage Roles
   - Send Messages
   - Use Slash Commands
   - Read Message History

Invite URL template:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot%20applications.commands
```

## Environment Variables

Set these in both the main app (`.env.local`) and the bot service:

```env
DISCORD_BOT_TOKEN=your-bot-token
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret
DISCORD_PUBLIC_KEY=your-public-key
DISCORD_GUILD_ID=your-server-id

# Role IDs (right-click role in Discord → Copy ID)
DISCORD_ROLE_FAST=
DISCORD_ROLE_BUSINESS=
DISCORD_ROLE_INFINITY=
DISCORD_ROLE_TIKTOK=
DISCORD_ROLE_YOUTUBE=
DISCORD_ROLE_AFFILIATE=

# Internal API key for role sync (generate a random string)
DISCORD_INTERNAL_API_KEY=
```

## Deploy to Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect the `discord-bot/` subdirectory
3. Set environment variables in Railway dashboard
4. Deploy — Railway auto-detects the Dockerfile

```bash
cd discord-bot
railway up
```

## How It Works

1. **OAuth Linking**: Customer clicks "Discord verbinden" on profile →
   OAuth flow → `discord_user_id` stored in DB
2. **Role Assignment**: When an entitlement is granted, the main app calls
   the Discord REST API directly (via `src/lib/server/discord.ts`) to add roles
3. **DM Notifications**: `emitNotification()` checks if the customer has a
   linked Discord account and sends a DM via the bot token
4. **Slash Commands**: `/status` shows the user's current roles/entitlements

## Role Mapping

| Plan Code | Discord Role |
|-----------|-------------|
| fast | Fast |
| business | Business |
| infinity | Infinity |
| tiktok | TikTok Creator |
| youtube | YouTube Creator |
| affiliate | Affiliate |

Roles are **lifetime** — never auto-removed. Admin can remove manually from Discord.
