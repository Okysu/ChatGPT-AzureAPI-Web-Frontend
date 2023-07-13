// Utilities
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      avatar: "",
      username: "User",
    } as user,
    auth: {
      key: "",
    } as auth,
  }),
});
