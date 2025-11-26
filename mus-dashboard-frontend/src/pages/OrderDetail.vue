<template>
  <div class="p-4 text-white">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Order Detail</h1>

      <router-link to="/orders">
        <el-button>Back to Orders</el-button>
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-slate-300 text-sm">
      Loading order...
    </div>

    <!-- Error / tidak ditemukan -->
    <div v-if="!loading && !currentOrder" class="text-red-400 text-sm">
      {{ error || "Order tidak ditemukan." }}
    </div>

    <!-- Detail order -->
    <div
      v-if="!loading && currentOrder"
      class="space-y-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700"
    >
      <!-- Info utama -->
      <div class="space-y-1 text-sm">
        <p>
          <span class="font-semibold">Order #:</span>
          {{ currentOrder.orderNumber }}
        </p>
        <p>
          <span class="font-semibold">Customer:</span>
          {{ currentOrder.customerName }}
        </p>
        <p>
          <span class="font-semibold">Total:</span>
          Rp {{ currentOrder.totalAmount.toLocaleString("id-ID") }}
        </p>
        <p>
          <span class="font-semibold">Status:</span>
          {{ currentOrder.status }}
        </p>
        <p>
          <span class="font-semibold">Created At:</span>
          {{ formatDate(currentOrder.createdAt) }}
        </p>
      </div>

      <!-- Update status -->
      <div class="space-y-2">
        <h2 class="font-semibold text-sm">Update Status</h2>

        <div class="flex items-center space-x-2">
          <el-select
            v-model="selectedStatus"
            placeholder="Select status"
            class="w-48"
          >
            <el-option label="pending" value="pending" />
            <el-option label="paid" value="paid" />
            <el-option label="shipped" value="shipped" />
            <el-option label="cancelled" value="cancelled" />
          </el-select>

          <el-button type="primary" size="small" @click="onSaveStatus">
            Save
          </el-button>
        </div>
      </div>

      <!-- Items -->
      <div>
        <h2 class="font-semibold text-sm mb-2">Items</h2>

        <div
          class="bg-slate-900/70 border border-slate-800 rounded-xl shadow-md overflow-hidden"
        >
          <table class="min-w-full text-sm">
            <thead class="bg-slate-900/90 border-b border-slate-800">
              <tr class="text-left text-slate-300">
                <th class="px-4 py-3">Product</th>
                <th class="px-4 py-3 w-20">Qty</th>
                <th class="px-4 py-3">Price</th>
                <th class="px-4 py-3">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, i) in currentOrder.items"
                :key="i"
                class="border-b border-slate-800/70 odd:bg-slate-900/40 even:bg-slate-900/20 hover:bg-slate-800/60 transition-colors"
              >
                <td class="px-4 py-2">{{ item.productName }}</td>
                <td class="px-4 py-2">{{ item.qty }}</td>
                <td class="px-4 py-2">
                  {{ formatPrice(item.price) }}
                </td>
                <td class="px-4 py-2">
                  {{ formatPrice((Number(item.price) || 0) * (Number(item.qty) || 0)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useOrderStore } from "../stores/orderStore";
import { ElMessage } from "element-plus";

const route = useRoute();
const orderStore = useOrderStore();
const { currentOrder, loading, error } = storeToRefs(orderStore);

const selectedStatus = ref("pending");
const updating = ref(false);

onMounted(async () => {
  const id = route.params.id;
  await orderStore.fetchOrderById(id);

  if (currentOrder.value) {
    selectedStatus.value = currentOrder.value.status;
  }
});

const onSaveStatus = async () => {
  if (!currentOrder.value) return;

  updating.value = true;
  try {
    await orderStore.changeOrderStatus(
      currentOrder.value._id,
      selectedStatus.value
    );

    ElMessage.success("Status order berhasil diupdate");
  } catch (err) {
    console.error("Gagal update status order:", err);
    ElMessage.error("Gagal mengupdate status order");
  } finally {
    updating.value = false;
  }
};

const formatPrice = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return "Rp " + num.toLocaleString("id-ID");
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  return d.toLocaleString("id-ID");
};
</script>

