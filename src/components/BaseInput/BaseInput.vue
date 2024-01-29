<template>
	<div>
		<input
			class="w-full outline-0 transition-all border focus:border-2 focus:border-yellow-900 rounded-[5px] px-3 py-2.5 text-lg font-bold drop-shadow-lg"
			type="text"
			:value="value"
			:placeholder="placeholder"
			@input="$emit('changeValue', ($event.target as HTMLInputElement).value)"
		/>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
	name: 'BaseInput',

	props: {
		value: {
			type: String,
			required: true
		},

		placeholder: {
			type: String,
			default: 'placeholder'
		}
	}
})
</script>