<template>
  <v-navigation-drawer width="280" v-model="drawer" temporary location="right">
    <v-text-field
      variant="solo-filled"
      class="text-field"
      label="Search Chat..."
      v-model="search"
    >
      <template #append-inner>
        <v-btn size="small" @click="now = -1">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <!-- chat list -->
    <div class="chat-list">
      <v-list>
        <v-list-item
          v-for="item in lists"
          :key="item._id"
          class="chat-list-item"
          @click.stop="toggleChat(item)"
          :class="[
            now === chats.findIndex((chat) => chat._id === item._id)
              ? 'chat-list-item--active'
              : '',
          ]"
        >
          <template v-slot:append>
            <div style="display: flex; gap: 5px">
              <!-- edit title -->
              <v-btn
                size="small"
                variant="text"
                icon="mdi-pencil"
                @click.stop="changeTitle(item)"
              ></v-btn>
              <!-- delete -->
              <v-btn
                size="small"
                variant="text"
                icon="mdi-delete"
                @click.stop="removeChat(item)"
              ></v-btn>
            </div>
          </template>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
    <div class="bottom-actions">
      <!-- change theme -->
      <v-btn size="small" variant="text" @click="appStore.toggleTheme()">
        <v-icon v-if="theme === 'light'">mdi-lightbulb-on</v-icon>
        <v-icon v-else>mdi-lightbulb</v-icon>
        {{ theme }}
      </v-btn>
      <!-- settings -->
      <v-btn size="small" variant="text" @click="toggleSettings">
        <v-icon>mdi-cog</v-icon>
        Settings
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { useChatStore } from "@/store/chat";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { ref } from "vue";
const appStore = useAppStore();
const chatStore = useChatStore();
const { drawer, theme } = storeToRefs(appStore);
const { now, chats } = storeToRefs(chatStore);

const toggleChat = (item: chat) => {
  now.value = chats.value.findIndex((chat) => chat._id === item._id);
};

const removeChat = (item: chat) => {
  if (
    confirm("Are you sure to delete this chat? This action cannot be undone!")
  ) {
    const index = chats.value.findIndex((chat) => chat._id === item._id);
    chats.value.splice(index, 1);
    if (now.value === index) {
      now.value = -1;
    }
  }
};

const changeTitle = (item: chat) => {
  const newTitle = prompt("Enter new title", item.title);
  if (newTitle) {
    item.title = newTitle;
  }
};

const search = ref("");

const lists = computed(() => {
  if (!search.value.trim()) return chats.value;
  return chats.value.filter(
    (item) =>
      item.title.includes(search.value) ||
      item.messages.some((message) => message.content.includes(search.value))
  );
});

const toggleSettings = () => {
  window.postMessage({ type: "set", value: "on" }, "*");
};
</script>

<style lang="scss" scoped>
.text-field {
  top: 0;
  position: sticky;
  z-index: 999;
  max-height: 56px;
}

.chat-list {
  height: calc(100% - 100px);
  overflow-y: auto;
  padding: 0 8px;
}

.bottom-actions {
  position: absolute;
  bottom: 0;
  height: 44px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

// beautify scrollbar
.chat-list::-webkit-scrollbar {
  width: 6px;
}

.chat-list::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}

.chat-list::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
}

.chat-list::-webkit-scrollbar-thumb:hover {
  background: #a6a6a6;
}

.chat-list-item {
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
  margin: 2px 0;
  border-radius: 10px;
}

.chat-list-item:hover {
  border: 2px solid #a6a6a6;
}

.chat-list-item--active {
  border: 2px solid #bfbfbf;
}
</style>
