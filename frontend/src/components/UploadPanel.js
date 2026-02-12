import { useState } from "react";

export default function UploadPanel({ onUploaded }) {
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleFiles = async (files) => {
    if (!files || !files[0]) return;
    const file = files[0];
    setError(null);
    setBusy(true);
    try {
      await onUploaded(file);
    } catch (e) {
      setError("Échec de l’envoi. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`dropzone ${dragOver ? "over" : ""}`}
      onDragEnter={(e) => {
        prevent(e);
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        prevent(e);
        setDragOver(false);
      }}
      onDragOver={prevent}
      onDrop={(e) => {
        prevent(e);
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <div className="zone-inner">
        <p className="eyebrow">Audio · Image · PDF · Vidéo</p>
        <h2>Dépose ici ou choisis un fichier</h2>
        <p className="hint">Routage auto vers le bon préfixe S3</p>
        <label className="btn">
          <input
            type="file"
            accept="audio/*,video/*,image/*,application/pdf"
            onChange={(e) => handleFiles(e.target.files)}
            hidden
          />
          Choisir un fichier
        </label>
        {busy && <p className="status">Envoi en cours…</p>}
        {error && <p className="status error">{error}</p>}
      </div>
    </div>
  );
}
