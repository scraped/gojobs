<template>
  <div>
    <svg
      :viewBox="`0 0 ${metrics.maxDistX + 56} ${metrics.maxDistY + 56}`">
      <line
        stroke="#f0c850"
        stroke-width="8"
        v-for="(loc, i) in locNorm.primary"
        v-if="!(pointToPoint && i === locNorm.primary.length - 1)"
        :key="`line${i}`"
        :x1="loc[0]"
        :y1="loc[1]"
        :x2="i === locNorm.primary.length - 1
          ? locNorm.primary[0][0]
          : locNorm.primary[i + 1][0]"
        :y2="i === locNorm.primary.length - 1
          ? locNorm.primary[0][1]
          : locNorm.primary[i + 1][1]" />
      <circle
        :fill="i === 0 ? '#00ff00' : (i === locNorm.primary.length - 1) ? '#ff0000' : '#f0c850'"
        stroke="#000000"
        stroke-width="2"
        v-for="(loc, i) in locNorm.primary"
        :key="`circle${i}`"
        :cx="loc[0]"
        :cy="loc[1]"
        :r="(i === 0 || i === locNorm.primary.length - 1) ? 12 : 6" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    pointToPoint: {
      type: Boolean,
      default: false
    },

    locations: {
      type: Array,
      default: () => []
    },

    slocations: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    metrics() {
      const { locations, slocations } = this;
      const realSlocations = slocations.filter(loc => loc[0] || loc[1]);
      const locationsX = locations.map(loc => loc[0]);
      const locationsY = locations.map(loc => loc[1]);
      const slocationsX = realSlocations.map(loc => loc[0]);
      const slocationsY = realSlocations.map(loc => loc[1]);
      const allLocationsX = [...locationsX, ...slocationsX];
      const allLocationsY = [...locationsY, ...slocationsY];
      const minX = Math.min(...allLocationsX);
      const minY = Math.min(...allLocationsY);
      const maxX = Math.max(...allLocationsX);
      const maxY = Math.max(...allLocationsY);
      return {
        offsetX: 14 + (-minX),
        offsetY: 14 + (-minY),
        maxDistX: Math.abs(maxX - minX),
        maxDistY: Math.abs(maxY - minY)
      };
    },

    locNorm() {
      const { offsetX, offsetY, maxDistY } = this.metrics;

      const mapper = loc => {
        return [
          28 + loc[0] + offsetX,
          28 + maxDistY - (loc[1] + offsetY)
        ];
      };

      return {
        primary: this.locations.map(mapper),
        secondary: this.slocations.map(mapper)
      };
    }
  }
};
</script>
