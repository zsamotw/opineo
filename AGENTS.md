<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Instructions

## Project Overview
This is a web application built with Next.js and React.
It uses TypeScript and follows a component-based architecture.

## Setup & Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Project Structure
- `/app` or `/pages` – routing (Next.js)
- `/components` – reusable UI components
- `/lib` – utilities and helpers
- `/styles` – global styles

## Coding Guidelines
- Use functional components with hooks
- Prefer TypeScript types over `any`
- Keep components small and reusable
- Use server components where possible (Next.js)

## API & Data
- Fetch data using `fetch` or server actions
- Keep API logic in `/lib` or `/services`

## What the Agent Can Do
- Generate new components
- Refactor existing code
- Fix bugs
- Add API routes

## What the Agent Should NOT Do
- Do not install new dependencies without approval
- Do not modify config files unless necessary
- Do not change environment variables

## Style
- Use consistent naming (camelCase for variables, PascalCase for components)
- Follow ESLint rules

## UI Rules
- Use Tailwind for styling
- Avoid inline styles

## Performance
- Use dynamic imports when needed
- Avoid unnecessary re-renders
