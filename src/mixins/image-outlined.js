export default {
  methods: {
    imageOutlined(color, radius = 2) {
      return {
        boxShadow: `0 0 0 4px #ffffff, 0 0 0 ${4 + radius}px #${color}`,
        margin: `${4 + radius}px`,
      };
    },
  },
};
