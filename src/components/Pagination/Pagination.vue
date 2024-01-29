<template>
  <div class="flex gap-x-2 gap-y-4 justify-center items-center flex-wrap">
    <ul class="flex gap-x-1 justify-center items-center">
      <li
        class="flex justify-center items-center"
        :class="currentPage === 1 ? 'cursor-default' : 'cursor-pointer'"
        @click="onFirstPage"
      >
        <button class="p-1 -mr-2 border-2 border-t-gray-500 border-l-gray-500 -rotate-45 border-r-transparent border-b-transparent" />
        <button class="p-1 mr-2 border-2 border-t-gray-500 border-l-gray-500 -rotate-45 border-r-transparent border-b-transparent" />
      </li>

      <li class="flex justify-center items-center">
        <button 
          class="p-1 mr-2 border-2 border-t-gray-500 border-l-gray-500 -rotate-45 border-r-transparent border-b-transparent"
          type="button"
          :disabled="disabledButtons.prev"
          @click="prevPage"
        />
      </li>

      <li
        v-for="page in availablePages"
        :key="page"
        class="flex justify-center items-center"
      >
        <button
          class="py-2 px-4 bg-amber-200 rounded-[5px] font-bold transition-all hover:bg-slate-300"
          :class="page === currentPage ? 'bg-slate-300' : ''"
          type="button"
          @click="onClickPage(page)"
        >
          {{ page }}
        </button>
      </li>

      <li class="flex justify-center items-center">
        <button 
          class="p-1 ml-2 border-2 border-t-gray-500 border-r-gray-500 rotate-45 border-l-transparent border-b-transparent"
          type="button"
          :disabled="disabledButtons.next"
          @click="nextPage"
        />
      </li>

      <li 
        class="flex justify-center items-center"
        :class="currentPage === totalPages ? 'cursor-default' : 'cursor-pointer'"
        @click="onLastPage"
      >
        <button class="p-1 ml-2 border-2 border-t-gray-500 border-r-gray-500 rotate-45 border-l-transparent border-b-transparent" />
        <button class="p-1 -ml-2 border-2 border-t-gray-500 border-r-gray-500 rotate-45 border-l-transparent border-b-transparent" />
      </li>
    </ul>

    <div class="flex justify-center items-center ml-6">
      <label 
        class="text-sm font-bold" 
        for="record-count"
      >
        Кол-во записей
      </label>
      <input
        id="record-count"
        v-model="localePerPage"
        class="w-10 ml-2 p-1 pr-0 rounded-[5px] font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        type="number"
        :max="maxPerPage"
        @keydown.enter="changePerPage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type {PaginationData} from './Pagination.types';

export default defineComponent({
  name: 'CustomPagination',

  props: {
    total: {
      type: Number,
      required: true
    },

    currentPage: {
      type: Number,
      required: true
    },

    perPage: {
      type: Number,
      default: 10
    },

    maxPerPage: {
      type: Number,
      default: 100
    }
  },

  data(): PaginationData {
    return {
      localePerPage: 10,
      maxVisibleButtons: 5
    }
  },

  mounted() {
    this.localePerPage = this.perPage;

    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);
  },

  unmounted() {
    window.removeEventListener('resize', this.resizeHandler);
  },

  computed: {
    totalPages(): number {
      return Math.ceil(this.total / this.perPage);
    },

    startPage(): number {
      if (this.currentPage < Math.ceil(this.maxVisibleButtons / 2)) {
        return 1;
      }

      if (this.currentPage > this.totalPages - Math.ceil(this.maxVisibleButtons / 2)) {
        return this.totalPages - this.maxVisibleButtons + 1;
      }

      return this.currentPage - Math.floor(this.maxVisibleButtons / 2);
    },

    endPage(): number {
      return Math.min(this.startPage + this.maxVisibleButtons, this.totalPages + 1);
    },

    availablePages(): number[] {
      const pages: number[] = [];

      for (let i = this.startPage; i < this.endPage; i++) {
        pages.push(i);
      }

      return pages;
    },

    disabledButtons() {
      return {
        prev: this.currentPage === 1,
        next: this.currentPage === this.totalPages
      }
    }
  },

  methods: {
    onClickPage(page: number) {
      this.$emit('paginate', page);
    },

    nextPage() {
      this.$emit('paginate', this.currentPage + 1);
    },

    prevPage() {
      this.$emit('paginate', this.currentPage - 1);
    },

    onFirstPage() {
      this.$emit('paginate', 1);
    },

    onLastPage() {
      this.$emit('paginate', this.totalPages);
    },

    changePerPage() {
      if (this.localePerPage > 100) {
        this.localePerPage = 100;
      }
      
      this.$emit('perPage', this.localePerPage);
    },

    resizeHandler() {
      if (window.innerWidth > 545) {
        this.maxVisibleButtons = 5;
        return;
      }

      this.maxVisibleButtons = 3;
    }
  }
})
</script>