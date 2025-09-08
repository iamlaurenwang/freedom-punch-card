<template>
    <div v-if="user">
      <h3>離職集點卡</h3>
      <div>總點數：{{ points.length }}</div>
  
      <form @submit.prevent="submit">
        <textarea v-model="reason" placeholder="寫下這次不開心的原因 (選填)"></textarea>
        <button type="submit">+1</button>
      </form>
  
      <ul>
        <li v-for="p in points" :key="p.id">
          <div>{{ p.reason || '（未填原因）' }}</div>
          <small>{{ formatDate(p.createdAt) }}</small>
        </li>
      </ul>
    </div>
  
    <div v-else>
      <p>請先登入觀看你的集點卡</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onUnmounted } from 'vue';
  import { useAuth } from '../composables/useAuth';
  import { addPoint, subscribeToUserPoints } from '../firebase';
  import { serverTimestamp } from 'firebase/firestore';
  
  const { user } = useAuth();
  const points = ref([]);
  const reason = ref('');
  
  let unsubscribe = null;
  
  function formatDate(ts) {
    if (!ts || !ts.toDate) return '';
    return ts.toDate().toLocaleString();
  }
  
  watchEffect((onInvalidate) => {
    if (user.value) {
      unsubscribe = subscribeToUserPoints(user.value.uid, (items) => {
        points.value = items;
      });
      onInvalidate(() => {
        if (unsubscribe) unsubscribe();
      });
    } else {
      points.value = [];
      if (unsubscribe) { unsubscribe(); unsubscribe = null; }
    }
  });
  
  async function submit() {
    if (!user.value) return alert('請先登入');
    try {
      await addPoint(user.value.uid, reason.value.trim());
      reason.value = '';
    } catch (e) {
      alert(e.message);
    }
  }
  </script>
  