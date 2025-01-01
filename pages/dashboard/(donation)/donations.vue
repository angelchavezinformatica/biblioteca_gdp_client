<script setup lang="ts">
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BACKEND_SERVER } from "~/config/api";
import SearchContainer from "~/features/dashboard/components/search-container.vue";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import { type PaginatedI, type DonationsI } from "~/types";

const { data } = useAuthStore();
const toast = useToast();
const paginatedDonations = ref<PaginatedI<DonationsI>>();
const isNotAuthorized = ref(false);
const url = ref(`${BACKEND_SERVER}/donation`);

const fetchDonations = async (page: number, limit: number) => {
  try {
    const response = await axios.get(
      `${url.value}?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${data}` },
      }
    );

    if (response.status === 200) paginatedDonations.value = response.data;
  } catch {
    isNotAuthorized.value = true;
  }
};

const columns = [
  { key: "id", label: "ID" },
  { key: "date", label: "Fecha" },
  { key: "description", label: "Descripción" },
  { key: "donorName", label: "Nombre del donador" },
  { key: "donorEmail", label: "Correo del donador" },
  { key: "actions", label: "Acciones" },
];

const items = (row: DonationsI) => [
  [
    {
      label: "Editar",
      icon: "i-mdi-edit",
      click: () => handleEditSelectRow(row),
    },
  ],
];

// Pagination

const currentPage = ref(1);
const limitPerPage = ref<string>("10");

onMounted(async () => {
  await fetchDonations(currentPage.value, Number(limitPerPage.value));
});

watch(currentPage, async (newCurrentPage) => {
  await fetchDonations(newCurrentPage, Number(limitPerPage.value));
});

watch(limitPerPage, async () => {
  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchDonations(currentPage.value, Number(limitPerPage.value));
});

// Filter

const selectedFilter = ref<string>("Todo");
const filters = ["Todo", "Descripción", "Donador", "Código de copia"];

const searchInput = ref("");

const handleFilter = async () => {
  if (selectedFilter.value === "Todo") {
    url.value = `${BACKEND_SERVER}/donation`;
  } else if (selectedFilter.value === "Descripción") {
    url.value = `${BACKEND_SERVER}/search/donation-by-description/${searchInput.value}`;
  } else if (selectedFilter.value === "Donador") {
    url.value = `${BACKEND_SERVER}/search/donation-by-donor/${searchInput.value}`;
  } else if (selectedFilter.value === "Código de copia") {
    url.value = `${BACKEND_SERVER}/search/donation-by-copycode/${searchInput.value}`;
  }

  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchDonations(currentPage.value, Number(limitPerPage.value));
};

// Edit Modal

const handleEditSelectRow = (row: DonationsI) => {};
</script>

<template>
  <NotAuthorized v-if="isNotAuthorized" path="/dashboard" />
  <DashboardContainer v-else>
    <template #title>Donaciones</template>
    <template #description> Administra las donaciones </template>
    <template #title-table>Lista de donaciones</template>

    <template #search>
      <SearchContainer>
        <template #search-filter>
          <USelectMenu v-model="selectedFilter" :options="filters" />
        </template>
        <template #search-input>
          <UInput
            v-model="searchInput"
            name="filter"
            placeholder="Buscar"
            :disabled="selectedFilter === 'Todo'"
          />
        </template>
        <template #search-reset-filter>
          <Button
            v-show="selectedFilter !== 'Todo' || searchInput !== ''"
            @click="
              selectedFilter = 'Todo';
              searchInput = '';
              handleFilter();
            "
            icon="i-tabler-circle-x-filled"
          >
            Limpiar filtro
          </Button>
        </template>
        <template #search-button>
          <Button
            @click="handleFilter"
            icon="i-heroicons-magnifying-glass"
            :disabled="!searchInput && selectedFilter !== 'Todo'"
          >
            Filtrar
          </Button>
        </template>
      </SearchContainer>
    </template>

    <UTable
      :loading="paginatedDonations === undefined || !paginatedDonations.data"
      :columns="columns"
      :rows="paginatedDonations?.data"
    >
      <template #id-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #date-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #description-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #donorName-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #donorEmail-header="{ column }">
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
      <template #date-data="{ row }">
        <span class="text-white text-left">
          {{ format(new Date(row.date), "dd-MM-yyyy", { locale: es }) }}
        </span>
      </template>
      <template #description-data="{ row }">
        <span class="text-white text-left">{{ row.description }}</span>
      </template>
      <template #donorName-data="{ row }">
        <span class="text-white text-left">{{ row.donor?.name }}</span>
      </template>
      <template #donorEmail-data="{ row }">
        <span class="text-white text-left">{{ row.donor?.email }}</span>
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
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

    <template #current-page>{{ currentPage }}</template>
    <template #total-pages>{{ paginatedDonations?.lastPage }}</template>

    <template #pagination v-if="paginatedDonations">
      <UPagination
        v-model="currentPage"
        :page-count="Number(limitPerPage)"
        :total="paginatedDonations.total"
      >
      </UPagination>
    </template>
    <template #select-limit-per-page>
      <USelect
        v-model="limitPerPage"
        :options="[
          { value: 10, label: 'Mostrar 10' },
          { value: 20, label: 'Mostrar 20' },
          { value: 30, label: 'Mostrar 30' },
          { value: 40, label: 'Mostrar 40' },
          { value: 50, label: 'Mostrar 50' },
        ]"
      ></USelect>
    </template>

    <template #modals></template>
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
