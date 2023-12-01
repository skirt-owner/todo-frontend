<template>
  <div class="rounded-borders todo">
    <q-checkbox
      v-model="completed"
      color="teal"
      checked-icon="task_alt"
      unchecked-icon="highlight_off"
      dense
      size="70px"
      @update:model-value="updateCompleted"
      class="todo-status"
    ></q-checkbox>

    <q-input
      outlined
      dense
      item-aligned
      v-model="editedTitle"
      :readonly="isDisableTitleInput"
      :hint="titleHint"
      @keydown="handleTitleInputKeydown"
      ref="titleInput"
      class="title-input"
      @dblclick="editTitle"
    />

    <q-input
      outlined
      dense
      item-aligned
      autogrow
      v-model="editedDescription"
      :readonly="isDisableDescriptionInput"
      :hint="descriptionHint"
      @keydown="handleDescriptionInputKeydown"
      ref="descriptionInput"
      class="description-input"
      @dblclick="editDescription"
    />

    <div
      class="row inline wrap justify-center items-center content-center tags"
    >
      <span class="rounded-borders tag" v-for="tag in todo.tags" :key="tag.id">
        {{ tag.name }}
        <q-menu class="bg-red text-white" touch-position :target="$refs.tag">
          <q-item v-close-popup clickable dense @click="deleteTag(tag)">
            <q-item-section>
              <q-icon size="xs" color="white" name="delete"></q-icon>
            </q-item-section>
          </q-item>
        </q-menu>
      </span>

      <q-input
        maxlength="20"
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
</template>

<script>
import { api } from "boot/axios";

export default {
  props: {
    todo: {
      type: Object,
      required: true,
      validator: (value) => typeof value === "object" && value !== null,
    },
  },
  data() {
    return {
      addedTag: null,
      editedTitle: this.todo.title,
      editedDescription: this.todo.description,
      previousTitle: this.todo.title,
      previousDescription: this.todo.description,
      isDisableTitleInput: true,
      isDisableDescriptionInput: true,
      isAddingTag: false,
      completed: this.todo.completed,
    };
  },
  computed: {
    tagHint() {
      return "Press 'Enter' to open PornHub or 'Esc' to cancel";
    },
    titleHint() {
      return this.isDisableTitleInput
        ? "Double click to edit"
        : "Press 'Enter' to call your mommy or 'Esc' to cancel";
    },
    descriptionHint() {
      return this.isDisableDescriptionInput
        ? "Double click to edit"
        : "Press 'Enter' to submit or 'Esc' to cancel a celebrity";
    },
  },
  methods: {
    async updateCompleted() {
      try {
        await api.patch(`/todos/${this.todo.id}/completed`);
      } catch (error) {
        console.error(error);
      }
    },
    async updateTags() {
      const tags_string =
        this.todo.tags.map((tag) => tag.name).join(",") + "," + this.addedTag;
      console.log(tags_string);
      await api.post(`/todos/${this.todo.id}/tags`, { tags: tags_string });
      this.$emit("tags-updated");
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
          this.updateTags();
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
    addTag() {
      this.isAddingTag = true;
    },
    async deleteTag(tag) {
      try {
        await api.delete(`/todos/${this.todo.id}/tags/${tag.name}`);
        this.$emit("tag-deleted", tag.id);
      } catch (error) {
        console.error(error);
      }
    },
    editTitle() {
      this.editedTitle = this.todo.title;
      this.previousTitle = this.todo.title;
      this.$nextTick(() => {
        this.isDisableTitleInput = false;
        this.$refs.titleInput.focus();
      });
    },
    async updateTitle() {
      await api.put(`/todos/${this.todo.id}`, { title: this.editedTitle });
      this.$emit("title-updated", this.editedTitle);
    },
    handleTitleInputKeydown(event) {
      if (event === void 0) {
        return;
      }

      if (event.key === "Enter") {
        if (this.editedTitle.trim() === "") {
          this.editedTitle = this.previousTitle;
          this.isDisableTitleInput = true;
        } else {
          this.isDisableTitleInput = true;
          this.updateTitle();
        }
        return;
      }

      if (event.key === "Escape") {
        this.editedTitle = this.previousTitle;
        this.isDisableTitleInput = true;
        return;
      }
    },
    editDescription() {
      this.editedDescription = this.todo.description;
      this.previousDescription = this.todo.description;
      this.$nextTick(() => {
        this.isDisableDescriptionInput = false;
        this.$refs.descriptionInput.focus();
      });
    },
    async updateDescription() {
      await api.put(`/todos/${this.todo.id}`, {
        description: this.editedDescription,
      });
      this.$emit("description-updated", this.editDescription);
    },
    handleDescriptionInputKeydown(event) {
      if (event === void 0) {
        return;
      }

      if (event.key === "Enter") {
        if (this.editedDescription.trim() === "") {
          this.editedDescription = this.previousDescription;
          this.isDisableDescriptionInput = true;
        } else {
          this.isDisableDescriptionInput = true;
          this.updateDescription();
        }
        return;
      }

      if (event.key === "Escape") {
        this.editedDescription = this.previousDescription;
        this.isDisableDescriptionInput = true;
        return;
      }
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
  margin-top: 2%;
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
  padding: 3px;
  margin: 3px;
}

.tag-input {
  max-width: 24ch;
  margin: 3px;
}

.todo-status {
  margin-top: 7%;
}

span.tag {
  cursor: pointer;
  padding: 3px;
  margin: 3px;
  color: rgb(120, 120, 120);
  border: 1px solid rgba(106, 156, 137, 0.5);
  background: rgba(193, 216, 195, 0.5);
}
</style>
