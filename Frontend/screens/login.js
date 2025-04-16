import React from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,} from "react-native";
import { useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const Login = ({ navigation }) => {
  const { setValue, handleSubmit, reset } = useForm();
  const onLogin = async (data) => {
    const { email, password } = data;

    if (!email || !password) {
      Alert.alert("Error", "Please enter all fields", [{ text: "OK" }]);
      return;
    }

    try {
      const formData = { email, password };
      const response = await axios.post('http://192.168.65.168:3000/login', formData);
      console.log("Response", response.data);

      const { id } = response.data;
      await AsyncStorage.setItem('userId', id.toString());
      Alert.alert('Success', 'Login successful');
      reset();
      navigation.replace("Home");
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Invalid email or password", [{ text: "OK" }]);
    }
  };
  return (
    
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Please sign in to continue.</Text>
        {/* Email Field */}
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => setValue("email", text)}  keyboardType="email-address" autoCapitalize="none" />
        </View>
        {/* Password Field */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Password"  onChangeText={(text) => setValue("password", text)} secureTextEntry/>
        </View>
        {/* Forgot Password */}
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
        </TouchableOpacity>
        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onLogin)}>
          <Text style={styles.buttonText}>LOGIN</Text>
          <Ionicons name="arrow-forward-outline" size={20} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
        {/* Sign up */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text style={styles.signupLink}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#D9E3F0",
    borderRadius: 25,
    padding: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 2, 
    borderColor: "#002B5B", 
    borderRadius: 35,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fdfdfd",
  },
  icon: {
    marginRight: 8,
    color: "#002B5B",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  forgotText: {
    alignSelf: "flex-end",
    color: "#002B5B",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#002B5B",
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  signupText: {
    fontSize: 19,
    color: "#666",
  },
  signupLink: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#002B5B",
    textDecorationLine: "underline",
  },
});
export default Login;