# Executive Briefing Note

## What I Made

I made a live expense dashboard for Spendlens that converts an unruly multi-currency expense log into a USD snapshot that is useful to the finance lead immediately. The dashboard includes total spend, sorted by category, the top three merchants, and a filterable and sortable workflow. It includes a form to create an expense and what-if controls to see how variations of the EUR exchange rate impact the total.

This is important because Spendlens is trying to help people manage their spending in multiple currencies. The assignment version is minimal, but it illustrates the basic product concept: accept inputs from different currencies, normalize them into one currency, and display in a format which is understandable without spreadsheets.

## Trade-offs

- I used a static dataset and in-memory storage since persistence was not called for in the brief. The implementation was easier and quicker to ship, but added expenses will vanish with refreshes.
- I stuck with plain tables rather than extensive visualizations. The dashboard may be duller, but the important numbers are easy to double-check.
- I left categories set to the provided dataset. Fewer data entry mistakes, but editable categories would be necessary for real world use case.
