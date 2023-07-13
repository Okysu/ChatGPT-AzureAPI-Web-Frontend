// Utilities
import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    now: -1,
    chats: [] as chat[],
    value: "",
  }),
});
