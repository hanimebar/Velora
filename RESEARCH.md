# Velora — Research & Decision Log

This file captures the VentureLens research session that produced Velora, including the reasoning behind every key decision. Read this for context before building.

---

## What Velora Is

**Velora** is a boutique fitness studio scheduling, membership, and payments platform.

- Targeted at independent yoga and Pilates studio owners
- Nordic-first go-to-market (Sweden, Norway, Denmark, Finland), pan-European intent
- Positioned between Punchpass (too simple) and Mindbody (too expensive, hostile)
- Female owner demographic, ages 30–50
- Domain: `velora.actvli.com`

---

## Why This Exists — The Market Problem

Independent yoga and Pilates studios need software to handle:
- Class schedules with capacity limits
- Client booking and cancellations
- Class packs (e.g. 10-class cards) and recurring monthly memberships
- Automated reminders and waitlists
- Revenue reporting

**Mindbody** is the dominant incumbent (15+ years). It was acquired by private equity in 2018 and has since:
- Raised prices without warning to €139–599/month
- Degraded support quality significantly
- Become bloated and complex for small studios
- Locked studios in: charges €500 for a full data export, only at cancellation

**Punchpass** is the well-liked bootstrapped alternative at €35–75/month. But it has documented gaps:
- No automatic membership renewal (billing)
- No native mobile app
- Weak email tools, no segmentation
- Bulk class management is one-by-one
- Limited reporting

The gap: a clean, modern, fairly-priced platform above Punchpass, below Mindbody, built specifically for yoga and Pilates studios.

---

## Why Nordic First

**Zoezi** is the main Nordic competitor (Swedish-built, since 2013). It:
- Handles Swish, Klarna, Autogiro (local payment rails)
- Starts at 2,690 SEK/month (~€250) with no free trial
- Has been acquired by Nordic Capital (private equity) — same trajectory as Mindbody

The gap in the Nordics: nothing affordable between Zoezi and spreadsheets.

Total addressable Nordic studio count: estimated 400–800 independent boutique studios across Stockholm, Oslo, Copenhagen, Helsinki. Too thin as a standalone market — Nordic-first is the go-to-market wedge, not the ceiling. Build pan-European from day one.

---

## Key Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Name | Velora | Soft, memorable, wellness register, no existing product |
| Domain | velora.actvli.com | Subdomain of existing actvli.com |
| Client booking | PWA, not native app | Client complaints are about bugs not tech model; studio-directed funnel removes app store friction |
| Target vertical | Yoga + Pilates only | Martial arts (belt tracking, tuition model) and CrossFit (WOD programming) are genuinely different products |
| Migration | CSV-based import wizard | Mindbody API ToS prohibits competitor use; studio exports their own CSVs, Velora imports them |
| Payment cards | Cannot be migrated | Stripe tokens can't transfer — clients re-enter cards (expected, normal) |
| Nordic wallets | Post-MVP via Payment Element | Swish/Vipps/MobilePay are one-time only (no recurring) — memberships must use card anyway |
| Auth (clients) | No passwords — magic links | Reduces friction; clients book with email and get signed cancel links |

---

## The Migration Story (Most Important Sales Tool)

Switching from Mindbody requires:

1. Studio owner exports CSVs from Mindbody Reports dashboard (they are entitled to their own data)
2. Velora's import wizard reads those CSVs, Claude API suggests column mappings, owner confirms
3. Client profiles, membership status, class schedules import automatically
4. Clients receive a branded welcome email asking them to re-enter their card for recurring billing

What Velora does that no competitor does cleanly: makes this a 10-minute process instead of a weekend project.

---

## Why Studios Switch from Mindbody

- **Trigger:** Renewal invoice arrives, price has gone up again
- **Sustained motivation:** Accumulated frustration with support (long hold times, staff who don't know the product)
- **Retention on new platform:** Determined by UX quality

The pitch: *"Half the price. Same features. We'll walk you through the migration."*

---

## Competitive Landscape Summary

| Tool | Price | Problem |
|---|---|---|
| Mindbody | €139–599/month | PE-owned, price hikes, poor support, complex |
| Punchpass | €35–75/month | No auto-renewal, no app, limited reporting |
| Zoezi (Nordics) | ~€250/month | PE-owned, no free trial, Swedish-only focus |
| Vagaro | Mid-range | Dated UI, poor support |
| TeamUp | Mid-range | Generic, not studio-native |

---

## Scale Ceiling

At 500 studios × €79/month = ~€40K MRR with near-zero incremental infrastructure cost. Supabase and Vercel scale without intervention. Natural low churn — once a studio's clients are booking through Velora, switching again is painful. Target: €1M ARR runnable by one person.

---

## Go-to-Market: First 10 Studios

Target: independent female yoga/Pilates studio owners, 30–50, Nordic countries.

**Channels:**
1. Facebook groups — search "[yoga/pilates] studio [ägare/eiere/ejere/omistajat]" per country. Post a genuine "looking for 5 beta studios" message.
2. Instagram DMs — search `#yogastudio` + city. Target 500–5,000 follower accounts (independent operators). Lead with the migration story.
3. National yoga associations — Svenska Yogaförbundet, Norges Yogaforbund, Dansk Yogalærerforening, Suomen Joogaliitto — newsletter announcements.
4. Reddit — `r/yoga`, `r/pilates` — find "Mindbody too expensive" threads and reply.

**The offer for first 10:** Free for 3 months, personal migration help, feedback shapes the product.
