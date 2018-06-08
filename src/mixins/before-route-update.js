export async function beforeRouteUpdate(to, from, next) {
  const { fetchData } = this.$options;

  if (fetchData) {
    this.$Progress.start();

    await fetchData({
      store: this.$store,
      route: to
    });

    this.$Progress.finish();
  }

  next();
}
