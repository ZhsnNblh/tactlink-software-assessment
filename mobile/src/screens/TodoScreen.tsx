import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  GET_TODOS,
  CREATE_TODO,
  DELETE_TODO,
  UPDATE_TODO,
} from "../graphql/queries";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
};

type TodoScreenProps = {
  onLogout: () => void;
};

export default function TodoScreen({ onLogout }: TodoScreenProps) {
  const [newTodo, setNewTodo] = useState("");

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_TODOS);

  const [createTodo, { loading: creating }] =
    useMutation(CREATE_TODO);

  const [deleteTodo] = useMutation(DELETE_TODO);
  
  const [updateTodo] = useMutation(UPDATE_TODO);

  const todos: Todo[] = data?.todos ?? [];

  const addTodo = async () => {
    const title = newTodo.trim();

    if (!title) {
      return;
    }

    try {
      await createTodo({
        variables: {
          title,
        },
      });

      setNewTodo("");
      await refetch();
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to create the task."
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo({
        variables: {
          id,
        },
      });

      await refetch();
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to delete the task."
      );
    }
  };

  const toggleTodo = async (todo: Todo) => {
  try {
    await updateTodo({
      variables: {
        id: todo.id,
        completed: !todo.completed,
      },
    });

    await refetch();
  } catch (error) {
    Alert.alert(
      "Error",
      "Unable to update the task."
    );
  }
};

  const renderTodo = ({ item }: { item: Todo }) => (
  <View style={styles.todoItem}>
    <TouchableOpacity
      style={styles.todoContent}
      onPress={() => toggleTodo(item)}
    >
      <View
        style={[
          styles.checkbox,
          item.completed && styles.checkboxCompleted,
        ]}
      >
        {item.completed && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>

      <Text
        style={[
          styles.todoText,
          item.completed && styles.completedText,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(item.id)}
    >
      <Text style={styles.deleteText}>
        Delete
      </Text>
    </TouchableOpacity>
  </View>
);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Unable to load tasks.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Text style={styles.retryText}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          My Todos
        </Text>

        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logout}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task"
          value={newTodo}
          onChangeText={setNewTodo}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addTodo}
          disabled={creating}
        >
          <Text style={styles.addButtonText}>
            {creating ? "..." : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderTodo}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tasks yet. Add your first task!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  errorText: {
    marginBottom: 16,
  },

  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#222222",
    borderRadius: 8,
  },

  retryText: {
    color: "#ffffff",
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  logout: {
    fontSize: 15,
  },

  addContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },

  addButton: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222222",
  },

  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },

  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 8,
    marginBottom: 10,
  },

  todoText: {
    flex: 1,
    fontSize: 16,
    marginRight: 12,
  },

  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  deleteText: {
    fontSize: 14,
  },

  emptyText: {
    textAlign: "center",
    color: "#777777",
    marginTop: 40,
  },

  todoContent: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  marginRight: 12,
},

checkbox: {
  width: 24,
  height: 24,
  borderWidth: 1,
  borderColor: "#cccccc",
  borderRadius: 6,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
},

checkboxCompleted: {
  backgroundColor: "#222222",
  borderColor: "#222222",
},

checkmark: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "700",
},

completedText: {
  textDecorationLine: "line-through",
  color: "#888888",
},
});