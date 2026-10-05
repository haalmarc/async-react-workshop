# Formatering

- Bruk Oxfmt med prosjektets `.oxfmtrc.json` som kilde til formatteringsregler.
- Legg formatteringsregler i prosjektkonfigurasjonen, ikke i editorspesifikke innstillinger.
- Bruk doble anførselstegn i JavaScript/TypeScript og doble i JSX-attributter og JSON.
- Bruk to mellomrom til innrykk, semikolon og LF-linjeskift.
- Formater bare filene du endrer: `pnpm exec oxfmt --write <fil ...>`.
- Sjekk disse filene med `pnpm exec oxfmt --check <fil ...>` før du avslutter.
- Unngå formatteringsendringer i andre filer. Ikke kjør `pnpm format` på hele
  prosjektet med mindre oppgaven gjelder formatering av hele prosjektet.
- Bevar eksisterende brukerendringer.
