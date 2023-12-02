<template>
  <div
    class="rounded-borders todo"
    :class="{ selected: isSelected }"
    @click="toggleSelected"
  >
    <q-checkbox
      v-model="completed"
      color="teal"
      checked-icon="task_alt"
      unchecked-icon="highlight_off"
      size="70px"
      dense
      @update:model-value="updateCompleted"
      class="todo-status"
    ></q-checkbox>
    <span class="todo-title">{{ todo.title }}</span>
    <span class="todo-description">{{ todo.description }}</span>
    <div class="row wrap justify-center items-center content-center tags">
      <span
        class="rounded-borders tag"
        v-for="tag in todo.tags"
        :key="tag.id"
        >{{ tag.name }}</span
      >
    </div>
    <q-btn
      class="edit-button"
      label="edit"
      icon="edit"
      dense
      @click.stop="editTodo"
    ></q-btn>
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
      isSelected: false,
      completed: this.todo.completed,
    };
  },
  methods: {
    async updateCompleted() {
      const id = this.todo.id;
      try {
        await api.patch(`/todos/${id}/completed`);
      } catch (error) {
        console.error(error);
      }
    },

    toggleSelected() {
      this.isSelected = !this.isSelected;
      this.$emit("select-todo", this.todo, this.isSelected);
    },

    editTodo() {
      this.$router.push({ path: `/${this.todo.id}` });
    },
  },
};
</script>

<style scoped>
.todo {
  padding-left: 10px;
  margin: 10px;
  border: 2px solid #f5e8b7;
  background-color: #f5e8b7;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  overflow-y: scroll;
  height: 350px;
  width: 250px;
  text-align: center;
}

.todo.selected {
  border: 2px solid #cd5c08;
  background-color: #f5e8b7;
  box-shadow: 0px 5px 35px 0px rgba(0, 0, 0, 0.1);
}

.todo:hover {
  box-shadow: 0px 5px 35px 0px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.todo-status {
  margin-top: 5%;
}

span.todo-title {
  margin-top: 5%;
  line-height: 30px;
  display: block;
  font-size: 30px;
  color: #cd5c08;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

span.todo-description {
  line-height: 20px;
  margin-top: 5%;
  display: block;
  font-size: 20px;
  color: #cd5c08;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
}

.tags {
  margin-top: 5%;
}

span.tag {
  padding: 4px 6px;
  margin: 4px;
  color: rgb(120, 120, 120);
  border: 1px solid rgba(106, 156, 137, 0.5);
  background: rgba(193, 216, 195, 0.5);
}

.edit-button {
  margin-top: 5%;
  margin-bottom: 5%;
}
</style>
