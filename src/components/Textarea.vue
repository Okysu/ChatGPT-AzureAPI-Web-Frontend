<template>
  <div class="input">
    <!-- textarea -->
    <div class="message-input">
      <v-textarea
        v-model="value"
        :placeholder="
          using
            ? 'AI is thinking, but you can still type...'
            : 'Type something...'
        "
        outlined
        auto-grow
        rows="1"
        variant="solo-filled"
        @keydown="quickSend"
      >
      </v-textarea>
      <v-btn
        :loading="using"
        color="primary"
        @click="sendMessage"
        class="fab-send"
      >
        <v-icon> mdi-send </v-icon>
        Send
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-input {
  position: fixed;
  padding: 0 16px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  width: 100%;
  max-width: 1200px;
}
.fab-send {
  position: absolute;
  right: 32px;
  bottom: 32px;
}
</style>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useChatStore } from "@/store/chat";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { requestAI } from "@/api/model";
import { useFetch } from "@/api";
// chat store
const chatStore = useChatStore();
// app store
const appStore = useAppStore();
// chat
const { now, chats, value } = storeToRefs(chatStore);
watch(value, (val) => {
  if (val.trim() === "/") {
    appStore.togglePrompt();
    value.value = "";
  }
});

const using = ref(false);

const sendMessage = () => {
  if (value.value.trim() === "") return;
  const newMessage: message = {
    _id: uuidv4(),
    content: value.value,
    created_at: new Date().toLocaleString(),
    choose_flag: true,
    role: "user",
  };
  chats.value[now.value].messages.push(newMessage);
  value.value = "";

  // AI
  const chatNow = chats.value[now.value];
  let messages = chatNow.messages
    .filter((item) => item.role !== "application" && item.choose_flag)
    .map((item) => {
      return {
        content: item.content,
        role: item.role,
      };
    });
  // if signle mode, only send the last two messages(don't include system message)
  if (chatNow.options.single) {
    let filteredMessages: Array<{ role: string; content: string }> = [];
    filteredMessages = messages.filter((item) => item.role === "system");
    filteredMessages.push(messages[messages.length - 2]);
    filteredMessages.push(messages[messages.length - 1]);
    messages = filteredMessages;
  }
  requestAI(messages, chatNow.options)
    .then((res) => {
      const result = res.data;
      const { code, data } = result;

      if (code === 0) {
        const { id } = data;
        const aiNewMessage: message = {
          _id: id,
          content: "AI is thinking...",
          created_at: new Date().toLocaleString(),
          choose_flag: true,
          role: "assistant",
        };
        chatNow.messages.push(aiNewMessage);
        const point = chatNow.messages.length - 1;
        const messageNow = chatNow.messages[point];
        using.value = true;
        useFetch(`/model/stream/${id}`)
          .then((res) => {
            if (!res.body) {
              messageNow.content = "Unknown error.";
              messageNow.role = "application";
              return;
            }
            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let result = "";
            async function readStream(): Promise<any> {
              const { done, value } = await reader.read();
              if (done) {
                using.value = false;
                messageNow.created_at = new Date().toLocaleString();
                if (
                  chatNow.messages.filter((item) => item.role === "assistant")
                    .length === 1 &&
                  chatNow.title === "New Chat"
                ) {
                  function cutTitle(title: string): string {
                    const punctuations = [
                      ",",
                      "，",
                      ".",
                      "。",
                      "!",
                      "！",
                      "(",
                      "（",
                      ")",
                      "）",
                    ];
                    let endIndex = title.length;
                    for (let i = 0; i < title.length; i++) {
                      if (punctuations.includes(title[i])) {
                        endIndex = i;
                        break;
                      }
                    }
                    return endIndex > 8
                      ? title.slice(0, 8)
                      : title.slice(0, endIndex);
                  }
                  const title = cutTitle(messageNow.content);
                  chatNow.title = title;
                }
                return result;
              }
              const chunk = decoder.decode(value, { stream: true });
              result += chunk;
              messageNow.content = result;
              return readStream();
            }

            return readStream();
          })
          .catch((err) => {
            const result = err.response.data;
            chatNow.messages[point] = {
              _id: uuidv4(),
              content: JSON.stringify(result),
              created_at: new Date().toLocaleString(),
              choose_flag: true,
              role: "application",
            };
          });
      }
    })
    .catch((err) => {
      const result = err.response.data;
      chatNow.messages.push({
        _id: uuidv4(),
        content: JSON.stringify(result),
        created_at: new Date().toLocaleString(),
        choose_flag: true,
        role: "application",
      });
    });
};

const quickSend = (e: KeyboardEvent) => {
  // Ctrl + Enter
  if (e.ctrlKey && e.key === "Enter") {
    sendMessage();
  }
};
</script>
