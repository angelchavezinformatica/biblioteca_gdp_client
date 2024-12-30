<script setup lang="ts">
import axios from "axios";
import { BACKEND_SERVER } from "~/config/api";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import type { PaginatedI, AllDataUserI } from "~/types";

const { data } = useAuthStore();
const paginatedUsers = ref<PaginatedI<AllDataUserI>>();
const isNotAuthorized = ref(false);

const fetchUsers = async (page: number, limit: number) => {
  try {
    const response = await axios.get(
      `${BACKEND_SERVER}/user/all?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${data}` },
      }
    );

    if (response.status === 200) paginatedUsers.value = response.data;
  } catch {
    isNotAuthorized.value = true;
  }
};

const columns = [
  { key: "id", label: "ID" },
  { key: "dni", label: "DNI" },
  { key: "names", label: "Nombres" },
  { key: "lastName", label: "Apellidos" },
  { key: "phoneNumber", label: "Celular" },
  { key: "role", label: "Rol" },
  { key: "email", label: "Correo" },
  { key: "emailVerified", label: "Verificado" },
  { key: "isDisabled", label: "Habilitado" },
  { key: "actions", label: "Acciones" },
];

const handleSelectRow = (row: AllDataUserI) => {};

const items = (row: AllDataUserI) => [
  [
    {
      label: "Editar",
      icon: "i-mdi-edit",
      click: () => handleSelectRow(row),
    },
  ],
];

// Pagination

const currentPage = ref(1);
const limitPerPage = ref<string>("10");

callOnce(() => fetchUsers(currentPage.value, Number(limitPerPage.value)));

watch(currentPage, async (newCurrentPage) => {
  await fetchUsers(newCurrentPage, Number(limitPerPage.value));
});

watch(limitPerPage, async () => {
  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchUsers(currentPage.value, Number(limitPerPage.value));
});
</script>

<template>
  <NotAuthorized v-if="isNotAuthorized" path="/dashboard" />
  <DashboardContainer v-else>
    <template #title>Usuarios</template>
    <template #description> Administra tus usuarios </template>
    <template #title-table>Usuarios</template>

    <UTable
      :loading="paginatedUsers === undefined || !paginatedUsers.data"
      :columns="columns"
      :rows="paginatedUsers?.data"
    >
      <template #id-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #dni-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #names-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #lastName-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #phoneNumber-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #role-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #email-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #emailVerified-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #isDisabled-header="{ column }">
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
      <template #dni-data="{ row }">
        <span class="text-white text-left">{{ row.dni }}</span>
      </template>
      <template #names-data="{ row }">
        <span class="text-white text-left">{{ row.names }}</span>
      </template>
      <template #lastName-data="{ row }">
        <span class="text-white text-left">{{ row.lastName }}</span>
      </template>
      <template #phoneNumber-data="{ row }">
        <span class="text-white text-left">{{ row.phoneNumber }}</span>
      </template>
      <template #role-data="{ row }">
        <span class="text-white text-left">{{
          row.role === "ADMIN"
            ? "ADMINISTRADOR"
            : row.role === "LIBRARIAN"
            ? "BIBLIOTECARIO"
            : "LECTOR"
        }}</span>
      </template>
      <template #email-data="{ row }">
        <span class="text-white text-left">{{ row.email }}</span>
      </template>
      <template #emailVerified-data="{ row }">
        <span class="text-white text-left">{{
          row.emailVerified ? "✅" : "❌"
        }}</span>
      </template>
      <template #isDisabled-data="{ row }">
        <span class="text-white text-left">{{
          row.isDisabled ? "❌" : "✅"
        }}</span>
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
    <template #total-pages>{{ paginatedUsers?.lastPage }}</template>

    <template #pagination v-if="paginatedUsers">
      <UPagination
        v-model="currentPage"
        :page-count="Number(limitPerPage)"
        :total="paginatedUsers.total"
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
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
