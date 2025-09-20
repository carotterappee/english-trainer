import type { Goal } from "@/lib/profile";

export type SentenceItem = { en: string; fr: string };

const everyday: SentenceItem[] = [
  { en: "I get up early and make some coffee.", fr: "Je me lève tôt et je prépare du café." },
  { en: "I usually take the bus to work.", fr: "Je prends généralement le bus pour aller au travail." },
  { en: "I cook dinner and watch a show in the evening.", fr: "Le soir, je prépare le dîner et je regarde une série." },
  { en: "Let’s meet at the supermarket after work.", fr: "On se retrouve au supermarché après le travail." },
];

const travel: SentenceItem[] = [
  { en: "Could I get a return ticket to London, please?", fr: "Je pourrais avoir un billet aller-retour pour Londres, s’il vous plaît ?" },
  { en: "Where is the nearest underground station?", fr: "Où est la station de métro la plus proche ?" },
  { en: "My suitcase is small, but it’s heavy.", fr: "Ma valise est petite, mais elle est lourde." },
  { en: "What time does the train to Bristol leave?", fr: "À quelle heure part le train pour Bristol ?" },
];

const work: SentenceItem[] = [
  { en: "I have a meeting at ten.", fr: "J’ai une réunion à dix heures." },
  { en: "Could we move the call to this afternoon?", fr: "Pourrait-on décaler l’appel à cet après-midi ?" },
  { en: "I’ll send you the notes after the meeting.", fr: "Je t’enverrai le compte rendu après la réunion." },
  { en: "I’m working from home on Fridays.", fr: "Je travaille à la maison le vendredi." },
];

const exams: SentenceItem[] = [
  { en: "There are three questions on the test.", fr: "Il y a trois questions dans le test." },
  { en: "Read the text and answer in complete sentences.", fr: "Lis le texte et réponds en phrases complètes." },
  { en: "Underline the adjectives in the paragraph.", fr: "Souligne les adjectifs dans le paragraphe." },
  { en: "Write a short email to your teacher.", fr: "Écris un court e-mail à ton professeur." },
];

export function getSentences(goal: Goal): SentenceItem[] {
  switch (goal) {
    case "everyday": return everyday;
    case "travel":   return travel;
    case "work":     return work;
    case "exams":    return exams;
    default:         return everyday;
  }
}
