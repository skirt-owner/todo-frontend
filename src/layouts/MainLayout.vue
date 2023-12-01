<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated style="background: #6a9c89">
      <q-toolbar>
        <q-toolbar-title>Todo App</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

    <q-footer elevated class="q-footer--center" style="background: #6a9c89">
      <div class="contact-links">
        <ContactItem
          v-for="link in contactLinks"
          :key="link.label"
          :label="link.label"
          :contactUrl="link.contactUrl"
        />
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import ContactItem from "../components/ContactItem.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    ContactItem,
  },

  setup() {
    const contactLinks = [
      {
        label: "Telegram",
        contactUrl: "https://t.me/skirtsfield",
      },
      {
        label: "GitHub",
        contactUrl: "https://github.com/skirt-owner",
      },
      {
        label: "Email",
        contactUrl: "mailto:wrkngskirt@gmail.com",
      },
    ];

    return {
      contactLinks,
    };
  },
});
</script>

<style scoped>
.contact-links {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
