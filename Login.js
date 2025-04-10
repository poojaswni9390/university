import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const Login = ({ onLoginSuccess, onNavigateToSignup, onNavigateToForgotPassword }) => {
  const navigation = useNavigation();
  const { control, handleSubmit, reset } = useForm();

  const onLogin = async (data) => {
    if (!data.email || !data.password) {
      Alert.alert("Error", "Please enter all fields", [{ text: "OK" }]);
      return;
    }

    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(storedUserData);

      if (userData.email === data.email && userData.password === data.password) {
        console.log("Login Data:", data);
        await AsyncStorage.setItem("userToken", "dummyToken"); // Store user session
        reset();
        onLoginSuccess();
        navigation.replace("HomeTabs"); // Corrected navigation
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        rules={{ required: "Email is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        rules={{ required: "Password is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onLogin)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={onNavigateToForgotPassword}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Sign Up Section */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={onNavigateToSignup}>
          <Text style={styles.signupLink}> Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  forgotText: {
    marginTop: 10,
    color: "#007bff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: "#333",
  },
  signupLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
});

export default Login;
