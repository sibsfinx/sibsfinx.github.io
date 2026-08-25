# BASE rules — portfolio site style & content

## Visual style (non-negotiable)

- Match the **homepage cover layout 100%** on every HTML page (home, about, work, contact, privacy, 404).
- Source of truth: live alexmesch.com / root `index.html` + local `css/layout.css` + `site.css` (white background `#fff`, black type, `#30f` link hover, Gira Sans via Adobe Fonts kit `wma7yvn`).
- Homepage cover `.app-cover--blank` uses **`height: auto`** with **`min-height: 50vh`** so the title can grow without overlapping prose below. Subpages use `subpage-cover` the same way.
- Left copy sits in `.cover-title-wrap` (`width: 100%` so the column/nav stay put). Cap text in **em**: home display H1 `30em`; subpage title + `.subpage-prose` `34em` (body-proportional). Do not reuse home’s `30em` on subpages.
- Reuse homepage structure and classes: `app-container--blank`, `app-cover--blank`, `cover-title`, `font-space`, `social-link--grid`, `w-row` / `w-col`, photo when appropriate.
- Subpages may use `subpage-cover` + `subpage-prose` in `site.css` **only** for height/prose sizing. No new visual theme.
- **Do not** invent alternate UI: cream/paper backgrounds, serif “editorial” stacks, custom `.site-nav` bars, card layouts, purple gradients, or dashboard chrome.
- Keep social label spelling parity with live when unsure (`Github` / `Linkedin` on older exports); newer GitHub/LinkedIn/Email labels are OK if already on the branch.

## Homepage agent content

Homepage must include a **visible** `<main class="home-main">` / `.home-prose` summary (≥500 characters of real text in raw HTML) with a clear heading hierarchy (**H1** cover title plus **H2** sections such as Selected work and Contact). Do not put the only biography in `aria-hidden` or `display:none` blocks — AI crawlers discount that.
Keep brand discoverability signals: `alexmesch.com` in `<title>` / `og:site_name`, profile image `alt="Alexander Mescheryakov"`, and at least one visible mention of **alexmesch.com** in homepage prose.
JSON-LD `@graph` must include `Person`, personal-brand `Organization` (with `contactPoint` email + `PostalAddress` for Belgrade only — no phone, no invented street), and `WebSite`.

## Homepage headline

Canonical H1 (do not “improve” grammar or rewrite):

Alexander Mescheryakov,
an AI–native product engineer with fullstack, engineering management and product experience, building scalable systems from 0 to 1 and delivering end–to–end

## Subpage heading crumb

Subpage H1 format: gray un-underlined `alexmesch.com` (links to `/`) + `&nbsp;&nbsp;` + page title, e.g. `alexmesch.com  Selected work`.
Class: `page-crumb`. Do not put a Home item in the right-hand `social-link--grid`.

## Secondary nav (all pages)

Right-hand `social-link--grid` must be **identical on every page** (home and subpages):
**About**, **Work**, GitHub, LinkedIn, Wellfound, Medium, Dribbble.
No Home, Email, Contact, or Privacy in that column (Contact/Privacy via page content / crumbs as needed).


## Positioning & contact

- First person; Lead / Senior Software Engineer (React, TypeScript, Node.js, Ruby, Ruby on Rails, MongoDB, Vercel AI SDK).
- UX/product is complementary early-startup / 0→1 experience, not a designer pitch.
- Contact: LinkedIn `https://www.linkedin.com/in/alexmesch/` **or** `hello@alexmesch.com` (on `/contact` and in body copy). Never strip email from contact/privacy prose.
- No published CVs (PDF, MD, DOC/DOCX, or `/cv*` paths); no phone; no legal entities; Do not label Vectary as US.
- Never publish place names **Cheboksary** / **Cheboxary**, or company name **Brandymint**.
- **Do not name** Wecudos, SlidePresenter, Brandymint, or Flow Health. If needed, describe the work/achievement without those company names.
- `/about` copy source of truth is the LinkedIn About text (including Belgrade / timezone-flexible and open-to-work lines). Do not rewrite it into a softer bio.
- Do not invent additional residence details beyond what that LinkedIn About states.
- Do not reintroduce nickname prose (“also known as sibsfinx”).

## Company naming on /work and mirrors

- Keep named outcomes for: Littledata, Vectary, Fohlio, IQ300, 3dEYE. Unnamed healthcare engagements: US healthcare/insurance; UK healthcare/wellness/performance (never “Flow Health”).
- **Do not name** Wecudos, SlidePresenter, Brandymint, or Flow Health. If needed, describe the work/achievement without those company names.

## Typography

Site typeface is **Gira Sans** only (`gira-sans` via Adobe Fonts / Typekit kit `wma7yvn`).
Load `https://use.typekit.net/wma7yvn.css` in `<head>` on every HTML page (with typekit preconnects) and keep `/site.css` font-family overrides.
Do not use Lato, Space Mono, or other display stacks for UI copy. Ensure the Adobe Fonts kit allows the publish domains (alexmesch.com, Netlify previews) so the font is not missing.

## Analytics

No Yandex.Metrika. Do not embed Metrika or any other first-party analytics counter. Privacy copy must not describe Metrika (or similar) as in use.

## Background

Canvas must stay solid white (`#fff`) on every breakpoint. Override legacy mobile `#eee` cover gradients via `site.css`; never ship gray/cream page backgrounds.

## About page

Use the LinkedIn About content verbatim (structured into paragraphs + Stack + Skills). Keep site contact footer: LinkedIn or hello@alexmesch.com.

## Private `.ai/` tree

`.ai/` is for local/agent rules only. It must **never** be copied into `dist/` or served on alexmesch.com. `scripts/prepare-netlify.mjs` allowlists publish files and deletes `.ai` from `dist`; Netlify force-404s `/.ai/*`.

