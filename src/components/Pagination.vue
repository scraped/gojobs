<template>
  <div>
    <div
      v-if="short"
      class="subtitle is-hidden-tablet">
      Page {{ currPage }} of {{ totalPages }} — {{ totalItems }} items
    </div>

    <nav
      class="pagination"
      role="navigation"
      aria-label="pagination">
      <router-link
        class="pagination-previous"
        v-if="hasPrev()"
        :to="{ path: '/', query: genQuery(prevPage) }"
        :aria-label="'Go to page ' + prevPage">
          <i class="icon fa fa-angle-left"></i>
          <template v-if="short">Previous page</template>
      </router-link>

      <router-link
        class="pagination-next"
        v-if="hasNext()"
        :to="{ path: '/', query: genQuery(nextPage) }"
        :aria-label="'Go to page ' + nextPage">
          <template v-if="short">Next page</template>
          <i class="icon fa fa-angle-right"></i>
      </router-link>

      <div
        v-if="short"
        class="subtitle pagination-list is-hidden-mobile">
        {{ totalItems }} items — page {{ currPage }} of {{ totalPages }}</div>
      <ul class="pagination-list" v-else>
        <li v-if="hasFirst()">
          <router-link
            class="pagination-link"
            :to="{ path: '/', query: genQuery(1) }"
            :aria-label="'Go to page 1'">
              1
          </router-link>
        </li>
        <li v-if="hasFirst()">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>

        <li v-for="page in pages" :key="page">
          <router-link
            class="pagination-link"
            :to="{ path: '/', query: genQuery(page) }"
            :class="{ 'is-current': currPage === page }"
            :aria-label="'Go to page ' + page"
            append>
              {{ page }}
          </router-link>
        </li>

        <li v-if="hasLast()">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="hasLast()">
          <router-link
            class="pagination-link"
            :to="{ path: '/', query: genQuery(totalPages) }"
            :aria-label="'Go to page ' + totalPages">
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

export default {
  props: {
    currPage: { type: Number, default: 1 },
    totalItems: { type: Number, default: 0 },
    perPage: { type: Number, default: 30 },
    offset: { type: Number, default: 2 },
    short: { type: Boolean, default: false }
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
    genQuery: function(page) {
      return Object.assign({}, this.$route.query, { page: page });
    },

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
