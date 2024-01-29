<template>
  <div class="wrapper">
    <div class="mb-5 flex justify-end">
      <SunSVG 
        v-if="isDarkTheme"
        class="size-12 cursor-pointer"
        @click="toggleTheme"
      />
      <MoonSVG
        v-else
        class="size-12 cursor-pointer"
        @click="toggleTheme"
      />
    </div>

    <BaseInput 
      :value="message"
      placeholder="Введите названия или описание репозиториев"
      @changeValue="inputHandler"
    />

    <h1 class="mt-10 text-center text-2xl font-bold dark:text-white">
      Репозитории из GitHub
    </h1>

    <template v-if="message.length">
      <Pagination
        class="mt-7"
        v-if="repositories.total_count"
        :total="repositories.total_count"
        :current-page="page"
        :per-page="perPage"
        @paginate="paginate"
        @perPage="changePerPage"
      />

      <div 
        v-if="isLoading"
        class="mt-10"
      >
        <Spinner class="mx-auto" />
      </div>
      
      <template v-else>
        <RepositoryCard
          v-for="rep in repositories.items"
          :key="rep.id"
          :name="rep.name"
          :description="rep.description"
          :language="rep.language"
          :stargazers-count="rep.stargazers_count"
          :owner="rep.owner"
          :git-url="rep.git_url"
        />
      </template>

      <Pagination
        v-if="repositories.total_count && perPage > 18 && !isLoading"
        class="mt-7"
        :total="repositories.total_count" 
        :current-page="page" 
        :per-page="perPage"
        @paginate="paginate"
        @perPage="changePerPage"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {githubApi} from '@/services/github.api';
import type {Repositories, ComponentData} from './App.types';

import BaseInput from '@/components/BaseInput/BaseInput.vue';
import RepositoryCard from '@/components/RepositoryCard/RepositoryCard.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import Spinner from '@/components/Spinner/Spinner.vue'

import SunSVG from '@/assets/icons/sun.svg?component';
import MoonSVG from '@/assets/icons/moon.svg?component';

export default defineComponent({
  name: 'App',

  components: {
    BaseInput, 
    RepositoryCard, 
    Pagination, 
    Spinner,
    SunSVG,
    MoonSVG
  },

  data(): ComponentData {
    return {
      message: '',
      page: 1,
      perPage: 30,
      isLoading: false,
      isDarkTheme: false,
      repositories: {
        total_count: 0,
        items: []
      }
    }
  },

  mounted() {
    const searchParams = new URLSearchParams(window.location.search);
    
    const message = searchParams.get('q');
    const page = searchParams.get('page');
    const perPage = searchParams.get('per_page');

    if (perPage && +perPage > 0 && +perPage <= 100 && Number.isInteger(+perPage)) {
      this.perPage = +perPage;
    }

    if (page && +page > 0 && Number.isInteger(+page)) {
      this.page = +page;
    }

    if (message && message.length) {
      this.message = message;
      this.fetchRepositories();
    }
  },

  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      document.documentElement.classList.toggle('dark');
    },

    async fetchRepositories() {
      this.isLoading = true;

      const response = await githubApi<Repositories | void>({
        q: this.message,
        per_page: this.perPage, 
        page: this.page
      })

      if (response) {
        this.repositories.total_count = Math.min(response.total_count, 1000); // GitHub дает взять только первые 1000 записей
        this.repositories.items = response.items;
      }

      this.isLoading = false;
    },

    inputHandler(value: string) {
      this.message = value;
      this.resetRepositories();

      if (value.length) {
        const url = new URL(location.href);
        url.searchParams.set('q', value);
        url.searchParams.set('page', `${this.page}`);
        history.replaceState(null, '', url);

        this.fetchRepositories();
      }
    },

    paginate(page: number) {
      this.page = page;

      const url = new URL(location.href);
      url.searchParams.set('page', `${this.page}`);
      history.replaceState(null, '', url);

      this.fetchRepositories();
    },

    changePerPage(perPage: number) {
      this.resetRepositories();
      this.perPage = perPage;

      const url = new URL(location.href);
      url.searchParams.set('per_page', `${this.perPage}`);
      url.searchParams.set('page', `${this.page}`);
      history.replaceState(null, '', url);

      this.fetchRepositories();
    },

    resetRepositories() {
      this.page = 1;
      this.repositories.total_count = 0;
      this.repositories.items = [];
    }
  }
})
</script>