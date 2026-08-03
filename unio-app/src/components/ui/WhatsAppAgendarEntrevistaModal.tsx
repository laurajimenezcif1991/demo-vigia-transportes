import { useState, useRef, useEffect } from 'react';
import { X, CheckCircle2, Users, Calendar, ChevronDown, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import type { Candidate } from '../../data/mock';
import Avatar from './Avatar';
import { WaIcon } from './WhatsAppPreEntrevistaModal';

// ─── Constants ─────────────────────────────────────────────────────────────────

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DAYS_ES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

const PLACES = [
  {
    id: 'siberia',
    name: 'Siberia',
    address: 'Km 3.4 Vía Siberia, Centro Empresarial Metropolitano Local A2',
    phone: '311 570 4719',
  },
  {
    id: 'madrid',
    name: 'Madrid',
    address: 'Km 13.5 Vía Facatativá – Bogotá, Tractocarga Madrid Local 3',
    phone: '320 264 3158',
  },
  {
    id: 'funza',
    name: 'Funza',
    address: 'Cra 7 #15-40 Zona Industrial, Centro Logístico Funza',
    phone: '312 456 7890',
  },
  {
    id: 'cota',
    name: 'Cota',
    address: 'Km 2.8 Autopista Medellín, Patio de Maniobras Cota Bodega 5',
    phone: '318 765 4321',
  },
  {
    id: 'mosquera',
    name: 'Mosquera',
    address: 'Cll 4 #8-22 Zona Industrial, Terminal de Carga Mosquera',
    phone: '316 289 1034',
  },
];

// ─── Date helpers ──────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function formatDisplayDate(d: Date) {
  const day = String(d.getDate()).padStart(2, '0');
  const mon = MONTHS_ES[d.getMonth()].slice(0, 3);
  return `${day} ${mon} ${d.getFullYear()}`;
}

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { date: Date; currentMonth: boolean }[] = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrev - i), currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), currentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: new Date(year, month + 1, d), currentMonth: false });
  }
  return cells;
}

// ─── DatePicker (single day, no past dates) ────────────────────────────────────

interface DatePickerProps {
  value: Date | null;
  onChange: (d: Date) => void;
}

function DatePicker({ value, onChange }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [open, setOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOut);
    return () => document.removeEventListener('mousedown', handleOut);
  }, []);

  const cells = buildCalendar(displayMonth.getFullYear(), displayMonth.getMonth());

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
          width: '100%', height: '40px', padding: '0 12px',
          border: open ? '1.5px solid #128C7E' : '1.5px solid #E0E0E0',
          borderRadius: '10px', background: open ? '#F0FFF4' : '#fff',
          fontFamily: 'var(--font-display)', fontSize: '13px',
          color: value ? '#111' : '#999', cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Calendar size={14} color={value ? '#128C7E' : '#aaa'} />
          {value ? formatDisplayDate(value) : 'Seleccionar fecha'}
        </span>
        <ChevronDown size={13} color="#aaa" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 500,
          background: '#fff', border: '1px solid #E8E8E8', borderRadius: '14px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.14)', padding: '16px',
          minWidth: '280px',
        }}>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <button
              onClick={() => setDisplayMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              style={{ background: 'transparent', border: '1px solid #E0E0E0', borderRadius: '6px', padding: '4px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ChevronLeft size={14} color="#666" />
            </button>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: '#111' }}>
              {MONTHS_ES[displayMonth.getMonth()]} {displayMonth.getFullYear()}
            </span>
            <button
              onClick={() => setDisplayMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              style={{ background: 'transparent', border: '1px solid #E0E0E0', borderRadius: '6px', padding: '4px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ChevronRight size={14} color="#666" />
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 34px)', marginBottom: '4px' }}>
            {DAYS_ES.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#999', paddingBottom: '4px' }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 34px)', rowGap: '2px' }}>
            {cells.map((cell, i) => {
              const { date, currentMonth } = cell;
              const isPast = date < today;
              const isSelected = value ? isSameDay(date, value) : false;
              const isToday = isSameDay(date, today);
              const disabled = isPast || !currentMonth;

              return (
                <div
                  key={i}
                  onClick={() => !disabled && (onChange(date), setOpen(false))}
                  style={{
                    width: '34px', height: '34px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                    background: isSelected ? '#128C7E' : 'transparent',
                    cursor: disabled ? 'default' : 'pointer',
                    fontSize: '13px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: isSelected || isToday ? 700 : 400,
                    color: isSelected ? '#fff' : disabled ? '#D0D0D0' : isToday ? '#128C7E' : '#111',
                    outline: isToday && !isSelected ? '1.5px solid #25D366' : 'none',
                    outlineOffset: '-1.5px',
                    transition: 'background 0.1s ease',
                    userSelect: 'none',
                  }}
                  onMouseOver={(e) => {
                    if (!disabled && !isSelected)
                      (e.currentTarget as HTMLDivElement).style.background = '#F0FFF4';
                  }}
                  onMouseOut={(e) => {
                    if (!disabled && !isSelected)
                      (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  }}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SimpleDropdown ────────────────────────────────────────────────────────────

interface SimpleDropdownProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  options: { id: string; label: string; sublabel?: string }[];
  onChange: (id: string) => void;
}

function SimpleDropdown({ icon, placeholder, value, options, onChange }: SimpleDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.id === value);

  useEffect(() => {
    function handleOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOut);
    return () => document.removeEventListener('mousedown', handleOut);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
          width: '100%', height: '40px', padding: '0 12px',
          border: open ? '1.5px solid #128C7E' : '1.5px solid #E0E0E0',
          borderRadius: '10px', background: open ? '#F0FFF4' : '#fff',
          fontFamily: 'var(--font-display)', fontSize: '13px',
          color: selected ? '#111' : '#999', cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '7px', overflow: 'hidden' }}>
          {icon}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <ChevronDown size={13} color="#aaa" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 500,
          background: '#fff', border: '1px solid #E8E8E8', borderRadius: '12px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.14)', overflow: 'hidden',
        }}>
          {options.map(opt => {
            const isActive = opt.id === value;
            return (
              <button
                key={opt.id}
                onClick={() => { onChange(opt.id); setOpen(false); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  width: '100%', padding: opt.sublabel ? '10px 14px' : '10px 14px',
                  background: isActive ? '#F0FFF4' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderBottom: '1px solid #F5F5F5',
                  transition: 'background 0.1s ease',
                }}
                onMouseOver={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#FAFAFA'; }}
                onMouseOut={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? '#128C7E' : '#111' }}>
                  {opt.label}
                </span>
                {opt.sublabel && (
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: '#888', marginTop: '1px', lineHeight: 1.3 }}>
                    {opt.sublabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  jobTitle?: string;
  onConfirmSend?: (candidates: Candidate[]) => void;
}

// ─── Main Modal ────────────────────────────────────────────────────────────────

export default function WhatsAppAgendarEntrevistaModal({
  isOpen, onClose, candidates, onConfirmSend,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
      setSelectedHour('');
      setSelectedPlace('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFormReady = selectedDate && selectedHour && selectedPlace;

  const placeOptions = PLACES.map(p => ({
    id: p.id,
    label: p.name,
    sublabel: `${p.address} · ${p.phone}`,
  }));

  const hourOptions = TIME_SLOTS.map(t => ({ id: t, label: t }));

  return (
    <>
      <style>{`@keyframes waModalIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(15,8,36,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '480px',
            background: '#fff', borderRadius: '20px',
            boxShadow: '0 24px 80px rgba(15,8,36,0.22)',
            overflow: 'visible', display: 'flex', flexDirection: 'column',
            maxHeight: '90vh',
            animation: 'waModalIn 0.22s ease',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '20px 24px 18px',
            borderBottom: '1px solid #F0F0F0',
            flexShrink: 0,
          }}>
            <WaIcon size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '17px', color: '#111' }}>
                Agendar prueba de manejo
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '1px' }}>
                Alex IA · Demo Transportes
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '24px', overflowY: 'auto' }}>

            {/* Info card */}
            <div style={{
              background: '#F0FFF4', border: '1.5px solid #BBF7D0',
              borderRadius: '12px', padding: '14px 16px', marginBottom: '20px',
              display: 'flex', alignItems: 'flex-start', gap: '12px',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Calendar size={18} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#15803D' }}>
                  Alex IA · Agendamiento de Prueba de Manejo
                </div>
                <p style={{ fontSize: '13px', color: '#166534', margin: '4px 0 0', lineHeight: 1.55 }}>
                  Alex enviará automáticamente una confirmación al conductor con los detalles del agendamiento.
                </p>
              </div>
            </div>

            {/* Candidates */}
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#444' }}>
              <Users size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              {candidates.length} candidato{candidates.length !== 1 ? 's' : ''} seleccionado{candidates.length !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {candidates.map((c) => (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '10px',
                  background: '#FAFAFA', border: '1px solid #EFEFEF',
                }}>
                  <Avatar src={c.photo} initials={c.avatarInitials} color={c.avatarColor} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{c.role}</div>
                  </div>
                  <span style={{
                    fontWeight: 800, fontSize: '14px',
                    color: c.score >= 80 ? '#16A34A' : c.score >= 60 ? '#D97706' : '#DC2626',
                  }}>
                    {c.score}
                  </span>
                </div>
              ))}
            </div>

            {/* Scheduling fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>

              {/* Fecha */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Fecha
                </label>
                <DatePicker value={selectedDate} onChange={setSelectedDate} />
              </div>

              {/* Hora */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Hora
                </label>
                <SimpleDropdown
                  icon={<Clock size={14} color={selectedHour ? '#128C7E' : '#aaa'} />}
                  placeholder="Seleccionar hora"
                  value={selectedHour}
                  options={hourOptions}
                  onChange={setSelectedHour}
                />
              </div>

              {/* Lugar */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Lugar
                </label>
                <SimpleDropdown
                  icon={<MapPin size={14} color={selectedPlace ? '#128C7E' : '#aaa'} />}
                  placeholder="Seleccionar sede"
                  value={selectedPlace}
                  options={placeOptions}
                  onChange={setSelectedPlace}
                />
                {selectedPlace && (() => {
                  const p = PLACES.find(x => x.id === selectedPlace);
                  return p ? (
                    <div style={{ marginTop: '6px', padding: '8px 12px', background: '#F8F8F8', borderRadius: '8px', fontSize: '12px', color: '#666', lineHeight: 1.4 }}>
                      📍 {p.address}<br />
                      📞 {p.phone}
                    </div>
                  ) : null;
                })()}
              </div>
            </div>

            {/* Confirm button */}
            {onConfirmSend && (
              <button
                onClick={() => isFormReady && (onConfirmSend(candidates), onClose())}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: isFormReady ? '#128C7E' : '#E0E0E0',
                  border: 'none',
                  cursor: isFormReady ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  fontWeight: 700, fontSize: '15px',
                  color: isFormReady ? '#fff' : '#aaa',
                  transition: 'all 0.2s ease',
                }}
              >
                <CheckCircle2 size={20} color={isFormReady ? '#fff' : '#bbb'} />
                Confirmar y agendar prueba de manejo
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
