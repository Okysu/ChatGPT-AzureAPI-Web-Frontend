<template>
  <v-theme-provider :theme="theme">
    <v-app>
      <side-bar />
      <app-bar />
      <app-view />
    </v-app>
    <prompts-component />
  </v-theme-provider>
</template>

<script lang="ts" setup>
import AppBar from "./AppBar.vue";
import AppView from "./View.vue";
import SideBar from "./SideBar.vue";
import PromptsComponent from "@/components/Prompts.vue";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
const appStore = useAppStore();
const { theme } = storeToRefs(appStore);
</script>
