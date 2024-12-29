import axios from "axios";
import { defineStore } from "pinia";
import { BACKEND_SERVER } from "~/config/api";
import type { UserI } from "~/types";

export const useAuthStore = defineStore("auth-store", () => {
  const userToken = useUserTokenStore();

  const isAuth = ref<boolean | null>(null);
  const user = ref<UserI | null>(null);

  const fetchUser = async () => {
    if (userToken.userToken) {
      isAuth.value = false;
      return;
    }

    const response = await axios.get(`${BACKEND_SERVER}/user/me`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });

    if (response.status === 200) {
      isAuth.value = true;
      user.value = response.data;
    } else isAuth.value = false;
  };

  const login = async (dni: string, password: string) => {
    const response = await axios.post(`${BACKEND_SERVER}/auth/login`, {
      dni,
      password,
    });

    if (response.status === 200) {
      userToken.userToken = response.data.token;
      return { response, isLogged: true };
    }

    return { response, isLogged: false };
  };

  const logout = () => {
    userToken.userToken = null;
  };

  return { isAuth, user, login, logout, fetchUser };
});
