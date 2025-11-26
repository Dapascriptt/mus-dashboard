<template>
  <div class="p-4 text-white">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Add Customer</h1>
      <router-link to="/customers">
        <el-button>Back to List</el-button>
      </router-link>
    </div>

    <!-- Form -->
    <div class="max-w-xl">
      <BaseForm
        title="Customer Information"
        subtitle="Isi data customer baru di bawah ini."
        :schema="formSchema"
        :model="form"
        :loading="saving"
        submit-label="Save"
        @submit="handleSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import BaseForm from "../components/BaseForm.vue";
import { createCustomer } from "../services/CustomerService";

const router = useRouter();
const saving = ref(false);

const form = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
});

// Schema untuk BaseForm
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
    placeholder: "Alamat customer",
  },
  {
    label: "Notes",
    prop: "notes",
    type: "textarea",
    rows: 2,
    placeholder: "Catatan tambahan (opsional)",
  },
];

// Back function
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
    await createCustomer(form.value);
    ElMessage.success("Customer berhasil ditambahkan!");
    router.push("/customers");
  } catch (err) {
    console.error(err);
    ElMessage.error("Gagal menambahkan customer!");
  } finally {
    saving.value = false;
  }
};
</script>
