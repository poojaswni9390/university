import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Reset Password

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address", [{ text: "OK" }]);
      return;
    }
    try {
      const response = await axios.post("http://192.168.65.168:3000/api/forgot-password", { email });
      if (response.data.success) {
        Alert.alert("Success", "OTP sent to your email", [{ text: "OK" }]);
        setStep(2); // Move to OTP step
      } else {
        Alert.alert("Error", response.data.message, [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP", [{ text: "OK" }]);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP", [{ text: "OK" }]);
      return;
    }
    try {
      const response = await axios.post("http://192.168.65.168:3000/api/verify-otp", { email, otp });
      if (response.data.success) {
        Alert.alert("Success", "OTP verified. Proceed to reset your password.", [{ text: "OK" }]);
        setStep(3); // Move to Reset Password step
      } else {
        Alert.alert("Error", response.data.message, [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP", [{ text: "OK" }]);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      Alert.alert("Error", "Please fill in all fields", [{ text: "OK" }]);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "Passwords do not match", [{ text: "OK" }]);
      return;
    }
    try {
      const response = await axios.post("http://192.168.65.168:3000/api/reset-password", {
        email,
        newPassword,
        confirmnewPassword: confirmNewPassword,
      });
      if (response.data.success) {
        Alert.alert("Success", "Password reset successful", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", response.data.message, [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to reset password", [{ text: "OK" }]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        {/* Step 1: Enter Email */}
        {step >= 1 && (
          <>
            <Text style={styles.subtitle}>Enter your email address to receive an OTP.</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {step === 1 && (
              <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
                <Text style={styles.buttonText}>SEND OTP</Text>
                <Ionicons name="arrow-forward-outline" size={20} color="#fff" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            )}
          </>
        )}
        {/* Step 2: Enter OTP */}
        {step >= 2 && (
          <>
            <Text style={styles.subtitle}>Enter the OTP sent to your email.</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="key-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />
            </View>
            {step === 2 && (
              <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                <Text style={styles.buttonText}>VERIFY OTP</Text>
                <Ionicons name="checkmark-outline" size={20} color="#fff" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            )}
          </>
        )}
        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <Text style={styles.subtitle}>Enter your new password.</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>RESET PASSWORD</Text>
              <Ionicons name="refresh-outline" size={20} color="#fff" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
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
  button: {
    flexDirection: "row",
    backgroundColor: "#002B5B",
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backText: {
    alignSelf: "center",
    color: "#002B5B",
    fontWeight: "bold",
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default ForgotPassword;