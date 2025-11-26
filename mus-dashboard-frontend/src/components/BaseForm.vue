<!-- src/components/BaseForm.vue -->
<template>
  <div class="bg-slate-900/40 border border-slate-700/60 rounded-xl p-5">
    <div v-if="title" class="mb-4">
      <h2 class="text-sm font-semibold text-slate-100">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-xs text-slate-400 mt-1">
        {{ subtitle }}
      </p>
    </div>

    <el-form
      :model="model"
      :label-position="labelPosition"
      :label-width="labelWidth"
      class="grid gap-4"
    >
      <div
        v-for="field in schema"
        :key="field.prop"
        class="w-full"
        :class="field.wrapperClass"
      >
        <el-form-item :label="field.label" :prop="field.prop">
          <!-- text -->
          <el-input
            v-if="field.type === 'text'"
            v-model="model[field.prop]"
            :placeholder="field.placeholder"
            clearable
          />

          <!-- textarea -->
          <el-input
            v-else-if="field.type === 'textarea'"
            v-model="model[field.prop]"
            type="textarea"
            :rows="field.rows || 3"
            :placeholder="field.placeholder"
            clearable
          />

          <!-- number -->
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="model[field.prop]"
            :min="field.min ?? 0"
            :max="field.max"
            :controls="field.controls ?? true"
            class="w-full"
          />

          <!-- select -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="model[field.prop]"
            :placeholder="field.placeholder"
            class="w-full"
            clearable
          >
            <el-option
              v-for="opt in field.options || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <!-- date -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="model[field.prop]"
            type="date"
            :placeholder="field.placeholder"
            class="w-full"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />

          <!-- fallback / slot custom -->
          <slot
            v-else
            :name="field.prop"
            :model="model"
            :field="field"
          >
            <el-input
              v-model="model[field.prop]"
              :placeholder="field.placeholder"
              clearable
            />
          </slot>
        </el-form-item>
      </div>
    </el-form>

    <div class="mt-4 flex items-center justify-end gap-2">
      <slot name="actions">
        <el-button @click="$emit('cancel')" plain>
          Cancel
        </el-button>
        <el-button type="primary" :loading="loading" @click="$emit('submit')">
          {{ submitLabel }}
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  schema: {
    type: Array,
    required: true
  },
  model: {
    type: Object,
    required: true
  },
  labelPosition: {
    type: String,
    default: 'top'
  },
  labelWidth: {
    type: String,
    default: '120px'
  },
  submitLabel: {
    type: String,
    default: 'Save'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['submit', 'cancel'])
</script>
