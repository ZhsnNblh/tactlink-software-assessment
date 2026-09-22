import { useMemo, useState } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import {
  ApolloProvider,
  useMutation,
  useQuery,
} from "@apollo/client/react";

import {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  GET_TODOS,
  CREATE_TODO,
  DELETE_TODO,
  UPDATE_TODO,
} from "./graphql";

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL ||
  "http://192.168.0.3:4000/";

function App() {
  const [token, setToken] = useState(null);

  const client = useMemo(() => {
    return new ApolloClient({
      link: new HttpLink({
        uri: GRAPHQL_URL,
        headers: token
          ? {
              authorization: `Bearer ${token}`,
            }
          : {},
      }),
      cache: new InMemoryCache(),
    });
  }, [token]);

  return (
    <ApolloProvider client={client}>
      {token ? (
        <TodoPage onLogout={() => setToken(null)} />
      ) : (
        <LoginPage onLogin={setToken} />
      )}
    </ApolloProvider>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const [login, { loading: loginLoading }] =
    useMutation(LOGIN_MUTATION);

  const [signup, { loading: signupLoading }] =
    useMutation(SIGNUP_MUTATION);

  const loading = loginLoading || signupLoading;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const mutation = isSignup ? signup : login;

      const { data } = await mutation({
        variables: {
          email,
          password,
        },
      });

      const authData = isSignup
        ? data?.signup
        : data?.login;

      if (authData?.token) {
        onLogin(authData.token);
      }
    } catch (error) {
      console.error(error);

      alert(
        isSignup
          ? "Unable to create account. The email may already be registered."
          : "Invalid email or password."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>TactLink Todo</h1>

        <p>
          {isSignup
            ? "Create an account to manage your tasks"
            : "Sign in to manage your tasks"}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        <button
          type="button"
          className="switch-button"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

function TodoPage({ onLogout }) {
  const [newTodo, setNewTodo] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_TODOS);

  const [createTodo, { loading: creating }] =
    useMutation(CREATE_TODO);

  const [deleteTodo] = useMutation(DELETE_TODO);

  const [updateTodo] = useMutation(UPDATE_TODO);

  const todos = data?.todos ?? [];

  const handleAddTodo = async (event) => {
    event.preventDefault();

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
      console.error(error);
      alert("Unable to create the task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo({
        variables: {
          id,
        },
      });

      await refetch();
    } catch (error) {
      console.error(error);
      alert("Unable to delete the task.");
    }
  };

  const handleToggle = async (todo) => {
    try {
      await updateTodo({
        variables: {
          id: todo.id,
          completed: !todo.completed,
        },
      });

      await refetch();
    } catch (error) {
      console.error(error);
      alert("Unable to update the task.");
    }
  };

  return (
    <div className="todo-page">
      <div className="todo-container">
        <div className="todo-header">
          <div>
            <h1>My Todos</h1>
            <p>Manage your tasks</p>
          </div>

          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>

        <form className="add-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
          />

          <button type="submit" disabled={creating}>
            {creating ? "Adding..." : "Add Task"}
          </button>
        </form>

        {loading && <p>Loading tasks...</p>}

        {error && (
          <p className="error-message">
            Unable to load tasks.
          </p>
        )}

        {!loading && !error && todos.length === 0 && (
          <div className="empty-state">
            <p>No tasks yet.</p>
            <span>Add your first task above.</span>
          </div>
        )}

        <div className="todo-list">
          {todos.map((todo) => (
            <div className="todo-item" key={todo.id}>
              <div className="todo-left">
                <button
                  className={`checkbox ${
                    todo.completed ? "completed" : ""
                  }`}
                  onClick={() => handleToggle(todo)}
                >
                  {todo.completed ? "✓" : ""}
                </button>

                <span
                  className={
                    todo.completed ? "todo-title completed-title" : "todo-title"
                  }
                >
                  {todo.title}
                </span>
              </div>

              <button
                className="delete-button"
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;