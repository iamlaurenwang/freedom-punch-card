<script setup lang="ts">
// type Card = {
//     title: string
//     description: string
//     datetime: string
//     status: any
// }

const emit = defineEmits(['delete', 'select'])
</script>
<template>
  <span class="aspect-3/2 w-[250px] rounded-xl shadow text-text-primary bg-white">
    <div class="border-b-1 border-gray-400 w-full px-6 py-2 h-2/3 grid grid-cols-[3fr_1fr] grid-rows-3 gap-1">
      <div class="text-lg font-semibold truncate">this is a test hello</div>
      <div class="row-span-3 border-0.5 justify-self-center text-center" style="border-radius: 50%; width: 30px; height: 30px">🪄</div>
      <div class="text-sm truncate">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis vitae nam consequuntur eaque adipisci nostrum laborum nulla sapiente quisquam magni aliquid excepturi non recusandae itaque exercitationem officiis voluptate, magnam voluptatibus.</div>
      <div class="text-sm text-gray-400 italic truncate">datetime</div>
    </div>
    <div class="flex border-gray-400 divide-x-1 w-full h-1/3">
      <div class="flex-1 flex items-center justify-center cursor-pointer" @click="emit('delete')"><span>Delete</span></div>
      <div class="flex-1 flex items-center justify-center cursor-pointer" @click="emit('select')"><span>Select</span></div>
    </div>
  </span>
</template>
