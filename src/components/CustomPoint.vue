<script setup lang="ts">
import { ref } from 'vue'
import IconCheck from './icons/IconCheck.vue'

defineProps<{
  data: {
    order: number
    checkedAt?: string | null
    reason?: string
  }
}>()

const isChecked = defineModel('isChecked', { type: Boolean, default: false })
const tooltipDisplay = ref(false)
</script>
<template>
  <div class="border-3 rounded-full border-dashed aspect-square text-center p-1 w-[150px] cursor-pointer relative" @click="isChecked = !isChecked">
    <IconCheck v-show="isChecked" @mouseover="tooltipDisplay = true" @mouseleave="tooltipDisplay = false"></IconCheck>
    <span
      id="tooltip"
      class="absolute -top-15 left-0 bg-decor-blue text-white rounded-xl font-semibold text-nowrap py-1 px-2"
      v-show="tooltipDisplay && isChecked"
      >{{ data.checkedAt }}</span
    >
  </div>
</template>
