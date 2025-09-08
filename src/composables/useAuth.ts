// src/composables/useAuth.js
import { ref } from 'vue';
import { onAuthChange, signInWithGoogle, signOut } from '../firebase';

const user = ref(null);
onAuthChange(u => user.value = u);

export function useAuth() {
  return {
    user,
    signInWithGoogle,
    signOut
  };
}
