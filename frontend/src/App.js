import { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import SummaryList from "./components/SummaryList";
import "./styles.css";

function App() {
  const [uploads, setUploads] = useState([]);
  const API_BASE ="http://localhost:4000" || "";

  const handleUploaded = async (file) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: form });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Upload échoué");
    }
    const data = await res.json(); // { category, s3Uri, s3Key }

    setUploads((prev) => [
      {
        id: crypto.randomUUID(),
        title: file.name,
        text: `${data.category.toUpperCase()} → ${data.s3Uri}`,
      },
      ...prev,
    ]);
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">App DYS</p>
          <h1>Upload vers S3</h1>
          <p className="lede">
            Audio, image, PDF ou vidéo déposés ici sont routés vers le bon
            préfixe S3.
          </p>
        </div>
      </header>

      <section className="panel">
        <UploadPanel onUploaded={handleUploaded} />
      </section>

      <section className="panel">
        <SummaryList items={uploads} />
      </section>
    </main>
  );
}

export default App;
