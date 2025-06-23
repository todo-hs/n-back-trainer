import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function TestScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Test Screen</Text>
      <Text style={styles.count}>Count: {count}</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Increment" 
          onPress={() => {
            setCount(count + 1);
            console.log('Button pressed, count:', count + 1);
          }} 
        />
        
        <Button 
          title="Show Alert" 
          onPress={() => {
            Alert.alert('Test', 'Alert works!');
          }} 
        />
        
        <Button 
          title="Reset" 
          onPress={() => {
            setCount(0);
            console.log('Reset pressed');
          }} 
          color="red"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  count: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
  },
});