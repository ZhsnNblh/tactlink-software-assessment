import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import TodoScreen from "../screens/TodoScreen";

export type RootStackParamList = {
  Login: undefined;
  Todo: undefined;
};

type AppNavigatorProps = {
  token: string | null;
  onLogin: (token: string) => void;
  onLogout: () => void;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator({
  token,
  onLogin,
  onLogout,
}: AppNavigatorProps) {
  const handleLogin = (token: string) => {
  onLogin(token);
};

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {() => <LoginScreen onLogin={handleLogin} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="Todo"
            options={{ title: "My Todos" }}
          >
            {() => <TodoScreen onLogout={onLogout} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}