import { useLocalStorage } from "@vueuse/core";

export const useUserTokenStore = defineStore("user-token", () => {
  const userToken = useLocalStorage<string | null>("gdp-bm", null);

  return { userToken };
});
