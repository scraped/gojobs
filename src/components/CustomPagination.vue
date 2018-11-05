<template>
  <div>
    <div
      class="content"
    >
      <div
        :class="{'is-loading': loading}"
        :disabled="!showLoadMoreButton"
        class="button button_shadow button_responsible is-primary has-backgroud-grey is-rounded is-large is-fullwidth"
        @click="loadMore()"
      >
        <span>Load more</span>
      </div>
    </div>

    <div class="buttons has-addons is-pulled-right">
      <router-link
        v-if="hasPrev()"
        :to="genPageRoute(prevPage)"
        :aria-label="`Go to page ${prevPage}`"
        class="button"
      >
        <i class="icon fa fa-angle-left"/>
        <span class="is-hidden-mobile">Previous page</span>
      </router-link>

      <router-link
        v-if="hasNext()"
        :aria-label="`Go to page ${nextPage}`"
        :to="genPageRoute(nextPage)"
        class="button"
      >
        <span class="is-hidden-mobile">Next page</span>
        <i class="icon fa fa-angle-right"/>
      </router-link>
    </div>

    <div
      class="buttons has-addons"
      role="navigation"
      aria-label="pagination"
    >
      <router-link
        v-if="hasFirst()"
        :to="genPageRoute(1)"
        class="button"
        aria-label="Go to page 1"
      >
        1
      </router-link>

      <span
        v-if="hasFirst() & leftBound > 3"
        class="button "
      >
        &hellip;
      </span>

      <router-link
        v-for="page in pages"
        :key="page"
        :to="genPageRoute(page)"
        :aria-label="`Go to page ${page}`"
        :class="{[currPageButtonClass]: currPage === page}"
        class="button"
      >
        {{page}}
      </router-link>

      <span
        v-if="hasLast() & totalPages - rightBound > 2"
        class="button"
      >
        &hellip;
      </span>

      <router-link
        v-if="hasLast()"
        :to="genPageRoute(totalPages)"
        :aria-label="`Go to page ${totalPages}`"
        class="button"
      >
        {{totalPages}}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currPage: {type: Number, default: 1},
    totalItems: {type: Number, default: 0},
    perPage: {type: Number, default: 30},
    offset: {type: Number, default: 3},
    routeName: {type: String, default: 'main'},

    loadMoreButton: {type: Boolean, default: true},
    loading: {type: Boolean, default: false},

    currPageButtonClass: {
      type: String,
      default: 'is-primary',
    },
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
      return Math.ceil(this.totalItems / this.perPage) || 1;
    },

    leftBound() {
      let bound = this.currPage - this.offset;
      if (bound === 3) {
        bound = 2;
      }
      return Math.max(bound, 1);
    },

    rightBound() {
      let bound = this.currPage + this.offset;
      if (bound === this.totalPages - 2) {
        bound = this.totalPages - 1;
      }
      return Math.min(bound, this.totalPages);
    },

    nextPage() {
      return this.currPage + 1;
    },

    prevPage() {
      return this.currPage - 1;
    },

    showLoadMoreButton() {
      return this.loadMoreButton
        && this.totalItems > 0
        && this.currPage !== this.totalPages;
    },
  },

  methods: {
    genPageRoute(page) {
      return {
        query: {...this.$route.query, page}
      };
    },

    loadMore() {
      if (this.showLoadMoreButton) {
        this.$emit('load-more');
      }
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
    },
  },
};
</script>
