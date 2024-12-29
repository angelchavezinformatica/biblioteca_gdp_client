<script setup lang="ts">
import Header from "~/features/dashboard/header.vue";
import Sidebar from "~/features/dashboard/sidebar.vue";

const isCollapsed = ref<boolean>(false);

const store = useAuthStore();
const router = useRouter();

await useAsyncData("user-token", () => store.fetchUser());

if (store.isAuth === false) router.push("/");

onUpdated(() => {
  if (store.isAuth === false) router.push("/");
});
</script>

<template>
  <template v-if="store.isAuth">
    <Header @toogleIsCollapsed="isCollapsed = !isCollapsed"></Header>
    <Sidebar :isCollapsed="isCollapsed" />
  </template>
</template>

<style lang="sass">
body
    background-color: #010101
</style>
