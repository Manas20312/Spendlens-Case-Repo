# CEO Briefing Note

## What I Built

I built a working expense dashboard for Spendlens that turns a messy multi-currency expense list into a USD summary a finance lead can use quickly. The dashboard shows total spend, ranked category spend, the top three merchants, and a searchable workflow through filtering and sorting. It also includes a form for adding a new expense and a what-if control for testing how EUR exchange-rate changes affect the total.

This matters because Spendlens is trying to help individuals and small businesses understand spending across currencies. The assignment version is small, but it demonstrates the core product loop: accept mixed-currency records, normalize them into a common currency, and present the result in a way that is understandable without spreadsheet work.

## Trade-Offs

1. I used a static dataset and in-memory state because the brief did not require persistence. This made the app faster to ship, but added expenses disappear after refresh.
2. I focused on clear finance-facing tables instead of heavy charts. The dashboard is less flashy, but the key numbers are easier to verify.
3. I kept categories fixed to the provided dataset. That reduces form mistakes, but a real product would need editable categories and mapping rules.

## Next Sprint Priorities

1. Add persistence and CSV import/export. This would make the tool usable beyond a demo and reduce manual finance work.
2. Add validation and error reporting for missing rates, unsupported currencies, and bad uploaded rows. This would protect board-report totals from silent data problems.
3. Add trend views by month and category. This would move the product from reporting what happened to helping the team notice spending patterns earlier.

The app is functional for the assignment scope, but it is not production-ready until it has persistence, stronger import validation, and a clearer data-review workflow.
