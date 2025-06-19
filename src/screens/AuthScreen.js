// NoteWave/src/screens/AuthScreen.js
// This screen handles the user entering their username.
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles'; // Import global styles

// Corrected: Removed setUsername from props destructuring as it's no longer passed from App.js.
// The username is now passed directly as a navigation parameter.
const AuthScreen = ({ navigation }) => {
  const [inputUsername, setInputUsername] = useState('');

  // Function to handle "Sign In" button press
  const handleSignIn = () => {
    // Check if the username is not empty
    if (inputUsername.trim()) {
      // Navigate to NoteList screen, replacing the current screen and passing username
      navigation.replace('NoteList', { username: inputUsername.trim() });
    } else {
      // Basic validation for empty username
      alert('Please enter a username to continue.');
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Welcome to NoteWave!</Text>
      <Text style={styles.subtitle}>Enter your username to start collaborating:</Text>
      <TextInput
        style={GlobalStyles.input}
        placeholder="Enter your username"
        value={inputUsername}
        onChangeText={setInputUsername}
        autoCapitalize="none" // Prevent auto-capitalization for usernames
      />
      <TouchableOpacity style={GlobalStyles.button} onPress={handleSignIn}>
        <Text style={GlobalStyles.buttonText}>Sign In / Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default AuthScreen;