# Spendlens Expense Dashboard

This project is a small browser-based dashboard for reviewing multi-currency expenses. It converts every expense into USD, summarizes spend by category and merchant, and lets a finance user filter, sort, add rows, and test how a changed EUR rate would affect totals.

## Live URL

Deployed URL:

`https://spendlens-case-repo.netlify.app`

## Run Locally

Open `index.html` in a browser, or run a small static server from this folder:

```bash
python -m http.server 5173
```

Then visit `http://localhost:5173`.

## File Structure

- `index.html` - page structure, dashboard regions, form, and written Part A notes.
- `styles.css` - responsive layout and visual styling.
- `app.js` - static dataset, conversion logic, summary calculations, sorting, filtering, form handling, and EUR what-if behavior.
- `docs/ceo-brief.md` - plain-English CEO briefing note.
- `docs/edge-cases.md` - bonus failure-mode analysis.

## Assumptions

- The supplied rate table is the source of truth.
- Rates are quoted as local currency per 1 USD, so USD value is `amount / rate`.
- In-memory additions are enough for the assignment; added rows disappear on refresh.
- Categories are limited to Travel, Food, Software, and Entertainment.
- The EUR slider changes the supplied EUR-per-USD rate, not a live market rate.

## Known Limitations

- There is no login, database, or file import.
- The add form validates basic inputs, but it does not support custom categories.
- The dashboard does not persist user-added expenses.
- The live URL placeholder must be replaced after deployment.

## With Another 4 Hours

- Add local storage or a lightweight backend so new expenses persist.
- Add CSV import/export for finance handoff.
- Add tests for conversion, grouping, and form validation.
- Add clearer error states for unsupported currencies in imported data.
- Add a compact chart for monthly spend trends.
