<template>
  <v-container style="height: calc(100vh - 64px)">
    <v-responsive style="height: calc(100vh - 64px)">
      <div class="start">
        <v-card class="mx-auto" max-width="600">
          <v-card-text>
            <div class="text-center text-h6">Azure OpenAI ChatGPT Web</div>
            <div class="text--primary text-center">
              You can either start directly or choose a pre-made prompt.
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn class="mx-auto" @click="start">
              <v-icon left>mdi-plus</v-icon>
              New Chat
            </v-btn>
            <v-btn class="mx-auto" @click="startWithPrompt">
              <v-icon left>mdi-plus</v-icon>
              Start with Prompt
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-responsive>
  </v-container>
</template>

<style lang="scss" scoped>
.start {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>

<script lang="ts" setup>
import { useChatStore } from "@/store/chat";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
// app store
const appStore = useAppStore();
// chat store
const chatStore = useChatStore();
// chat
const { now, chats } = storeToRefs(chatStore);

// start
const start = () => {
  let newChat: chat = {
    _id: uuidv4(),
    title: "New Chat",
    messages: [],
    created_at: new Date().toLocaleString(),
    type: "chat",
    options: appStore.options,
  };
  chats.value.push(newChat);
  now.value = chats.value.length - 1;
};

// start with prompt
const startWithPrompt = () => {
  appStore.togglePrompt();
};
</script>
