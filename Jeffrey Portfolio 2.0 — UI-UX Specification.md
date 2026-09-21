# Jeffrey Portfolio 2.0 — UI/UX Specification

## 1. Design Direction

The portfolio should feel like the website of a serious Data Analyst rather than a generic developer template.

Visual keywords:

- Data-driven
- Minimal
- Professional
- Modern
- Precise
- Confident
- Clean

The interface should prioritize content and evidence over decoration.

---

# 2. Color System

Use a restrained dark-first palette.

### Background

Near-black / deep charcoal.

### Primary Surface

Dark slate.

### Accent

Emerald/green can be used as the analytical/data accent.

### Text

Primary:

Near-white.

Secondary:

Muted gray.

### Borders

Subtle low-contrast borders.

Avoid using many competing accent colors.

---

# 3. Typography

Use a modern sans-serif typeface.

Typography hierarchy:

### H1

Large, bold, highly visible.

### H2

Strong section headings.

### H3

Project and subsection headings.

### Body

Comfortable reading width and line height.

Data and statistics may use a slightly more technical type treatment.

---

# 4. Homepage Layout

## Header

Desktop:

```text
JEFFREY                         About Projects Experience Skills Contact
```

Include a clear contact CTA.

Mobile:

```text
JEFFREY                                      ☰
```

Navigation becomes a mobile drawer.

---

# 5. Hero

Structure:

```text
[Small professional label]

JEFFREY USMAN

Data Analyst
turning data into
actionable insights.

[View My Work] [Contact Me]

        [Professional Image / Data Visualization]
```

The hero should immediately establish professional identity.

Avoid unnecessary typewriter effects.

---

# 6. Trust / Quick Facts

Immediately after the hero, show concise credibility indicators.

Examples:

```text
01+
Years Experience

XX
Projects

XX
Certifications

XX
Tools & Technologies
```

Only display verified numbers.

Never fabricate metrics.

---

# 7. About

Use a two-column desktop layout.

Left:

Short professional statement.

Right:

Supporting information.

Possible visual:

A subtle data-grid or analytical visualization.

---

# 8. Featured Projects

Header:

```text
SELECTED WORK
Projects built around real problems.
```

Project cards should contain:

- Image
- Category
- Title
- Short description
- Technology badges
- View Case Study

Example:

```text
┌─────────────────────────────┐
│                             │
│        PROJECT IMAGE        │
│                             │
├─────────────────────────────┤
│ DATA ANALYSIS               │
│ Sales Performance Analysis  │
│                             │
│ Python · SQL · Power BI     │
│                             │
│ View Case Study →           │
└─────────────────────────────┘
```

---

# 9. Project Listing

Route:

`/projects`

Include:

- Search
- Category filter
- Technology filter
- Featured indicator

Grid:

Desktop: 3 columns

Tablet: 2 columns

Mobile: 1 column

---

# 10. Project Detail Page

Route:

`/projects/[slug]`

Hero:

```text
DATA ANALYSIS

Sales Performance Analysis

Understanding sales trends and
identifying opportunities through data.

[GitHub] [Live Project]

             HERO IMAGE
```

Then:

```text
Overview
────────

Problem
────────

Objective
────────

Methodology
────────

Tools
────────

Key Insights
────────

Results
────────

Challenges
────────

Project Gallery
────────
```

Use strong visual hierarchy.

Long case studies should be easy to scan.

---

# 11. Experience

Use a timeline.

Example:

```text
2026
│
├── Data Analyst
│   Organization
│   Description...
│
2025
│
├── ...
```

The timeline should collapse naturally on mobile.

---

# 12. Skills

Use grouped cards.

```text
DATA ANALYSIS

Python
SQL
Excel
Pandas

DATA VISUALIZATION

Power BI
Tableau
Matplotlib

DATABASE

PostgreSQL
MySQL
```

Avoid percentage skill bars unless there is a meaningful reason to use them.

---

# 13. Certifications

Use compact cards:

```text
┌────────────────────────────┐
│ Certificate Image          │
│                            │
│ Certification Name         │
│ Issued by Organization     │
│ 2026                       │
│                            │
│ View Credential →          │
└────────────────────────────┘
```

---

# 14. Contact

The contact section should feel like a clear invitation.

Example:

```text
HAVE A PROJECT IN MIND?

Let's turn your data into
something useful.

[Name]
[Email]
[Subject]
[Message]

[Send Message]
```

Show success/error feedback without navigating away.

---

# 15. Footer

Include:

- Jeffrey Usman
- Professional title
- GitHub
- LinkedIn
- Email
- Copyright
- Back to top

---

# 16. Admin UI

The admin dashboard should look completely different from the marketing website.

Use a productivity-focused interface.

Desktop:

```text
┌──────────────┬──────────────────────────────────────┐
│              │ Dashboard                            │
│ JEFFREY CMS  │                                      │
│              │ ┌────────┐ ┌────────┐ ┌────────┐    │
│ Dashboard    │ │Projects│ │Messages│ │Skills  │    │
│ Projects     │ └────────┘ └────────┘ └────────┘    │
│ Experience   │                                      │
│ Skills       │ Recent Projects                      │
│ Certificates │                                      │
│ Messages     │                                      │
│ Profile      │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

---

# 17. Admin Project Editor

The project editor should be structured into sections.

### Basic Information

- Title
- Slug
- Category
- Short description
- Featured
- Published

### Case Study

- Overview
- Problem
- Objective
- Methodology
- Insights
- Results
- Challenges

### Technologies

Multi-select/tag input.

### Media

Cloudinary uploader.

Support:

- Cover image
- Multiple gallery images
- Reordering
- Alt text
- Delete

### Links

- GitHub
- Live project
- Dataset

---

# 18. Loading States

Use skeleton loaders for:

- Project cards
- Project pages
- Dashboard statistics
- Tables

Avoid blank screens.

---

# 19. Empty States

Example:

```text
No projects found.

Try another category or search term.
```

Admin:

```text
No projects yet.

Create your first project →
```

---

# 20. Error States

Errors must be understandable.

Bad:

> Error 500.

Better:

> We couldn't load the projects right now. Please try again.

Admin errors should provide actionable information.

---

# 21. Motion

Use subtle animation only.

Allowed:

- Fade
- Small slide
- Hover elevation
- Image transitions
- Navigation transitions

Avoid:

- Excessive parallax
- Constant floating elements
- Long loading animations
- Distracting scroll effects

Respect `prefers-reduced-motion`.

---

# 22. Responsive Rules

Mobile is not simply a smaller desktop.

On mobile:

- Stack layouts.
- Increase touch targets.
- Simplify navigation.
- Reduce decorative elements.
- Maintain readable typography.
- Keep project imagery prominent.
- Avoid horizontal overflow.

---

# 23. Accessibility

Every interactive component must have:

- Keyboard support
- Focus state
- Accessible name
- Correct semantic element
- Appropriate ARIA only when necessary

Forms must have labels.

Images must have meaningful alt text.

Color must never be the only indicator of state.

---

# 24. Design Principle

The portfolio should answer three questions within the first minute:

1. Who is Jeffrey?
2. What can Jeffrey do?
3. What evidence exists that Jeffrey can do it?

Everything in the UI should support those questions.