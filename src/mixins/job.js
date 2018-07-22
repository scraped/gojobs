export const ratingMixin = {
  methods: {
      /**
     * @param {number} rating rating
     * @param {string} prepend string to prepend via '-'
     * @return {string} 'success', 'warning', or 'danger'
     */
    ratingCssClass(rating = 0, prepend = 'is') {
      let ratingClass = 'danger';
      if (rating >= 34) ratingClass = 'warning';
      if (rating >= 67) ratingClass = 'success';

      return (prepend ? `${prepend}-` : '')
        + ratingClass;
    }
  }
};
