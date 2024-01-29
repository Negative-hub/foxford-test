<template>
	<div class="w-full bg-white px-6 py-4 mt-8 rounded-[5px] drop-shadow-lg overflow-hidden dark:bg-sky-900">
		<div class="text-center">
			<a 
				class="text-2xl font-bold dark:text-white"
				:href="gitUrl" 
				target="_black"
			>
				{{ name }}
			</a>
		</div>
		<div class="text-center text-gray-400">
			<p>{{ description }}</p>
		</div>

		<div class="flex justify-between items-center mt-6 flex-wrap gap-4">
			<a 
				class="flex-1"
				:href="owner.url" 
				target="_black"
			>
				<div class="flex items-center flex-wrap">
					<img
						class="size-16 rounded-full"
						:src="owner.avatar_url" 
						:alt="owner.login"
					/>

					<div class="ml-2 text-lg font-bold dark:text-white">
						{{ owner.login }}
					</div>
				</div>
			</a>
			<div class="flex flex-col items-end flex-1">
				<span
					v-if="language && language.length"
					class="text-lg dark:text-white"
				>
					Язык программирования: {{ language }}
				</span>
				<span class="text-lg dark:text-white">
					Кол-во ⭐: {{ stargazersCount }}
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type {PropType} from 'vue'
import type {RepositoryOwner} from './RepositoryCard.types';

export default defineComponent({
	name: 'RepositoryName',

	props: {
		name: {
			type: String,
			required: true
		},
		
		description: {
			type: String,
			required: true
		},

		language: {
			type: String,
			required: true
		},

		stargazersCount: {
			type: Number,
			required: true
		},

		owner: {
			type: Object as PropType<RepositoryOwner>,
			required: true
		},

		gitUrl: {
			type: String,
			required: true
		}
	}
})
</script>