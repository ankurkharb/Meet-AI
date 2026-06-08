<p align="center">
  <img src="public/logo.svg" alt="Meet.ai Logo" width="80" />
</p>

<h1 align="center">🤖 Meet.ai — AI-Powered Meeting Assistant</h1>

<p align="center">
  <strong>An intelligent meeting platform where AI agents join your video calls, take notes, and provide real-time insights.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Stream-Video-005FFF?logo=stream" alt="Stream" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql" alt="PostgreSQL" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Routes & tRPC Routers](#-api-routes--trpc-routers)
- [Background Jobs (Inngest)](#-background-jobs-inngest)
- [Authentication](#-authentication)
- [AI Features](#-ai-features)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Meet.ai** is a full-stack AI-powered meeting assistant built with **Next.js 16** and **React 19**. Users can create customizable AI agents that join video calls as real participants, providing real-time voice interactions, and post-meeting intelligence including transcription, summarization, sentiment analysis, and action item extraction.

The platform combines **Stream Video SDK** for high-quality video conferencing with **OpenAI's GPT-4o** for meeting intelligence and the **Realtime API** for live AI voice conversations.

---

## ✨ Key Features

### 🎥 Video Conferencing
- Real-time video calls powered by **Stream Video SDK**
- Camera, microphone, and screen sharing controls
- AI agents join as live participants in the call
- Call recording with playback support (speed control, timeline)

### 🤖 AI Agents
- Create and manage custom AI agents with unique names and descriptions
- Agents join meetings as real-time voice participants using **OpenAI Realtime API** (`gpt-4o-realtime-preview`)
- Agent status management (active / inactive / archived)

### 📝 Post-Meeting Intelligence
- **Automated Transcription** — Transcripts are fetched, cleaned (filler words removed), and stored
- **AI Summarization** — GPT-4o generates structured summaries with:
  - Executive summary & key discussion points
  - Action items with assignees
  - Decisions made during the meeting
  - Speaker highlights with main contributions
  - Structured meeting notes
- **Sentiment Analysis** — Overall meeting sentiment (positive / neutral / negative) with confidence scores
- **Transcript Search** — Full-text search with highlighting across meeting transcripts

### 🔐 Authentication
- Authentication is powered by **Clerk**
- Email/password and social login are configured in your Clerk dashboard
- Session management is handled by Clerk
- Protected routes use Clerk middleware

### 📊 Dashboard
- Overview page with meeting statistics
- Sidebar navigation with command palette (`Ctrl+K`)
- Meeting management (upcoming, active, completed, processing, cancelled)
- Agent management interface
- User profile and settings

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Frontend** | [React 19](https://react.dev/), TypeScript 5 |
| **Styling** | [TailwindCSS 4](https://tailwindcss.com/), [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) (Avatar, Dialog, Dropdown, Popover), [Lucide Icons](https://lucide.dev/), [cmdk](https://cmdk.paco.me/) |
| **API Layer** | [tRPC v11](https://trpc.io/) with [TanStack React Query v5](https://tanstack.com/query) |
| **Authentication** | [Clerk](https://clerk.com/) (hosted auth, sessions, social login) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) (serverless) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) with Drizzle Kit migrations |
| **Video** | [Stream Video SDK](https://getstream.io/video/) (React + Node) |
| **AI** | [OpenAI GPT-4o](https://openai.com/) (Summarization, Transcription), [Realtime API](https://platform.openai.com/docs/guides/realtime) (Voice) |
| **Background Jobs** | [Inngest](https://www.inngest.com/) (Event-driven functions with retries) |
| **Validation** | [Zod v4](https://zod.dev/) |
| **Utilities** | [superjson](https://github.com/blitz-js/superjson), [nanoid](https://github.com/ai/nanoid), [nuqs](https://nuqs.47ng.com/) (URL query state) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (React 19)                    │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐  │
│  │ Dashboard │  │  Meetings  │  │   Video Call (Stream) │  │
│  │   Pages   │  │   Pages    │  │   + AI Agent Voice    │  │
│  └─────┬─────┘  └─────┬─────┘  └──────────┬───────────┘  │
│        │              │                    │              │
│  ┌─────┴──────────────┴────────────────────┴─────┐       │
│  │          tRPC Client + React Query             │       │
│  └────────────────────┬──────────────────────────┘       │
└───────────────────────┼──────────────────────────────────┘
                        │
┌───────────────────────┼──────────────────────────────────┐
│                  Server (Next.js API)                     │
│  ┌────────────────────┴──────────────────────────┐       │
│  │              tRPC Server (v11)                  │       │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────┐ │       │
│  │  │ Agents  │ │ Meetings │ │ Stream │ │ Users│ │       │
│  │  │ Router  │ │  Router  │ │ Router │ │Router│ │       │
│  │  └────┬────┘ └────┬─────┘ └───┬────┘ └──┬───┘ │       │
│  └───────┼───────────┼───────────┼─────────┼─────┘       │
│          │           │           │         │              │
│  ┌───────┴───────────┴───────────┴─────────┴─────┐       │
│  │               Drizzle ORM                      │       │
│  └──────────────────────┬────────────────────────┘       │
│                         │                                │
│  ┌──────────────────────┴────────────────────────┐       │
│  │        PostgreSQL (Neon Serverless)             │       │
│  └────────────────────────────────────────────────┘       │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │          Inngest (Background Jobs)            │        │
│  │  • handleCallEnded → set processing status    │        │
│  │  • processTranscription → clean & store       │        │
│  │  • processRecording → store recording URL     │        │
│  │  • summarizeMeeting → GPT-4o analysis         │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Clerk Auth   │  │  Stream SDK   │  │   OpenAI API  │   │
│  │  (Sessions)   │  │  (Video/Call)  │  │  (GPT + RT)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
app/
├── drizzle/                     # Database migrations
│   ├── 0000_*.sql               # Initial migration
│   └── meta/                    # Drizzle migration metadata
├── public/                      # Static assets
│   └── logo.svg                 # App logo
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── layout.tsx       # Auth layout (centered, unauthenticated)
│   │   │   ├── login/           # Login page
│   │   │   └── register/        # Registration page
│   │   ├── (dashboard)/         # Dashboard route group (protected)
│   │   │   ├── layout.tsx       # Dashboard layout (sidebar + navbar)
│   │   │   ├── page.tsx         # Dashboard home / overview
│   │   │   ├── agents/          # AI agents management
│   │   │   ├── meetings/        # Meetings list & detail views
│   │   │   ├── schedule/        # Meeting scheduling
│   │   │   ├── profile/         # User profile
│   │   │   └── settings/        # App settings
│   │   ├── api/
│   │   │   ├── inngest/         # Inngest webhook endpoint
│   │   │   ├── trpc/            # tRPC HTTP handler
│   │   │   └── webhooks/        # Stream Video webhooks
│   │   ├── globals.css          # Global styles & Tailwind config
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   │
│   ├── components/              # React components
│   │   ├── agents/              # Agent CRUD components
│   │   ├── auth/                # LoginForm, RegisterForm
│   │   ├── call/                # CallView (video call UI)
│   │   ├── dashboard/           # Sidebar, Navbar, UserButton, CommandProvider
│   │   ├── meetings/            # MeetingsHeader, MeetingsFilters, detail tabs
│   │   └── ui/                  # Reusable UI primitives (Button, Dialog, etc.)
│   │
│   ├── modules/                 # Business logic modules
│   │   ├── agents/              # Agent types, server actions
│   │   ├── dashboard/           # Dashboard types
│   │   └── meetings/            # Meeting types, server actions
│   │
│   ├── lib/                     # Core libraries & services
│   │   ├── auth.ts              # Clerk server auth exports
│   │   ├── auth-client.ts       # Clerk client auth exports
│   │   ├── openai.ts            # OpenAI service (summarization, transcription)
│   │   ├── openai-realtime.ts   # OpenAI Realtime API (voice agent)
│   │   ├── stream.ts            # Stream Video server utilities
│   │   ├── inngest.ts           # Inngest client & event types
│   │   ├── inngest.functions.ts # Background job definitions
│   │   └── utils.ts             # General utilities (cn helper)
│   │
│   ├── trpc/                    # tRPC configuration
│   │   ├── init.ts              # tRPC initialization & context
│   │   ├── server.ts            # Server-side caller
│   │   ├── client.tsx           # Client-side provider
│   │   ├── query-client.tsx     # TanStack Query client config
│   │   ├── index.ts             # Barrel exports
│   │   └── routers/
│   │       ├── _app.ts          # Root app router
│   │       ├── agents.ts        # Agents CRUD procedures
│   │       ├── meetings.ts      # Meetings CRUD procedures
│   │       ├── stream.ts        # Stream token generation
│   │       └── users.ts         # User procedures
│   │
│   ├── db.ts                    # Database connection (pg + Drizzle)
│   ├── schema.ts                # Drizzle schema definitions
│   └── proxy.ts                 # Clerk route protection
│
├── .env                         # Environment variables
├── drizzle.config.ts            # Drizzle Kit config
├── next.config.ts               # Next.js config
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript config
└── components.json              # shadcn/ui config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or yarn / pnpm)
- **PostgreSQL** database (recommended: [Neon](https://neon.tech/) for serverless)
- **Stream** account ([getstream.io](https://getstream.io/))
- **OpenAI** API key ([platform.openai.com](https://platform.openai.com/))
- **Clerk** application ([dashboard.clerk.com](https://dashboard.clerk.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/Meet.ai.git
   cd Meet.ai/app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your credentials:

   ```bash
   cp .env.example .env.local
   ```

   See the [Environment Variables](#-environment-variables) section for details.

4. **Set up the database**

   Push the Drizzle schema to your PostgreSQL database:

   ```bash
   npx drizzle-kit push
   ```

   Or run migrations:

   ```bash
   npx drizzle-kit migrate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Start Inngest Dev Server** (for background jobs, in a separate terminal)

   ```bash
   npx inngest-cli@latest dev
   ```

7. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | App URL (`http://localhost:3000` for dev) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for this app |
| `CLERK_SECRET_KEY` | Clerk server secret key for this app |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route (`/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route (`/sign-up`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign-in (`/`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign-up (`/`) |
| `DATABASE_URL` | PostgreSQL connection string (e.g., Neon, Supabase, Railway, or local Postgres) |
| `NEXT_PUBLIC_STREAM_API_KEY` | Stream Video public API key |
| `STREAM_API_SECRET` | Stream Video server-side secret |
| `OPENAI_API_KEY` | OpenAI API key (for GPT-4o & Realtime API) |
| `INNGEST_EVENT_KEY` | Inngest event key for sending events |
| `INNGEST_SIGNING_KEY` | Inngest signing key for webhook verification |
| `POLAR_ACCESS_TOKEN` | Optional Polar token for premium subscription checks |
| `POLAR_ENVIRONMENT` | `sandbox` for development or `production` for live billing |

---

## 🗃 Database Schema

The app uses **Drizzle ORM** with **PostgreSQL**. The schema is defined in `src/schema.ts`:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    user       │     │   session     │     │   account     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │◄────│ userId (FK)  │     │ userId (FK)  │──►│
│ name         │     │ token        │     │ accountId    │
│ email        │     │ expiresAt    │     │ providerId   │
│ emailVerified│     │ ipAddress    │     │ accessToken  │
│ image        │     │ userAgent    │     │ refreshToken │
│ createdAt    │     │ createdAt    │     │ scope        │
│ updatedAt    │     │ updatedAt    │     │ createdAt    │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │
       │  1:N                              ┌──────────────┐
       ├──────────────────────────────────►│ verification  │
       │                                   ├──────────────┤
       │                                   │ identifier   │
       │                                   │ value        │
       │                                   │ expiresAt    │
       │                                   └──────────────┘
       │
       │  1:N         ┌──────────────┐
       ├─────────────►│    agent      │
       │              ├──────────────┤
       │              │ id (PK)      │
       │              │ name         │◄──────────┐
       │              │ description  │           │
       │              │ status       │           │
       │              │ userId (FK)  │           │
       │              │ createdAt    │           │
       │              │ updatedAt    │           │
       │              └──────────────┘           │
       │                                         │
       │  1:N         ┌──────────────┐           │
       └─────────────►│   meeting     │───────────┘
                      ├──────────────┤   agentId (FK)
                      │ id (PK)      │
                      │ name         │
                      │ status       │  (upcoming/active/completed/processing/cancelled)
                      │ startedAt    │
                      │ endedAt      │
                      │ callId       │  (Stream Video call ID)
                      │ summary      │  (JSON: summary, keyPoints, actionItems, sentiment)
                      │ transcript   │  (JSON: raw + cleaned transcript)
                      │ recordingUrl │  (Stream CDN URL)
                      │ userId (FK)  │
                      │ agentId (FK) │
                      │ createdAt    │
                      │ updatedAt    │
                      └──────────────┘
```

---

## 🔌 API Routes & tRPC Routers

### API Routes

| Route | Description |
|---|---|
| `/api/trpc/[trpc]` | tRPC HTTP handler for all procedures |
| `/api/inngest` | Inngest webhook endpoint for background jobs |
| `/api/webhooks` | Stream Video webhooks (call events) |

### tRPC Routers

| Router | Key Procedures |
|---|---|
| **agents** | `getAll`, `getById`, `create`, `update`, `delete` — Full CRUD for AI agents |
| **meetings** | `getAll`, `getById`, `create`, `update`, `delete` — Meeting management with filtering |
| **stream** | `getToken` — Generate Stream Video tokens for authenticated users |
| **users** | `getSession` — Retrieve current user session |

---

## ⚡ Background Jobs (Inngest)

Meet.ai uses **Inngest** for reliable, event-driven background processing with automatic retries:

| Function | Trigger Event | Description |
|---|---|---|
| `handleCallEnded` | `meeting/call.ended` | Sets meeting to "processing" status, stores call duration & participant count |
| `processTranscription` | `meeting/transcription.ready` | Fetches transcript (URL or inline), cleans filler words, stores in DB, triggers summarization |
| `processRecording` | `meeting/recording.ready` | Stores recording URL and metadata (format, size, duration) in DB |
| `summarizeMeeting` | `meeting/summarize` | Generates AI summary via GPT-4o, stores results, sets meeting to "completed" |

**Pipeline Flow:**
```
Call Ends → handleCallEnded → processTranscription → summarizeMeeting
                              processRecording ──────────────┘
```

---

## 🔐 Authentication

Built with **[Clerk](https://clerk.com/)**, the app supports:

- **Hosted Sign-In / Sign-Up** - Clerk components power `/sign-in` and `/sign-up`
- **Social Login** - Configure providers such as Google or GitHub in Clerk
- **Session Management** - Clerk manages secure sessions
- **Route Protection** - `src/proxy.ts` guards protected app routes

Auth flow:
1. Unauthenticated users are redirected to `/sign-in`
2. After login, users are redirected to the dashboard
3. Sessions are validated server-side with Clerk
4. The Clerk user is synced into the local database before protected tRPC procedures run

---

## 🧠 AI Features

### Meeting Summarization (`src/lib/openai.ts`)

- **Transcript Cleaning** — Removes filler words (um, uh, like, etc.) and normalizes whitespace
- **Chunked Processing** — Long transcripts are split into chunks to handle token limits
- **Structured Output** — Generates JSON with:
  - Executive summary
  - Key discussion points
  - Action items with assignees
  - Decisions made
  - Sentiment analysis (positive/neutral/negative + confidence score)
  - Per-speaker highlights with their main contributions
  - Formatted meeting notes

### Real-Time Voice Agent (`src/lib/openai-realtime.ts`)

- Uses **OpenAI Realtime API** with `gpt-4o-realtime-preview` model
- Creates ephemeral tokens for secure client-side WebSocket connections
- Agents receive custom instructions based on their name and description
- Natural conversational voice with the "alloy" voice model

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (with HMR) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx drizzle-kit push` | Push schema changes to database |
| `npx drizzle-kit migrate` | Run database migrations |
| `npx drizzle-kit studio` | Open Drizzle Studio (DB GUI) |
| `npx inngest-cli@latest dev` | Start Inngest dev server |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using Next.js, OpenAI, and Stream
</p>
