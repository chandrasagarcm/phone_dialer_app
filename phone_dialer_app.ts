import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, PermissionsAndroid, FlatList } from 'react-native';
import CallDetectorManager from 'react-native-call-detection';

const DialerApp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callLogs, setCallLogs] = useState([]);

  const requestPermissions = async () => {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CALL_LOG);
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
    } catch (err) {
      console.warn(err);
    }
  };

  const makeCall = () => {
    if (phoneNumber.length > 0) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const startCallListener = () => {
    new CallDetectorManager((event, number) => {
      if (event === 'Incoming' || event === 'Outgoing' || event === 'Missed') {
        setCallLogs(prevLogs => [{ number, event }, ...prevLogs]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Dialer</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity style={styles.button} onPress={makeCall}>
        <Text style={styles.buttonText}>Call</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Recent Calls</Text>
      <FlatList
        data={callLogs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.log}>{item.event}: {item.number}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  input: { borderBottomWidth: 1, marginVertical: 20, fontSize: 18, padding: 10 },
  button: { backgroundColor: '#007AFF', padding: 15, alignItems: 'center', borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 18 },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  log: { fontSize: 16, marginVertical: 5 }
});

export default DialerApp;
