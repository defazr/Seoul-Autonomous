import styles from './MapLinkButton.module.css';

type MapLinkButtonProps = {
  displayNameKo: string;
  label: string;
};

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={15}
      height={15}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

/**
 * URL generation: Same as the app's MapLinkButtons component.
 * Uses Kakao Map search URL with displayNameKo as query parameter.
 * See: components/ui/MapLinkButtons.tsx line 14
 */
export function MapLinkButton({ displayNameKo, label }: MapLinkButtonProps) {
  const q = encodeURIComponent(displayNameKo);
  const href = `https://map.kakao.com/?q=${q}`;

  return (
    <div className={styles.container}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <ExternalLinkIcon />
        {label}
      </a>
    </div>
  );
}
