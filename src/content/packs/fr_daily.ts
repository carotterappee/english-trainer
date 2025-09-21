export type FrDailyItem = { fr: string; ru?: string; alts?: string[] };

const frEveryday: FrDailyItem[] = [
  // — Salutations / politesses —
  { fr: "Bonjour, comment vas-tu ?", ru: "Привет, как дела?", alts: ["Добрый день, как ты?"] },
  { fr: "Salut, ça va ?", ru: "Привет, как дела?", alts: ["Как ты?"] },
  { fr: "Bonsoir, tu as passé une bonne journée ?", ru: "Добрый вечер, день прошёл хорошо?", alts: ["Как прошёл день?"] },
  { fr: "Merci beaucoup, c’est très gentil.", ru: "Большое спасибо, это очень мило.", alts: ["Спасибо большое, очень любезно."] },
  { fr: "Excuse-moi, je ne voulais pas te déranger.", ru: "Извини, я не хотел тебя беспокоить.", alts: ["Извини, я не хотела тебя беспокоить.", "Прости, не хотел(а) беспокоить."] },
  { fr: "Pardon, est-ce que je peux passer ?", ru: "Извините, можно пройти?", alts: ["Простите, можно я пройду?"] },
  { fr: "À bientôt, prends soin de toi !", ru: "До скорого, береги себя!" },
  { fr: "Bonne journée, bonne soirée, bonne nuit.", ru: "Хорошего дня, хорошего вечера, спокойной ночи." },

  // — Maison / quotidien —
  { fr: "Tu as bien dormi cette nuit ?", ru: "Ты хорошо спал этой ночью?", alts: ["Ты хорошо спала этой ночью?"] },
  { fr: "Qu’est-ce qu’on mange ce soir ?", ru: "Что на ужин сегодня?", alts: ["Что будем есть вечером?"] },
  { fr: "Tu peux mettre la table s’il te plaît ?", ru: "Можешь накрыть на стол, пожалуйста?", alts: ["Накрой, пожалуйста, на стол."] },
  { fr: "J’ai besoin de faire une lessive.", ru: "Мне нужно постирать.", alts: ["Мне надо постирать", "Мне нужно сделать стирку", "Мне нужно выстирать"] },
  { fr: "On sort les poubelles demain matin.", ru: "Завтра утром выносим мусор." },
  { fr: "Tu peux fermer la fenêtre, il fait froid.", ru: "Можешь закрыть окно, холодно." },
  { fr: "Tu as vu mes clés ? Je ne les trouve pas.", ru: "Ты не видел мои ключи? Я их не нахожу.", alts: ["Ты не видела мои ключи? Я их не нахожу.", "Где мои ключи? Не могу найти."] },
  { fr: "La télécommande est où ?", ru: "Где пульт?", alts: ["Пульт где?"] },
  { fr: "J’ai faim, qu’est-ce qu’on prépare ?", ru: "Я голоден, что готовим?", alts: ["Я голодна, что готовим?", "Что будем готовить?"] },
  { fr: "Tu veux un café ou un thé ?", ru: "Хочешь кофе или чай?", alts: ["Тебе кофе или чай?"] },
  { fr: "Passe-moi le sel, s’il te plaît.", ru: "Передай, пожалуйста, соль.", alts: ["Соль, пожалуйста."] },
  { fr: "Tu as envie de dessert ?", ru: "Хочешь десерт?", alts: ["Есть желание десерта?", "Будешь десерт?"] },
  { fr: "Je fais les courses demain, il te faut quelque chose ?", ru: "Завтра иду за покупками, тебе что-нибудь нужно?", alts: ["Завтра я делаю покупки, тебе нужно что-нибудь?"] },
  { fr: "Attention, c’est chaud !", ru: "Осторожно, горячо!" },
  { fr: "Tu veux goûter ?", ru: "Хочешь попробовать?" },
  { fr: "C’est délicieux, tu as bien cuisiné !", ru: "Очень вкусно, хорошо приготовил!", alts: ["Очень вкусно, хорошо приготовила!"] },

  // — Courses / boutique —
  { fr: "Bonjour, je voudrais une baguette, s’il vous plaît.", ru: "Здравствуйте, один багет, пожалуйста.", alts: ["Можно, пожалуйста, один багет.", "Здравствуйте, одну булку багета, пожалуйста."] },
  { fr: "Combien ça coûte ?", ru: "Сколько это стоит?" },
  { fr: "Est-ce que vous avez une taille plus grande ?", ru: "У вас есть размер побольше?", alts: ["Есть ли размер побольше?"] },
  { fr: "Je peux payer par carte ?", ru: "Могу я заплатить картой?", alts: ["Можно заплатить картой?", "Я могу заплатить картой?"] },
  { fr: "Vous ouvrez à quelle heure demain ?", ru: "Завтра во сколько открываетесь?", alts: ["Во сколько вы открываетесь завтра?"] },
  { fr: "Excusez-moi, où se trouve le rayon des fruits ?", ru: "Извините, где отдел фруктов?", alts: ["Подскажите, где фруктовый отдел?"] },
  { fr: "Merci, bonne journée.", ru: "Спасибо, хорошего дня." },

  // — Transports —
  { fr: "Le bus passe toutes les combien de minutes ?", ru: "Автобус ходит с каким интервалом?", alts: ["Через сколько минут приходит автобус?"] },
  { fr: "Je prends le métro à la prochaine station.", ru: "Я сажусь на метро на следующей станции.", alts: ["На следующей станции сяду в метро."] },
  { fr: "Excusez-moi, pour aller à la gare ?", ru: "Извините, как пройти к вокзалу?", alts: ["Подскажите, как пройти к вокзалу?"] },
  { fr: "Vous descendez au prochain arrêt ?", ru: "Вы выходите на следующей остановке?" },
  { fr: "On se retrouve devant l’entrée principale.", ru: "Встречаемся у главного входа.", alts: ["Давай встретимся у главного входа."] },
  { fr: "Je dois acheter un billet aller-retour.", ru: "Мне нужно купить билет туда и обратно.", alts: ["Нужен возвратный билет."] },
  { fr: "Il y a beaucoup de circulation aujourd’hui.", ru: "Сегодня сильные пробки.", alts: ["Сегодня большие пробки.", "Сегодня плотное движение."] },

  // — Communication —
  { fr: "Allô, tu m’entends bien ?", ru: "Алло, меня хорошо слышно?", alts: ["Ты меня хорошо слышишь?"] },
  { fr: "Je te rappelle plus tard.", ru: "Я перезвоню позже." },
  { fr: "Tu peux m’envoyer un message quand tu arrives ?", ru: "Напиши мне, когда приедешь.", alts: ["Сообщи мне, когда приедешь.", "Отпиши, когда приедешь."] },
  { fr: "J’ai raté ton appel, excuse-moi.", ru: "Я пропустил твой звонок, извини.", alts: ["Я пропустила твой звонок, извини."] },
  { fr: "Tu as reçu mon mail ?", ru: "Ты получил моё письмо по электронной почте?", alts: ["Ты получила мой имейл?", "Ты получил(а) моё письмо?"] },
  { fr: "Envoie-moi la photo sur WhatsApp.", ru: "Пришли мне фото в WhatsApp.", alts: ["Скинь фото в WhatsApp.", "Отправь фотографию в WhatsApp."] },
  { fr: "On se fait une visio ce soir ?", ru: "Созвонимся с видео сегодня вечером?", alts: ["Сделаем видеозвонок сегодня вечером?"] },

  // — Travail / études —
  { fr: "Tu as terminé ton dossier ?", ru: "Ты закончил свой документ?", alts: ["Ты закончила свой документ?", "Ты закончил(а) своё дело/папку?"] },
  { fr: "J’ai une réunion à 14h.", ru: "У меня встреча в 14:00.", alts: ["У меня совещание в два."] },
  { fr: "Peux-tu m’expliquer encore une fois ?", ru: "Можешь объяснить ещё раз?", alts: ["Поясни, пожалуйста, ещё раз."] },
  { fr: "On fait une pause café ?", ru: "Сделаем кофейный перерыв?", alts: ["Перерыв на кофе?"] },
  { fr: "J’imprime les documents et je te les apporte.", ru: "Я распечатаю документы и принесу тебе.", alts: ["Распечатаю документы и занесу."] },
  { fr: "Je vais travailler de chez moi aujourd’hui.", ru: "Сегодня я работаю из дома." },
  { fr: "On révise ensemble demain ?", ru: "Завтра повторяем вместе?", alts: ["Давай завтра вместе позанимаемся?"] },

  // — Social / sorties —
  { fr: "Tu veux venir dîner à la maison ce week-end ?", ru: "Хочешь прийти на ужин к нам домой в выходные?", alts: ["Придёшь поужинать у нас на выходных?"] },
  { fr: "On va au cinéma ce soir ?", ru: "Пойдём в кино сегодня вечером?", alts: ["Сходим в кино сегодня вечером?"] },
  { fr: "Tu as déjà vu ce film ?", ru: "Ты уже видел этот фильм?", alts: ["Ты уже видела этот фильм?"] },
  { fr: "Ça te dit d’aller boire un verre ?", ru: "Хочешь пойти выпить?", alts: ["Как насчёт выпить по стаканчику?"] },
  { fr: "J’ai une super nouvelle à t’annoncer !", ru: "У меня для тебя отличная новость!" },
  { fr: "Je suis désolé(e), je ne peux pas venir.", ru: "Прости, я не могу прийти." },
  { fr: "Joyeux anniversaire !", ru: "С днём рождения!" },
  { fr: "On se fait une balade cet après-midi ?", ru: "Пойдём прогуляться сегодня днём?", alts: ["Гуляем сегодня днём?"] },

  // — Réactions / humeur / météo —
  { fr: "Ça marche !", ru: "Договорились!", alts: ["Идёт!", "Окей!"] },
  { fr: "Pas de souci.", ru: "Без проблем." },
  { fr: "C’est pas grave.", ru: "Ничего страшного." },
  { fr: "Tant mieux !", ru: "Тем лучше!" },
  { fr: "Tu plaisantes ?", ru: "Ты шутишь?", alts: ["Ты издеваешься?"] },
  { fr: "Je suis crevé(e).", ru: "Я устал.", alts: ["Я устала.", "Я вымотан.", "Я вымотана."] },
  { fr: "Il fait un temps magnifique !", ru: "Погода замечательная!", alts: ["Шикарная погода!"] },
  { fr: "J’ai trop de choses à faire aujourd’hui.", ru: "У меня сегодня слишком много дел.", alts: ["Столько дел сегодня."] },
];

export default frEveryday;
