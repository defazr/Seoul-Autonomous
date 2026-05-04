import styles from './StepCard.module.css';

type StepCardProps = {
  step: number;
  title: string;
  description: string;
};

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="var(--color-accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx={12} cy={10} r={3} />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="var(--color-accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={10} />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="var(--color-accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x={6} y={3} width={12} height={18} rx={2} />
      <path d="M9 7h6" />
      <circle cx={12} cy={17} r={1.2} />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="var(--color-accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x={4} y={4} width={16} height={14} rx={2} />
      <circle cx={8} cy={20} r={1.5} />
      <circle cx={16} cy={20} r={1.5} />
      <path d="M4 12h16M9 4v8M15 4v8" />
    </svg>
  );
}

function StepIcon({ step }: { step: number }) {
  if (step === 1) return <PinIcon />;
  if (step === 2) return <ClockIcon />;
  if (step === 3) return <PhoneIcon />;
  return <BusIcon />;
}

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>
        <StepIcon step={step} />
      </div>
      <div className={styles.stepLabel}>STEP {String(step).padStart(2, '0')}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{description}</div>
    </div>
  );
}
