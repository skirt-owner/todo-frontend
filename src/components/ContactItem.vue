<template>
  <q-item @click="openContact" clickable>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "ContactItem",
  props: {
    label: String,
    contactUrl: String,
  },
  methods: {
    openContact() {
      window.open(this.contactUrl, "_blank");
    },
  },
};
</script>
