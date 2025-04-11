import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const formData = { email, password };

    try {
      const response = await axios.post('http://192.168.29.26:3000/login', formData);
      console.log("Response", response.data);
      const { id } = response.data;
      await AsyncStorage.setItem('userId', id.toString());
      Alert.alert('Success', 'Login successful');
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error", error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}/>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}/>
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28, 
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50, 
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12, 
    paddingHorizontal: 12, 
    borderRadius: 6, 
    fontSize: 18, 
  },
  link: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});

export default Login;