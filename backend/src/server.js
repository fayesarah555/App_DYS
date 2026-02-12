import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Load environment variables from .env when present
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const bucket = process.env.S3_BUCKET || "projetbigdata0";
const region = process.env.AWS_REGION || "eu-west-1";
const frontendOrigin = process.env.FRONTEND_ORIGIN;

// CORS: lock to a specific origin if provided
app.use(cors(frontendOrigin ? { origin: frontendOrigin } : undefined));

// Keep files in memory; S3 upload streams the buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 } // 200 MB guardrail
});

const s3 = new S3Client({ region });

const PATHS = {
  audio: "raw/audio/",
  pdf: "raw/pdf/",
  image: "raw/photo/",
  video: "raw/video/"
};

function classifyMime(mimeType) {
  if (!mimeType) return null;
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return null;
}

function safeName(originalName) {
  const sanitized = originalName.replace(/[^A-Za-z0-9_.-]/g, "_");
  return `${Date.now()}-${sanitized}`;
}

app.get("/health", (_, res) => {
  res.json({ status: "ok", bucket, region });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu (champ 'file')." });
    }

    const category = classifyMime(req.file.mimetype);
    if (!category) {
      return res.status(400).json({ error: `Type de fichier non géré: ${req.file.mimetype}` });
    }

    const key = `${PATHS[category]}${safeName(req.file.originalname)}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      })
    );

    res.status(201).json({
      message: "Fichier stocké dans S3",
      category,
      s3Key: key,
      s3Uri: `s3://${bucket}/${key}`
    });
  } catch (err) {
    console.error("Erreur upload S3", err);
    res.status(500).json({ error: "Echec de l'upload S3", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`API upload en écoute sur http://localhost:${port}`);
});
