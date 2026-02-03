# Ergon - Kanban Collaboration Dashboard

A dark-themed Kanban board for task management and team collaboration. Built with Next.js 14, Tailwind CSS, and Supabase.

**Live:** https://ergon-sable.vercel.app

## MVP Features (Complete)

- ✅ **Kanban Board** - Drag-and-drop task management across columns
- ✅ **List View** - Toggle between board and compact table view with sorting
- ✅ **Task Conversations** - Timestamped notes with attribution (Jason/JC)
- ✅ **User Switching** - Toggle between users for note attribution
- ✅ **Token Usage Tracking** - Dashboard showing API costs by provider
- ✅ **Dark Theme** - #1a1a1a background with forest green accents

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (database + real-time)
- Vercel (hosting)

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Database

See `schema.sql` for table structure. Requires Supabase project with the following tables:
- `columns` - Kanban columns
- `tasks` - Task cards
- `task_notes` - Conversation threads
- `token_usage` - API usage tracking

---

*Built by Jean Claude Bot Damme 🥋*
