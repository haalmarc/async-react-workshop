// ✍️ Ekstraoppgave: Bytt ut referanseskjemaet med ditt eget skjema i denne filen.
// Bruk useActionState til resultat, valideringsfeil og pending-status.
// Action tar (previousState, formData), kaller createQuestion og oppdaterer listen.
// Prøv et spørsmål med færre enn fem tegn (servervalidering), suksess og simulert feil.
// Behold brukerens tekst ved feil. Sammenlign med src/solution/questions.tsx.
// ✅ Ferdig når: Pending vises; feil beholder teksten; suksess tømmer feltet og oppdaterer listen.
// 📜 https://react.dev/reference/react/useActionState
// 💡 Refleksjon: React Actions er ikke det samme som Next.js Server Actions.
// Hvor kjører denne handlingen, og hvor validerer vi data?
export { Questions } from '../base/questions';
