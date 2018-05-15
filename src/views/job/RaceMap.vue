<template>
  <div>
    <svg
      :viewBox="`0 0 ${metrics.maxDistX + 32} ${metrics.maxDistY + 32}`">
      <line
        stroke="#f0c850"
        stroke-width="8px"
        v-for="(loc, i) in locNorm.primary"
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
        fill="#f0c850"
        stroke="#000000"
        stroke-width="2px"
        v-for="(loc, i) in locNorm.primary"
        :key="`circle${i}`"
        :cx="loc[0]"
        :cy="loc[1]"
        r="6px" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
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
        offsetX: 8 + (minX < 0 ? -minX : 0),
        offsetY: 8 + (minY < 0 ? -minY : 0),
        maxDistX: Math.abs(maxX - minX),
        maxDistY: Math.abs(maxY - minY)
      };
    },

    locNorm() {
      const { offsetX, offsetY, maxDistY } = this.metrics;

      const mapper = loc => {
        return [
          16 + loc[0] + offsetX,
          16 + maxDistY - (loc[1] + offsetY)
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
