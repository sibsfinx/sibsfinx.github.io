# BASE rules — portfolio site style & content

## Visual style (non-negotiable)

- Match the **homepage Webflow look 100%** on every HTML page (home, about, work, contact, privacy, 404).
- Source of truth: live alexmesch.com / root `index.html` + CDN CSS  
  `octobear.webflow.*.css` (white background `#fff`, black type, `#30f` link hover, Space Mono / gira-sans / Lato via existing embeds).
- Reuse homepage structure and classes: `app-container--blank`, `app-cover--blank`, `cover-title`, `font-space`, `social-link--grid`, `w-row` / `w-col`, photo when appropriate.
- Subpages may use `subpage-cover` + `subpage-prose` in `site.css` **only** for height/prose sizing. No new visual theme.
- **Do not** invent alternate UI: cream/paper backgrounds, serif “editorial” stacks, custom `.site-nav` bars, card layouts, purple gradients, or dashboard chrome.
- Keep social label spelling parity with live when unsure (`Github` / `Linkedin` on older exports); newer GitHub/LinkedIn/Email labels are OK if already on the branch.

## Homepage link column

In the right-hand `social-link--grid` column, put **About** and **Work** first (above GitHub / LinkedIn / Email / other profiles).

## Positioning & contact

- First person; Lead / Senior Software Engineer (React, TypeScript, Node.js, Ruby, Ruby on Rails, MongoDB, Vercel AI SDK).
- UX/product is complementary early-startup / 0→1 experience, not a designer pitch.
- Contact: LinkedIn `https://www.linkedin.com/in/alexmesch/` **or** `hello@alexmesch.com`. Never strip email.
- No published CV PDFs; no phone; no city of residence; no legal entities; Vectary = US.
- Do not reintroduce nickname prose (“also known as sibsfinx”).

## Company naming on /work and mirrors

- Keep named outcomes for: Littledata, Vectary, Fohlio, IQ300, 3dEYE, Flow Health (and similar kept names).
- **Do not name** Wecudos, SlidePresenter, or Brandymint. If needed, describe the work/achievement without those company names.
