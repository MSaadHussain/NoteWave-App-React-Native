// NoteWave/src/screens/NoteTakingScreen.js
// This screen allows users to add new notes.
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ref, push, serverTimestamp } from 'firebase/database';
import { database } from '../../firebaseConfig'; // Import the database instance
import GlobalStyles from '../styles/GlobalStyles'; // Import global styles

const NoteTakingScreen = ({ navigation, route }) => {
  // Get the current username from the route parameters
  const { username } = route.params;
  const [noteText, setNoteText] = useState('');

  // Function to handle saving a new note
  const handleSaveNote = async () => {
    // Check if the note text is not empty AND username is available
    if (noteText.trim() && username) {
      try {
        // Get a reference to the 'notes' collection in Realtime Database
        const notesRef = ref(database, 'notes');
        // Push a new note object to the database
        await push(notesRef, {
          text: noteText.trim(),
          username: username,
          timestamp: serverTimestamp(), // Firebase's server timestamp
        });
        setNoteText(''); // Clear the input field after saving
        navigation.goBack(); // Go back to the NoteList screen
      } catch (error) {
        console.error("Error saving note: ", error);
        alert("Failed to save note. Please try again.");
      }
    } else {
      // Provide specific feedback if username is missing or note is empty
      if (!username) {
        alert('You are not signed in. Please go back and enter a username.');
      } else {
        alert('Note cannot be empty.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={GlobalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
    >
      <Text style={GlobalStyles.title}>Create New Note</Text>
      {username && <Text style={GlobalStyles.loggedInAs}>Logged in as: {username}</Text>}
      <TextInput
        style={[GlobalStyles.input, styles.noteInput]} // Apply global input style and specific note input style
        placeholder="Write your note here..."
        multiline // Allow multiple lines of text
        value={noteText}
        onChangeText={setNoteText}
        textAlignVertical="top" // Align text to the top for multiline input
      />
      <TouchableOpacity style={GlobalStyles.button} onPress={handleSaveNote}>
        <Text style={GlobalStyles.buttonText}>Save Note</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  noteInput: {
    height: 200, // Make the note input taller
    paddingTop: 15, // Add padding to the top for multiline input
  },
});

export default NoteTakingScreen;