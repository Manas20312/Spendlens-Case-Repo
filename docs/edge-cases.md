# Edge Case Analysis

| Failure mode | Current handling | Correct behavior |
| --- | --- | --- |
| Amount is `0` | The form rejects it and keeps the row out of the table. | Require a positive amount for normal expenses; model credits/refunds separately if the product later supports them. |
| Amount is negative | The form rejects negative values. | Decide product policy: either reject negatives or model them explicitly as refunds/credits with clear labels. |
| Merchant has special characters like `<script>` | Merchant names are escaped before rendering. | Continue escaping all user-entered text and never inject raw HTML. |
| Rate is `null`, undefined, or `0` | Conversion returns `null`; displayed rows show `Missing rate`. | Block bad rate entries from summary totals and show a clear actionable error. |
| Add form submitted with empty fields | The form shows a validation message. | Keep the row out of the dataset until all required fields pass validation. |
| Very large amount | It renders using normal table layout and may become visually wide. | Add max-width wrapping or abbreviated display for extreme values while preserving exact values on hover/export. |
| Filter returns no results | An empty-state message appears. | Keep the current filter visible and provide a one-click way back to all categories. |
| Narrow mobile screen | Tables scroll horizontally and panels stack. | Keep the full data accessible, then consider card-style rows for a more polished mobile experience. |
| Duplicate merchant names with different capitalization | The app treats them as different merchants. | Normalize merchant keys for ranking while preserving the original display name. |
| Future currency added to expense data but not rate table | The row would show a missing-rate state if present in data; the form only allows supported currencies. | Require a valid rate before accepting or importing that currency. |
| EUR what-if rate creates a lower total | The delta displays a negative currency value. | Keep the sign explicit so finance can see whether spend increased or decreased. |
| Same date expenses sorted by date | Same-day order follows original array order implicitly. | Add a secondary sort by merchant or USD amount for deterministic sorting. |
