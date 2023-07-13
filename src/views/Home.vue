<template>
  <div v-if="now !== -1">
    <message-component />
    <textarea-component />
  </div>
  <div v-else>
    <start-component />
  </div>
</template>

<script lang="ts" setup>
import MessageComponent from "@/components/Message.vue";
import TextareaComponent from "@/components/Textarea.vue";
import StartComponent from "@/components/Start.vue";
import { useChatStore } from "@/store/chat";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
// chat store
const chatStore = useChatStore();
// chat
const { now } = storeToRefs(chatStore);
// user store
const userStore = useUserStore();
// auth
const { auth } = storeToRefs(userStore);
while (auth.value.key.trim() === "") {
  const key = prompt("Enter your key");
  if (key) {
    auth.value.key = key;
  }
}
</script>
