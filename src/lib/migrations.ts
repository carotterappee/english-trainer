const VERSION_KEY = "app:dataVersion";

export function runMigrations() {
  const cur = Number(localStorage.getItem(VERSION_KEY) || "1");

  // Exemple : passer wallet:v1 -> wallet:v2 sans perdre de données
  if (cur < 2) {
    const w = localStorage.getItem("wallet:v1");
    if (w && !localStorage.getItem("wallet:v2")) {
      localStorage.setItem("wallet:v2", w);
    }
    localStorage.setItem(VERSION_KEY, "2");
  }

  // ajoute d’autres steps ici (cur < 3, etc.)
}
