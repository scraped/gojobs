<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <router-link
      :to="{ path: '/', query: { page: prevPage }}"
      class="pagination-previous"
      :aria-label="'Go to page ' + prevPage"
      v-if="hasPrev()">
        ←
    </router-link>
    <router-link
      :to="{ path: '/', query: { page: nextPage }}"
      class="pagination-next"
      :aria-label="'Go to page ' + nextPage"
      v-if="hasNext()">
        →
    </router-link>
    <ul class="pagination-list">
      <li v-if="hasFirst()">
        <router-link
          to="/"
          class="pagination-link"
          aria-label="Goto page 1">
            1
        </router-link>
      </li>
      <li v-if="hasFirst()">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-for="page in pages" :key="page">
        <router-link
          :to="{ path: '/', query: { page: page }}"
          class="pagination-link"
          :class="{ 'is-current': currPage === page }"
          :aria-label="'Go to page ' + page">
            {{ page }}
        </router-link>
      </li>
      <li v-if="hasLast()">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="hasLast()">
        <router-link
          :to="{ path: '/', query: { page: totalPages }}" class="pagination-link"
          :aria-label="'Go to page ' + totalPages">
            {{ totalPages }}
        </router-link>
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
      console.log('hasFirst' + this.leftBound !== 1)
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
  }
}
</script>

<style>

</style>
