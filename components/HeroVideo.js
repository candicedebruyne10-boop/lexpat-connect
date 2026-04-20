"use client";

import { useState, useRef } from "react";
import Image from "next/image";

/**
 * HeroVideo — Click-to-play video component.
 * La vidéo n'est PAS chargée au démarrage de la page → LCP non bloqué.
 * Quand l'utilisateur clique sur le bouton play → la vidéo se lance.
 */
export default function HeroVideo({ src, poster, locale = "fr" }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  function handlePlay() {
    setPlaying(true);
    // On attend que React ait rendu la vidéo, puis on la lance
    setTimeout(() => {
      videoRef.current?.play();
    }, 50);
  }

  const label = locale === "en" ? "Watch the presentation" : "Voir la présentation";

  return (
    <div className="relative overflow-hidden rounded-[18px] bg-[#07112f]">
      {!playing ? (
        /* ── État initial : poster léger + bouton play ── */
        <div className="relative cursor-pointer group" onClick={handlePlay}>
          {/* Poster image — WebP léger, chargé sans priority car pas LCP */}
          <Image
            src={poster}
            alt={label}
            width={400}
            height={225}
            className="mx-auto block h-auto w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[400px]"
            style={{ display: "block" }}
          />

          {/* Overlay sombre au hover */}
          <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/35" />

          {/* Bouton play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              aria-label={label}
              className="flex flex-col items-center gap-2 transition-transform group-hover:scale-110"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {/* Cercle play */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.95)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                }}
              >
                {/* Triangle play */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ width: 26, height: 26, marginLeft: 3 }}
                >
                  <path
                    d="M6 4.5l14 7.5-14 7.5V4.5z"
                    fill="#1E3A78"
                    stroke="#1E3A78"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* Label sous le bouton */}
              <span
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* ── Après clic : la vraie vidéo se charge et joue ── */
        <video
          ref={videoRef}
          className="mx-auto block h-auto w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[400px]"
          controls
          autoPlay
          playsInline
          poster={poster}
        >
          <source src={src} type="video/mp4" />
          {locale === "en"
            ? "Your browser does not support video playback."
            : "Votre navigateur ne prend pas en charge la lecture vidéo."}
        </video>
      )}
    </div>
  );
}
