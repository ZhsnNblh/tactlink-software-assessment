import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client/react";

import { apolloClient } from "./src/graphql/client";
import { setAuthToken } from "./src/graphql/client";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = (newToken: string) => {
    setAuthToken(newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setToken(null);
  };

  return (
    <ApolloProvider client={apolloClient}>
      <AppNavigator
        token={token}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </ApolloProvider>
  );
}