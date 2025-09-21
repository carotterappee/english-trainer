export type PlaceEN = { en: string; fr: string; alts?: string[] };
const P_EN: PlaceEN[] = [
  { en: "Good morning!", fr: "Bonjour !" },
  { en: "Where is the nearest metro station?", fr: "Où est la station de métro la plus proche ?" },
  { en: "I’d like a glass of water, please.", fr: "Je voudrais un verre d’eau, s’il vous plaît." },
  { en: "Don’t worry, it happens.", fr: "Ne t’inquiète pas, ça arrive.", alts:["Ne vous inquiétez pas, ça arrive."] },
  { en: "We’re meeting at the main entrance.", fr: "On se retrouve devant l’entrée principale." },
  { en: "Please summarize the main idea.", fr: "Résume l’idée principale, s’il te plaît.", alts:["Résumez l’idée principale, s’il vous plaît."] },
  { en: "What are the advantages and disadvantages?", fr: "Quels sont les avantages et les inconvénients ?" },
  { en: "Let’s take a short break.", fr: "On fait une courte pause.", alts:["Faisons une courte pause."] },
  { en: "Is this seat taken?", fr: "Cette place est-elle prise ?", alts:["Cette place est prise ?"] },
  { en: "I have to buy a round-trip ticket.", fr: "Je dois acheter un billet aller-retour." },
  { en: "Could you speak a bit slower?", fr: "Tu peux parler un peu plus lentement ?", alts:["Vous pouvez parler un peu plus lentement ?"] },
  { en: "He refused, albeit politely.", fr: "Il a refusé, quoique poliment.", alts:["Il a refusé, bien que poliment."] },
];
export default P_EN;
