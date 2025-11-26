<template>
  <!-- INGAT: App.vue sudah flex-center full screen -->
  <div
    class="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-xl p-8 shadow-xl"
  >
    <h1 class="text-2xl font-bold mb-4">Login</h1>

    <p class="text-slate-400 text-sm mb-6 leading-relaxed">
      Masuk ke <span class="text-slate-100 font-semibold">Mus-Dashboard</span>
      untuk mengelola produk, pesanan, dan customer.
      Silakan gunakan akun yang sudah terdaftar.
    </p>

    <div class="space-y-4">
      <div>
        <label class="block text-sm mb-1 text-slate-200">Username</label>
        <input
          v-model="username"
          class="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                 focus:border-blue-500"
          placeholder="Masukkan username"
        />
      </div>

      <div>
        <label class="block text-sm mb-1 text-slate-200">Password</label>
        <input
          type="password"
          v-model="password"
          class="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                 focus:border-blue-500"
          placeholder="Masukkan password"
        />
      </div>

      <button
        @click="handleLogin"
        :disabled="authStore.loading"
        class="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-700
               disabled:opacity-60 disabled:cursor-not-allowed
               text-sm font-semibold tracking-wide transition-colors"
      >
        <span v-if="authStore.loading">Logging in...</span>
        <span v-else>Login</span>
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";

  const ok = await authStore.login(username.value, password.value);

  if (ok) {
    router.push("/dashboard");
  } else {
    errorMessage.value = "Username atau password salah.";
  }
};
</script>
