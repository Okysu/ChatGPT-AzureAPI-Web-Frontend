<template>
  <v-container>
    <v-responsive class="message-list">
      <!-- message list -->
      <v-list>
        <div class="message-divider">
          <v-btn size="small" variant="text" @click="premade.open()">
            <v-icon>mdi-plus</v-icon>
            New message
          </v-btn>
        </div>
        <v-list-item
          v-for="item in chats[now].messages.filter((item) => item.choose_flag)"
          :key="item._id"
        >
          <div>
            <span class="font-weight-bold">{{
              item.role === "user"
                ? user.username
                : item.role.toLocaleUpperCase()
            }}</span>
            <span class="grey--text">
              - {{ new Date(item.created_at).toLocaleString() }}</span
            >
          </div>
          <v-card variant="tonal" class="message-content">
            <div :id="item._id" hidden>
              {{ item.content }}
            </div>
            <div v-html="markdownToHtml(item.content)"></div>
          </v-card>
          <div class="message-actions">
            <div>
              <v-btn
                class="copy-btn"
                size="x-small"
                variant="text"
                @click="copyText(item._id)"
              >
                <v-icon>mdi-content-copy</v-icon>
                Copy
              </v-btn>
              <v-btn
                v-if="item.role === 'user'"
                size="x-small"
                variant="text"
                @click="freshMessage(item._id)"
              >
                <v-icon>mdi-refresh</v-icon>
                Refresh
              </v-btn>
              <v-btn
                v-if="item.role !== 'application'"
                @click="item.choose_flag = false"
                size="x-small"
                variant="text"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
                Uncheck
              </v-btn>
            </div>
            <!-- if edited, show updated_at -->
            <span v-if="item.updated_at" style="color: lightgray">
              - Edited at {{ new Date(item.updated_at).toLocaleString() }}</span
            >
          </div>
          <div class="message-divider">
            <v-btn size="small" variant="text" @click="premade.open(item._id)">
              <v-icon>mdi-plus</v-icon>
              New message
            </v-btn>
          </div>
        </v-list-item>
      </v-list>
    </v-responsive>
  </v-container>
  <premade-component ref="premade" />
</template>

<style lang="scss" scoped>
.message-actions {
  margin: 5px;
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.message-content {
  padding: 12px;
  width: fit-content;
}

.message-list {
  padding: 0 4px;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  max-width: 1200px;
  margin: 0 auto;
}

// beautify scrollbar
.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}

.message-list::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
}

.message-list::-webkit-scrollbar-thumb:hover {
  background: #a6a6a6;
}

.message-divider {
  text-align: center;
  color: #bfbfbf;
}

.message-divider::before,
.message-divider::after {
  content: "";
  display: inline-block;
  width: calc(50% - 100px);
  height: 1px;
  background: #bfbfbf;
  vertical-align: middle;
  margin: 0 10px;
}
</style>

<script lang="ts" setup>
import PremadeComponent from "./Premade.vue";
import { useChatStore } from "@/store/chat";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
// markdown
import { markdownToHtml, copyText } from "@/utils/markdown";
import { requestAI } from "@/api/model";
import { useFetch } from "@/api";
import { ref } from "vue";
// chat store
const chatStore = useChatStore();
// chat that checked
const { now, chats } = storeToRefs(chatStore);
// user store
const userStore = useUserStore();
// user
const { user } = storeToRefs(userStore);

// fresh message
const freshMessage = (_id: string) => {
  const chatNow = chats.value[now.value];
  const index = chatNow.messages.findIndex((item) => item._id === _id);
  let nextMessage = chatNow.messages[index + 1];
  let messages = chatNow.messages
    .slice(0, index + 1)
    .filter((item) => item.role !== "application" && item.choose_flag)
    .map((item) => {
      return {
        content: item.content,
        role: item.role,
      };
    });
  if (chatNow.options.single) {
    messages = messages.filter((item) => item.role === "system");
    messages.push({
      content: chatNow.messages[index].content,
      role: chatNow.messages[index].role,
    });
  }
  requestAI(messages, chatNow.options)
    .then((res) => {
      const result = res.data;
      const { code, data } = result;

      if (code === 0) {
        const { id } = data;
        if (
          nextMessage &&
          nextMessage.role === "assistant" &&
          nextMessage.choose_flag
        ) {
        } else {
          // add new message
          const newMessage: message = {
            _id: id,
            content: "AI is thinking...",
            created_at: new Date().toLocaleString(),
            choose_flag: true,
            role: "assistant",
          };
          // insert new message
          chatNow.messages.splice(index + 1, 0, newMessage);
          nextMessage = chatNow.messages[index + 1];
        }
        nextMessage._id = id;
        nextMessage.content = "AI is thinking...";
        useFetch(`/model/stream/${id}`)
          .then((res) => {
            if (!res.body) {
              nextMessage.content = "Unknown error.";
              nextMessage.role = "application";
              return;
            }
            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let result = "";
            async function readStream(): Promise<any> {
              const { done, value } = await reader.read();
              if (done) {
                nextMessage.updated_at = new Date().toLocaleString();
                return result;
              }
              const chunk = decoder.decode(value, { stream: true });
              result += chunk;
              nextMessage.content = result;
              return readStream();
            }

            return readStream();
          })
          .catch((err) => {
            const result = err.response.data;
            nextMessage.content = JSON.stringify(result);
            nextMessage.role = "application";
          });
      }
    })
    .catch((err) => {
      const result = err.response.data;
      nextMessage.content = JSON.stringify(result);
      nextMessage.role = "application";
    });
};

// premade
const premade = ref();
</script>
