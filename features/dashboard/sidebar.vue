<script setup lang="ts">
interface Props {
  isCollapsed: boolean;
}
defineProps<Props>();

const links = [
  [
    {
      label: "Catálogo de libros",
      to: "/dashboard",
      icon: "i-mdi-library-shelves",
    },
  ],
  [
    {
      label: "Préstamos",
      to: "/dashboard/loan",
      icon: "i-mdi-book",
    },
    {
      label: "Historial",
      to: "/dashboard/loan-history",
      icon: "i-mdi-book-clock",
    },
  ],
  [
    {
      label: "Libros",
      to: "/dashboard/books",
      icon: "i-mdi-bookshelf",
    },
  ],
  [
    {
      label: "Donaciones",
      to: "/dashboard/donations",
      icon: "i-mdi-gift",
    },
    {
      label: "Donadores",
      to: "/dashboard/donor",
      icon: "i-material-symbols-light-person-raised-hand-rounded",
    },
  ],
  [
    {
      label: "Usuarios",
      to: "/dashboard/users",
      icon: "i-mdi-account",
    },
  ],
];
</script>

<template>
  <aside :class="`Sidebar${isCollapsed ? ' Sidebar--collapsed' : ''}`">
    <div className="Sidebar-logo">
      <img
        :src="isCollapsed ? '/logo-muni.png' : '/logo-muni2.png'"
        alt="Logo Municipalidad de Guadalupe"
      />
    </div>
    <UVerticalNavigation :links="links" class="Sidebar-nav" />
  </aside>
</template>

<style scoped lang="sass">
.Sidebar
  display: flex
  align-items: start
  flex-direction: column
  gap: 1rem
  padding: 1rem .3rem
  position: fixed
  top: 56px
  left: 0
  width: 200px
  z-index: 99999
  height: calc(100vh - 56px)
  background-color: #010101
  border-right: 2px solid #FFFFFF

  .Sidebar-logo
    display: flex
    align-items: center
    justify-content: center
    width: 100%
    img
      width: 120px

  .Sidebar-nav
    display: flex
    flex-direction: column
    width: 100%

.Sidebar--collapsed
  width: 3.2rem

  .Sidebar-logo
    width: 100%
</style>
