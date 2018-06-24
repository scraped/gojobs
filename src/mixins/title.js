// Код миксина взят отсюда:
// https://ssr.vuejs.org/ru/head.html

const mandatoryTitlePart = 'GTA Online Jobs';

function getTitle(vm) {
  // компоненты могут просто предоставлять опцию `title`,
  // которая может быть как строкой, так и функцией
  let { title } = vm.$options;

  console.log('here');
  let genTitle = (typeof title === 'function' ? title.call(vm) : title) || '';

  if (genTitle) {
    genTitle += ' - ';
  }

  genTitle += mandatoryTitlePart;

  return genTitle;
}

// created
export function serverTitleMixin() {
  const title = getTitle(this);
  if (title) {
    this.$ssrContext.title = title;
  }
};

// mounted
export function clientTitleMixin() {
  const title = getTitle(this);
  document.title = title;
};
