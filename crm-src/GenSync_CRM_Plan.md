# GenSync CRM - Complete Plan & Context

## Overview

GenSync Media and Tech is a small digital agency with 3 team members:
- **Manish Sampatrao** - Founder/Primary Partner
- **Mohit Sula** - Second Partner (handles SEO, website updates)
- **Amulya** - Designer (brochures, visuals)

Current Clients:
1. **ConnectMe** (Dubai) - B2B IoT for buildings/enterprises
2. **GeoDo** (SF) - (services TBD)

---

## Lead Sources (6 Channels)

1. Tarini (Referral)
2. Email
3. LinkedIn Posting
4. Instagram Content
5. LinkedIn DMs
6. Loom Videos

---

## CRM Structure

### One Google Sheet with 5 Tabs

| Tab | Purpose | View |
|-----|---------|------|
| Dashboard | Single view with all pipelines, clients, today's tasks | Card Grid |
| Tasks | All tasks with assignee, status, due date | Table + Kanban |
| Pipeline | All leads with source, temperature, stage | Card View |
| Clients | Client info, docs links, contacts | Table |
| Settings | CREA config, team, templates | Table |

---

## Dashboard Layout (Card-Style)

### Top Section: Active Clients (2 cards)

```
┌─────────────────────────────────────────────────────────────────┐
│                     ACTIVE CLIENTS (2)                        │
│  ┌──────────┐  ┌──────────┐                                    │
│  │ CONNECT  │  │  GEODO   │  ← Green dot = Active              │
│  │   ME     │  │    SF    │                                    │
│  │  Dubai   │  │    SF    │                                    │
│  └──────────┘  └──────────┘                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Middle Section: Pipeline (All Leads)

```
┌─────────────────────────────────────────────────────────────────┐
│              PIPELINE - ALL LEADS (6 sources)                  │
│                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│  │ ● Tarini   │ │ ● Gmail   │ │ ● LinkedIn │ │ ● IG Post  │ │
│  │ Company A  │ │ Company B  │ │ Company C  │ │ Company D  │ │
│  │ HOT ●     │ │ WARM ○    │ │ COLD ○    │ │ WARM ●    │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
│                                                                 │
│         [+ Add Lead]  [Filter: All | Hot | Warm | Cold]        │
└─────────────────────────────────────────────────────────────────┘
```

### Bottom Section: Today's Tasks

```
┌─────────────────────────────────────────────────────────────────┐
│                    TODAY'S TASKS                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🔵 Website Update - ConnectMe    │ Mohit │ Due Today      ││
│  │ 🟢 Brochure V3 - ConnectMe        │ Amulya │ Done          ││
│  │ 🔵 SEO Report - GeoDo            │ Mohit │ Due Tomorrow  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Card Fields

### Client Card
- Name
- Status (Active/Paused/Done)
- Contact Person
- Location
- Services Provided
- Last Updated

### Lead Card
- Company Name
- Contact Person
- Source (icon + label)
- Temperature (HOT/WARM/COLD)
- Last Contact Date
- Stage (New → Contacted → Proposal → Negotiation → Won → Lost)

### Task Card
- Task Name
- Assignee
- Due Date
- Status (To Do / In Progress / Done)
- Client (linked)
- Priority

---

## Status Light Legend

| Symbol | Temperature | Meaning |
|--------|-------------|---------|
| ● | HOT | Responded, interested, close to closing |
| 🟡 | WARM | Some engagement, needs follow-up |
| ⚪ | COLD | No response, needs nurture or move to lost |

---

## Lead Source Icons

| Source | Icon |
|--------|------|
| Tarini (Referral) | 👤 |
| Email | 📧 |
| LinkedIn Post | 💼 |
| Instagram Post | 📸 |
| LinkedIn DM | 💬 |
| Loom Video | 🎥 |

---

## Kanban Stages (Tasks)

- **To Do** - Tasks waiting to be started
- **In Progress** - Tasks currently being worked on
- **Done** - Completed tasks

---

## Pipeline Stages (Leads)

1. **New** - Just added as lead
2. **Contacted** - Initial outreach done
3. **Proposal** - Proposal sent
4. **Negotiation** - In discussion
5. **Won** - Client acquired
6. **Lost** - Client not acquired

---

## CREA Integration

### What CREA Does

1. **Reads the Google Sheet** (tasks, leads, clients)
2. **Sends WhatsApp pings** to team members
3. **Reminds about pending work**

### CREA Triggers

| Trigger | Message Example |
|---------|---------------|
| Morning (configurable time) | "Good morning! You have X tasks today. [list]" |
| Task moved to In Progress | "@assignee: New task assigned: [task name]" |
| Task overdue | "Reminder: [task] is overdue. Due: [date]" |
| Lead moved to HOT | "Nice! [Company] is HOT! 🎉" |
| Lead COLD for 7 days | "[Lead] cold for 7 days. Move to Lost or revive?" |
| Lead won | "🎉 [Client] is now a client! Added to Active Clients" |

### REPLY Triggers (WhatsApp)

| Reply | CREA Response |
|-------|---------------|
| "tasks" | Lists all pending tasks for sender |
| "leads" | Lists all leads with status |
| "clients" | Lists active clients |
| "todo" | Tasks in "To Do" column |
| "help" | Shows available commands |

---

## Onboarding Documents

When a new client is onboarded, store:

| Document | Description |
|----------|-------------|
| Service Contract | PDF (Drive link) |
| Brand Guidelines | PDF (Drive link) |
| Product Data | XLSX (Drive link) |
| Assets | Folder (Drive link) |
| Contact Info | Person, email, phone |

Stored in **Clients** tab with clickable links.

---

## Implementation Notes

### Simplicity First
- Keep the dashboard clean and readable
- Only essential fields on cards
- Click to expand details

### CREA Controls
- All data flow through CREA
- WhatsApp as command center
- No manual checks needed

### Future Features (To Think About Later)
- Invoice tracking
- Time tracking
- Project milestones
- Additional clients

---

## Files & Storage

**Primary Location:** `C:\Users\Manish\Desktop\development\GenSync CRM (save here)`

This document serves as the reference plan for building the CRM.

---

## Quick Reference

- **Team**: Manish, Mohit, Amulya
- **Clients**: ConnectMe (Dubai), GeoDo (SF)
- **Sources**: Tarini, Email, LinkedIn, Instagram, LinkedIn DM, Loom
- **Sheet**: 5 tabs (Dashboard, Tasks, Pipeline, Clients, Settings)
- **Control**: CREA reads sheet → WhatsApp pings