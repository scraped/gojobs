import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';

export function formatDateRelative(date) {
  const distance = distanceInWordsToNow(date);
  return `${distance} ago`;
}

export function formatDate(date) {
  return format(date, 'MM/DD/YYYY');
}

export function mToKm(metres) {
  return (metres / 1000).toFixed(2);
}

export function formatNumber(num, message = '') {
  const MILLION = 10 ** 6;
  const THOUSAND = 10 ** 3;

  let pre = '';
  let formatted = num;

  if (num >= MILLION) {
    formatted = (num / MILLION).toFixed(2) + 'm';
  } else if (num >= THOUSAND) {
    formatted = (num / THOUSAND).toFixed(2) + 'k';
  }

  if (message) {
    pre = message + ': ';
  }

  return pre + formatted;
}
