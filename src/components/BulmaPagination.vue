<template>
  <div>
    <!-- <template v-if="showLoadMoreButton">
      <div
        class="button is-large is-fullwidth"
        :class="{ 'is-loading': loading }"
        @click="loadMore()">
        <span>Load more</span>
      </div>
      <br>
    </template> -->

    <div class="buttons has-addons is-pulled-right">
      <router-link
        class="button"
        v-if="hasPrev()"
        :to="{ name: routeName, query: genQuery({ page: prevPage }) }"
        :aria-label="`Go to page ${prevPage}`">
        <i class="icon fa fa-angle-left"></i>
        <span class="is-hidden-mobile">Previous page</span>
      </router-link>

      <router-link
        class="button"
        v-if="hasNext()"
        :to="{ name: routeName, query: genQuery({ page: nextPage }) }"
        :aria-label="`Go to page ${nextPage}`">
        <span class="is-hidden-mobile">Next page</span>
        <i class="icon fa fa-angle-right"></i>
      </router-link>
    </div>

    <div
      class="buttons has-addons"
      role="navigation"
      aria-label="pagination">

      <router-link
        class="button"
        v-if="hasFirst()"
        :to="{ name: routeName, query: genQuery({ page: 1 }) }"
        :aria-label="'Go to page 1'">
        1
      </router-link>

      <span
        class="button"
        v-if="hasFirst() & leftBound > 2">
        &hellip;
      </span>

      <router-link
        class="button"
        v-for="page in pages" :key="page"
        :to="{ name: routeName, query: genQuery({ page }) }"
        :class="{ 'is-primary': currPage === page }"
        :aria-label="`Go to page ${page}`">
        {{ page }}
      </router-link>

      <span
        class="button"
        v-if="hasLast() & totalPages - rightBound > 1">
        &hellip;
      </span>

      <router-link
        class="button"
        v-if="hasLast()"
        :to="{ name: routeName, query: genQuery({ page: totalPages }) }"
        :aria-label="`Go to page ${totalPages}`">
        {{ totalPages }}
      </router-link>
    </div>
  </div>
</template>

<script>
import genQuery from 'src/utils/gen-query.js';

export default {
  mixins: [
    genQuery
  ],

  props: {
    currPage: { type: Number, default: 1 },
    totalItems: { type: Number, default: 0 },
    perPage: { type: Number, default: 30 },
    offset: { type: Number, default: 3 },
    routeName: { type: String, default: 'main' },

    loadMoreButton: { type: Boolean, default: true },
    loading: { type: Boolean, default: false }
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
    showLoadMoreButton() {
      return this.loadMoreButton
        && this.totalItems > 0
        && this.currPage != this.totalPages;
    },

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
