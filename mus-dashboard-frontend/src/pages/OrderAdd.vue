<template>
  <div class="p-4 text-white">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Add Order</h1>

      <router-link to="/orders">
        <el-button>Back to Orders</el-button>
      </router-link>
    </div>

    <div class="space-y-4">
      <!-- ORDER INFO (pakai BaseForm) -->
      <BaseForm
        title="Order Information"
        subtitle="Lengkapi informasi order sebelum menambahkan item."
        :schema="orderSchema"
        :model="form"
        :loading="submitting"
        submit-label="Save Order"
        @submit="onSubmit"
        @cancel="goBack"
      >
        <!-- supaya tombolnya dipindah ke bawah (Total Amount), slot ini dikosongkan -->
        <template #actions></template>
      </BaseForm>

      <!-- ITEMS (tabel custom dark) -->
      <div class="bg-slate-900/60 border border-slate-700 rounded-xl p-4 space-y-2">
        <div class="flex items-center justify-between mb-1">
          <h2 class="font-semibold text-sm">Items</h2>
          <p class="text-xs text-slate-400">
            Harga otomatis mengikuti data Product
          </p>
        </div>

        <div class="bg-slate-900/70 border border-slate-800 rounded-xl shadow-md overflow-hidden">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-900/90 border-b border-slate-800">
              <tr class="text-left text-slate-300">
                <th class="px-4 py-3">Product</th>
                <th class="px-4 py-3 w-24">Qty</th>
                <th class="px-4 py-3 w-40">Price</th>
                <th class="px-4 py-3 w-40">Subtotal</th>
                <th class="px-4 py-3 w-24 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in form.items"
                :key="index"
                class="border-b border-slate-800/70 odd:bg-slate-900/40 even:bg-slate-900/20 hover:bg-slate-800/60 transition-colors"
              >
                <!-- PRODUCT -->
                <td class="px-4 py-2 align-middle">
                  <el-select
                    v-model="item.productName"
                    placeholder="Pilih produk"
                    class="w-full"
                    :loading="loadingProducts"
                    @change="() => onProductChange(item)"
                  >
                    <el-option
                      v-for="product in products"
                      :key="product._id"
                      :label="product.name"
                      :value="product.name"
                    />
                  </el-select>
                </td>

                <!-- QTY -->
                <td class="px-4 py-2 align-middle">
                  <el-input-number
                    v-model="item.qty"
                    :min="1"
                    :max="1000"
                  />
                </td>

                <!-- PRICE -->
                <td class="px-4 py-2 align-middle">
                  <el-input
                    v-model.number="item.price"
                    type="number"
                    placeholder="Harga"
                    readonly
                  />
                </td>

                <!-- SUBTOTAL -->
                <td class="px-4 py-2 align-middle">
                  {{ formatPrice((Number(item.price) || 0) * (Number(item.qty) || 0)) }}
                </td>

                <!-- ACTION -->
                <td class="px-4 py-2 align-middle text-right">
                  <el-button
                    type="danger"
                    size="small"
                    @click="removeItem(index)"
                    :disabled="form.items.length === 1"
                  >
                    Hapus
                  </el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <el-button
          type="primary"
          plain
          size="small"
          class="mt-2"
          @click="addItem"
        >
          + Tambah Item
        </el-button>
      </div>

      <!-- Total + Actions -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="text-sm text-slate-400">
          Pastikan item dan harga sudah benar sebelum menyimpan order.
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm text-slate-400">Total Amount</p>
            <p class="text-xl font-semibold">
              {{ formatPrice(totalAmount) }}
            </p>
          </div>

          <div class="flex gap-2">
            <router-link to="/orders">
              <el-button>Cancel</el-button>
            </router-link>

            <el-button
              type="primary"
              :loading="submitting"
              @click="onSubmit"
            >
              Save Order
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useOrderStore } from "../stores/orderStore";
import BaseForm from "../components/BaseForm.vue";
import { getProducts } from "../services/ProductService";

const router = useRouter();
const orderStore = useOrderStore();

// ===== STATE ORDER FORM =====
const form = ref({
  orderNumber: "",
  customerName: "",
  status: "pending",
  items: [
    {
      productName: "",
      qty: 1,
      price: 0,
    },
  ],
});

// Schema untuk BaseForm (order info)
const orderSchema = [
  {
    label: "Order Number",
    prop: "orderNumber",
    type: "text",
    placeholder: "Contoh: ORD-002",
  },
  {
    label: "Customer Name",
    prop: "customerName",
    type: "text",
    placeholder: "Nama customer",
  },
  {
    label: "Status",
    prop: "status",
    type: "select",
    placeholder: "Pilih status",
    options: [
      { label: "pending", value: "pending" },
      { label: "paid", value: "paid" },
      { label: "shipped", value: "shipped" },
      { label: "cancelled", value: "cancelled" },
    ],
  },
];

const submitting = ref(false);

// ===== PRODUCTS UNTUK DROPDOWN =====
const products = ref([]);
const loadingProducts = ref(false);

onMounted(async () => {
  try {
    loadingProducts.value = true;
    const res = await getProducts();
    const data = res.data;
    products.value = Array.isArray(data) ? data : data.data || [];
  } catch (err) {
    console.error(err);
    ElMessage.error("Gagal mengambil data produk");
  } finally {
    loadingProducts.value = false;
  }
});

const goBack = () => {
  router.push("/orders");
};

// Trigger ketika produk dipilih
const onProductChange = (row) => {
  const selected = products.value.find((p) => p.name === row.productName);

  if (selected) {
    row.price = selected.price || 0;
    if (!row.qty || row.qty <= 0) row.qty = 1;
  } else {
    row.price = 0;
  }
};

// Hitung total
const totalAmount = computed(() =>
  form.value.items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return sum + price * qty;
  }, 0)
);

const addItem = () => {
  form.value.items.push({
    productName: "",
    qty: 1,
    price: 0,
  });
};

const removeItem = (index) => {
  if (form.value.items.length === 1) return;
  form.value.items.splice(index, 1);
};

const formatPrice = (value) => {
  return "Rp " + Number(value || 0).toLocaleString("id-ID");
};

const onSubmit = async () => {
  if (!form.value.orderNumber || !form.value.customerName) {
    ElMessage.error("Order number dan customer name wajib diisi");
    return;
  }

  const validItems = form.value.items.filter(
    (i) => i.productName && i.qty > 0 && i.price > 0
  );
  if (!validItems.length) {
    ElMessage.error("Minimal 1 item dengan qty & price > 0");
    return;
  }

  const payload = {
    orderNumber: form.value.orderNumber,
    customerName: form.value.customerName,
    status: form.value.status,
    items: validItems,
    totalAmount: totalAmount.value,
  };

  try {
    submitting.value = true;
    await orderStore.createOrderAction(payload);
    ElMessage.success("Order berhasil dibuat");
    router.push("/orders");
  } catch (err) {
    console.error(err);
    ElMessage.error("Gagal membuat order");
  } finally {
    submitting.value = false;
  }
};
</script>
