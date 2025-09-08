<template>
    <div>
      <button v-if="!user" @click="login">Sign in with Google</button>
      <div v-else class="user">
        <img :src="user.photoURL" :alt="user.displayName" width="32" height="32"/>
        <span>{{ user.displayName || user.email }}</span>
        <button @click="logout">Sign out</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuth } from '../composables/useAuth';
  const { user, signInWithGoogle, signOut } = useAuth();
  
  function login() { signInWithGoogle().catch(e => alert(e.message)); }
  function logout() { signOut().catch(e => alert(e.message)); }
  </script>
  