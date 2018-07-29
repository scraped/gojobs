export async function beforeRouteUpdate(to, from, next) {
  const { fetchData } = this.$options;

  if (fetchData) {
    this.$Progress.start();

    try {
      await fetchData({
        store: this.$store,
        route: to
      });
    } catch (e) {}

    this.$Progress.finish();
  }

  next();
}
