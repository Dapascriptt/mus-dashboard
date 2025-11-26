<template>
  <div class="p-4 text-white">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Edit Customer</h1>
      <router-link to="/customers">
        <el-button>Back to List</el-button>
      </router-link>
    </div>

    <!-- Loading & Error -->
    <div v-if="loading" class="text-slate-300 text-sm mb-2">
      Loading customer...
    </div>
    <div v-if="error" class="text-red-400 text-sm mb-2">
      {{ error }}
    </div>

    <!-- Form -->
    <div v-if="!loading" class="max-w-xl">
      <BaseForm
        title="Customer Information"
        subtitle="Perbarui data customer di bawah ini."
        :schema="formSchema"
        :model="form"
        :loading="saving"
        submit-label="Update"
        @submit="handleSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import BaseForm from "../components/BaseForm.vue";
import {
  getCustomerById,
  updateCustomer,
} from "../services/customerService"; // samakan dengan nama file-mu

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const error = ref("");

// model form
const form = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
});

// schema untuk BaseForm
const formSchema = [
  {
    label: "Name",
    prop: "name",
    type: "text",
    placeholder: "Nama customer",
    required: true,
  },
  {
    label: "Email",
    prop: "email",
    type: "text",
    placeholder: "email@example.com",
  },
  {
    label: "Phone",
    prop: "phone",
    type: "text",
    placeholder: "08xxxxxxxxxx",
  },
  {
    label: "Address",
    prop: "address",
    type: "textarea",
    rows: 2,
    placeholder: "Alamat lengkap",
  },
  {
    label: "Notes",
    prop: "notes",
    type: "textarea",
    rows: 2,
    placeholder: "Catatan tambahan (opsional)",
  },
];

const fetchCustomer = async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await getCustomerById(route.params.id);
    const data = res.data || {};

    form.value = {
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      notes: data.notes || "",
    };
  } catch (err) {
    console.error(err);
    error.value = "Gagal mengambil data customer";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCustomer);

const goBack = () => {
  router.push("/customers");
};

const handleSubmit = async () => {
  if (!form.value.name) {
    ElMessage.error("Nama wajib diisi");
    return;
  }

  try {
    saving.value = true;
    await updateCustomer(route.params.id, form.value);
    ElMessage.success("Customer berhasil diupdate!");
    router.push("/customers");
  } catch (err) {
    console.error(err);
    ElMessage.error("Gagal mengupdate customer!");
  } finally {
    saving.value = false;
  }
};
</script>
