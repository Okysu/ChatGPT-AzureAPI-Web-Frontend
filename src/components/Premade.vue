<template>
  <v-dialog persistent width="90%" v-model="model">
    <v-card>
      <v-toolbar title="Pre-made"></v-toolbar>
      <v-card-text>
        <v-select
          label="Role"
          v-model="select"
          :items="['user', 'system', 'assistant']"
        />
        <v-textarea
          v-model="content"
          outlined
          auto-grow
          rows="1"
          placeholder="Type something..."
          variant="solo-filled"
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" color="primary" @click="addPreMade">
          Sumbit
        </v-btn>
        <v-btn variant="text" color="primary" @click="model = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useChatStore } from "@/store/chat";
import { storeToRefs } from "pinia";
import { defineComponent, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
export default defineComponent({
  name: "Premade",
  watch: {
    model(val) {
      this.content = "";
      this.select = "user";
    },
  },
  setup() {
    const { now, chats } = storeToRefs(useChatStore());
    const select = ref("user");
    const chatNow = chats.value[now.value];
    const model = ref(false);
    const point = ref(0);
    const content = ref("");
    const addPreMade = () => {
      const message = {
        _id: uuidv4(),
        content: content.value,
        role: select.value,
        choose_flag: true,
        created_at: new Date().toLocaleString(),
      } as message;
      chatNow.messages.splice(point.value + 1, 0, message);
      model.value = false;
    };
    return {
      chatNow,
      select,
      model,
      point,
      addPreMade,
      content,
    };
  },
  methods: {
    open(_id?: string) {
      if (!_id) this.point = 0;
      this.model = true;
      this.point = this.chatNow.messages.findIndex((item) => item._id === _id);
    },
  },
});
</script>
