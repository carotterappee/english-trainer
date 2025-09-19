import DoneToday from "@/components/DoneToday";

export default function Mission() {
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Mission du jour</h1>
      <p className="text-gray-600">Fais tes exercices, puis enregistre la session :</p>
      <DoneToday />
    </main>
  );
}
