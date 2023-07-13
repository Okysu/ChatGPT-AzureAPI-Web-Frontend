<template>
  <v-dialog
    scrollable
    v-model="prompt"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Prompts Repo</v-toolbar-title>
        <v-toolbar-items>
          <v-select
            style="margin: 4px 0"
            v-model="select"
            :items="['CN', 'EN']"
            label="Lang"
          ></v-select>
          <v-btn rounded @click="prompt = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-list>
        <v-list-item
          v-for="(prompt, i) in prompts?.[select.toLocaleLowerCase() as keyof Prompt]"
          :key="i"
          @click="startWithPrompt(prompt)"
        >
          <v-list-item-title>{{ prompt[0] }}</v-list-item-title>
          <v-list-item-subtitle>{{ prompt[1] }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useChatStore } from "@/store/chat";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { getPrompts } from "@/api/app";
interface Prompt {
  cn: [];
  en: [];
}

const getUserLang = () => {
  const lang = navigator.language;
  if (lang.includes("zh")) {
    return "CN";
  } else {
    return "EN";
  }
};

export default defineComponent({
  name: "Prompts",
  setup() {
    const prompts = ref<Prompt>();
    const select = ref(getUserLang() as keyof Prompt);
    const appStore = useAppStore();
    const chatStore = useChatStore();
    const { now, chats, value } = storeToRefs(chatStore);
    const { prompt, options } = storeToRefs(appStore);
    return {
      prompt,
      prompts,
      select,
      now,
      chats,
      value,
      options,
    };
  },
  methods: {
    startWithPrompt(prompt: Array<string>) {
      if (this.now === -1) {
        let newChat: chat = {
          _id: uuidv4(),
          title: prompt[0],
          messages: [],
          created_at: new Date().toLocaleString(),
          type: "chat",
          options: this.options,
        };
        this.chats.push(newChat);
        this.now = this.chats.length - 1;
        this.value = prompt[1];
        this.prompt = false;
      } else {
        this.value = prompt[1];
        this.prompt = false;
      }
    },
  },
  mounted() {
    getPrompts().then((res) => {
      this.prompts = res.data;
    });
  },
});
</script>

<style lang="scss" scoped>
// beautify scrollbar
.v-list::-webkit-scrollbar {
  width: 6px;
}

.v-list::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}

.v-list::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
}

.v-list::-webkit-scrollbar-thumb:hover {
  background: #a6a6a6;
}
</style>
