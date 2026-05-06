import styles from './PageContainer.module.css';

type PageContainerProps = {
  width?: 'default' | 'longform';
  children: React.ReactNode;
};

export function PageContainer({ width = 'default', children }: PageContainerProps) {
  return (
    <div className={`${styles.container} ${width === 'longform' ? styles.longform : styles.default}`}>
      {children}
    </div>
  );
}
