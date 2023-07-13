<template>
  <v-app-bar flat>
    <v-app-bar-nav-icon
      @click.stop="appStore.toggleSideBar()"
    ></v-app-bar-nav-icon>
    <v-app-bar-title>
      {{ now !== -1 ? chats[now].title : "Playground" }}
    </v-app-bar-title>
    <template v-slot:append>
      <!-- button group -->
      <div
        v-if="now !== -1"
        class="d-flex align-center flex-column"
        style="max-height: 32px"
      >
        <v-btn-toggle divided variant="outlined">
          <!-- edit title -->
          <v-btn size="x-small" icon="mdi-pencil" @click="changeTitle"></v-btn>
          <!-- settings -->
          <v-btn size="x-small" icon="mdi-cog" @click="setting = true"></v-btn>
          <!-- delete -->
          <v-btn size="x-small" icon="mdi-delete" @click="removeChat"></v-btn>
        </v-btn-toggle>
      </div>
    </template>
  </v-app-bar>
  <settings-components v-model="setting" :global="global" />
  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarText }}

    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SettingsComponents from "@/components/Settings.vue";
import { useAppStore } from "@/store/app";
import { useChatStore } from "@/store/chat";
import { storeToRefs } from "pinia";
import { watch } from "vue";
// application store
const appStore = useAppStore();
// chat store
const chatStore = useChatStore();
// chat
const { now, chats } = storeToRefs(chatStore);
// change title
const changeTitle = () => {
  const newTitle = prompt("Enter new title", chats.value[now.value].title);
  if (newTitle) {
    chats.value[now.value].title = newTitle;
  }
};

// remove chat
const removeChat = () => {
  if (
    confirm("Are you sure to delete this chat? This action cannot be undone!")
  ) {
    chats.value.splice(now.value, 1);
    now.value = -1;
  }
};

// settings
const setting = ref(false);
watch(setting, (val) => {
  if (val === false) {
    setTimeout(() => {
      global.value = false;
    }, 300);
  }
});

// global settings
const global = ref(false);

// snackbar
const snackbar = ref(false);
const snackbarText = ref("");
window.onmessage = (e) => {
  if ((e.data.type === "set")) {
    if (e.data.value === "on") {
      global.value = true;
      setting.value = true;
    }
  }
  if (e.data.type === "copy") {
    if (e.data.value === "success") {
      snackbarText.value = "Copied!";
      snackbar.value = true;
    } else {
      snackbarText.value = "Copy failed!";
      snackbar.value = true;
    }
  }
};
</script>
