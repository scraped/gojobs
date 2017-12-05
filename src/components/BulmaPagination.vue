<template>
  <div>
    <nav
      class="pagination is-centered is-rounded"
      role="navigation"
      aria-label="pagination">
      <router-link
        class="pagination-previous button is-medium"
        v-if="hasPrev()"
        :to="{ path: '/', query: genQuery({ page: prevPage }) }"
        :aria-label="`Go to page ${prevPage}`">
          <i class="icon fa fa-angle-left"></i>
          <span>Previous</span>
      </router-link>

      <router-link
        class="pagination-next button is-medium"
        v-if="hasNext()"
        :to="{ path: '/', query: genQuery({ page: nextPage }) }"
        :aria-label="`Go to page ${nextPage}`">
          <span>Next</span>
          <i class="icon fa fa-angle-right"></i>
      </router-link>

      <ul class="pagination-list">
        <li v-if="hasFirst()">
          <router-link
            class="pagination-link button is-medium"
            :to="{ path: '/', query: genQuery({ page: 1 }) }"
            :aria-label="'Go to page 1'"
            append>
              1
          </router-link>
        </li>

        <li v-if="hasFirst() && leftBound > 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>

        <li v-for="page in pages" :key="page">
          <span class="pagination-link">
          <router-link
            class="button is-medium is-rounded"
            :to="{ path: '/', query: genQuery({ page }) }"
            :class="{ 'is-primary': currPage === page }"
            :aria-label="`Go to page ${page}`"
            append>
              {{ page }}
          </router-link>
          </span>
        </li>

        <li v-if="hasLast() && totalPages - rightBound > 1">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>

        <li v-if="hasLast()">
          <router-link
            class="pagination-link button is-medium"
            :to="{ path: '/', query: genQuery({ page: totalPages }) }"
            :aria-label="`Go to page ${totalPages}`">
              {{ totalPages }}
          </router-link>
        </li>
      </ul>
      </slot>
    </nav>
  </div>
</template>

<script>
import _ from 'lodash';
import genQuery from './mixins/gen-query.js';

export default {
  mixins: [
    genQuery
  ],

  props: {
    currPage: { type: Number, default: 1 },
    totalItems: { type: Number, default: 0 },
    perPage: { type: Number, default: 30 },
    offset: { type: Number, default: 3 }
  },

  computed: {
    pages() {
      let pages = [];

      for (let i = this.leftBound; i <= this.rightBound; i++) {
        pages.push(i);
      }

      return pages;
    },

    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },

    leftBound() {
      const bound = this.currPage - this.offset;
      return Math.max(bound, 1);
    },

    rightBound() {
      const bound = this.currPage + this.offset;
      return Math.min(bound, this.totalPages);
    },

    nextPage() {
      return this.currPage + 1;
    },

    prevPage() {
      return this.currPage - 1;
    }
  },

  methods: {
    loadMore() {
      this.$emit('load-more');
    },

    hasFirst() {
      return this.leftBound !== 1;
    },

    hasLast() {
      return this.rightBound < this.totalPages;
    },

    hasPrev() {
      return this.currPage > 1;
    },

    hasNext() {
      return this.currPage < this.totalPages;
    }
  }
}
</script>

<style lang="scss">
@import "../scss/utilities/_all";

$pagination-margin: 0;

@import "../scss/components/pagination";
</style>
