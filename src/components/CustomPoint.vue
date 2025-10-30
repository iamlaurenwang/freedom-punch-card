<script setup>
import { ref } from 'vue'
import IconCheck from './icons/IconCheck.vue'

const isClicked = ref(false)
</script>
<template>
  <div class="border-3 rounded-full border-dashed aspect-square text-center p-1 w-[150px] cursor-pointer" @click="isClicked = !isClicked">
    <IconCheck v-show="isClicked"></IconCheck>
  </div>
</template>
