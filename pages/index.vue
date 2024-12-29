<script setup lang="ts">
import ButtonTab from "~/components/button/button-tab.vue";
import { useIndexPage } from "~/features/auth/session/composable";

const {
  isLogin,
  showConfirmModal,
  showChangePasswordModal,
  formData,
  buttonLoginLoading,
  buttonRegisterLoading,
  buttonSearchDNILoading,
  buttonChangePasswordLoading,
  handleSubmit,
  handleRegister,
  handleFindByDNI,
  handleChangePassword,
} = useIndexPage();
</script>

<template>
  <div class="App">
    <div
      class="Container min-h-screen flex flex-col items-center justify-start"
    >
      <div class="z-10 text-center text-white mb-8">
        <img
          src="/logo-muni.png"
          alt="Logo"
          class="mx-auto w-32 h-32 mb-[-15px]"
        />
        <p class="text-xl2 font-semibold">SGB - MDG</p>
        <h1 class="mb-[-15px] font-medium">
          SISTEMA DE GESTION DE LA BIBIBLIOTECA DE LA MUNICIPALIDAD DE GUADALUPE
        </h1>
      </div>
      <div class="z-10 bg-white p-4 rounded-2xl shadow-lg w-full mb-8">
        <h2 class="text-2xl font-extrabold text-center">
          {{ isLogin ? "Ingresa Aquí" : "Empieza Aquí" }}
        </h2>
        <p class="text-sm text-center text-gray-600 mb-4">
          Accede a muchos libros y recursos
        </p>
        <div class="flex w-full justify-center">
          <div class="ButtonContainer flex mb-6 rounded-full p-0 w-72">
            <ButtonTab
              text="Iniciar Sesión"
              :active="isLogin"
              @click="isLogin = true"
            />
            <ButtonTab
              text="Registrarse"
              :active="!isLogin"
              @click="isLogin = false"
            />
          </div>
        </div>
        <form @submit.prevent="handleSubmit">
          <FormBaseInput
            v-if="isLogin"
            name="dni"
            label="DNI"
            v-model="formData.dni"
            placeholder="Ingresa tu número de DNI"
            required
          />
          <div v-else class="flex gap-4 mb-4 h-auto">
            <FormBaseInput
              class="flex-1"
              name="dni"
              label="DNI"
              v-model="formData.dni"
              placeholder="Ingresa tu número de DNI"
              required
            />
            <div class="h-7 w-7">
              <UButton
                icon="i-heroicons-magnifying-glass"
                size="sm"
                color="primary"
                square
                variant="solid"
                :loading="buttonSearchDNILoading"
                @click="handleFindByDNI"
              />
            </div>
          </div>
          <template v-if="!isLogin">
            <FormBaseInput
              name="names"
              label="Nombre"
              v-model="formData.names"
              placeholder="Ingresa tus nombres"
              required
            />
            <FormBaseInput
              name="lastName"
              label="Apellidos"
              v-model="formData.lastName"
              placeholder="Ingresa tus apellidos"
              required
            />
            <FormBaseInput
              name="email"
              label="Correo Electrónico"
              v-model="formData.email"
              placeholder="Ingresa tu correo electrónico"
              required
              type="email"
            />
            <FormBaseInput
              name="phoneNumber"
              label="Teléfono"
              v-model="formData.phoneNumber"
              placeholder="Ingresa tu número de teléfono"
              type="tel"
            />
          </template>
          <FormBaseInput
            name="password"
            label="Contraseña"
            v-model="formData.password"
            placeholder="Ingresa tu contraseña"
            type="password"
            required
          />
          <Button type="submit" :loading="buttonLoginLoading" v-show="isLogin">
            Iniciar Sesión
          </Button>
          <Button type="submit" v-show="!isLogin"> Registrarse </Button>
        </form>
        <button
          v-show="isLogin"
          @click="showChangePasswordModal = true"
          class="mt-4 ml-2 text-gray-500 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
        <UModal v-model="showConfirmModal">
          <UCard class="UModal-card">
            <template #header>
              <h2 className="text-xl font-bold mb-2">Confirma tus datos</h2>
              <div className="-mb-3">
                ¿Estás seguro de que deseas registrarte con los siguientes
                datos?
              </div>
            </template>

            <strong>DNI:</strong> {{ formData.dni }}
            <br />
            <strong>Nombres:</strong> {{ formData.names }}
            <br />
            <strong>Apellidos:</strong> {{ formData.lastName }}
            <br />
            <strong>Correo Electrónico:</strong> {{ formData.email }}
            <br />
            <strong>Teléfono:</strong> {{ formData.phoneNumber }}

            <template #footer>
              <div className="flex justify-between flex-col gap-5">
                <Button @click="showConfirmModal = false"> Volver </Button>
                <Button
                  @click="handleRegister"
                  :loading="buttonRegisterLoading"
                >
                  Enviar
                </Button>
              </div>
            </template>
          </UCard>
        </UModal>
        <UModal v-model="showChangePasswordModal">
          <UCard class="UModal-card">
            <template #header>
              <h2 className="text-xl font-bold mb-2">
                Solicita cambiar de contraseña
              </h2>
            </template>

            <FormBaseInput
              name="dni-change"
              label="DNI"
              v-model="formData.dniChange"
              placeholder="Ingresa tu número de DNI"
              required
            />

            <template #footer>
              <div className="flex justify-between flex-col gap-5">
                <Button @click="showChangePasswordModal = false">
                  Volver
                </Button>
                <Button
                  @click="handleChangePassword"
                  :loading="buttonChangePasswordLoading"
                >
                  Enviar
                </Button>
              </div>
            </template>
          </UCard>
        </UModal>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.App
  background-color: black
  position: relative
  z-index: 1

  .Container
    position: relative
    z-index: 1
    padding: 0 1rem
    max-width: 500px
    margin: 0 auto

    .ButtonContainer
      outline: 1px solid
      outline-color: #c6c6c6
      overflow: hidden

  &::before
    content: ""
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-image: url("/background.jpg")
    background-repeat: no-repeat
    background-size: cover
    opacity: 0.3
    z-index: -1
</style>
