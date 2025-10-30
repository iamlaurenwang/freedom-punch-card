<script setup lang="ts">
import CustomPoint from './components/CustomPoint.vue'
</script>

<template>
  <div class="flex flex-col gap-12 h-screen items-center justify-center">
    <span class="text-center text-7xl font-semibold text-gray-900 italic"
      >Redeem your
      <span class="relative">
        <span class="absolute -inset-1 block -skew-y-e bg-pink-500" aria-hidden="true"></span>
        <span class="relative text-white">FREEDOM</span>
      </span>
      today!</span
    >
    <div class="shadow-xl aspect-video w-1/2 bg-white rounded-xl p-10">
      <div class="flex flex-wrap gap-6 justify-center items-center h-full">
        <CustomPoint v-for="point in 10" :key="point"></CustomPoint>
      </div>
    </div>
  </div>
</template>
