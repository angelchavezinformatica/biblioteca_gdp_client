<script setup lang="ts">
import CatalogTable from "~/features/dashboard/components/catalog-table.vue";
import { useDashboardCatalogPage } from "~/features/dashboard/composables/catalog";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";

const catalog = useDashboardCatalogPage();
</script>

<template>
  <DashboardContainer>
    <template #title>Bienvenido</template>
    <template #description>
      ¡Bienvenido! Explora y reserva tus libros favoritos
    </template>
    <template #title-table>Catálogo de Libros</template>

    <CatalogTable v-bind="catalog" />
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
