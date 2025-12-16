# Bot Creator

AI-powered chatbot builder for your website. Create, train, and deploy intelligent chatbots in minutes.

## Features

- **Agent Builder** - Create custom AI chatbots with a step-by-step wizard
- **Knowledge Training** - Train your bot with website URLs, text content, and files
- **Customizable Appearance** - Customize colors, avatar, and widget position
- **Lead Capture** - Collect visitor information automatically
- **Real-time Analytics** - Track conversations, leads, and performance metrics
- **Easy Deployment** - Simple embed code for any website

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude / OpenAI GPT
- **UI Components:** Radix UI + shadcn/ui
- **Animations:** Framer Motion

## Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com)) or OpenAI API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/iamtheslickrick69/bot-creator.git
cd bot-creator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then update the values in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI APIs (at least one required)
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up Supabase database

Run the SQL schema to create the necessary tables:

```sql
-- Create bots table
CREATE TABLE bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  industry TEXT,
  bot_name TEXT DEFAULT 'AI Assistant',
  tone TEXT DEFAULT 'friendly',
  custom_instructions TEXT,
  welcome_message TEXT,
  fallback_message TEXT,
  avatar_type TEXT DEFAULT 'preset',
  avatar_preset TEXT,
  avatar_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1E40AF',
  position TEXT DEFAULT 'bottom-right',
  lead_capture_enabled BOOLEAN DEFAULT true,
  collect_name BOOLEAN DEFAULT true,
  name_required BOOLEAN DEFAULT false,
  collect_email BOOLEAN DEFAULT true,
  email_required BOOLEAN DEFAULT true,
  collect_phone BOOLEAN DEFAULT false,
  phone_required BOOLEAN DEFAULT false,
  trigger_type TEXT DEFAULT 'after_messages',
  trigger_after_messages INTEGER DEFAULT 2,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_sources table
CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'pending',
  chunks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bots" ON bots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bots" ON bots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bots" ON bots
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bots" ON bots
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bot-creator/
├── src/
│   ├── app/
│   │   ├── agent-builder/      # Bot management pages
│   │   │   ├── new/           # Create bot wizard
│   │   │   └── [id]/          # Edit bot page
│   │   ├── api/
│   │   │   └── bots/          # Bot API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # UI components (shadcn)
│   │   ├── bot-created-success-modal.tsx
│   │   ├── bot-installation-guide.tsx
│   │   └── logo.tsx
│   ├── hooks/
│   │   └── use-bots.ts        # Bot data hooks
│   ├── lib/
│   │   ├── anthropic.ts       # AI client
│   │   ├── supabase/          # Supabase client
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── database.ts        # Database types
├── .env.example               # Environment variables template
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## API Routes

- `GET /api/bots` - List all bots
- `POST /api/bots` - Create a new bot
- `GET /api/bots/[id]` - Get bot details
- `PUT /api/bots/[id]` - Update bot
- `DELETE /api/bots/[id]` - Delete bot
- `POST /api/bots/[id]/train` - Train bot with knowledge sources
- `POST /api/bots/[id]/publish` - Publish bot changes
- `GET /api/bots/[id]/sources` - List knowledge sources
- `POST /api/bots/[id]/sources` - Add knowledge source
- `DELETE /api/bots/[id]/sources/[sourceId]` - Remove knowledge source

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iamtheslickrick69/bot-creator)

### Environment Variables

Make sure to add all environment variables from `.env.example` to your Vercel project settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.
