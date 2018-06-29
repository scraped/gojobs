// Код миксина взят отсюда:
// https://ssr.vuejs.org/ru/head.html

const defaultTitle = 'GTA Online Jobs';

function getTitle(vm) {
  // компоненты могут просто предоставлять опцию `title`,
  // которая может быть как строкой, так и функцией
  let { title } = vm.$options;

  if (!title) return null;

  return typeof title === 'function'
    ? title.call(vm)
    : title;
}

// created
export function serverTitleMixin() {
  const title = getTitle(this);
  if (title === null) return;
  if (this.$ssrContext) {
    this.$ssrContext.title = title
      ? `${title} - ${defaultTitle}`
      : defaultTitle;
  }
};

// mounted
export function clientTitleMixin() {
  const title = getTitle(this);
  if (title === null) return;
  document.title = title
    ? `${title} - ${defaultTitle}`
    : defaultTitle;
};
