---
title: Designing With Open Props
date: 2026-06-18
post_author: tonya
categories:
  - Web
  - Process
tags:
  - css
  - tools
excerpt: Why we rebuilt our internal design tokens on top of Open Props instead of a custom system.
---

Every studio eventually writes its own CSS variable system, and every studio eventually regrets parts of it. This year we replaced ours with [Open Props](https://open-props.style/) and haven't looked back.

## Fewer decisions, better defaults

Open Props gives us a full scale of sizes, colors, shadows, and easing curves that are already tuned to look good together. We spend less time inventing tokens and more time using them.

## It plays well with client handoffs

Because the tokens are just CSS custom properties, developers on the client side can override them without learning a build tool or a new naming convention.
