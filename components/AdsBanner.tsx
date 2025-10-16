import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Note: Google Mobile Ads require a development build in Expo SDK 53+
// This is a placeholder component for Expo Go compatibility
export default function AdsBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ad placeholder - requires development build</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    color: '#666',
    fontSize: 12,
  },
});
