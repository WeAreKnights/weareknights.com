# Hours

Visible opening hours from the same data as the LocalBusiness JSON-LD (`site.business.openingHours`), as a native `<details>` accordion.

```liquid
{% hours site.business.openingHours, site.timeZone %}
```

- Renders nothing when the array is empty.
- Collapsed it reads "Open from 9 am to 5 pm today." (or "Closed today."); open, it shows the full week with today's row highlighted. Several entries on one day join as "9 am to 12 pm and 1 pm to 5 pm". Days with no entry show "Closed".
- "Today" is worked out in the browser by `hours.js` (the site is static), in the business's `site.timeZone` (an IANA name, default `America/New_York`), so visitors in other time zones see the business's day. A missing or invalid time zone falls back to the visitor's own clock. Without JS the summary stays "Opening hours" and the table still works.
- Times are formatted from the 24-hour `HH:MM` values, e.g. `17:30` → "5:30 pm".
- No new data: edit `openingHours` in `site.json` and both the schema and this component follow.
