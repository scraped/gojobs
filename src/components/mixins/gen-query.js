export default {
  methods: {
    genQuery(query) {
      return Object.assign({}, this.$route.query, query);
    },
  }
}
