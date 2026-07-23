---
title: "It Was the Best of Times, It Was the Worst of Times"
description: "WordPress has never been more capable, but between plugin supply chain attacks, the WP Engine lawsuit, and Automattic's governance, it's never been harder to trust who's steering it."
excerpt: "WordPress has never been more capable, but between plugin supply chain attacks, the WP Engine lawsuit, and Automattic's governance, it's never been harder to trust who's steering it."
date: 2026-07-10
post_author: mitchell
tags:
  - wordpress
---

WordPress has never been more capable. It&rsquo;s also never been harder to trust the people steering it. Both things are true at once, and anyone building on WordPress right now needs to hold them together.

## The Best of Times: A More Capable Platform Than Ever

### WP-CLI

Command-line management has turned WordPress from a click-around admin panel into something you can script, automate, and deploy like real software. Updates, migrations, multisite management &mdash; all scriptable, all repeatable. For anyone running more than a handful of sites, it&rsquo;s no longer optional.

### WordPress Playground

A full WordPress install running in the browser, no server required, powered by WebAssembly PHP and SQLite. Instant sandboxes for testing plugins, teaching, and demoing themes without provisioning anything. It removes the last excuse for not trying before you buy.

### The REST API

Baked into core since 4.7, the REST API turned WordPress into a legitimate headless CMS and quietly became the backbone Gutenberg itself runs on. Content can now live anywhere and reach any front end.

### MCP and the Abilities API

The Abilities API landed in core with WordPress 6.9, giving plugins and themes a standardized way to register what they can do. The official MCP Adapter translates those abilities into the Model Context Protocol, so AI agents can discover and act on a WordPress site directly. This is WordPress positioning itself as the CMS built for the agentic web, not scrambling to catch up to it.

### WordPress Studio

Automattic&rsquo;s free local development app spins up a working WordPress site in seconds, no Docker or MAMP wrangling required, with a direct path to push to WordPress.com or Pressable. It lowers the barrier to local dev meaningfully.

### WooCommerce&rsquo;s More in Core Initiative

Features that used to require a stack of paid extensions &mdash; brands, cost of goods sold, better analytics &mdash; are moving into WooCommerce core. Fewer plugins means fewer conflicts and more stable stores, which matters enormously given what&rsquo;s happening elsewhere in the plugin ecosystem.

### The Interactivity API

A native standard for building reactive, interactive blocks without reaching for a heavy JavaScript framework. It&rsquo;s the missing piece that lets Gutenberg blocks behave like real front-end components instead of static markup.

### Gutenberg&rsquo;s React-Based Page Builder

The Site Editor has matured into a genuine page-building tool, built on React, closing the gap with dedicated page builders while staying native to core. Fewer third-party builder dependencies, more of the experience owned by WordPress itself.

### Rising Quality Standards

Core review, plugin review, security scanning, and performance benchmarking have all gotten more rigorous. The project is holding itself to a higher bar than it used to, and it shows in the software.

## The Worst of Times: An Institution That Isn&rsquo;t in Reliable Hands

### Enshittification of the Plugin Ecosystem

Popular plugins are getting bought &mdash; by private equity roll-ups, by opportunists on marketplaces like Flippa, sometimes by outright bad actors &mdash; and the trust built into the auto-update mechanism is now an attack surface. EssentialPlugin was acquired in 2025 and quietly backdoored across 30-plus plugins, sitting dormant for eight months before activating in April 2026. ShapedPlugin&rsquo;s update infrastructure was compromised in June 2026, pushing malicious updates to over 200,000 sites and harvesting credentials and 2FA codes in the process. This isn&rsquo;t a fringe risk anymore. It&rsquo;s a supply chain problem baked into how WordPress plugins are distributed.

### Automattic&rsquo;s War on WP Engine

Matt Mullenweg publicly called WP Engine a &ldquo;cancer to WordPress,&rdquo; demanded 8% of its revenue in trademark royalties, and had WordPress.org block WP Engine&rsquo;s access to the plugin and theme update servers &mdash; cutting off updates for millions of sites over a business dispute. The lawsuit is still grinding through court, with WP Engine now alleging Mullenweg planned to hit ten more hosting competitors with the same royalty demands and pressured Stripe to cut ties with the company. Trial is set for 2027. Whatever the merits, using .org infrastructure as leverage in a commercial fight should worry anyone whose site depends on that infrastructure.

### &ldquo;My Personal Site&rdquo;

Mullenweg has stated plainly that WordPress.org is his personal property, not the community&rsquo;s. That&rsquo;s not a technicality &mdash; the plugin directory, the update servers, and the WordPress trademark all run through that property. The open-source project everyone assumes is community-governed is, legally, one person&rsquo;s site.

### Profit-Driven Governance

Automattic runs WordPress.com, Pressable, WooCommerce, and Jetpack, and it exerts outsized influence over .org roadmap decisions. When a for-profit company controls both the commercial products and the open-source project they compete on top of, it gets harder to tell whether a given decision serves the community or the business. Lately, more decisions read like the latter.

## Both Things Are True

The software has never been better. The institution has never looked shakier. That gap &mdash; what WordPress can do versus who&rsquo;s actually steering it &mdash; is the thing worth watching over the next few years, and it&rsquo;s why building on WordPress today means paying as much attention to governance as to code.
