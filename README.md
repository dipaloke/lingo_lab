This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Features:

- Next.js 14 & server actions
- AI Voices using Elevenlabs AI
- Beautiful component system using Shadcn UI
- Amazing characters thanks to KenneyNL
- Auth using Clerk
- Sound effects
- Hearts system
- Points / XP system
- No hearts left popup
- Exit confirmation popup
- Practice old lessons to regain hearts
- Leaderboard
- Quests milestones
- Shop system to exchange points with hearts
- Pro tier for unlimited hearts using Stripe
- Landing page
- Admin dashboard React Admin
- ORM using DrizzleORM
- PostgresDB using SupaBase
- Deployment on Vercel
- Mobile responsiveness
- edited ShadCN Button components

- If user don't have a course selected then user will always be redirected to the courses page.
- Here we kept the DB queries & server actions separated.
- courses -> units -> lessons -> challenge
- we include only 2 type of challenges ("select", "assists"). More types can be added form drizzle schema.

## Packages:

- [ShadCn](https://ui.shadcn.com/docs) - reuseable component library.(button, sheet, tooltip, sonner)
- [@clerk/nextjs](https://clerk.com/docs/quickstarts/nextjs) - Auth
- [drizzle-orm postgres](https://orm.drizzle.team/docs/get-started-postgresql#supabase) - Headless ORM for NodeJS, TypeScript and JavaScript
- [drizzle-kit](https://github.com/drizzle-team/drizzle-kit-mirror#readme) - DrizzleKit - is a CLI migrator tool for DrizzleORM.
- [dotenv](https://github.com/motdotla/dotenv#readme) - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
- [pg](https://www.npmjs.com/package/pg) - Non-blocking PostgreSQL client for Node.js.
- [tsx](https://www.npmjs.com/package/tsx) - TypeScript Execute (tsx): The easiest way to run TypeScript in Node.js.(using for seeding our DB)
- [react-circular-progressbar](https://github.com/kevinsqi/react-circular-progressbar#readme) - A circular progressbar component, built with SVG and extensively customizable
