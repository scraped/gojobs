<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <a
      class="pagination-previous"
      v-if="hasPrev()"
      @click.prevent="changePage(prevPage)"
      :aria-label="'Go to page ' + prevPage">
        ←
    </a>
    <a
      class="pagination-next"
      v-if="hasNext()"
      @click.prevent="changePage(nextPage)"
      :aria-label="'Go to page ' + nextPage"
      >
        →
    </a>
    <ul class="pagination-list">
      <li v-if="hasFirst()">
        <a
          class="pagination-link"
          @click.prevent="changePage(1)"
          aria-label="Goto page 1">
            1
        </a>
      </li>
      <li v-if="hasFirst()">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-for="page in pages" :key="page">
        <a
          class="pagination-link"
          @click.prevent="changePage(page)"
          :class="{ 'is-current': currPage === page }"
          :aria-label="'Go to page ' + page">
            {{ page }}
        </a>
      </li>
      <li v-if="hasLast()">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="hasLast()">
        <a
          class="pagination-link"
          @click.prevent="changePage(totalPages)"
          :aria-label="'Go to page ' + totalPages">
            {{ totalPages }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currPage: { type: Number, default: 1 },
    totalItems: { type: Number, default: 0 },
    perPage: { type: Number, default: 30 },
    offset: { type: Number, default: 2 }
  },

  computed: {
    pages: function() {
      let pages = [];

      for (let i = this.leftBound; i <= this.rightBound; i++) {
        pages.push(i);
      }

      return pages;
    },

    totalPages: function() {
      return Math.ceil(this.totalItems / this.perPage);
    },

    leftBound: function() {
      let bound = this.currPage - this.offset;
      return Math.max(bound, 1);
    },

    rightBound: function() {
      let bound = this.currPage + this.offset;
      return Math.min(bound, this.totalPages);
    },

    nextPage: function() {
      return this.currPage + 1;
    },

    prevPage: function() {
      return this.currPage - 1;
    }
  },

  methods: {
    hasFirst: function() {
      return this.leftBound !== 1;
    },

    hasLast: function() {
      return this.rightBound < this.totalPages;
    },

    hasPrev: function() {
      return this.currPage > 1;
    },

    hasNext: function() {
      return this.currPage < this.totalPages;
    },

    changePage: function(page) {
      this.$emit('page-changed', page);
    }
  }
}
</script>

<style>

</style>
