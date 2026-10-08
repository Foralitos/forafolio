"use client";

import { useState } from "react";
import { getUploadSignature } from "../actions";

// Sube archivos directo del navegador a Cloudinary (Vercel no deja pasar más
// de 4.5 MB por una Server Action, y un video pesa mucho más). La action solo
// firma; aquí se sube y las URLs resultantes viajan en un <input hidden> que
// saveProject lee del FormData.
//
// - multiple: galería (guarda un JSON con la lista de URLs).
// - si no: un solo archivo (el video), guardado como texto.
async function subir(file, kind) {
  const firma = await getUploadSignature();
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", firma.apiKey);
  body.append("timestamp", String(firma.timestamp));
  body.append("signature", firma.signature);
  body.append("folder", firma.folder);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${firma.cloudName}/${kind}/upload`,
    { method: "POST", body }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "Cloudinary rechazó el archivo");
  return json.secure_url;
}

export default function MediaUploader({ name, label, kind = "image", multiple = false, initial }) {
  const [urls, setUrls] = useState(() =>
    multiple ? initial ?? [] : initial ? [initial] : []
  );
  const [subiendo, setSubiendo] = useState(0);
  const [error, setError] = useState("");

  const onChange = async (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setError("");
    setSubiendo(files.length);
    try {
      for (const file of files) {
        const url = await subir(file, kind);
        setUrls((prev) => (multiple ? [...prev, url] : [url]));
        setSubiendo((n) => n - 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(0);
    }
  };

  const quitar = (url) => setUrls((prev) => prev.filter((u) => u !== url));
  const valor = multiple ? JSON.stringify(urls) : urls[0] ?? "";

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input type="hidden" name={name} value={valor} />

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {urls.map((url) => (
            <div key={url} className="relative">
              {kind === "video" ? (
                <video src={url} className="w-48 h-28 object-cover border-2 border-gray-700" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="w-32 h-24 object-cover border-2 border-gray-700" />
              )}
              <button
                type="button"
                onClick={() => quitar(url)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs leading-none"
                aria-label="Quitar"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept={kind === "video" ? "video/*" : "image/*"}
        multiple={multiple}
        onChange={onChange}
        disabled={subiendo > 0}
        className="block text-sm text-gray-300 file:mr-3 file:border-2 file:border-gray-700 file:bg-gray-800 file:text-white file:px-3 file:py-1 file:text-xs"
      />
      <p className="text-gray-600 text-xs mt-1">
        {subiendo > 0
          ? `Subiendo… (${subiendo} restante${subiendo === 1 ? "" : "s"})`
          : "Se sube directo a Cloudinary; recuerda Guardar al final."}
      </p>
      {error ? <p className="text-red-400 text-xs mt-1">⚠ {error}</p> : null}
    </div>
  );
}
