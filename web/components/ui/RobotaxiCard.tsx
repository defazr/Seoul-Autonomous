import type { RobotaxiListItem } from '../../lib/types/route';
import { Pill, StatusDot } from './Pill';
import styles from './RobotaxiCard.module.css';

type RobotaxiCardProps = {
  // 26-C2O: 표시값과 공식 출처 1건만 담은 DTO. 48셀 조사 상태는 넘어오지 않는다.
  service: RobotaxiListItem;
  locale?: string;
  labels?: {
    appRequired: string;
    checkBeforeRiding: string;
    fareTitle: string;
    hoursTitle: string;
    reservationTitle: string;
    reservationRealtimeCall: string;
    appTitle: string;
    appPurposes: string;
    operatorTitle: string;
    sourcePrefix: string;
    effectivePrefix: string;
  };
};

const formatAmount = (amount: number, isKo: boolean) =>
  isKo ? `${amount.toLocaleString('ko-KR')}원` : `KRW ${amount.toLocaleString('en-US')}`;

const formatDate = (iso: string, isKo: boolean) => {
  const [y, m, d] = iso.split('-');
  if (isKo) return `${y}.${m}.${d}`;
  const month = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ][Number(m) - 1];
  return `${month} ${Number(d)}, ${y}`;
};

function TaxiIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--color-fg-2)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14l2-5h14l2 5" />
      <path d="M3 14v5h18v-5" />
      <circle cx={7} cy={18} r={1.5} />
      <circle cx={17} cy={18} r={1.5} />
      <path d="M9 7V5h6v2" />
    </svg>
  );
}

export function RobotaxiCard({ service, locale = 'en', labels }: RobotaxiCardProps) {
  const isKo = locale === 'ko';
  const isPending = service.verificationLevel === 'official_pending';

  const name = isKo ? service.displayNameKo : service.displayName;
  const subName = isKo ? service.displayName : service.displayNameKo;
  const area = isKo ? service.serviceAreaKo : service.serviceArea;

  const appLabel = labels?.appRequired ?? 'Kakao T (Korean app) required';
  const pendingLabel = labels?.checkBeforeRiding ?? 'CHECK BEFORE RIDING';

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div className={styles.modeGlyph}>
          <TaxiIcon />
        </div>
        <div className={styles.content}>
          <div className={styles.topRow}>
            <span className={styles.typeLabel}>ROBOTAXI</span>
            {isPending ? (
              <Pill variant="warning">
                <StatusDot color="var(--color-warning)" size={5} />
                <span>{pendingLabel}</span>
              </Pill>
            ) : (
              <Pill variant="success">
                <StatusDot color="var(--color-success)" size={5} />
                <span>OFFICIAL</span>
              </Pill>
            )}
          </div>
          <div className={styles.name}>{name}</div>
          <div className={styles.subName}>{subName}</div>
          <div className={styles.area}>{area}</div>
          {service.app && (
            <div className={styles.appTag}>
              <span className={styles.appDot} />
              <span className={styles.appText}>{appLabel}</span>
            </div>
          )}

          {/* 26-C2O: 공식 확인된 운영정보만 표시한다. 미확인 항목은 행 자체를 만들지 않는다. */}
          {(service.fareBands || service.hoursText || service.reservation || service.app || service.operatorNames.length > 0) && (
            <dl className={styles.opsList}>
              {service.fareBands && (
                <div className={styles.opsRow}>
                  <dt className={styles.opsLabel}>{labels?.fareTitle ?? 'Fare'}</dt>
                  <dd className={styles.opsValue}>
                    <ul className={styles.fareBands}>
                      {service.fareBands.map((b) => (
                        <li key={`${b.start}-${b.end}`} className={styles.fareBand}>
                          <span className={styles.fareTime}>{`${b.start}–${b.end}`}</span>
                          <span className={styles.fareAmount}>{formatAmount(b.amount, isKo)}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              {service.hoursText && (
                <div className={styles.opsRow}>
                  <dt className={styles.opsLabel}>{labels?.hoursTitle ?? 'Hours'}</dt>
                  <dd className={styles.opsValue}>{service.hoursText}</dd>
                </div>
              )}
              {service.reservation && (
                <div className={styles.opsRow}>
                  <dt className={styles.opsLabel}>{labels?.reservationTitle ?? 'How to ride'}</dt>
                  <dd className={styles.opsValue}>
                    {labels?.reservationRealtimeCall ??
                      'No advance reservation; request a ride in Kakao T'}
                  </dd>
                </div>
              )}
              {service.app && (
                <div className={styles.opsRow}>
                  <dt className={styles.opsLabel}>{labels?.appTitle ?? 'Required app'}</dt>
                  <dd className={styles.opsValue}>
                    {`${service.app.appName ?? ''}${labels?.appPurposes ? ` — ${labels.appPurposes}` : ''}`}
                  </dd>
                </div>
              )}
              {service.operatorNames.length > 0 && (
                <div className={styles.opsRow}>
                  <dt className={styles.opsLabel}>{labels?.operatorTitle ?? 'Operated by'}</dt>
                  <dd className={styles.opsValue}>{service.operatorNames.join(', ')}</dd>
                </div>
              )}
            </dl>
          )}

          {service.source && (
            <p className={styles.sourceNote}>
              <a
                className={styles.sourceLink}
                href={service.source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${labels?.sourcePrefix ?? 'Official source'}: ${service.source.publisher} · ${formatDate(service.source.publishedAt, isKo)}`}
              </a>
              {service.source.effectiveAt && (
                <span className={styles.sourceEffective}>
                  {`${formatDate(service.source.effectiveAt, isKo)} ${labels?.effectivePrefix ?? 'effective'}`}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
