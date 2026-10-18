import type { RobotaxiListItem } from '../../../lib/types/route';
import { Pill } from '../ui/Pill';
import styles from './transit.module.css';

export type RobotaxiLabels = { appRequired: string; checkBeforeRiding: string; fareTitle: string; hoursTitle: string; reservationTitle: string; reservationRealtimeCall: string; appTitle: string; appPurposes: string; operatorTitle: string; sourcePrefix: string; effectivePrefix: string };

const formatAmount = (amount: number, ko: boolean) => (ko ? `${amount.toLocaleString('ko-KR')}원` : `KRW ${amount.toLocaleString('en-US')}`);
const formatDate = (iso: string, ko: boolean) => { const [y, m, d] = iso.split('-'); if (ko) return `${y}.${m}.${d}`; const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m) - 1]; return `${mon} ${Number(d)}, ${y}`; };

function TaxiIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 14l2-5h14l2 5" /><path d="M3 14v5h18v-5" /><circle cx={7} cy={18} r={1.5} /><circle cx={17} cy={18} r={1.5} /><path d="M9 7V5h6v2" />
    </svg>
  );
}

/** 로보택시 카드 — 공식 확인된 운영정보만 행을 만든다(26-C2O 불변식). 표시값과 출처 1건만 받는다. */
export function RobotaxiCard({ service, locale = 'en', labels }: { service: RobotaxiListItem; locale?: string; labels?: RobotaxiLabels }) {
  const ko = locale === 'ko';
  const pending = service.verificationLevel === 'official_pending';
  const hasOps = service.fareBands || service.hoursText || service.reservation || service.app || service.operatorNames.length > 0;
  return (
    <div className={styles.card}>
      <span className={styles.glyph}><TaxiIcon /></span>
      <div>
        <div className={styles.topRow}>
          <span className={styles.type}>Robotaxi</span>
          {pending ? <Pill tone="neutral" dot>{labels?.checkBeforeRiding ?? 'Check before riding'}</Pill> : <Pill tone="ok" dot on>OFFICIAL</Pill>}
        </div>
        <div className={styles.name}>{ko ? service.displayNameKo : service.displayName}</div>
        <div className={styles.sub} lang={ko ? 'en' : 'ko'}>{ko ? service.displayName : service.displayNameKo}</div>
        <div className={styles.line}>{ko ? service.serviceAreaKo : service.serviceArea}</div>
        {service.app && <div className={styles.tag}>{labels?.appRequired ?? 'Kakao T (Korean app) required'}</div>}
        {hasOps && (
          <dl className={styles.ops}>
            {service.fareBands && <div className={styles.opsRow}><dt className={styles.opsLabel}>{labels?.fareTitle ?? 'Fare'}</dt><dd className={styles.opsValue}><ul className={styles.fare}>{service.fareBands.map((b) => <li key={`${b.start}-${b.end}`}><span>{b.start}–{b.end}</span><span>{formatAmount(b.amount, ko)}</span></li>)}</ul></dd></div>}
            {service.hoursText && <div className={styles.opsRow}><dt className={styles.opsLabel}>{labels?.hoursTitle ?? 'Hours'}</dt><dd className={styles.opsValue}>{service.hoursText}</dd></div>}
            {service.reservation && <div className={styles.opsRow}><dt className={styles.opsLabel}>{labels?.reservationTitle ?? 'How to ride'}</dt><dd className={styles.opsValue}>{labels?.reservationRealtimeCall ?? 'No advance reservation; request a ride in Kakao T'}</dd></div>}
            {service.app && <div className={styles.opsRow}><dt className={styles.opsLabel}>{labels?.appTitle ?? 'Required app'}</dt><dd className={styles.opsValue}>{`${service.app.appName ?? ''}${labels?.appPurposes ? ` — ${labels.appPurposes}` : ''}`}</dd></div>}
            {service.operatorNames.length > 0 && <div className={styles.opsRow}><dt className={styles.opsLabel}>{labels?.operatorTitle ?? 'Operated by'}</dt><dd className={styles.opsValue} lang={ko ? undefined : 'ko'}>{service.operatorNames.join(', ')}</dd></div>}
          </dl>
        )}
        {service.source && (
          <p className={styles.src}>
            <a href={service.source.url} target="_blank" rel="noopener noreferrer">{`${labels?.sourcePrefix ?? 'Official source'}: `}<span lang={ko ? undefined : 'ko'}>{service.source.publisher}</span>{` · ${formatDate(service.source.publishedAt, ko)}`}</a>
            {service.source.effectiveAt && <span>{`${formatDate(service.source.effectiveAt, ko)} ${labels?.effectivePrefix ?? 'effective'}`}</span>}
          </p>
        )}
      </div>
    </div>
  );
}
