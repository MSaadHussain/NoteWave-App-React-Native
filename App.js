// NoteWave/App.js
// This is the main entry point of the application, handling navigation.
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screen components
import AuthScreen from './src/screens/AuthScreen';
import NoteListScreen from './src/screens/NoteListScreen';
import NoteTakingScreen from './src/screens/NoteTakingScreen';

// Create a stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        {/* AuthScreen for username input. No custom props needed; navigation handles passing username. */}
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />

        {/* NoteListScreen to display and edit notes.
            It receives the username from AuthScreen via route.params. */}
        <Stack.Screen
          name="NoteList"
          component={NoteListScreen}
          options={{ headerShown: false }} // Hide default header for custom header content
        />

        {/* NoteTakingScreen to add new notes.
            It receives the username from NoteListScreen via route.params. */}
        <Stack.Screen
          name="NoteTaking"
          component={NoteTakingScreen}
          options={{ title: 'Add New Note' }} // Set title for the screen header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}