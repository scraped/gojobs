<template>
  <div>
    <svg
      :viewBox="`0 0 ${metrics.maxDistX + 32} ${metrics.maxDistY + 32}`">
      <line
        stroke="#f0c850"
        stroke-width="8px"
        v-for="(loc, i) in locNorm"
        :key="i"
        :x1="loc.x"
        :y1="loc.y"
        :x2="i === locNorm.length - 1 ? locNorm[0].x : locNorm[i + 1].x"
        :y2="i === locNorm.length - 1 ? locNorm[0].y : locNorm[i + 1].y" />
      <circle
        fill="#f0c850"
        stroke="#000000"
        stroke-width="2px"
        v-for="(loc, i) in locNorm"
        :key="i"
        :cx="loc.x"
        :cy="loc.y"
        r="6px" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    locations: {
      type: Array,
      default: () => [
        {
            "x" : 141.851,
            "y" : -1399.011
        },
        {
            "x" : 63.398,
            "y" : -1278.012
        },
        {
            "x" : 70.303,
            "y" : -1136.001
        },
        {
            "x" : 197,
            "y" : -1126.621
        },
        {
            "x" : 262.174,
            "y" : -952.568
        },
        {
            "x" : 499.542,
            "y" : -956.533
        },
        {
            "x" : 499.433,
            "y" : -1256.48
        },
        {
            "x" : 397.058,
            "y" : -1260.815
        },
        {
            "x" : 273.474,
            "y" : -1409.834
        },
        {
            "x" : 357.14,
            "y" : -1482.04
        },
        {
            "x" : 467.597,
            "y" : -1418.037
        },
        {
            "x" : 534.415,
            "y" : -1464.474
        },
        {
            "x" : 476.524,
            "y" : -1441.469
        },
        {
            "x" : 331.545,
            "y" : -1504.326
        },
        {
            "x" : 178.889,
            "y" : -1392.061
        },
        {
            "x" : 221.059,
            "y" : -1133.813
        },
        {
            "x" : 395.464,
            "y" : -1128.759
        },
        {
            "x" : 398.422,
            "y" : -1055.829
        },
        {
            "x" : 580.613,
            "y" : -1027.678
        },
        {
            "x" : 772.232,
            "y" : -1011.362
        },
        {
            "x" : 789.112,
            "y" : -1144.642
        },
        {
            "x" : 605.485,
            "y" : -1176.976
        },
        {
            "x" : 158.089,
            "y" : -1184.042
        },
        {
            "x" : -299.851,
            "y" : -1184.667
        },
        {
            "x" : -374.124,
            "y" : -1136.567
        },
        {
            "x" : -404.579,
            "y" : -959.497
        },
        {
            "x" : -427.059,
            "y" : -1022.119
        },
        {
            "x" : -421.648,
            "y" : -1206.276
        },
        {
            "x" : -217.762,
            "y" : -1236.958
        },
        {
            "x" : -355.352,
            "y" : -1269.718
        },
        {
            "x" : -371.392,
            "y" : -1421.188
        },
        {
            "x" : -241.634,
            "y" : -1439.677
        },
        {
            "x" : -41.124,
            "y" : -1603.528
        },
        {
            "x" : 63.77,
            "y" : -1513.825
        }
      ]
    }
  },

  computed: {
    metrics() {
      const { locations } = this;
      const locationsX = locations.map(loc => loc.x);
      const locationsY = locations.map(loc => loc.y);
      const minX = Math.min(...locationsX);
      const minY = Math.min(...locationsY);
      const maxX = Math.max(...locationsX);
      const maxY = Math.max(...locationsY);
      return {
        offsetX: 8 + (minX < 0 ? -minX : 0),
        offsetY: 8 + (minY < 0 ? -minY : 0),
        maxDistX: Math.abs(maxX - minX),
        maxDistY: Math.abs(maxY - minY)
      };
    },

    locNorm() {
      const { offsetX, offsetY, maxDistY } = this.metrics;
      return this.locations.map(loc => {
        return {
          x: 16 + loc.x + offsetX,
          y: 16 + maxDistY - (loc.y + offsetY)
        };
      });
    }
  }
};
</script>
