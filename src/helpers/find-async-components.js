export function findAsyncComponents({ components, store, route }) {
  let fetchDataPromises = [];

  components.forEach(component => {
    if (component.fetchData) {
      fetchDataPromises.push(component.fetchData({ store, route }));
    }
  });

  return fetchDataPromises;
}
