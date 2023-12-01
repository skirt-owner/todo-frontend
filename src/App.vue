<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import TodoItem from "./components/TodoItem.vue";

export default defineComponent({
  name: "App",
  setup() {
    return {};
  },
});
</script>
