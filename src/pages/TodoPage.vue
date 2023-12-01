<template>
  <q-page padding style="background: #c1d8c3">
    <div
      class="fit row inline wrap justify-center items-center content-center todo-actions"
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
      <div v-if="loading" class="todo-item">Loading todo...</div>
      <div v-else-if="error" class="todo-item">
        Error occurred while fetching todo. Please try again.
      </div>
      <div v-else-if="todo" class="todo-item">
        <EditTodo
          :key="todo.id"
          :todo="todo"
          @tag-deleted="handleTagDeleted"
          @title-updated="handleTitleUpdated"
          @description-updated="handleDescriptionUpdated"
          @tags-updated="handleTagUpdated"
        />
      </div>
      <q-btn
        color="red"
        icon="delete"
        push
        round
        @click="deleteSelected"
        class="delete-button"
      >
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import EditTodo from "components/EditTodo.vue";

export default {
  components: { EditTodo },
  data() {
    return {
      todo: null,
      loading: false,
      error: false,
    };
  },
  created() {
    const todoId = this.$route.params.id;
    this.fetchTodo(todoId);
  },
  methods: {
    async fetchTodoTags() {
      try {
        const response = await api.get(`/todos/${this.todo.id}`);
        this.todo.tags = response.data.tags;
      } catch (error) {
        console.error(error);
      }
    },
    async handleTagUpdated() {
      await this.fetchTodoTags();
    },
    async handleDescriptionUpdated(description) {
      this.todo.description = description;
    },
    async handleTitleUpdated(title) {
      this.todo.title = title;
    },
    async handleTagDeleted(tagId) {
      this.todo.tags = this.todo.tags.filter((tag) => tag.id !== tagId);
    },
    async fetchTodo(todoId) {
      try {
        this.loading = true;
        const response = await api.get(`/todos/${todoId}`);
        this.todo = response.data;
      } catch (error) {
        console.error(error);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    async backToTodosPage() {
      this.$router.push({ path: `/` });
    },
    async deleteSelected() {
      try {
        const response = await api.delete(`/todos/${this.todo.id}`);
        this.$router.push("/");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
