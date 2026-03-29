# GenZVoter Tech Stack

This document outlines the current technology stack and additions for the GenZVoter platform.

## Core Framework & Language
- **Next.js 16**: Utilizing the **App Router** for routing, layouts, and server actions.
- **React 19**: The underlying UI library, taking advantage of the latest features.
- **JavaScript (ES6+)**: The primary programming language used across the repository.

## Styling & Design System
- **Tailwind CSS 4**: Modern, utility-first CSS framework for rapid styling.
- **shadcn/ui**: High-quality, accessible UI components built on Radix UI.
- **Base UI**: Headless UI components for building custom design systems.
- **Framer Motion**: Powering smooth transitions and complex UI animations.
- **tw-animate-css**: Tailwind-integrated animation utilities.
- **Lucide React**: Beautiful, consistent icon set.

## Backend & Services
- **Supabase**: Backend-as-a-Service providing authentication and PostgreSQL database integration.
- **Stripe**: Payment processing platform for handling transactions and subscriptions.

## 3D & Graphics
- **Three.js**: Low-level 3D graphics library.
- **@react-three/fiber**: React renderer for Three.js.
- **@react-three/drei**: Useful helpers and components for React-Three-Fiber.

## Utilities & Configuration
- **clsx / tailwind-merge**: Strategies for dynamic class name management and conflict resolution.
- **class-variance-authority (CVA)**: For building structured, variant-based components.
- **PostCSS**: CSS transformation tool used by Tailwind.
- **ESLint**: Linting and code quality assurance.

## Directory Structure
- `src/app/`: Next.js App Router routes and pages.
- `src/components/`: Reusable React components.
- `src/lib/`: Shared utility functions and service clients (Supabase, Stripe).
- `public/`: Static assets like images and fonts.
