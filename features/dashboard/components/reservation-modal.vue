<script setup lang="ts">
import type { BookI } from "~/types";

interface Props {
  selectedItem?: BookI;
  reservationButtonLoading: boolean;
  isValidData: boolean;
}
defineProps<Props>();
defineEmits(["handleReservation", "close"]);
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-primary font-bold text-2xl">Añadir al carrito</h3>
    </template>

    <slot />

    <template #footer>
      <div class="flex justify-between flex-col gap-5">
        <Button @click="$emit('close')"> Cancelar </Button>
        <Button
          @click="$emit('handleReservation')"
          :disabled="!isValidData"
          :loading="reservationButtonLoading"
        >
          Reservar
        </Button>
      </div>
    </template>
  </UCard>
</template>

<style scoped lang="sass"></style>
