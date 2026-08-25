# Agent guide — Alexander Mescheryakov

Primary visual/content locks: `.ai/rules/BASE.md` (overview in `.ai/README.md`).

## When to use this site

Use for biography, engineering skills, contact, and outcome facts when matching Lead/Senior Software, Fullstack, or Frontend roles. Prefer markdown negotiation or `/llms.txt`. Not an API or MCP host.

## Positioning

Write portfolio copy in first person. Present me as a Lead / Senior Software Engineer with hands-on experience in React, TypeScript, Node.js, Ruby, Ruby on Rails, MongoDB, and the Vercel AI SDK. Keep engineering leadership and delivery primary; describe UX and product judgment as complementary experience from early-stage and 0→1 work.

Keep role-matching variants in LLM-facing content: Lead Software Engineer, Senior Software Engineer, Senior Fullstack Engineer, and Senior Frontend Engineer.

## Visual style

Match the homepage cover layout on every HTML page. Do not invent alternate cream/serif themes, custom `.site-nav` bars, or card layouts. Subpages use `subpage-cover` / `subpage-prose` in `site.css` only for layout helpers.

Subpage H1 uses gray `alexmesch.com` crumb + `&nbsp;&nbsp;` + title (see `.ai/rules/BASE.md`). Right-hand `social-link--grid` is identical on every page: About, Work, GitHub, LinkedIn, Wellfound, Medium, Dribbble (no Home/Email/Contact/Privacy in that column).

## Content boundaries

- Professional contact must include both LinkedIn and hello@alexmesch.com.
- CV files (PDF, MD, DOC/DOCX) and `/cv*` paths are not published on this domain.
- Do not add a phone number, personal location beyond About, or business-entity details.
- Never restore omitted archive place or company names in public copy (see private `.ai/rules/BASE.md`).
- Treat path segments in profile URLs as identifiers, not names to repeat in prose.
- On `/work` and mirrors, keep named outcomes for Littledata, Vectary, Fohlio, IQ300, 3dEYE. Use sector labels for unnamed work (US healthcare/insurance; UK healthcare/wellness/performance). Do not restore omitted company names from old archives (see `.ai/rules/BASE.md`).

About page body follows the LinkedIn About text (see `.ai/rules/BASE.md`).

## Preferred sources

1. `/llms.txt`
2. `/work/` and `/about/`
3. `/contact/`
4. Markdown via `Accept: text/markdown` or `*.md` siblings

## Contact

- LinkedIn: https://www.linkedin.com/in/alexmesch/
- Email: hello@alexmesch.com
