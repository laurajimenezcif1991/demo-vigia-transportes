import { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Phase {
  id: number;
  name: string;
  heroText: string;
  steps: string[];
}

const PHASES: Phase[] = [
  {
    id: 1,
    name: 'Validación inicial',
    heroText: 'analizando candidatos',
    steps: [
      'Analizando hoja de vida de candidatos',
      'Realizando consultas en RUNT',
      'Consultando manifiestos en el RNDC',
    ],
  },
  {
    id: 2,
    name: 'Contacto',
    heroText: 'contactando candidatos',
    steps: [
      'Contactando por WhatsApp',
      'Llamando a candidatos para contarles sobre la vacante y confirmar datos',
    ],
  },
  {
    id: 3,
    name: 'Agendamiento',
    heroText: 'agendando pruebas de manejo',
    steps: ['Agendando prueba de manejo'],
  },
];

const FLAT_STEPS = PHASES.flatMap((phase, pi) =>
  phase.steps.map((_, si) => ({ phaseIndex: pi, stepIndex: si }))
);

const STEP_DURATION = 2800;

export default function AlexAgent() {
  const [globalStep, setGlobalStep] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalStep((prev) => (prev + 1) % FLAT_STEPS.length);
      setTextKey((prev) => prev + 1);
    }, STEP_DURATION);
    return () => clearTimeout(timer);
  }, [globalStep]);

  const { phaseIndex: currentPhaseIndex, stepIndex: currentStepInPhase } =
    FLAT_STEPS[globalStep];
  const currentPhase = PHASES[currentPhaseIndex];

  return (
    <>
      <style>{`
        @keyframes alex-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes alex-spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes alex-pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(135, 80, 246, 0.25); }
          50% { box-shadow: 0 0 0 14px rgba(135, 80, 246, 0); }
        }
        @keyframes alex-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes alex-text-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes alex-dot {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.7); }
          40% { opacity: 1; transform: scale(1); }
        }
        @keyframes alex-step-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.85); }
        }

        .alex-hero-text {
          animation: alex-text-in 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        .alex-step-row {
          animation: alex-fadein 0.35s ease both;
        }
        .alex-dot-1 { animation: alex-dot 1.3s ease-in-out infinite 0s; }
        .alex-dot-2 { animation: alex-dot 1.3s ease-in-out infinite 0.22s; }
        .alex-dot-3 { animation: alex-dot 1.3s ease-in-out infinite 0.44s; }

        /* ── Responsive layout ── */
        .alex-page {
          min-height: 100vh;
          font-family: var(--font-display);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 36px 20px 52px;
        }
        .alex-logo {
          height: 52px;
          width: auto;
          object-fit: contain;
          margin-bottom: 40px;
        }
        .alex-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
          width: 100%;
        }
        /* Avatar wrapper — responsive square capped at 300px */
        .alex-av-wrap {
          position: relative;
          width: min(300px, 82vw);
          height: min(300px, 82vw);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* White disc: 56% of wrapper */
        .alex-white-disc {
          position: absolute;
          width: 56%;
          height: 56%;
          border-radius: 50%;
          background: #ffffff;
          z-index: 1;
        }
        /* Avatar: 50.7% of wrapper */
        .alex-avatar-img {
          position: absolute;
          width: 50.7%;
          height: 50.7%;
          border-radius: 50%;
          object-fit: cover;
          z-index: 2;
          animation: alex-pulse-ring 2.6s ease-in-out infinite;
        }
        .alex-phase-grid {
          width: 100%;
          max-width: 900px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
          margin-bottom: 48px;
        }
        .alex-card {
          border-radius: var(--radius-lg);
          padding: 20px;
          transition: opacity 0.4s ease, box-shadow 0.4s ease;
        }
        @media (max-width: 480px) {
          .alex-page   { padding: 24px 16px 40px; }
          .alex-logo   { height: 42px; margin-bottom: 28px; }
          .alex-hero   { gap: 18px; margin-bottom: 28px; }
          .alex-phase-grid { gap: 10px; margin-bottom: 36px; }
          .alex-card   { padding: 16px; }
        }
      `}</style>

      <div className="alex-page">
        {/* ── Logo Vigía ───────────────────────────────────────────────── */}
        <img
          src={`${import.meta.env.BASE_URL}logo-vigia.png`}
          alt="Vigía Transportes"
          className="alex-logo"
        />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="alex-hero">
          {/* Avatar + video background */}
          <div className="alex-av-wrap">
            {/* Video — masked to circle */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            >
              <source
                src={`${import.meta.env.BASE_URL}video-alex-avatar.mp4`}
                type="video/mp4"
              />
            </video>

            {/* White disc — outline ring between video and avatar */}
            <div className="alex-white-disc" />

            {/* Avatar image */}
            <img
              src={`${import.meta.env.BASE_URL}alex-avatar.avif`}
              alt="Alex"
              className="alex-avatar-img"
            />
          </div>

          {/* Text */}
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(24px, 4vw, 30px)',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.4px',
                lineHeight: '1.3',
                margin: '0 0 10px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>Alex está</span>
              <span
                key={textKey}
                className="alex-hero-text"
                style={{ color: 'var(--color-brand-accent)' }}
              >
                {currentPhase.heroText}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  gap: '4px',
                  alignItems: 'center',
                  marginBottom: '2px',
                }}
              >
                <span
                  className="alex-dot-1"
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: 'var(--color-brand-accent)',
                    display: 'inline-block',
                  }}
                />
                <span
                  className="alex-dot-2"
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: 'var(--color-brand-accent)',
                    display: 'inline-block',
                  }}
                />
                <span
                  className="alex-dot-3"
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: 'var(--color-brand-accent)',
                    display: 'inline-block',
                  }}
                />
              </span>
            </h1>

            <p
              style={{
                fontSize: '16px',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                margin: 0,
              }}
            >
              Vacante Conductor C2 · Vigía Transportes
            </p>
          </div>
        </div> {/* .alex-hero */}

        {/* ── Phase cards ──────────────────────────────────────────────── */}
        <div className="alex-phase-grid">
          {PHASES.map((phase, pi) => {
            const isCompleted = pi < currentPhaseIndex;
            const isActive = pi === currentPhaseIndex;
            const isPending = pi > currentPhaseIndex;

            return (
              <div
                key={phase.id}
                className="alex-card"
                style={{
                  background: isActive
                    ? 'rgba(255,255,255,0.92)'
                    : isCompleted
                    ? 'rgba(255,255,255,0.75)'
                    : 'rgba(255,255,255,0.4)',
                  border: isActive
                    ? '1.5px solid var(--color-border-focus)'
                    : isCompleted
                    ? '1px solid rgba(39,190,105,0.35)'
                    : '1px solid var(--color-border-default)',
                  boxShadow: isActive
                    ? '0 6px 28px rgba(135, 80, 246, 0.14)'
                    : isCompleted
                    ? '0 2px 10px rgba(39,190,105,0.06)'
                    : '0 2px 8px rgba(24,20,46,0.04)',
                  opacity: isPending ? 0.52 : 1,
                }}
              >
                {/* Phase label + status icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: isActive || isCompleted ? '16px' : '0',
                  }}
                >
                  {/* Status icon */}
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    {isCompleted ? (
                      <CheckCircle2 size={20} color="var(--color-success)" />
                    ) : isActive ? (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '3px solid var(--color-secondary-100)',
                          borderTopColor: 'var(--color-brand-accent)',
                          animation: 'alex-spin 0.85s linear infinite',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '2px solid var(--color-border-default)',
                        }}
                      />
                    )}
                  </div>

                  {/* Phase name */}
                  <div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: isCompleted
                          ? 'var(--color-success)'
                          : isActive
                          ? 'var(--color-brand-accent)'
                          : 'var(--color-text-muted)',
                        marginBottom: '2px',
                      }}
                    >
                      Fase {phase.id}
                    </div>
                    <div
                      style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: isPending
                      ? 'var(--color-text-muted)'
                      : 'var(--color-text-primary)',
                    lineHeight: 1.3,
                      }}
                    >
                      {phase.name}
                    </div>
                  </div>
                </div>

                {/* Active phase: reveal steps one by one */}
                {isActive && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {phase.steps.slice(0, currentStepInPhase + 1).map((step, si) => {
                      const isDone = si < currentStepInPhase;
                      const isStepActive = si === currentStepInPhase;
                      return (
                        <div
                          key={step}
                          className="alex-step-row"
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                        >
                          {isDone ? (
                            <CheckCircle2
                              size={16}
                              color="var(--color-brand-accent)"
                              style={{ flexShrink: 0, marginTop: '2px' }}
                            />
                          ) : (
                            <span
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: isStepActive
                                  ? 'var(--color-brand-accent)'
                                  : 'var(--color-neutral-200)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '2px',
                                animation: isStepActive
                                  ? 'alex-step-pulse 1.4s ease-in-out infinite'
                                  : 'none',
                              }}
                            >
                              <span
                                style={{
                                  width: '5px',
                                  height: '5px',
                                  borderRadius: '50%',
                                  background: '#fff',
                                  display: 'block',
                                }}
                              />
                            </span>
                          )}
                          <span
                            style={{
                            fontSize: '15px',
                            fontWeight: isDone ? 500 : isStepActive ? 600 : 400,
                              color: isDone
                                ? 'var(--color-text-secondary)'
                                : isStepActive
                                ? 'var(--color-text-primary)'
                                : 'var(--color-text-muted)',
                              lineHeight: 1.45,
                            }}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Completed phase: all steps with checkmarks */}
                {isCompleted && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {phase.steps.map((step) => (
                      <div
                        key={step}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}
                      >
                        <CheckCircle2
                          size={14}
                          color="var(--color-success)"
                          style={{ flexShrink: 0, marginTop: '2px' }}
                        />
                        <span
                          style={{
                          fontSize: '14px',
                          color: 'var(--color-text-muted)',
                          fontWeight: 400,
                          lineHeight: 1.45,
                          }}
                        >
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: 'auto',
          }}
        >
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 400 }}>
            Powered by
          </span>
          <img
            src={`${import.meta.env.BASE_URL}logo-unio.png`}
            alt="Unio"
            style={{ height: '16px', width: 'auto' }}
          />
        </div>
      </div> {/* .alex-page */}
    </>
  );
}
