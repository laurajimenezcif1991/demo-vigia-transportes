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
        @keyframes alex-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
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
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          fontFamily: 'var(--font-display)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 24px 56px',
        }}
      >
        {/* ── Logo Vigía ───────────────────────────────────────────────── */}
        <img
          src={`${import.meta.env.BASE_URL}logo-vigia.png`}
          alt="Vigía Transportes"
          style={{ height: '56px', width: 'auto', objectFit: 'contain', marginBottom: '52px' }}
        />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '28px',
            marginBottom: '52px',
          }}
        >
          {/* Avatar + video background */}
          <div style={{ position: 'relative', width: '200px', height: '200px', flexShrink: 0 }}>
            {/* Video glow animation behind avatar */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '310px',
                height: '310px',
                objectFit: 'cover',
                borderRadius: '50%',
                opacity: 0.55,
                zIndex: 0,
                pointerEvents: 'none',
                animation: 'alex-glow 3s ease-in-out infinite',
              }}
            >
              <source
                src={`${import.meta.env.BASE_URL}video-alex-avatar.mp4`}
                type="video/mp4"
              />
            </video>

            {/* Spinning gradient ring */}
            <div
              style={{
                position: 'absolute',
                inset: '-3px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #9A7CF7, #FDD83F, #F05899, #3DAC56, #00ADFE)',
                animation: 'alex-spin-slow 5s linear infinite',
                zIndex: 1,
              }}
            />

            {/* White buffer ring */}
            <div
              style={{
                position: 'absolute',
                inset: '0',
                borderRadius: '50%',
                background: '#ffffff',
                zIndex: 2,
              }}
            />

            {/* Avatar image */}
            <img
              src={`${import.meta.env.BASE_URL}alex-avatar.avif`}
              alt="Alex"
              style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                width: 'calc(100% - 10px)',
                height: 'calc(100% - 10px)',
                borderRadius: '50%',
                objectFit: 'cover',
                zIndex: 3,
                animation: 'alex-pulse-ring 2.6s ease-in-out infinite',
              }}
            />
          </div>

          {/* Text */}
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(20px, 4vw, 26px)',
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
                fontSize: '14px',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                margin: 0,
              }}
            >
              Vacante Conductor C2 · Vigía Transportes
            </p>
          </div>
        </div>

        {/* ── Phase cards ──────────────────────────────────────────────── */}
        <div
          style={{
            width: '100%',
            maxWidth: '900px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '56px',
          }}
        >
          {PHASES.map((phase, pi) => {
            const isCompleted = pi < currentPhaseIndex;
            const isActive = pi === currentPhaseIndex;
            const isPending = pi > currentPhaseIndex;

            return (
              <div
                key={phase.id}
                style={{
                  background: isActive
                    ? 'rgba(255,255,255,0.92)'
                    : isCompleted
                    ? 'rgba(255,255,255,0.75)'
                    : 'rgba(255,255,255,0.4)',
                  borderRadius: 'var(--radius-lg)',
                  border: isActive
                    ? '1.5px solid var(--color-border-focus)'
                    : isCompleted
                    ? '1px solid rgba(39,190,105,0.35)'
                    : '1px solid var(--color-border-default)',
                  padding: '24px',
                  boxShadow: isActive
                    ? '0 6px 28px rgba(135, 80, 246, 0.14)'
                    : isCompleted
                    ? '0 2px 10px rgba(39,190,105,0.06)'
                    : '0 2px 8px rgba(24,20,46,0.04)',
                  opacity: isPending ? 0.52 : 1,
                  transition: 'opacity 0.4s ease, box-shadow 0.4s ease',
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
                        fontSize: '15px',
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
                              fontSize: '13px',
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
                            fontSize: '12px',
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
      </div>
    </>
  );
}
