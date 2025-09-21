export type PlaceFR = { fr: string; ru: string; alts?: string[] };
const P_FR: PlaceFR[] = [
  { fr: "Bonjour, comment vas-tu ?", ru: "Привет, как дела?", alts:["Добрый день, как ты?"] },
  { fr: "Tu peux fermer la fenêtre, il fait froid.", ru: "Можешь закрыть окно, холодно." },
  { fr: "Je dois acheter un billet aller-retour.", ru: "Мне нужно купить билет туда и обратно.", alts:["Нужен возвратный билет."] },
  { fr: "On se retrouve devant l’entrée principale.", ru: "Встречаемся у главного входа." },
  { fr: "Tu as reçu mon mail ?", ru: "Ты получил моё письмо по электронной почте?", alts:["Ты получила мой имейл?"] },
  { fr: "C’est délicieux, tu as bien cuisiné !", ru: "Очень вкусно, хорошо приготовил!", alts:["Очень вкусно, хорошо приготовила!"] },
  { fr: "Le bus passe toutes les combien de minutes ?", ru: "Автобус ходит с каким интервалом?", alts:["Через сколько минут приходит автобус?"] },
  { fr: "Expliquez avec vos propres mots.", ru: "Объясните своими словами." },
  { fr: "Donnez un exemple précis.", ru: "Приведите конкретный пример." },
  { fr: "Décrivez la scène représentée.", ru: "Опишите представленную сцену." },
  { fr: "Quels sont les avantages et les inconvénients ?", ru: "Каковы преимущества и недостатки?" },
  { fr: "Faites un résumé en cinq lignes.", ru: "Сделайте краткое изложение в пять строк." },
];
export default P_FR;
