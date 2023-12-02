<template>
  <q-page padding style="background: #c1d8c3">
    <div
      class="fit row inline wrap justify-center items-center content-center todos-actions"
    >
      <q-select
        style="width: 250px"
        outlined
        v-model="sortBy"
        :options="sortOptions"
        label="Sort By"
        dense
        menu-shrink
        options-dense
      ></q-select>
      <q-select
        style="width: 250px"
        outlined
        v-model="filterByTitle"
        :options="titleOptions"
        use-chips
        stack-label
        label="Filter By Title"
        dense
        menu-shrink
        options-dense
      ></q-select>
      <q-select
        style="width: 250px"
        outlined
        v-model="filterByTags"
        multiple
        :options="tagOptions"
        use-chips
        menu-shrink
        options-dense
        stack-label
        label="Filter By Tags"
        dense
      ></q-select>
      <q-btn
        color="red"
        icon="delete"
        push
        dense
        round
        @click="deleteSelected"
        v-if="selectedTodos.length > 0"
        class="delete-button"
      >
      </q-btn>
      <q-btn
        color="teal"
        icon="done"
        push
        round
        dense
        @click="applyFilters"
        v-if="showApplyButton"
        class="apply-button"
      >
      </q-btn>
    </div>

    <div
      class="fit row inline wrap justify-center items-center content-center todos-grid"
    >
      <Todo
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :isSelected="selectedTodos.includes(todo)"
        @select-todo="selectTodo"
      />

      <q-btn
        class="create-button"
        icon="add"
        color="teal"
        dense
        push
        @click="openCreatePage"
      ></q-btn>
    </div>
  </q-page>
</template>

<script>
import { api } from "boot/axios";

import Todo from "components/TodoItem.vue";

export default {
  components: {
    Todo,
  },
  data() {
    return {
      todos: [],
      selectedTodos: [],
      previousSortBy: { label: "Descending", value: "DESC" },
      sortBy: { label: "Descending", value: "DESC" },
      previousFilterByTitle: null,
      filterByTitle: null,
      previousFilterByTags: [],
      filterByTags: [],
      sortOptions: [
        { label: "Ascending", value: "ASC" },
        { label: "Descending", value: "DESC" },
      ],
      titleOptions: [],
      tagOptions: [],
      showApplyButton: false,
    };
  },
  watch: {
    sortBy() {
      if (this.previousSortBy.value !== this.sortBy.value) {
        this.showApplyButton = true;
      } else {
        this.showApplyButton = false;
      }
    },
    filterByTitle() {
      if (this.previousFilterByTitle !== this.filterByTitle) {
        this.showApplyButton = true;
      } else {
        this.showApplyButton = false;
      }
    },
    filterByTags() {
      if (!this.arrayEquals(this.previousFilterByTags, this.filterByTags)) {
        this.showApplyButton = true;
      } else {
        this.showApplyButton = false;
      }
    },
  },
  async created() {
    await this.getTodos();
  },
  methods: {
    openCreatePage() {
      this.$router.push({ path: `/create` });
    },
    arrayEquals(a, b) {
      return (
        Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index])
      );
    },
    selectTodo(todo, isSelected) {
      if (isSelected) {
        this.selectedTodos.push(todo);
      } else {
        this.selectedTodos = this.selectedTodos.filter(
          (selectedTodo) => selectedTodo !== todo
        );
      }
    },
    buildUrlWithFilters() {
      let url = "/todos";
      let queryParams = [];

      if (this.sortBy) {
        queryParams.push(`sortBy=${this.sortBy.value}`);
      }
      if (this.filterByTitle) {
        queryParams.push(`filterByTitle=${this.filterByTitle}`);
      }
      if (this.filterByTags.length > 0) {
        queryParams.push(`filterByTags=${this.filterByTags.join(",")}`);
      }

      if (queryParams.length > 0) {
        url += "?" + queryParams.join("&");
      }

      return url;
    },
    setFiltersOptions() {
      this.titleOptions = this.todos.map((todo) => todo.title);
      this.tagOptions = [
        ...new Set(
          this.todos
            .map((todo) => todo.tags.map((tag) => tag.name))
            .reduce((acc, curr) => acc.concat(curr), [])
        ),
      ];
    },
    async getTodos() {
      try {
        const url = this.buildUrlWithFilters();
        const response = await api.get(url);

        this.todos = response.data;

        this.setFiltersOptions();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteSelected() {
      if (this.selectedTodos.length > 0) {
        try {
          const ids = this.selectedTodos.map((todo) => todo.id).join(",");

          await api.delete("/todos", { data: { ids } });

          this.todos = this.todos.filter(
            (todo) =>
              !this.selectedTodos.some(
                (selectedTodo) => selectedTodo.id === todo.id
              )
          );

          this.selectedTodos = [];
        } catch (error) {
          console.error(error);
        }
      }
    },
    async applyFilters() {
      this.todos = [];
      this.selectedTodos = [];

      await this.getTodos();

      this.previousSortBy = this.sortBy;
      this.previousFilterByTitle = this.filterByTitle;
      this.previousFilterByTags = this.filterByTags;

      this.showApplyButton = false;
    },
  },
};
</script>

<style scoped>
.q-select,
.delete-button,
.apply-button {
  margin: 10px;
}
</style>
