import styles from './Button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  onClick,
  icon,
  className,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className ?? ''}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
      {icon}
    </button>
  );
}
