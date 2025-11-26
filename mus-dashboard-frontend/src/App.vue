<template>
  <!-- LAYOUT AUTH (TANPA SIDEBAR) -->
  <div
    v-if="isAuthRoute"
    class="min-h-screen bg-slate-950 flex items-center justify-center"
  >
    <RouterView />
  </div>

  <!-- LAYOUT UTAMA -->
  <div v-else class="min-h-screen flex bg-slate-950 text-slate-100">
    <!-- SIDEBAR -->
    <aside
      :class="[
        'bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-200',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      ]"
    >
      <!-- TOP BAR + HAMBURGER -->
      <div
        class="flex items-center justify-between px-3 py-4 border-b border-slate-800 min-w-[64px]"
      >
        <span
          class="font-semibold tracking-wide truncate"
          :class="isSidebarCollapsed ? 'text-sm ml-1' : 'text-lg'"
        >
          {{ isSidebarCollapsed ? 'MS' : 'Mus Store' }}
        </span>

        <button
          @click="toggleSidebar"
          class="p-1.5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center"
        >
          <span class="flex flex-col gap-[3px]">
            <span class="block w-4 h-0.5 bg-slate-200 rounded"></span>
            <span class="block w-4 h-0.5 bg-slate-200 rounded"></span>
            <span class="block w-4 h-0.5 bg-slate-200 rounded"></span>
          </span>
        </button>
      </div>

      <!-- MENU -->
      <nav class="flex-1 px-2 py-4 space-y-1 text-sm">
        <RouterLink
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 rounded-lg py-2 transition-colors"
          :class="[
            isSidebarCollapsed ? 'justify-center px-0' : 'justify-start px-3',
            'hover:bg-slate-800/80'
          ]"
          active-class="bg-slate-800 text-white"
        >
          <!-- ICON -->
          <span class="w-5 h-5 flex items-center justify-center text-slate-300">
            <!-- Dashboard -->
            <svg
              v-if="item.label === 'Dashboard'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-5H3zM13 3v5h8V3z" />
            </svg>

            <!-- Products -->
            <svg
              v-else-if="item.label === 'Products'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 7.5 12 3l9 4.5-9 4.5L3 7.5z" />
              <path d="M3 7.5v9L12 21l9-4.5v-9" />
              <path d="M12 12v9" />
            </svg>

            <!-- Orders -->
            <svg
              v-else-if="item.label === 'Orders'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M7 3h10l2 3v15l-3-2-3 2-3-2-3 2V6z" />
              <path d="M9 9h6M9 13h4" />
            </svg>

            <!-- Customers -->
            <svg
              v-else-if="item.label === 'Customers'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M8 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm8 0a3 3 0 1 0-3-3" />
              <path d="M2 21a6 6 0 0 1 12 0M14 18a4 4 0 0 1 8 3" />
            </svg>

            <!-- Analytics -->
            <svg
              v-else-if="item.label === 'Analytics'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M7 14l4-5 4 3 4-7" />
            </svg>

            <!-- Settings -->
            <svg
              v-else-if="item.label === 'Settings'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15 1.65 1.65 0 0 0 2 14v-.09a2 2 0 1 1 0-3.82V10a1.65 1.65 0 0 0 1.6-1"
              />
            </svg>

            <!-- fallback -->
            <span v-else class="w-2 h-2 rounded-full bg-slate-400"></span>
          </span>

          <!-- LABEL (hilang saat collapse) -->
          <span v-if="!isSidebarCollapsed">
            {{ item.label }}
          </span>
        </RouterLink>
      </nav>
    </aside>

    <!-- MAIN -->
    <div class="flex-1 flex flex-col bg-gradient-to-b from-slate-900 to-slate-950">
      <header
        class="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/80 backdrop-blur"
      >
        <h1 class="text-lg font-semibold tracking-wide">Admin Dashboard</h1>

        <div class="flex items-center gap-4">
          <span class="text-sm text-slate-300">
            Hi, {{ authStore.user?.username || "" }}
          </span>

          <button
            @click="onLogout"
            class="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-xs font-medium tracking-wide transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main class="flex-1 p-4 lg:p-6 overflow-y-auto">
        <div class="max-w-6xl mx-auto">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./stores/authStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const authRoutes = ["Login"];
const isAuthRoute = computed(() => authRoutes.includes(route.name));

const isSidebarCollapsed = ref(false);
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const menu = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/products", label: "Products" },
  { path: "/orders", label: "Orders" },
  { path: "/customers", label: "Customers" },
  { path: "/analytics", label: "Analytics" },
  { path: "/settings", label: "Settings" },
];

const onLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
