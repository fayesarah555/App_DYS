import { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import SummaryList from "./components/SummaryList";
import "./styles.css";

function App() {
  const [summaries, setSummaries] = useState([]);

  const handleUploaded = async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/summarize", { method: "POST", body: form });
    const data = await res.json(); // attendu: { id, title?, summary }
    setSummaries((prev) => [
      { id: data.id, title: data.title || file.name, text: data.summary },
      ...prev,
    ]);
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">App DYS</p>
          <h1>Upload & Résumé</h1>
          <p className="lede">
            Audio ou vidéo → résumé clair, pensé pour les troubles DYS.
          </p>
        </div>
      </header>

      <section className="panel">
        <UploadPanel onUploaded={handleUploaded} />
      </section>

      <section className="panel">
        <SummaryList items={summaries} />
      </section>
    </main>
  );
}

export default App;
