# 📊 Discord Ticket Analyzer

A Discord bot that analyzes Ticket Tool transcripts and generates activity reports, showing which users were the most active in a support ticket.

---

## ⚙️ Features

- Slash command `/analyzeticket` to analyze Ticket Tool transcripts
- Upload transcript `.html` files directly to the bot
- Extracts and decodes transcript data automatically
- Counts how many messages each user sent
- Clean, embed-based activity reports with `<@user>` mentions
- Highlights the most active participant in the ticket

---

## 🛠️ Installation

```bash
git clone https://github.com/xyn4xdev-lab/discord-ticket-analyzer.git
cd discord-ticket-analyzer
npm install
```

---

## 🔧 Setup

1. Copy the environment file and edit it:

```bash
cp .env.example .env
```

2. Fill in `.env` with your bot's credentials:

```
DISCORD_TOKEN=your-discord-bot-token
CLIENT_ID=your-discord-application-client-id
GUILD_ID=your-test-server-id  # Optional for faster testing
```

---

## 🚀 Deploy Commands

To register the `/analyzeticket` slash command:

```bash
node deploy-commands.js
```

* If `GUILD_ID` is set in your `.env`, the command will register instantly in that server.  
* If `GUILD_ID` is **not** set, it will register globally (may take up to 1 hour to appear).  

---

## ▶️ Run the Bot

```bash
node index.js
```

---

## 🧠 Notes

* Requires Node.js v16 or higher  
* Uses Discord.js v14  
* Only works with **Ticket Tool transcript files** (`.html`)  
* Designed for any server that uses Ticket Tool  

---
