# Agron Clone

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Short description

A static clone of "Agron," an organic farm business landing page template, rebuilt with plain HTML, CSS, and vanilla JavaScript to practice recreating a full multi-section marketing site — then taken through a full audit and UI/UX polish pass to bring it up to a production-ready standard.

## Technologies

HTML5, CSS3 (custom properties / design tokens), vanilla JavaScript, Google Fonts (Plus Jakarta Sans), Font Awesome (icons), Flag Icons

## Features

- A hero section introducing the farm with a call-to-action
- An about section describing the business and its produce
- A services section outlining what the farm offers (crops like tomatoes, carrots, and fruit)
- Animated stat counters that count up when scrolled into view
- A product catalog with realistic, varied pricing and consistently sized product images
- A photo gallery and a "meet the farmers" team section with a working prev/next carousel
- Scroll-reveal animations and a back-to-top button, both tasteful and `prefers-reduced-motion`-aware
- An accessible mobile menu (keyboard/Escape support, closes on link click or outside click) and a nav bar that highlights the current section as you scroll
- A working contact form and newsletter signup with inline validation feedback and a brief loading state on submit
- A branded loading screen on first paint that can never block interaction with the page underneath it
- A skip-to-content link, `:focus-visible` states throughout, and a consistent color/spacing/radius system via CSS custom properties

## The process

This was a layout-recreation exercise built section by section from a real template: hero, about, services, stats, products, gallery, team, and contact. The biggest part of the initial work was matching the visual rhythm of a long marketing page, keeping consistent spacing and typography across very different section types (icon-based service cards vs. photo-based team cards vs. numeric stat counters).

The project then went through two further passes. First, a bug audit: duplicated CSS blocks that were silently overriding each other (causing layout bugs like an oversized gap under the About paragraph, an unreadable mobile nav, and content quietly clipped off-screen on phones), a broken nav hover selector, invalid `<a><li>` nesting, missing accessibility attributes, broken footer payment icons, and a large embedded base64 background image. Second, a full senior-level UI/UX pass: a proper typeface and design-token system, missing hover/focus/active states filled in across every button and card, scroll-reveal micro-interactions, and a handful of subtler bugs only visible under real interaction — a loading overlay that silently ate every click for a couple of seconds after page load, an active nav-link indicator that could get stuck mid smooth-scroll animation, and a CSS positioning quirk that stretched a badge across an entire card instead of anchoring it to one edge.

## What I learned

- Structuring a long, multi-section marketing page with consistent, reusable CSS patterns
- Building a responsive navbar with a mobile menu toggle and scroll-synced active-link tracking
- Using icon fonts (Font Awesome) and flag icon sets within a content-heavy layout
- Laying out photo grids and stat blocks that stay aligned across different section types, including when a hotlinked image fails to load
- How unscoped CSS class names silently collide across sections when a stylesheet grows, and why scoping/specificity matters
- Progressive enhancement with vanilla JS: IntersectionObserver for scroll-triggered effects, respecting `prefers-reduced-motion`, and keeping forms usable without a backend
- Why `opacity: 0` alone doesn't make an element stop capturing clicks, and why updating UI state on every scroll event (instead of once the scroll settles) can leave it stuck
- A recurring CSS positioning edge case: an absolutely positioned element with only `right` set (and `left` left as `auto`) can resolve its position from the element's static position instead of shrinking to fit — worth remembering next time a badge or corner element stretches unexpectedly

## How it can be improved

- Break the single HTML file into smaller, reusable sections/components
- Replace the remaining hotlinked third-party image URLs with self-hosted, optimized assets
- Wire the contact/newsletter forms up to a real backend or form service
- The "Our Products" and "Delivered We Product" sections currently overlap in purpose (two separate product-grid-with-pricing sections); worth merging them or giving the second a clearly distinct role

## How to run the project

1. Clone the repo
2. Open `agron.html` directly in your browser (no build step or server required)
