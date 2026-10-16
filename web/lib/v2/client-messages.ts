import { getMessages } from 'next-intl/server';
import type { AbstractIntlMessages } from 'next-intl';

/**
 * 클라이언트 부품이 쓰는 네임스페이스만 골라 NextIntlClientProvider 에 넘긴다 (V7 성능 — 전체 messages 직렬화 금지).
 * 쓰는 곳: 홈(nightHome) · 노선 목록 RoutesList(routes) · 정류장 ArrivalCard(stopDetail). 새 클라이언트 부품이 useTranslations 를 쓰면 여기에 추가.
 */
export async function clientMessages(locale: string, namespaces: readonly string[]): Promise<AbstractIntlMessages> {
  const all = await getMessages({ locale });
  return Object.fromEntries(namespaces.filter((ns) => ns in all).map((ns) => [ns, all[ns]])) as AbstractIntlMessages;
}
