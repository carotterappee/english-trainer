import type { Goal } from "@/lib/profile";

export type SentenceItem = { en: string; fr: string };

const everyday: SentenceItem[] = [
  { en: "I get up early and make some coffee.", fr: "Je me lève tôt et je prépare du café." },
  { en: "I usually take the bus to work.", fr: "Je prends généralement le bus pour aller au travail." },
  { en: "I cook dinner and watch a show in the evening.", fr: "Le soir, je prépare le dîner et je regarde une série." },
  { en: "Let’s meet at the supermarket after work.", fr: "On se retrouve au supermarché après le travail." },
  { en: "I tidy the kitchen after breakfast.", fr: "Je range la cuisine après le petit-déjeuner." },
  { en: "I’m running late — I’ll text you.", fr: "Je suis en retard — je t’enverrai un message." },
  { en: "Let’s grab a coffee near the park.", fr: "On prend un café près du parc." },
  { en: "I usually cook simple meals during the week.", fr: "Je cuisine des plats simples pendant la semaine." },
  { en: "I like reading before going to sleep.", fr: "J’aime lire avant de dormir." },
  { en: "I’ll do the dishes later.", fr: "Je ferai la vaisselle plus tard." },
  { en: "I need a quick nap.", fr: "J’ai besoin d’une petite sieste." },
  { en: "I’m not in the mood to go out.", fr: "Je n’ai pas envie de sortir." },
  { en: "It’s raining cats and dogs.", fr: "Il pleut des cordes." },
  { en: "Take your time — no rush.", fr: "Prends ton temps — il n’y a pas d’urgence." },
  { en: "It’s on the tip of my tongue.", fr: "Je l’ai sur le bout de la langue." },
];

const travel: SentenceItem[] = [
  { en: "Could I get a return ticket to London, please?", fr: "Je pourrais avoir un billet aller-retour pour Londres, s’il vous plaît ?" },
  { en: "Where is the nearest underground station?", fr: "Où est la station de métro la plus proche ?" },
  { en: "My suitcase is small, but it’s heavy.", fr: "Ma valise est petite, mais elle est lourde." },
  { en: "What time does the train to Bristol leave?", fr: "À quelle heure part le train pour Bristol ?" },
  { en: "Where can I check in my luggage?", fr: "Où puis-je enregistrer mes bagages ?" },
  { en: "Is this seat taken?", fr: "Ce siège est-il pris ?" },
  { en: "How long does the journey take?", fr: "Le trajet dure combien de temps ?" },
  { en: "Do I need to change trains?", fr: "Dois-je changer de train ?" },
  { en: "I’m looking for a cheap hostel.", fr: "Je cherche une auberge pas chère." },
  { en: "Our flight is delayed.", fr: "Notre vol est retardé." },
  { en: "We missed the connection.", fr: "Nous avons raté la correspondance." },
  { en: "Let’s hit the road.", fr: "On prend la route." },
  { en: "Can I get this to go?", fr: "C’est possible à emporter ?" },
  { en: "Keep the change.", fr: "Gardez la monnaie." },
  { en: "I’m just browsing, thanks.", fr: "Je regarde seulement, merci." },
];

const work: SentenceItem[] = [
  { en: "I have a meeting at ten.", fr: "J’ai une réunion à dix heures." },
  { en: "Could we move the call to this afternoon?", fr: "Pourrait-on décaler l’appel à cet après-midi ?" },
  { en: "I’ll send you the notes after the meeting.", fr: "Je t’enverrai le compte rendu après la réunion." },
  { en: "I’m working from home on Fridays.", fr: "Je travaille à la maison le vendredi." },
  { en: "Can we push the deadline to Monday?", fr: "On peut repousser l’échéance à lundi ?" },
  { en: "I’ll send an update this afternoon.", fr: "J’enverrai une mise à jour cet après-midi." },
  { en: "Let’s keep it short and clear.", fr: "Faisons court et clair." },
  { en: "Could you share the slides?", fr: "Tu peux partager les diapositives ?" },
  { en: "Let’s circle back tomorrow.", fr: "On y revient demain." },
  { en: "I’m swamped today.", fr: "Je suis débordé(e) aujourd’hui." },
  { en: "Let’s take this offline.", fr: "On en parle en privé." },
  { en: "It’s a tight deadline.", fr: "L’échéance est serrée." },
  { en: "I’ll loop you in by email.", fr: "Je te mets en copie par e-mail." },
  { en: "That works for me.", fr: "Ça me convient." },
  { en: "Let’s schedule a quick check-in.", fr: "Planifions un petit point rapide." },
];

const exams: SentenceItem[] = [
  { en: "There are three questions on the test.", fr: "Il y a trois questions dans le test." },
  { en: "Read the text and answer in complete sentences.", fr: "Lis le texte et réponds en phrases complètes." },
  { en: "Underline the adjectives in the paragraph.", fr: "Souligne les adjectifs dans le paragraphe." },
  { en: "Write a short email to your teacher.", fr: "Écris un court e-mail à ton professeur." },
  { en: "Check your spelling and punctuation.", fr: "Vérifie l’orthographe et la ponctuation." },
  { en: "Compare these two paragraphs.", fr: "Compare ces deux paragraphes." },
  { en: "Give two examples from the passage.", fr: "Donne deux exemples tirés du passage." },
  { en: "Justify your answer.", fr: "Justifie ta réponse." },
  { en: "Don’t forget the title.", fr: "N’oublie pas le titre." },
  { en: "Explain it in your own words.", fr: "Explique-le avec tes propres mots." },
  { en: "Choose the correct option.", fr: "Choisis la bonne option." },
  { en: "Fill in the blanks.", fr: "Complète les blancs." },
  { en: "Match the words with their definitions.", fr: "Associe les mots à leurs définitions." },
  { en: "Summarize the main idea.", fr: "Résume l’idée principale." },
  { en: "Use linking words to connect your ideas.", fr: "Utilise des mots de liaison pour relier tes idées." },
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
