import moment from 'moment';

export function formatDate(date) {
  return moment(date).fromNow();
}

export function formatNumber(num) {
  const MILLION = 1000000;
  const THOUSAND = 1000;

  if (num >= MILLION) return (num / MILLION).toFixed(2) + 'm';
  if (num >= THOUSAND) return (num / THOUSAND).toFixed(2) + 'k';

  return num;
}

