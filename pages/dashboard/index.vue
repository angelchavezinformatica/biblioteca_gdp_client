<script setup lang="ts">
import axios from "axios";
import { BACKEND_SERVER } from "~/config/api";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import { type PaginatedI, type BookI } from "~/types";

const { data } = useAuthStore();
// const toast = useToast();
const paginatedBooks = ref<PaginatedI<BookI>>();
const isNotAuthorized = ref(false);
const url = ref(`${BACKEND_SERVER}/book`);

const fetchBooks = async (page: number, limit: number) => {
  try {
    const response = await axios.get(
      `${url.value}?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${data}` },
      }
    );

    if (response.status === 200) paginatedBooks.value = response.data;
  } catch {
    isNotAuthorized.value = true;
  }
};

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Título" },
  { key: "pages", label: "Páginas" },
  { key: "author", label: "Autor" },
  { key: "category", label: "Categoría" },
  { key: "subcategory", label: "Subcategoría" },
  { key: "actions", label: "Acciones" },
];

const items = (row: BookI) => [
  [
    {
      label: "Reservar",
      icon: "i-mdi-edit",
      click: () => handleReservateSelectRow(row),
    },
  ],
];

// Pagination

const currentPage = ref(1);
const limitPerPage = ref<string>("10");

callOnce(() => fetchBooks(currentPage.value, Number(limitPerPage.value)));

watch(currentPage, async (newCurrentPage) => {
  await fetchBooks(newCurrentPage, Number(limitPerPage.value));
});

watch(limitPerPage, async () => {
  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchBooks(currentPage.value, Number(limitPerPage.value));
});

const selectedFilter = ref<string>("Todo");
const filters = ["Todo", "Titulo", "Autor", "Categoría", "Subcategoría"];

const searchInput = ref("");

const handleFilter = async () => {
  if (selectedFilter.value === "Todo") {
    url.value = `${BACKEND_SERVER}/user/book`;
  } else if (selectedFilter.value === "Titulo") {
    url.value = `${BACKEND_SERVER}/search/books-by-title/${searchInput.value}`;
  } else if (selectedFilter.value === "Autor") {
    url.value = `${BACKEND_SERVER}/search/books-by-author/${searchInput.value}`;
  } else if (selectedFilter.value === "Categoría") {
    url.value = `${BACKEND_SERVER}/search/books-by-category/${searchInput.value}`;
  } else if (selectedFilter.value === "Subcategoría") {
    url.value = `${BACKEND_SERVER}/search/books-by-subcategory/${searchInput.value}`;
  }

  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchBooks(currentPage.value, Number(limitPerPage.value));
};

// Reservation modal

const showReservationModal = ref(false);
const bookToEdit = ref<BookI>();
// const reservationFormData = ref();

const handleReservateSelectRow = (row: BookI) => {
  showReservationModal.value = true;
  bookToEdit.value = row;

  // TODO: Reset form data
};

// const handleAcceptReservation = async () => {};
</script>

<template>
  <NotAuthorized v-if="isNotAuthorized" path="/dashboard" />
  <DashboardContainer v-else>
    <template #title>Bienvenido</template>
    <template #description>
      ¡Bienvenido! Explora y reserva tus libros favoritos
    </template>
    <template #title-table>Catálogo de Libros</template>

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

    <UTable
      :loading="paginatedBooks === undefined || !paginatedBooks.data"
      :columns="columns"
      :rows="paginatedBooks?.data"
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
    <template #total-pages>{{ paginatedBooks?.lastPage }}</template>

    <template #pagination v-if="paginatedBooks">
      <UPagination
        v-model="currentPage"
        :page-count="Number(limitPerPage)"
        :total="paginatedBooks.total"
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

    <template #modals>
      <!-- <UModal v-if="showReservationModal" @handle-accept="handleAcceptReservation">

      </UModal> -->
    </template>
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
