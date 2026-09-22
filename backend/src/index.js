const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

// Temporary in-memory data storage
const users = [];
const todos = [];

function getUserFromToken(token) {
  if (!token) {
    return null;
  }

  const userId = token.replace("dummy-token-", "");

  return users.find((user) => user.id === userId) || null;
}

// GraphQL schema
const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    userId: ID!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
  todos: [Todo!]!
}

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    createTodo(title: String!): Todo!

    updateTodo(
      id: ID!
      title: String
      completed: Boolean
    ): Todo!

    deleteTodo(id: ID!): Boolean!
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
  todos: (_, __, context) => {
    if (!context.user) {
      throw new Error("Authentication required");
    }

    return todos.filter(
      (todo) => todo.userId === context.user.id
    );
  },
},

  Mutation: {
    signup: (_, { email, password }) => {
      // Prevent duplicate accounts
      const existingUser = users.find((user) => user.email === email);

      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = {
        id: String(users.length + 1),
        email,
        password,
      };

      users.push(user);

      return {
        token: `dummy-token-${user.id}`,
        user,
      };
    },

    login: (_, { email, password }) => {
      const user = users.find(
        (user) =>
          user.email === email && user.password === password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      return {
        token: `dummy-token-${user.id}`,
        user,
      };
    },

    createTodo: (_, { title }, context) => {
  if (!context.user) {
    throw new Error("Authentication required");
  }

  const todo = {
    id: String(todos.length + 1),
    title,
    completed: false,
    userId: context.user.id,
  };

  todos.push(todo);

  return todo;
},

    updateTodo: (_, { id, title, completed }, context) => {
  if (!context.user) {
    throw new Error("Authentication required");
  }

  const todo = todos.find(
    (todo) =>
      todo.id === id &&
      todo.userId === context.user.id
  );

  if (!todo) {
    throw new Error("Todo not found");
  }

  if (title !== undefined) {
    todo.title = title;
  }

  if (completed !== undefined) {
    todo.completed = completed;
  }

  return todo;
},

    deleteTodo: (_, { id }, context) => {
  if (!context.user) {
    throw new Error("Authentication required");
  }

  const index = todos.findIndex(
    (todo) =>
      todo.id === id &&
      todo.userId === context.user.id
  );

  if (index === -1) {
    throw new Error("Todo not found");
  }

  todos.splice(index, 1);

  return true;
},
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 4000 },

    context: async ({ req }) => {
      const authHeader = req.headers.authorization || "";

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null;

      const user = getUserFromToken(token);

      return {
        user,
      };
    },
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();