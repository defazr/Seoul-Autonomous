export function formatDate(iso: string, isKo: boolean): string {
  const d = new Date(iso);
  if (isKo) {
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
