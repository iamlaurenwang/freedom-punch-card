<script setup lang="ts">
import type { AppUser } from '@/types/user'

const user = defineModel<AppUser | null>('model', {
  type: Object as () => AppUser | null,
  default: null,
})

defineEmits(['sign-in', 'sign-out'])
</script>
<template>
  <div class="relative isolate flex justify-end items-center gap-x-6 overflow-hidden bg-white px-6 py-2.5 h-14">
    <div
      v-if="user === null"
      class="flex-initial rounded-full bg-decor-orange px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      @click="$emit('sign-in')"
    >
      Sign In
    </div>

    <span v-else class="flex justify-center items-center gap-x-6">
      <div
        class="flex-initial rounded-full bg-decor-blue px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        @click="$emit('sign-out')"
      >
        Sign Out
      </div>

      <div class="flex items-center gap-x-3">
        <img :src="user?.photoURL" class="size-12 rounded-full outline-1 -outline-offset-1 outline-black/5" />
      </div>
    </span>
  </div>
</template>
