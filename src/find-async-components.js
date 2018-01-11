export default function findAsyncComponents({ components, store, route }) {
  let asyncDataPromises = [];

  components.forEach(component => {
    if (component.fetchData) {
      asyncDataPromises.push(component.fetchData({ store, route }));
    }
  });

  return asyncDataPromises;
}
