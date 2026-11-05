"use client";

import { useEffect, useRef, useState } from "react";

const usd = (n) => "$" + n.toLocaleString("en-US");

// Página de apoyo para TrepCamp Madrid. El botón crea una sesión de Stripe
// Checkout por el monto elegido (app/api/apoyo/checkout) y redirige ahí; el
// total llega del servidor, que lo suma de los aportes pagados.
export default function Campaign({ campaign, raised, backers, days, thanks }) {
  const { goal, amounts, defaultAmount, facts, breakdown, videoUrl, minAmount, maxAmount } = campaign;
  const [pick, setPick] = useState(defaultAmount);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const pct = Math.min(100, (raised / goal) * 100);
  // Con poquito recaudado, "0%" y una barra vacía se ven como si nada hubiera
  // pasado: se muestra "<1%" y un trazo mínimo.
  const pctLabel = raised > 0 && pct < 1 ? "<1%" : `${Math.round(pct)}%`;
  const barWidth = raised > 0 ? Math.max(pct, 1.5) : 0;
  const breakdownTotal = breakdown.reduce((s, b) => s + b.amount, 0);
  const closed = days === 0;

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Al volver de Stripe con ?gracias=1: agradecer y limpiar la URL para que
  // un refresh no lo repita.
  const [thanksOpen, setThanksOpen] = useState(Boolean(thanks));
  useEffect(() => {
    if (!thanks) return;
    window.history.replaceState(null, "", "/apoyo");
  }, [thanks]);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  function choose(v) {
    setCustom("");
    setPick(v);
  }

  function onCustom(e) {
    setCustom(e.target.value);
    const v = Math.floor(Number(e.target.value));
    if (v > 0) setPick(v);
  }

  async function support() {
    if (pick < minAmount || pick > maxAmount) {
      showToast(`Elige un monto entre ${usd(minAmount)} y ${usd(maxAmount)} USD.`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/apoyo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: pick }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "No se pudo abrir el pago.");
      window.location.href = data.url;
    } catch (err) {
      showToast(err.message || "No se pudo abrir el pago. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1080px] pt-5">
      <nav className="flex items-center justify-between py-2 text-sm">
        <span className="text-[17px] font-bold tracking-tight">Fora</span>
        <span className="font-medium text-[#6e6e73]">Madrid · 2027</span>
      </nav>

      <header className="mt-7 grid gap-2.5">
        <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#007aff]">
          TrepCamp Experience · Madrid
        </p>
        <h1 className="text-balance text-[clamp(30px,4vw,44px)] font-bold leading-[1.08] tracking-[-0.025em]">
          Me gané media beca para Madrid. ¿Me ayudas con la otra mitad?
        </h1>
        <p className="max-w-[62ch] text-[15.5px] leading-relaxed text-[#6e6e73]">
          La Iberoamerican Technology Foundation me seleccionó para la beca parcial de TrepCamp.
          Cubre el 50% de la matrícula. Con lo que junte aquí cierro la diferencia.
        </p>
      </header>

      <div className="mt-7 grid items-start gap-[22px] md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <Video url={videoUrl} onPlaceholder={() => showToast("Aquí va el video.")} />

        <aside
          aria-label="Meta de recaudación"
          className="grid gap-[18px] rounded-[14px] bg-white p-[22px] shadow-[0_1px_2px_rgba(0,0,0,.04),0_8px_30px_-12px_rgba(0,0,0,.18),inset_0_0_0_1px_rgba(0,0,0,.06)]"
        >
          <Countdown days={days} />

          <div className="grid gap-1.5">
            <div className="text-[clamp(32px,3.4vw,42px)] font-bold leading-none tracking-[-0.02em] tabular-nums">
              {usd(raised)}
            </div>
            <div className="text-sm text-[#6e6e73]">
              recaudados de <b className="font-semibold text-[#1d1d1f]">{usd(goal)} USD</b>
            </div>
          </div>

          <div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={goal}
              aria-valuenow={raised}
              className="relative h-[26px] overflow-hidden rounded-md bg-black/[0.08] shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]"
            >
              <div
                className="absolute inset-y-0 left-0 transition-[width] duration-[1400ms] ease-[cubic-bezier(.2,.8,.2,1)] after:absolute after:inset-y-0 after:right-0 after:w-1.5 after:bg-white/85 motion-reduce:transition-none"
                style={{
                  width: `${barWidth}%`,
                  background:
                    "repeating-linear-gradient(90deg,#007aff 0 10px,#3395ff 10px 12px)",
                }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-[#6e6e73]">
              <span>$0</span>
              <span>{usd(goal / 2)}</span>
              <span>{usd(goal)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Stat value={pctLabel} label="de la meta" />
            <Stat value={backers} label={backers === 1 ? "persona ha apoyado" : "personas han apoyado"} />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {amounts.map((v) => {
              const on = !custom && pick === v;
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(v)}
                  className={`rounded-[10px] border py-2.5 text-sm font-semibold tabular-nums focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#007aff] ${
                    on
                      ? "border-[#007aff] bg-[#007aff]/[0.14] text-[#007aff]"
                      : "border-black/[0.12] bg-[#f5f7fa]"
                  }`}
                >
                  {usd(v)}
                </button>
              );
            })}
          </div>

          <label
            htmlFor="custom-amount"
            className="flex items-center gap-2 rounded-[10px] border border-black/[0.12] bg-[#f5f7fa] px-3 focus-within:border-[#007aff]"
          >
            <span className="font-semibold text-[#6e6e73]">USD</span>
            <input
              id="custom-amount"
              type="number"
              min={minAmount}
              max={maxAmount}
              inputMode="numeric"
              placeholder="Otra cantidad"
              value={custom}
              onChange={onCustom}
              className="min-w-0 flex-1 border-0 bg-transparent py-[11px] text-[15px] tabular-nums outline-none"
            />
          </label>

          <button
            type="button"
            onClick={support}
            disabled={loading || closed}
            className="rounded-[10px] bg-[#007aff] p-4 disabled:cursor-not-allowed disabled:opacity-60 text-base font-semibold text-white shadow-[0_4px_0_#00438c] transition-[transform,box-shadow] duration-75 active:translate-y-[3px] active:shadow-[0_1px_0_#00438c] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
          >
            {closed ? "La campaña cerró" : loading ? "Abriendo pago…" : `Apoyar con ${usd(pick)}`}
          </button>

          <p className="text-xs leading-snug text-[#6e6e73]">
            El pago se procesará con Stripe (tarjeta, Apple Pay, Google Pay).
          </p>
        </aside>
      </div>

      <section className="mt-7 grid gap-7 border-t border-black/[0.08] pt-[26px] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <h2 className="mb-2.5 text-[19px] font-bold tracking-tight">Qué es TrepCamp</h2>
          <p className="mb-3 max-w-[62ch] text-[15px] leading-relaxed">
            Es un programa intensivo de emprendimiento de la Iberoamerican Technology Foundation:
            una semana de talleres, visitas a empresas y retos con mentores, en Madrid y Nueva
            York. Hay tracks de Emprendimiento, Moda, Media y Sports Business.
          </p>
          <p className="mb-3 max-w-[62ch] text-[15px] leading-relaxed">
            Voy por Sports Business porque es justo lo que hago con Sport Metrics: análisis de
            partidos para coaches y clubes. Quiero regresar con contactos del deporte en Europa y
            con el producto más afilado.
          </p>
          <ul className="mt-3.5 border-t border-black/[0.08]">
            {facts.map(([k, v]) => (
              <li
                key={k}
                className="flex justify-between gap-4 border-b border-black/[0.08] py-2.5 text-sm"
              >
                <span className="text-[#6e6e73]">{k}</span>
                <span className="text-right font-semibold">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-2.5 text-[19px] font-bold tracking-tight">A dónde va cada dólar</h2>
          <div className="grid gap-3">
            {breakdown.map((b, i) => (
              <div key={b.label} className="grid gap-1.5">
                <div className="flex justify-between text-sm">
                  <span>{b.label}</span>
                  <b className="tabular-nums">{usd(b.amount)}</b>
                </div>
                <div className="h-2 overflow-hidden rounded-[3px] bg-black/[0.08]">
                  <i
                    className="block h-full bg-[#007aff]"
                    style={{
                      width: `${(b.amount / breakdownTotal) * 100}%`,
                      opacity: [1, 0.55, 0.28][i] ?? 0.28,
                    }}
                  />
                </div>
              </div>
            ))}
            <small className="text-xs text-[#6e6e73]">
              Montos estimados. Si sobra algo, va al vuelo.
            </small>
          </div>
        </div>
      </section>

      <div
        role="status"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-[60] max-w-[calc(100%-32px)] -translate-x-1/2 rounded-xl bg-[#1d1d1f] px-4 py-3 text-sm font-medium text-[#f5f7fa] transition-all duration-200 motion-reduce:transition-none ${
          toast ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        {toast}
      </div>
      {thanksOpen && (
        <ThanksModal
          amount={thanks?.amount}
          onClose={() => setThanksOpen(false)}
          onCopied={() => showToast("Link copiado. Gracias por pasarlo.")}
        />
      )}
    </main>
  );
}

// Modal que sale al volver de Stripe con el pago hecho. Se cierra con el
// botón, con Escape o tocando fuera; el foco arranca en el botón principal.
function ThanksModal({ amount, onClose, onCopied }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function share() {
    const url = window.location.origin + "/apoyo";
    try {
      await navigator.clipboard.writeText(url);
      onCopied();
    } catch {
      window.prompt("Copia el link:", url);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm motion-safe:animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="thanks-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,.45)] motion-safe:animate-slide-in"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#007aff]/10">
          <svg viewBox="0 0 24 24" className="h-8 w-8 fill-[#007aff]" aria-hidden="true">
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 3 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.6.1.2.5.2.6 0 .8-1.5 2.3-2.6 4.4-2.6 3.8 0 5.9 4 4.4 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
        </div>
        <h2 id="thanks-title" className="mt-5 text-balance text-[28px] font-bold leading-tight tracking-tight">
          Gracias, de corazón
        </h2>
        <p className="mt-3 text-[15.5px] leading-relaxed text-[#6e6e73]">
          {amount ? (
            <>
              Tus <b className="font-semibold text-[#1d1d1f]">{usd(amount)} USD</b> ya están en la
              barra, pero lo que más me llevo es saber que crees en mí.{" "}
            </>
          ) : (
            "Tu apoyo ya está en la barra, pero lo que más me llevo es saber que crees en mí. "
          )}
          Te lo agradezco con todo el corazón; este apoyo lo voy a llevar conmigo siempre.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#6e6e73]">
          Si puedes, compártelo con alguien. Un mensaje tuyo puede pesar más que cualquier cosa que
          yo diga.
        </p>
        <div className="mt-6 grid gap-2.5">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-[10px] bg-[#007aff] p-3.5 text-base font-semibold text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
          >
            Ver cómo vamos
          </button>
          <button
            type="button"
            onClick={share}
            className="rounded-[10px] border border-black/[0.12] bg-[#f5f7fa] p-3.5 text-base font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
          >
            Compartir con alguien
          </button>
        </div>
        <p className="mt-5 text-sm text-[#6e6e73]">
          Con todo mi cariño,
          <br />
          <span className="font-semibold text-[#1d1d1f]">Fora</span>
        </p>
      </div>
    </div>
  );
}

// El tiempo que queda va arriba de la tarjeta y en grande: es lo que empuja a
// apoyar hoy y no "luego".
function Countdown({ days }) {
  if (days === 0) {
    return (
      <div className="rounded-xl bg-black/[0.05] px-4 py-3.5 text-center">
        <div className="text-[22px] font-bold tracking-tight">La campaña cerró</div>
        <div className="text-sm text-[#6e6e73]">Cerró el 15 de diciembre. Gracias a todos.</div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 rounded-xl bg-[#007aff]/[0.09] px-4 py-3.5">
      <div className="text-[44px] font-bold leading-none tracking-[-0.03em] text-[#007aff] tabular-nums">
        {days}
      </div>
      <div className="min-w-0">
        <div className="text-[17px] font-bold leading-tight tracking-tight">
          {days === 1 ? "Queda 1 día" : `Quedan ${days} días`}
        </div>
        <div className="text-sm text-[#6e6e73]">para apoyar · cierra el 15 de diciembre</div>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="grid gap-0.5">
      <b className="text-[22px] font-bold tabular-nums tracking-tight">{value}</b>
      <span className="text-xs text-[#6e6e73]">{label}</span>
    </div>
  );
}

// Con video real se usa <video>; mientras no hay, un póster con botón de play.
function Video({ url, onPlaceholder }) {
  if (url) {
    return (
      <video
        src={url}
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full max-w-full rounded-[14px] bg-black"
      />
    );
  }
  return (
    <button
      type="button"
      aria-label="Reproducir video"
      onClick={onPlaceholder}
      className="group relative grid aspect-video w-full max-w-full place-items-center overflow-hidden rounded-[14px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#007aff]"
      style={{
        background:
          "radial-gradient(90% 80% at 25% 20%,#1d5fd1 0,transparent 60%),radial-gradient(70% 70% at 85% 90%,#0a84ff 0,transparent 55%),#141a2e",
      }}
    >
      <span className="relative grid h-[76px] w-[76px] place-items-center rounded-full bg-white/[0.92] shadow-[0_10px_30px_rgba(0,0,0,.35)] transition-transform duration-200 group-hover:scale-105">
        <span className="ml-1.5 border-y-[14px] border-l-[22px] border-y-transparent border-l-[#1d1d1f]" />
      </span>
      <span className="absolute bottom-3.5 left-3.5 rounded-md bg-black/45 px-2.5 py-1.5 text-xs font-semibold text-white">
        Video próximamente
      </span>
    </button>
  );
}
