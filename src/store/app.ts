// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    drawer: false,
    prompt: false,
    theme: "light",
    options: {
      maxTokens: "1000",
      temperature: "0.9",
      topP: "1",
      frequencyPenalty: "0",
      presencePenalty: "0",
      single: false,
    } as options,
  }),
  actions: {
    toggleSideBar() {
      this.drawer = !this.drawer;
    },
    togglePrompt() {
      this.prompt = !this.prompt;
    },
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },
    pointTheme(theme: string) {
      this.theme = theme;
    },
  },
});
