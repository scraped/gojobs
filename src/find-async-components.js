export default function findAsyncComponents({ components, store, route }) {
  let asyncDataPromises = [];

  components.forEach(component => {
    const subcomponents = component.components;

    if (component.fetchData) {
      asyncDataPromises.push(component.fetchData({ store, route }));
    } else if (subcomponents) {
      for (const subcomponent in subcomponents) {
        const { fetchData } = subcomponents[subcomponent];
        if (fetchData) {
          asyncDataPromises.push(fetchData({ store, route }));
        }
      }
    }
  });

  return asyncDataPromises;
}
