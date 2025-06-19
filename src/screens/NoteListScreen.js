// NoteWave/src/screens/NoteListScreen.js
// This screen displays notes and allows for inline editing.
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../firebaseConfig'; // Import the database instance
import GlobalStyles from '../styles/GlobalStyles'; // Import global styles

const NoteListScreen = ({ navigation, route }) => {
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNoteText, setEditedNoteText] = useState('');
  const [loading, setLoading] = useState(true);

  // Get the current username from the route parameters (passed from AuthScreen)
  // `route.params` will contain the `username` property.
  const { username } = route.params;

  useEffect(() => {
    // Create a reference to the 'notes' path in Realtime Database
    const notesRef = ref(database, 'notes');

    // Attach a listener to fetch notes in real-time
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val(); // Get the snapshot value
      const notesList = [];
      if (data) {
        // Iterate through the data and format it into an array
        for (const id in data) {
          notesList.push({ id, ...data[id] });
        }
      }
      // Sort notes by timestamp in descending order (latest first)
      notesList.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setNotes(notesList);
      setLoading(false); // Set loading to false once data is fetched
    }, (error) => {
      // Handle any errors during data fetching
      console.error("Error fetching notes: ", error);
      setLoading(false);
      alert("Failed to load notes. Please check your internet connection.");
    });

    // Cleanup function: detach the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Function to handle starting inline editing
  const handleEdit = (note) => {
    // Only allow editing if the current user is the author of the note
    if (username === note.username) {
      setEditingNoteId(note.id);
      setEditedNoteText(note.text);
    } else {
      alert("You can only edit notes that you created.");
    }
  };

  // Function to handle saving edited notes
  const handleSaveEdit = async (noteId) => {
    if (editedNoteText.trim()) {
      try {
        // Update the specific note in Firebase Realtime Database
        const noteRef = ref(database, `notes/${noteId}`);
        await update(noteRef, { text: editedNoteText.trim() });
        setEditingNoteId(null); // Exit editing mode
        setEditedNoteText(''); // Clear edited text
      } catch (error) {
        console.error("Error updating note: ", error);
        alert("Failed to update note. Please try again.");
      }
    } else {
      alert("Note text cannot be empty.");
    }
  };

  // Function to format timestamp into a readable string
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No date';
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format date and time according to locale
  };

  // Render function for each note item in the FlatList
  const renderNoteItem = ({ item }) => (
    <View style={GlobalStyles.card}>
      {editingNoteId === item.id ? (
        // Render TextInput for editing mode
        <TextInput
          style={[GlobalStyles.input, styles.editableNoteText]} // Apply global input style and specific editable style
          value={editedNoteText}
          onChangeText={setEditedNoteText}
          multiline
          onBlur={() => handleSaveEdit(item.id)} // Save on blur (when focus leaves the input)
          autoFocus // Automatically focus the input when it appears
        />
      ) : (
        // Render Text for display mode
        <TouchableOpacity onLongPress={() => handleEdit(item)}>
          <Text style={GlobalStyles.noteText}>{item.text}</Text>
        </TouchableOpacity>
      )}
      <Text style={GlobalStyles.noteMeta}>
        by {item.username} at {formatTimestamp(item.timestamp)}
      </Text>
      {editingNoteId === item.id && (
        // Show a "Save" button when in editing mode
        <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveEdit(item.id)}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[GlobalStyles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading Notes...</Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.headerContainer}>
        <Text style={GlobalStyles.headerText}>NoteWave</Text>
        <TouchableOpacity
          style={GlobalStyles.addNoteButton}
          // Pass username from this screen's route params to NoteTakingScreen
          onPress={() => navigation.navigate('NoteTaking', { username })}
        >
          <Text style={GlobalStyles.addNoteButtonText}>Add Note</Text>
        </TouchableOpacity>
      </View>
      {/* Display the logged-in username */}
      {username && <Text style={GlobalStyles.loggedInAs}>Logged in as: {username}</Text>}

      {notes.length === 0 ? (
        <Text style={styles.noNotesText}>No notes yet. Start by adding one!</Text>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id} // Use item.id as the key
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  flatListContent: {
    paddingBottom: 20, // Add some padding to the bottom of the list
  },
  editableNoteText: {
    height: 100, // Adjust height for editable note
    paddingVertical: 10,
  },
  saveButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-end', // Align button to the right
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noNotesText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});

export default NoteListScreen;