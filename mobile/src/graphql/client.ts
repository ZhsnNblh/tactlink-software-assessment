import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const httpLink = new HttpLink({
  uri: "http://192.168.0.3:4000/",
  headers: {
    get authorization() {
      return authToken ? `Bearer ${authToken}` : "";
    },
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});