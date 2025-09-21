export type BoostItemFR = { fr: string; ru: string; alts?: string[] };
const testFr: BoostItemFR[] = [
  { fr: "Bonjour, comment vas-tu ?", ru: "Привет, как дела?", alts:["Добрый день, как ты?"] },
  { fr: "Tu peux fermer la fenêtre, il fait froid.", ru: "Можешь закрыть окно, холодно." },
  { fr: "Je dois acheter un billet aller-retour.", ru: "Мне нужно купить билет туда и обратно.", alts:["Нужен возвратный билет."] },
  { fr: "Tu veux venir dîner à la maison ce week-end ?", ru: "Хочешь прийти на ужин к нам домой в выходные?" },
  { fr: "Je te rappelle plus tard.", ru: "Я перезвоню позже." },
  { fr: "Excusez-moi, où se trouve le rayon des fruits ?", ru: "Извините, где отдел фруктов?", alts:["Подскажите, где фруктовый отдел?"] },
  { fr: "C’est délicieux, tu as bien cuisiné !", ru: "Очень вкусно, хорошо приготовил!", alts:["Очень вкусно, хорошо приготовила!"] },
  { fr: "On se retrouve devant l’entrée principale.", ru: "Встречаемся у главного входа." },
  { fr: "Tu as reçu mon mail ?", ru: "Ты получил моё письмо по электронной почте?", alts:["Ты получила мой имейл?"] },
  { fr: "On fait une pause café ?", ru: "Сделаем кофейный перерыв?", alts:["Перерыв на кофе?"] },
  { fr: "J’ai trop de choses à faire aujourd’hui.", ru: "У меня сегодня слишком много дел." },
  { fr: "Le bus passe toutes les combien de minutes ?", ru: "Автобус ходит с каким интервалом?", alts:["Через сколько минут приходит автобус?"] },
];
export default testFr;
