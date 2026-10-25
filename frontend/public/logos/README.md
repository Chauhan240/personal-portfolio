# Client and certification logos

Logos are monochrome **SVG** files. The site renders them as a tintable mask, so
one file works on any background and picks up the surrounding text colour. Use a
single-colour, transparent-background SVG (square or wide viewBox both work).

Shipped (from Simple Icons, CC0): `coca-cola`, `amazon`, `dell`, `unilever`, plus
the certification providers `aws`, `azure`, `gcp`, `databricks`, `snowflake`.

**Not shipped** (no open-licence mark available): `capgemini`, `honeywell`,
`takeda`, `john-lewis`, `indorama`, `deloitte`. These render as a clean text
wordmark until you add the official file.

To add one:

1. Save the official SVG here as `<slug>.svg` (slugs are in `src/data/clients.ts`).
2. Add the slug to the `logoFiles` set in `src/data/clients.ts`.
3. If the artwork is a wide wordmark inside a square viewBox (like Coca-Cola),
   add it to `wide` and `aspect` in `src/components/LogoMark.tsx`.

Brand marks are trademarks of their owners and are shown here only to indicate
past client work. Check each company's brand guidelines before publishing.
