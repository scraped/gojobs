import moment from 'moment';

export function formatDate(date) {
  return moment(date).fromNow();
}

export function mToKm(metres) {
  return (metres / 1000).toFixed(2);
}

export function formatNumber(num, message = '') {
  const MILLION = 1000000;
  const THOUSAND = 1000;

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
