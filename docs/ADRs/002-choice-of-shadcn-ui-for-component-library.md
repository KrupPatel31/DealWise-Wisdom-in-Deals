# 2. Choice of Shadcn/UI for Component Library

- **Status:** Accepted
- **Date:** 2024-05-21

## Context and Problem Statement

We need a UI component library that is flexible, customizable, and unopinionated. We want to avoid being locked into a specific design system and have full control over the styling and behavior of our components.

## Decision Drivers

- Full ownership and control over component code.
- Styling with Tailwind CSS.
- Accessibility out-of-the-box.
- Good TypeScript support.

## Decision Outcome

We chose **Shadcn/UI**. It is not a traditional component library but a collection of reusable components that we can copy and paste into our project. This gives us complete control over the code, allowing for easy customization to match our design system. It's built on top of Radix UI for accessibility and Tailwind CSS for styling, which aligns perfectly with our tech stack.
