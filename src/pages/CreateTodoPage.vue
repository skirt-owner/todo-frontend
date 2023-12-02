<template>
  <q-page padding style="background: #c1d8c3">
    <div
      class="fit row inline wrap justify-center items-center content-center todo-creation"
    >
      <q-btn
        color="teal"
        icon="arrow_back"
        push
        round
        @click="backToTodosPage"
        class="back-button"
      >
      </q-btn>
      <div class="rounded-borders todo">
        <h2>Create Todo</h2>
        <q-input
          hint="Todo Title"
          maxlength="25"
          outlined
          clearable
          dense
          item-aligned
          v-model="addedTitle"
          class="title-input"
        ></q-input>

        <q-input
          hint="Todo Description"
          type="textarea"
          outlined
          clearable
          dense
          item-aligned
          v-model="addedDescription"
          class="description-input"
        ></q-input>

        <div
          class="row inline wrap justify-center items-center content-center tags"
        >
          <span class="rounded-borders tag" v-for="tag in tags" :key="tag.name">
            {{ tag.name }}
            <q-menu
              class="bg-red text-white"
              touch-position
              :target="$refs.tag"
            >
              <q-item
                v-close-popup
                clickable
                dense
                @click="deleteTag(tag.name)"
              >
                <q-item-section>
                  <q-icon size="xs" color="white" name="delete"></q-icon>
                </q-item-section>
              </q-item>
            </q-menu>
          </span>

          <q-input
            maxlength="20"
            autofocus
            outlined
            dense
            class="tag-input"
            hide-hint
            hide-bottom-space
            v-model="addedTag"
            :hint="tagHint"
            @keydown="handleTagInputKeydown"
            v-if="isAddingTag"
          ></q-input>

          <q-btn
            color="teal"
            icon="add"
            dense
            push
            @click="addTag"
            class="add-tag-button"
          >
          </q-btn>
        </div>
      </div>
      <q-btn
        color="teal"
        icon="done"
        push
        round
        @click="createTodo"
        class="create-button"
      ></q-btn>
    </div>
  </q-page>
</template>

<script>
import { api } from "boot/axios";

export default {
  data() {
    return {
      addedTitle: null,
      addedDescription: null,
      isAddingTag: false,
      tags: [],
      addedTag: null,
    };
  },
  created() {},
  watch: {},
  computed: {
    tagHint() {
      return "Press 'Enter' to submit or 'Esc' to cancel";
    },
  },
  methods: {
    deleteTag(tagName) {
      this.tags = this.tags.filter((tag) => tag.name !== tagName);
    },
    addTag() {
      this.isAddingTag = true;
    },
    handleTagInputKeydown(event) {
      if (event === void 0) {
        return;
      }

      if (event.key === "Enter") {
        if (this.addedTag.trim() === "") {
          this.addedTag = null;
          this.isAddingTag = false;
        } else {
          this.tags.push({ name: this.addedTag });
          this.addedTag = null;
          this.isAddingTag = false;
        }
        return;
      }

      if (event.key === "Escape") {
        this.addedTag = null;
        this.isAddingTag = false;
        return;
      }
    },
    async createTodo() {
      if (this.addedTitle.trim() === "") {
        return;
      }
      try {
        await this.$api.post(`/todos`, {
          title: this.addedTitle,
          description: this.addedDescription,
          tags: this.tags.map((tag) => tag.name).join(","),
        });
        this.backToTodosPage();
      } catch (error) {
        console.error(error);
      }
    },
    backToTodosPage() {
      this.addedTitle = null;
      this.addedDescription = null;
      this.tags = [];
      this.$router.push({ path: `/` });
    },
  },
};
</script>

<style scoped>
.todo {
  margin: 10px;
  border: 2px solid #f5e8b7;
  background-color: #f5e8b7;
  transition: all 0.2s ease-in-out;
  overflow: auto;
  height: 700px;
  width: 500px;
  text-align: center;
}

.title-input {
  margin-top: 10%;
  font-size: 30px;
}

.description-input {
  margin-top: 5%;
  font-size: 20px;
}

.tags {
  margin-top: 5%;
}

.add-tag-button {
  cursor: pointer;
  margin: 3px;
  padding: 3px;
}

.tag-input {
  max-width: 24ch;
  margin: 3px;
}

span.tag {
  cursor: pointer;
  padding: 3px;
  margin: 3px;
  color: rgb(120, 120, 120);
  border: 1px solid rgba(106, 156, 137, 0.5);
  background: rgba(193, 216, 195, 0.5);
}

h2 {
  color: #cd5c08;
}
</style>
