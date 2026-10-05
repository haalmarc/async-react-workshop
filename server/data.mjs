export const sessions = [
  {
    id: "mellomrom",
    day: "1",
    time: "09:00",
    title: "Det som skjer mens vi venter",
    speaker: "Ada Berg",
    track: "Frontend",
    color: "peach",
    description:
      "En app er mer enn sluttresultatet. Vi ser på hvordan venting, feedback og små produktvalg former opplevelsen mellom et klikk og et svar.",
  },
  {
    id: "cache",
    day: "1",
    time: "10:00",
    title: "Cache er også et produktvalg",
    speaker: "Noah Vik",
    track: "Data",
    color: "mint",
    description:
      "Når er gamle data nyttige, og når er de misvisende? Vi utforsker ferskhet, bakgrunnsoppdateringer og hvordan et datalag kan hjelpe oss.",
  },
  {
    id: "komponenter",
    day: "1",
    time: "11:00",
    title: "Komponenter som tar ansvar",
    speaker: "Lea Strand",
    track: "Design",
    color: "lavender",
    description:
      "Fra onClick og isLoading til tydelige kontrakter for handlinger. Hvordan kan et designsystem gjøre gode mellomtilstander enklere å få til?",
  },
  {
    id: "suspense",
    day: "2",
    time: "09:00",
    title: "En grense for venting",
    speaker: "Emil Lund",
    track: "Frontend",
    color: "mint",
    description:
      "Suspense handler også om hvor innhold skal dukke opp sammen. Vi undersøker grenser, fallbacks og hvorfor én stor spinner sjelden er hele svaret.",
  },
  {
    id: "optimisme",
    day: "2",
    time: "10:00",
    title: "Optimisme med retrettmulighet",
    speaker: "Mia Dahl",
    track: "Design",
    color: "peach",
    description:
      "Umiddelbar respons er fint, men serveren kan være uenig. En praktisk samtale om optimistiske oppdateringer, bekreftelse og forståelig rollback.",
  },
  {
    id: "navigasjon",
    day: "2",
    time: "11:00",
    title: "På vei til neste skjerm",
    speaker: "Oliver Sol",
    track: "Frontend",
    color: "lavender",
    description:
      "Hva bør skje med en gang når du navigerer? Vi kobler prioritering av React-oppdateringer til visuelle overganger uten å blande dem sammen.",
  },
];

export function createDatabase() {
  return { favorites: new Set(), questions: [], nextQuestionId: 1 };
}
