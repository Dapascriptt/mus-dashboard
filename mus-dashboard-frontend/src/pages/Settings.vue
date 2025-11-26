<template>
  <div class="space-y-6 text-white">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold mb-1">Account Settings</h1>
      <p class="text-xs text-slate-400">
        Kelola informasi akun Anda.
      </p>
    </div>

    <!-- User Info Card -->
    <section
      class="bg-slate-900/70 border border-slate-800 rounded-2xl px-6 py-5 space-y-4"
    >
      <h2 class="text-lg font-semibold">User Information</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Username (read only) -->
        <div>
          <label class="block text-xs text-slate-400 mb-1">Username</label>
          <input
            :value="profileForm.username"
            disabled
            class="w-full px-3 py-2 rounded-md bg-slate-800/80 border border-slate-700
                   text-sm text-slate-300 cursor-not-allowed"
          />
        </div>

        <!-- Name (editable) -->
        <div>
          <label class="block text-xs text-slate-400 mb-1">Name</label>
          <input
            v-model="profileForm.name"
            class="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700
                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nama lengkap"
          />
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          @click="handleSaveProfile"
          class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700
                 text-sm font-semibold transition-colors"
        >
          Save Changes
        </button>
      </div>
    </section>

    <!-- Change Password Card -->
    <section
      class="bg-slate-900/70 border border-slate-800 rounded-2xl px-6 py-5 space-y-4"
    >
      <h2 class="text-lg font-semibold">Change Password</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-slate-400 mb-1">New Password</label>
          <input
            type="password"
            v-model="passwordForm.newPassword"
            class="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700
                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Minimal 6 karakter"
          />
        </div>

        <div>
          <label class="block text-xs text-slate-400 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            v-model="passwordForm.confirmPassword"
            class="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700
                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ulangi password baru"
          />
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          @click="handleUpdatePassword"
          class="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700
                 text-sm font-semibold transition-colors"
        >
          Update Password
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

// --- FORM STATE ---
const profileForm = reactive({
  id: authStore.user?._id || null,
  username: authStore.user?.username || "",
  name: authStore.user?.name || "",
});

const passwordForm = reactive({
  newPassword: "",
  confirmPassword: "",
});

// --- HANDLERS ---

// update nama saja
const handleSaveProfile = async () => {
  if (!profileForm.id) {
    ElMessage.error("User tidak ditemukan di client.");
    return;
  }

  try {
    const res = await axios.put(
      "http://localhost:5000/api/auth/update-profile",
      {
        id: profileForm.id,
        name: profileForm.name,
      }
    );

    // update store + localStorage
    authStore.user = res.data;
    localStorage.setItem("user", JSON.stringify(authStore.user));

    ElMessage.success("Profil berhasil diperbarui.");
  } catch (err) {
    console.error(err);
    ElMessage.error(
      err.response?.data?.message || "Gagal memperbarui profil."
    );
  }
};

// update password
const handleUpdatePassword = async () => {
  if (!profileForm.id) {
    ElMessage.error("User tidak ditemukan di client.");
    return;
  }

  if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
    ElMessage.warning("Password baru dan konfirmasi wajib diisi.");
    return;
  }

  if (passwordForm.newPassword.length < 6) {
    ElMessage.warning("Password minimal 6 karakter.");
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error("Konfirmasi password tidak sama.");
    return;
  }

  try {
    await axios.put("http://localhost:5000/api/auth/update-password", {
      id: profileForm.id,
      newPassword: passwordForm.newPassword,
    });

    // kosongkan field
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";

    ElMessage.success("Password berhasil diperbarui.");
  } catch (err) {
    console.error(err);
    ElMessage.error(
      err.response?.data?.message || "Gagal memperbarui password."
    );
  }
};
</script>
