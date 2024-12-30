<script setup lang="ts">
import { useCatalogTable, type Props } from "./composable";
import ReservationModalC from "./reservation-modal.vue";
import "@coreui/coreui-pro/dist/css/coreui.min.css";

const props = defineProps<Props>();

const catalog = useCatalogTable(props);
</script>

<template>
  <UTable
    :columns="catalog.columns"
    :rows="catalog.rows.value"
    :loading="catalog.loading.value"
  >
    <template #id-header="{ column }">
      <span class="text-white">{{ column.label }}</span>
    </template>
    <template #title-header="{ column }">
      <span class="text-white">{{ column.label }}</span>
    </template>
    <template #pages-header="{ column }">
      <span class="text-white">{{ column.label }}</span>
    </template>
    <template #author-header="{ column }">
      <span class="text-white">{{ column.label }}</span>
    </template>
    <template #category-header="{ column }">
      <span class="text-white">{{ column.label }}</span>
    </template>
    <template #subcategory-header="{ column }">
      <span class="text-white">{{ column.label }}</span>
    </template>
    <template #actions-header="{ column }">
      <span class="text-white">{{ column.label }}</span>
    </template>

    <template #empty-state>
      <div class="flex flex-col items-center justify-center py-6 gap-3">
        <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8" />
        <span class="text-white">No hay resultados</span>
      </div>
    </template>

    <template #loading-state>
      <div class="flex flex-col items-center justify-center py-6 gap-3">
        <UIcon name="i-mdi-light-refresh" class="w-8 h-8 animate-spin" />
        <span class="text-white">Cargando...</span>
      </div>
    </template>

    <template #id-data="{ row }">
      <span class="text-white text-left">{{ row.id }}</span>
    </template>
    <template #title-data="{ row }">
      <span class="text-white text-left">{{ row.title }}</span>
    </template>
    <template #pages-data="{ row }">
      <span class="text-white text-left">{{ row.pages }}</span>
    </template>
    <template #author-data="{ row }">
      <span class="text-white text-left">
        {{ row.authors[0].name || "Desconocido" }}
      </span>
    </template>
    <template #category-data="{ row }">
      <span class="text-white text-left">{{ row.category }}</span>
    </template>
    <template #subcategory-data="{ row }">
      <span class="text-white text-left">{{ row.subcategory }}</span>
    </template>

    <template #actions-data="{ row }">
      <UDropdown :items="catalog.items(row)">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-ellipsis-horizontal-20-solid"
        />

        <template #item="{ item }">
          <span class="truncate text-black">{{ item.label }}</span>

          <UIcon
            :name="item.icon"
            class="flex-shrink-0 h-4 w-4 text-black dark:text-gray-500 ms-auto"
          />
        </template>
      </UDropdown>
    </template>
  </UTable>

  <UModal v-model="catalog.reservationModal.value">
    <ReservationModalC
      :selectedItem="catalog.selectedItem.value"
      :reservationButtonLoading="catalog.reservationButtonLoading.value"
      :isValidData="catalog.isValidData.value"
      @handleReservation="catalog.handleReservation"
      @close="catalog.reservationModal.value = !catalog.reservationModal.value"
    >
      <USelect
        :loading="catalog.copiesLoading.value"
        v-model="catalog.selectedCopy.value"
        :options="catalog.copies.value"
        option-attribute="name"
        placeholder="Seleccione una copia"
      />
    </ReservationModalC>
  </UModal>
</template>

<style scoped lang="sass"></style>
