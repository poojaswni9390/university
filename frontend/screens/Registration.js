import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,ScrollView,Image,Modal,} from "react-native";
import { useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";  
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";  
import DateTimePickerModal from "react-native-modal-datetime-picker";  
import { Picker } from "@react-native-picker/picker";  
import * as ImagePicker from "expo-image-picker";   
import axios from "axios"; // Add axios import
import config from "../screens/config.js";
const API = config.IP_Address; // Use the IP address from config.js


const Registration = ({ navigation }) => {
  const { setValue, handleSubmit, reset, getValues } = useForm();
  const [gender, setGender] = useState("");
  const [focusedField, setFocusedField] = useState("");  
  const [inputValues, setInputValues] = useState({
    full_name: "",
    email: "",
    dob: "",
    phone: "",
    address: "",
    father_name: "",
    mother_name: "",
    password: "",  
    confirm_password: "", 
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    objective: "",
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); 
  const [currentSection, setCurrentSection] = useState("personal"); 
  const [educationEntries, setEducationEntries] = useState([
    {
      institution_name: "",
      degree: "",
      branch: "",
      start_year: "",
      end_year: "",
      grade: "",
    },
  ]);
  const [skills, setSkills] = useState([
    { skill_name: "", proficiency_level: "" },
  ]);
  const [workExperience, setWorkExperience] = useState([
    {
      company_name: "",
      role: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
    },
  ]);
  const [projects, setProjects] = useState([
    { project_title: "", technologies_used: "", description: "", project_link: "" },
  ]);
  const [certifications, setCertifications] = useState([
    { certificate_name: "", issuing_organization: "", issue_date: "", certificate_link: "" },
  ]);
  const [achievements, setAchievements] = useState([
    { title: "", description: "", date: "" },
  ]);
  const [languages, setLanguages] = useState([
    { language_name: "", proficiency_level: "" },
  ]);
  const [hobbies, setHobbies] = useState([{ hobby_name: "" }]);
  const [references, setReferences] = useState([
    { reference_name: "", relation: "", contact_info: "" },
  ]);
  const [optionalAddOns, setOptionalAddOns] = useState({
    profile_photo_url: "",
    signature: "",
  }); 
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const [isChecked, setIsChecked] = useState(false); // State for checkbox 
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false); 
  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    handleInputChange("dob", formattedDate);
    hideDatePicker();
  }; 
  const handleInputChange = (field, value) => {
    setInputValues({ ...inputValues, [field]: value });
    setValue(field, value);
  }; 
  const handleEducationChange = (index, field, value) => {
    if (field === "grade" && isNaN(value)) {
      Alert.alert("Error", "Please enter a valid numeric value for Grade or Percentage", [{ text: "OK" }]);
      return;
    }
    const updatedEntries = [...educationEntries];
    updatedEntries[index][field] = value;
    setEducationEntries(updatedEntries);
  }; 
  const addEducationEntry = () => {
    setEducationEntries([
      ...educationEntries,
      {
        institution_name: "",
        degree: "",
        branch: "",
        start_year: "",
        end_year: "",
        grade: "",
      },
    ]);
  }; 
  const removeEducationEntry = (index) => {
    const updatedEntries = educationEntries.filter((_, i) => i !== index);
    setEducationEntries(updatedEntries);
  }; 
  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = value;
    setSkills(updatedSkills);
  }; 
  const addSkill = () => {
    setSkills([...skills, { skill_name: "", proficiency_level: "" }]);
  }; 
  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  }; 
  const handleWorkChange = (index, field, value) => {
    const updatedWork = [...workExperience];
    updatedWork[index][field] = value;
    setWorkExperience(updatedWork);
  }; 
  const addWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      { company_name: "", role: "", start_date: "", end_date: "", is_current: false, description: "" },
    ]);
  }; 
  const removeWorkExperience = (index) => {
    const updatedWork = workExperience.filter((_, i) => i !== index);
    setWorkExperience(updatedWork);
  }; 
  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  }; 
  const addProject = () => {
    setProjects([...projects, { project_title: "", technologies_used: "", description: "", project_link: "" }]);
  }; 
  const removeProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  }; 
  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...certifications];
    updatedCertifications[index][field] = value;
    setCertifications(updatedCertifications);
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      { certificate_name: "", issuing_organization: "", issue_date: "", certificate_link: "" },
    ]);
  };

  const removeCertification = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
  };

  const handleAchievementChange = (index, field, value) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[index][field] = value;
    setAchievements(updatedAchievements);
  };

  const addAchievement = () => {
    setAchievements([...achievements, { title: "", description: "", date: "" }]);
  };

  const removeAchievement = (index) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(updatedAchievements);
  };

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index][field] = value;
    setLanguages(updatedLanguages);
  };

  const addLanguage = () => {
    setLanguages([...languages, { language_name: "", proficiency_level: "" }]);
  };

  const removeLanguage = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
  };

  const handleHobbyChange = (index, value) => {
    const updatedHobbies = [...hobbies];
    updatedHobbies[index].hobby_name = value;
    setHobbies(updatedHobbies);
  };

  const addHobby = () => {
    setHobbies([...hobbies, { hobby_name: "" }]);
  };

  const removeHobby = (index) => {
    const updatedHobbies = hobbies.filter((_, i) => i !== index);
    setHobbies(updatedHobbies);
  };

  const handleReferenceChange = (index, field, value) => {
    const updatedReferences = [...references];
    updatedReferences[index][field] = value;
    setReferences(updatedReferences);
  };

  const addReference = () => {
    setReferences([...references, { reference_name: "", relation: "", contact_info: "" }]);
  };

  const removeReference = (index) => {
    const updatedReferences = references.filter((_, i) => i !== index);
    setReferences(updatedReferences);
  };

  const handleOptionalAddOnChange = (field, value) => {
    setOptionalAddOns({ ...optionalAddOns, [field]: value });
  };

  const handleProfilePhotoUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to allow access to your media library to upload a photo.", [{ text: "OK" }]);
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setOptionalAddOns({ ...optionalAddOns, profile_photo_url: result.assets[0].uri });
    }
  };

  // Define sectionProgress and totalSections
  const sectionProgress = {
    personal: 1,
    education: 2,
    skills: 3,
    work_experience: 4,
    projects: 5,
    certifications: 6,
    achievements: 7,
    languages: 8,
    hobbies: 9,
    references: 10,
  };

  const totalSections = Object.keys(sectionProgress).length; // Calculate total sections

  const onNext = async () => {
    try {
      const data = getValues();

      if (currentSection === "personal") {
        if (
          !data.full_name ||
          !data.email ||
          !data.dob ||
          !data.phone ||
          !data.address ||
          !data.father_name ||
          !data.mother_name ||
          !data.password || // Validate password
          !data.confirm_password || // Validate confirm password
          !gender // Validate gender as mandatory
        ) {
          Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
          return;
        }

        if (data.password !== data.confirm_password) {
          Alert.alert("Error", "Passwords do not match", [{ text: "OK" }]);
          return;
        }

        if (!data.email.includes("@gmail.com")) {
          Alert.alert("Error", "Please enter a valid email address", [{ text: "OK" }]);
          return;
        }

        await AsyncStorage.setItem("personalDetails", JSON.stringify({ ...data, gender }));
        setCurrentSection("education");
      } else if (currentSection === "education") {
        for (const entry of educationEntries) {
          if (
            !entry.institution_name ||
            !entry.degree ||
            !entry.branch ||
            !entry.start_year ||
            !entry.end_year ||
            !entry.grade
          ) {
            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
            return;
          }
        }

        await AsyncStorage.setItem("educationDetails", JSON.stringify(educationEntries));
        setCurrentSection("skills");
      } else if (currentSection === "skills") {
        for (const skill of skills) {
          if (!skill.skill_name || !skill.proficiency_level) {
            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
            return;
          }
        }

        await AsyncStorage.setItem("skillsDetails", JSON.stringify(skills));
        setCurrentSection("work_experience");
      } else if (currentSection === "work_experience") {
        for (const work of workExperience) {
          if (!work.company_name || !work.role || !work.start_date || (!work.is_current && !work.end_date)) {
            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
            return;
          }
        }

        await AsyncStorage.setItem("workExperienceDetails", JSON.stringify(workExperience));
        setCurrentSection("projects");
      } else if (currentSection === "projects") {
        for (const project of projects) {
          if (!project.project_title || !project.technologies_used || !project.description) {
            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
            return;
          }
        }

        await AsyncStorage.setItem("projectsDetails", JSON.stringify(projects));
        setCurrentSection("certifications");
      } else if (currentSection === "certifications") {
        for (const cert of certifications) {
          if (!cert.certificate_name || !cert.issuing_organization || !cert.issue_date) {
            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
            return;
          }
        }

        await AsyncStorage.setItem("certificationsDetails", JSON.stringify(certifications));
        setCurrentSection("achievements");
      } else if (currentSection === "achievements") {
        for (const achievement of achievements) {
          if (!achievement.title || !achievement.description) {
            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
            return;
          }
        }

        await AsyncStorage.setItem("achievementsDetails", JSON.stringify(achievements));
        setCurrentSection("languages");
      } else if (currentSection === "languages") {
        for (const language of languages) {
          if (!language.language_name || !language.proficiency_level) {
            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
            return;
          }
        }

        await AsyncStorage.setItem("languagesDetails", JSON.stringify(languages));
        setCurrentSection("hobbies");
      } else if (currentSection === "hobbies") {
        for (const hobby of hobbies) {
          if (!hobby.hobby_name) {
            Alert.alert("Error", "Please fill all fields for each hobby or interest", [{ text: "OK" }]);
            return;
          }
        }

        await AsyncStorage.setItem("hobbiesDetails", JSON.stringify(hobbies));
        setCurrentSection("references");
      } else if (currentSection === "references") {
        for (const reference of references) {
          if (!reference.reference_name || !reference.relation || !reference.contact_info) {
            Alert.alert("Error", "Please fill all fields for each reference", [{ text: "OK" }]);
            return;
          }
        }

        await AsyncStorage.setItem("referencesDetails", JSON.stringify(references));
        await AsyncStorage.setItem("optionalAddOns", JSON.stringify(optionalAddOns));
        Alert.alert("Success", "All details saved successfully!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      }
    } catch (error) {
      console.error("Error storing data:", error);
      Alert.alert("Error", "Failed to save data. Please try again.", [{ text: "OK" }]);
    }
  };

  const onSubmit = async () => {
    try {
      // Register user and get userId
      const registerData = {
        fullname: inputValues.full_name,
        email: inputValues.email,
        password: inputValues.password,
        contactnumber: inputValues.phone,
        address: inputValues.address,
        dob: inputValues.dob,
        fatherName: inputValues.father_name,
        motherName: inputValues.mother_name,
        linkedinUrl: inputValues.linkedin_url,
        githubUrl: inputValues.github_url || null,
        portfolioUrl: inputValues.portfolio_url || null,
        objective: inputValues.objective,
        languages: languages.map((lang) => ({
          languageName: lang.language_name,
          proficiencyLevel: lang.proficiency_level,
        })),
        hobbies: hobbies.map((hobby) => hobby.hobby_name),
        gender,
      };

      const registerResponse = await axios.post(`${API}/register`, registerData);
      const userId = registerResponse.data.userId; // Extract userId from the response

      if (!userId) {
        throw new Error("User ID not returned from registration");
      }

      // Prepare and send education details
      const educationData = educationEntries.map((entry) => ({
        userId, // Include userId
        institutionName: entry.institution_name,
        degree: entry.degree,
        branch: entry.branch,
        startYear: parseInt(entry.start_year, 10),
        endYear: parseInt(entry.end_year, 10),
        grade: entry.grade || null,
        skills: skills.map((skill) => ({
          skillName: skill.skill_name,
          proficiencyLevel: skill.proficiency_level,
        })),
        certificate_info: certifications.map((cert) => ({
          certificate_name: cert.certificate_name,
          issuing_organization: cert.issuing_organization,
          issue_date: cert.issue_date,
          certificate_link: cert.certificate_link,
        })),
      }));

      for (const edu of educationData) {
        await axios.post(`${API}/education`, edu);
      }

      // Prepare and send project experience details
      const projectExperienceData = {
        userId, // Include userId
        projectDetails: projects.map((project) => ({
          project_title: project.project_title,
          technologies_used: project.technologies_used,
          description: project.description,
          project_link: project.project_link || null,
        })),
        achievements: achievements.map((ach) => ({
          achievement_title: ach.title,
          achievement_description: ach.description,
          achievement_date: ach.date,
        })),
        workExperienceInfo: workExperience.map((work) => ({
          company_name: work.company_name || "",
          role_or_designation: work.role || "",
          start_date: work.start_date || null,
          end_date: work.end_date || null,
          work_description: work.description || "",
        })),
        referenceName: references[0]?.reference_name || "",
        referenceRelation: references[0]?.relation || "",
        referenceContactInfo: references[0]?.contact_info || "",
        profilePhotoUrl: optionalAddOns.profile_photo_url || null,
        signature: optionalAddOns.signature || null,
      };

      await axios.post("$/project-experience", projectExperienceData);

      // Clear AsyncStorage after successful submission
      await AsyncStorage.clear();

      Alert.alert("Success", "All details submitted successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert("Error", "Failed to submit data. Please try again.", [{ text: "OK" }]);
    }
  };

  const handleViewDetails = () => {
    // Validate all fields before showing the modal
    if (
      !inputValues.full_name ||
      !inputValues.email ||
      !inputValues.dob ||
      !inputValues.phone ||
      !inputValues.address ||
      !inputValues.father_name ||
      !inputValues.mother_name ||
      !inputValues.password ||
      !inputValues.confirm_password ||
      !gender
    ) {
      Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
      return;
    }
  
    if (inputValues.password !== inputValues.confirm_password) {
      Alert.alert("Error", "Passwords do not match", [{ text: "OK" }]);
      return;
    }
  
    setIsModalVisible(true); // Show the modal
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Step Indicator */}
      <View style={styles.progressBar}>
      
      <Text style={styles.stepIndicator}>
        Step {sectionProgress[currentSection]} of {totalSections}
      </Text>
      </View>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
      <View style={styles.progressBarContainer}>

        {Array.from({ length: totalSections }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              index < sectionProgress[currentSection] ? styles.activeSegment : styles.inactiveSegment,
            ]}
          />
        ))}
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.card}>
            {currentSection === "personal" ? (
              <>
                <Text style={styles.header}>Personal Details</Text>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Full Name Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "full_name" && styles.inputWrapperFocused,
                    ]}
                  >
                    <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={inputValues.full_name}
                      onChangeText={(text) => handleInputChange("full_name", text)}
                      placeholder="Full Name *"
                      placeholderTextColor="#aaa"
                      onFocus={() => setFocusedField("full_name")}
                      onBlur={() => setFocusedField("")}
                    />
                  </View> 
                  {/* Email Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "email" && styles.inputWrapperFocused,
                    ]}
                  >
                    <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={inputValues.email}
                      onChangeText={(text) => handleInputChange("email", text)}
                      placeholder="Email *"
                      placeholderTextColor="#aaa"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField("")}
                    />
                  </View> 
                  {/* DOB Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "dob" && styles.inputWrapperFocused,
                    ]}
                  >
                    <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
                    <TouchableOpacity
                      style={styles.input}
                      onPress={showDatePicker}
                    >
                      <Text style={{ color: inputValues.dob ? "#000" : "#aaa" }}>
                        {inputValues.dob || "Date of Birth (YYYY-MM-DD) *"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  /> 
                  {/* Phone Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "phone" && styles.inputWrapperFocused,
                    ]}
                  >
                    <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={inputValues.phone}
                      onChangeText={(text) => handleInputChange("phone", text)}
                      placeholder="Phone *"
                      placeholderTextColor="#aaa"
                      keyboardType="phone-pad"
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField("")}
                    />
                  </View> 
                  {/* Address Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "address" && styles.inputWrapperFocused,
                    ]}
                  >
                    <Ionicons name="home-outline" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={inputValues.address}
                      onChangeText={(text) => handleInputChange("address", text)}
                      placeholder="Address *"
                      placeholderTextColor="#aaa"
                      onFocus={() => setFocusedField("address")}
                      onBlur={() => setFocusedField("")}
                    />
                  </View> 
                  {/* Father Name Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "father_name" && styles.inputWrapperFocused,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="face-man-outline"
                      size={20}
                      color="#888"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      value={inputValues.father_name}
                      onChangeText={(text) => handleInputChange("father_name", text)}
                      placeholder="Father Name *"
                      placeholderTextColor="#aaa"
                      onFocus={() => setFocusedField("father_name")}
                      onBlur={() => setFocusedField("")}
                    />
                  </View> 
                  {/* Mother Name Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "mother_name" && styles.inputWrapperFocused,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="face-woman-outline"
                      size={20}
                      color="#888"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      value={inputValues.mother_name}
                      onChangeText={(text) => handleInputChange("mother_name", text)}
                      placeholder="Mother Name *"
                      placeholderTextColor="#aaa"
                      onFocus={() => setFocusedField("mother_name")}
                      onBlur={() => setFocusedField("")}
                    />
                  </View>

                  {/* Password Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "password" && styles.inputWrapperFocused,
                    ]}
                  >
                    <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={inputValues.password}
                      onChangeText={(text) => handleInputChange("password", text)}
                      placeholder="Password *"
                      placeholderTextColor="#aaa"
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField("")}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#888"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Confirm Password Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "confirm_password" && styles.inputWrapperFocused,
                    ]}
                  >
                    <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={inputValues.confirm_password}
                      onChangeText={(text) => handleInputChange("confirm_password", text)}
                      placeholder="Confirm Password *"
                      placeholderTextColor="#aaa"
                      secureTextEntry={!showConfirmPassword}
                      onFocus={() => setFocusedField("confirm_password")}
                      onBlur={() => setFocusedField("")}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#888"
                      />
                    </TouchableOpacity>
                  </View> 
                  {/* LinkedIn URL Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "linkedin_url" && styles.inputWrapperFocused,
                    ]}
                  >
                    <Ionicons name="logo-linkedin" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={inputValues.linkedin_url}
                      onChangeText={(text) => handleInputChange("linkedin_url", text)}
                      placeholder="LinkedIn URL"
                      placeholderTextColor="#aaa"
                      onFocus={() => setFocusedField("linkedin_url")}
                      onBlur={() => setFocusedField("")}
                    />
                  </View> 
                  {/* GitHub URL Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "github_url" && styles.inputWrapperFocused,
                    ]}
                  >
                    <Ionicons name="logo-github" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={inputValues.github_url}
                      onChangeText={(text) => handleInputChange("github_url", text)}
                      placeholder="GitHub URL (if applicable)"
                      placeholderTextColor="#aaa"
                      onFocus={() => setFocusedField("github_url")}
                      onBlur={() => setFocusedField("")}
                    />
                  </View> 
                  {/* Portfolio URL Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "portfolio_url" && styles.inputWrapperFocused,
                    ]}  >
                    <Ionicons name="globe-outline" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={inputValues.portfolio_url}
                      onChangeText={(text) => handleInputChange("portfolio_url", text)}
                      placeholder="Portfolio URL (optional)"
                      placeholderTextColor="#aaa"
                      onFocus={() => setFocusedField("portfolio_url")}
                      onBlur={() => setFocusedField("")} />
                  </View> 
                  {/* Objective or Summary Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "objective" && styles.inputWrapperFocused,
                    ]}  >
                    <Ionicons name="document-text-outline" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={inputValues.objective}
                      onChangeText={(text) => handleInputChange("objective", text)}
                      placeholder="Objective or Summary"
                      placeholderTextColor="#aaa"
                      onFocus={() => setFocusedField("objective")}
                      onBlur={() => setFocusedField("")} />
                  </View> 
                  {/* Gender Selection */}
                  <Text style={styles.label}>Gender *</Text>
                  <View style={styles.radioContainer}>
                    <TouchableOpacity style={styles.radioButton} onPress={() => setGender("male")}>
                      <View style={[styles.radioCircle, gender === "male" && styles.radioSelected]} />
                      <Text style={styles.radioText}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.radioButton} onPress={() => setGender("female")}>
                      <View style={[styles.radioCircle, gender === "female" && styles.radioSelected]} />
                      <Text style={styles.radioText}>Female</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.radioButton} onPress={() => setGender("other")}>
                      <View style={[styles.radioCircle, gender === "other" && styles.radioSelected]} />
                      <Text style={styles.radioText}>Other</Text>
                    </TouchableOpacity>
                  </View> 
                  {/* Next Button */}
                  <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                    <Ionicons name="arrow-forward-outline" size={26} color="#fff" style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                  <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
                </ScrollView>
              </>
            ) : currentSection === "education" ? (
              <>
                <Text style={styles.header}>Education Details</Text>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false} >
                  {educationEntries.map((entry, index) => (
                    <View key={index}>
                      {/* Institution Name Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `institution_name_${index}` && styles.inputWrapperFocused,
                        ]} >
                        <Ionicons name="school-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={entry.institution_name}
                          onChangeText={(text) => handleEducationChange(index, "institution_name", text)}
                          placeholder="Institution Name *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`institution_name_${index}`)}
                          onBlur={() => setFocusedField("")}  />
                      </View> 
                      {/* Degree Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `degree_${index}` && styles.inputWrapperFocused,
                        ]} >
                        <Ionicons name="book-outline" size={20} color="#888" style={styles.icon} />
                        <Picker
                          selectedValue={entry.degree}
                          style={{ flex: 1, color: "#000" }}
                          onValueChange={(value) => handleEducationChange(index, "degree", value)}
                          onFocus={() => setFocusedField(`degree_${index}`)}
                          onBlur={() => setFocusedField("")}  >
                          <Picker.Item label="Select Degree *" value="" color="#aaa" />
                          <Picker.Item label="B.Tech" value="B.Tech" />
                          <Picker.Item label="MBA" value="MBA" />
                          <Picker.Item label="MCA" value="MCA" />
                          <Picker.Item label="M.Tech" value="M.Tech" />
                          <Picker.Item label="B.Sc" value="B.Sc" />
                          <Picker.Item label="M.Sc" value="M.Sc" />
                        </Picker>
                      </View> 
                      {/* Branch or Major Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `branch_${index}` && styles.inputWrapperFocused,
                        ]}   >
                        <Ionicons name="git-branch-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={entry.branch}
                          onChangeText={(text) => handleEducationChange(index, "branch", text)}
                          placeholder="Branch or Major *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`branch_${index}`)}
                          onBlur={() => setFocusedField("")}  />
                      </View> 
                      {/* Start Year Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `start_year_${index}` && styles.inputWrapperFocused,
                        ]}  >
                        <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
                        <Picker
                          selectedValue={entry.start_year}
                          style={{ flex: 1, color: "#000" }}
                          onValueChange={(value) => handleEducationChange(index, "start_year", value)}
                          onFocus={() => setFocusedField(`start_year_${index}`)}
                          onBlur={() => setFocusedField("")}   >
                          <Picker.Item label="Select Start Year *" value="" color="#aaa" />
                          {Array.from({ length: 50 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return <Picker.Item key={year} label={`${year}`} value={`${year}`} />;
                          })}
                        </Picker>
                      </View> 
                      {/* End Year Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `end_year_${index}` && styles.inputWrapperFocused,
                        ]}    >
                        <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
                        <Picker
                          selectedValue={entry.end_year}
                          style={{ flex: 1, color: "#000" }}
                          onValueChange={(value) => handleEducationChange(index, "end_year", value)}
                          onFocus={() => setFocusedField(`end_year_${index}`)}
                          onBlur={() => setFocusedField("")}  >
                          <Picker.Item label="Select End Year *" value="" color="#aaa" />
                          {Array.from({ length: 50 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return <Picker.Item key={year} label={`${year}`} value={`${year}`} />;
                          })}
                        </Picker>
                      </View> 
                      {/* Grade Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `grade_${index}` && styles.inputWrapperFocused,
                        ]}  >
                        <Ionicons name="stats-chart-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={entry.grade}
                          onChangeText={(text) => handleEducationChange(index, "grade", text)}
                          placeholder="Grade or Percentage *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`grade_${index}`)}
                          onBlur={() => setFocusedField("")}    />
                      </View> 
                      {/* Remove Button */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeEducationEntry(index)} >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))} 
                  {/* Add Education Button */}
                  <TouchableOpacity style={styles.addButton} onPress={addEducationEntry}>
                    <Text style={styles.addButtonText}>Add Education *</Text>
                  </TouchableOpacity> 
                  {/* Back and Next Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.nextButton, styles.backButton]} // Apply backButton style
                      onPress={() => setCurrentSection("personal")}  >
                      <Ionicons name="arrow-back-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
                      <Text style={styles.nextButtonText}>Back</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => {
                        if (educationEntries.length === 0) {
                          Alert.alert("Error", "Please add at least one education entry marked with *", [{ text: "OK" }]);
                          return;
                        }
                        for (const entry of educationEntries) {
                          if (!entry.institution_name || !entry.degree || !entry.branch || !entry.start_year || !entry.end_year || !entry.grade) {
                            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
                            return;
                          }
                        }
                        setCurrentSection("skills");
                      }}       >
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Ionicons name="arrow-forward-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            ) : currentSection === "skills" ? (
              <>
                <Text style={styles.header}>Skills</Text>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}  >
                  {skills.map((skill, index) => (
                    <View key={index}>
                      {/* Skill Name Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `skill_name_${index}` && styles.inputWrapperFocused,
                        ]}    >
                        <Ionicons name="construct-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={skill.skill_name}
                          onChangeText={(text) => handleSkillChange(index, "skill_name", text)}
                          placeholder="Skill Name *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`skill_name_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Proficiency Level Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `proficiency_level_${index}` && styles.inputWrapperFocused,
                        ]}  >
                        <Ionicons name="bar-chart-outline" size={20} color="#888" style={styles.icon} />
                        <Picker
                          selectedValue={skill.proficiency_level}
                          style={{ flex: 1, color: "#000" }}
                          onValueChange={(value) => handleSkillChange(index, "proficiency_level", value)}
                          onFocus={() => setFocusedField(`proficiency_level_${index}`)}
                          onBlur={() => setFocusedField("")}   >
                          <Picker.Item label="Select Proficiency Level *" value="" color="#aaa" />
                          <Picker.Item label="Beginner" value="beginner" />
                          <Picker.Item label="Intermediate" value="intermediate" />
                          <Picker.Item label="Expert" value="expert" />
                        </Picker>
                      </View> 
                      {/* Remove Skill Button */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeSkill(index)} >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))} 
                  {/* Add Skill Button */}
                  <TouchableOpacity style={styles.addButton} onPress={addSkill}>
                    <Text style={styles.addButtonText}>Add Skill *</Text>
                  </TouchableOpacity> 
                  {/* Back and Next Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.nextButton, styles.backButton]}
                      onPress={() => setCurrentSection("education")} >
                      <Ionicons name="arrow-back-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
                      <Text style={styles.nextButtonText}>Back</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => {
                        if (skills.length === 0) {
                          Alert.alert("Error", "Please add at least one skill entry marked with *", [{ text: "OK" }]);
                          return;
                        }
                        for (const skill of skills) {
                          if (!skill.skill_name || !skill.proficiency_level) {
                            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
                            return;
                          }
                        }
                        setCurrentSection("work_experience");
                      }} >
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Ionicons name="arrow-forward-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            ) : currentSection === "work_experience" ? (
              <>
                <Text style={styles.header}>Work Experience / Internships</Text>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}  >
                  {workExperience.map((work, index) => (
                    <View key={index}>
                      {/* Company Name Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `company_name_${index}` && styles.inputWrapperFocused,
                        ]} >
                        <Ionicons name="business-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={work.company_name}
                          onChangeText={(text) => handleWorkChange(index, "company_name", text)}
                          placeholder="Company Name *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`company_name_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Role Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `role_${index}` && styles.inputWrapperFocused,
                        ]}   >
                        <Ionicons name="briefcase-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={work.role}
                          onChangeText={(text) => handleWorkChange(index, "role", text)}
                          placeholder="Role or Designation *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`role_${index}`)}
                          onBlur={() => setFocusedField("")}   />
                      </View> 
                      {/* Start Date Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `start_date_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
                        <TouchableOpacity
                          style={styles.input}
                          onPress={() => {
                            setFocusedField(`start_date_${index}`);
                            setDatePickerVisibility(true);
                          }}
                        >
                          <Text style={{ color: work.start_date ? "#000" : "#aaa" }}>
                            {work.start_date || "Start Date (YYYY-MM-DD) *"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible && focusedField === `start_date_${index}`}
                        mode="date"
                        onConfirm={(date) => {
                          const formattedDate = date.toISOString().split("T")[0];
                          handleWorkChange(index, "start_date", formattedDate);
                          hideDatePicker(); // Ensure the picker is hidden after selection
                          setFocusedField("");
                        }}
                        onCancel={() => {
                          hideDatePicker(); // Ensure the picker is hidden on cancel
                          setFocusedField("");
                        }}     /> 
                      {/* End Date Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `end_date_${index}` && styles.inputWrapperFocused,
                        ]}   >
                        <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
                        <TouchableOpacity
                          style={styles.input}
                          onPress={() => {
                            setFocusedField(`end_date_${index}`);
                            setDatePickerVisibility(true);
                          }}  >
                          <Text style={{ color: work.end_date ? "#000" : "#aaa" }}>
                            {work.end_date || "End Date (YYYY-MM-DD) *"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible && focusedField === `end_date_${index}`}
                        mode="date"
                        onConfirm={(date) => {
                          const formattedDate = date.toISOString().split("T")[0];
                          handleWorkChange(index, "end_date", formattedDate);
                          setDatePickerVisibility(false);
                          setFocusedField("");
                        }}
                        onCancel={() => {
                          setDatePickerVisibility(false);
                          setFocusedField("");
                        }}  /> 
                      {/* Responsibilities or Achievements Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `description_${index}` && styles.inputWrapperFocused,
                        ]}   >
                        <Ionicons name="document-text-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={work.description}
                          onChangeText={(text) => handleWorkChange(index, "description", text)}
                          placeholder="Responsibilities or Achievements *"
                          placeholderTextColor="#aaa"
                          multiline
                          onFocus={() => setFocusedField(`description_${index}`)}
                          onBlur={() => setFocusedField("")}  />
                      </View> 
                      {/* Remove Work Experience Button */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeWorkExperience(index)}  >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))} 
                  {/* Add Work Experience Button */}
                  <TouchableOpacity style={styles.addButton} onPress={addWorkExperience}>
                    <Text style={styles.addButtonText}>Add Work Experience *</Text>
                  </TouchableOpacity> 
                  {/* Back and Next Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.nextButton, styles.backButton]}
                      onPress={() => setCurrentSection("skills")}
                    >
                      <Ionicons name="arrow-back-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
                      <Text style={styles.nextButtonText}>Back</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => {
                        if (workExperience.length === 0) {
                          Alert.alert("Error", "Please add at least one work experience entry marked with *", [{ text: "OK" }]);
                          return;
                        }
                        for (const work of workExperience) {
                          if (
                            !work.company_name || 
                            !work.role || 
                            !work.start_date || 
                            (!work.is_current && !work.end_date) || 
                            !work.description
                          ) {
                            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
                            return;
                          }
                        }
                        setCurrentSection("projects");
                      }}
                    >
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Ionicons name="arrow-forward-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            ) : currentSection === "certifications" ? (
              <>
                <Text style={styles.header}>Certifications</Text>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {certifications.map((cert, index) => (
                    <View key={index}>
                      {/* Certificate Name Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `certificate_name_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="ribbon-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={cert.certificate_name}
                          onChangeText={(text) => handleCertificationChange(index, "certificate_name", text)}
                          placeholder="Certificate Name *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`certificate_name_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Issuing Organization Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `issuing_organization_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="business-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={cert.issuing_organization}
                          onChangeText={(text) => handleCertificationChange(index, "issuing_organization", text)}
                          placeholder="Issuing Organization *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`issuing_organization_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Issue Date Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `issue_date_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
                        <TouchableOpacity
                          style={styles.input}
                          onPress={() => {
                            setFocusedField(`issue_date_${index}`);
                            setDatePickerVisibility(true);
                          }}
                        >
                          <Text style={{ color: cert.issue_date ? "#000" : "#aaa" }}>
                            {cert.issue_date || "Issue Date (YYYY-MM-DD) *"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible && focusedField === `issue_date_${index}`}
                        mode="date"
                        onConfirm={(date) => {
                          const formattedDate = date.toISOString().split("T")[0];
                          handleCertificationChange(index, "issue_date", formattedDate);
                          setDatePickerVisibility(false);
                          setFocusedField("");
                        }}
                        onCancel={() => {
                          setDatePickerVisibility(false);
                          setFocusedField("");
                        }}
                      /> 
                      {/* Certificate Link Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `certificate_link_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="link-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={cert.certificate_link}
                          onChangeText={(text) => handleCertificationChange(index, "certificate_link", text)}
                          placeholder="Certificate Link (optional)"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`certificate_link_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Remove Certification Button */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeCertification(index)}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))} 
                  {/* Add Certification Button */}
                  <TouchableOpacity style={styles.addButton} onPress={addCertification}>
                    <Text style={styles.addButtonText}>Add Certification *</Text>
                  </TouchableOpacity> 
                  {/* Back and Next Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.nextButton, styles.backButton]}
                      onPress={() => setCurrentSection("projects")}
                    >
                      <Ionicons name="arrow-back-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
                      <Text style={styles.nextButtonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => {
                        if (certifications.length === 0) {
                          Alert.alert("Error", "Please add at least one certification entry marked with *", [{ text: "OK" }]);
                          return;
                        }
                        for (const cert of certifications) {
                          if (!cert.certificate_name || !cert.issuing_organization || !cert.issue_date) {
                            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
                            return;
                          }
                        }
                        setCurrentSection("achievements");
                      }}
                    >
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Ionicons name="arrow-forward-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            ) : currentSection === "achievements" ? (
              <>
                <Text style={styles.header}>Achievements / Awards</Text>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {achievements.map((achievement, index) => (
                    <View key={index}>
                      {/* Title Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `achievement_title_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="trophy-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={achievement.title}
                          onChangeText={(text) => handleAchievementChange(index, "title", text)}
                          placeholder="Title *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`achievement_title_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Description Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `achievement_description_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="document-text-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={achievement.description}
                          onChangeText={(text) => handleAchievementChange(index, "description", text)}
                          placeholder="Description *"
                          placeholderTextColor="#aaa"
                          multiline
                          onFocus={() => setFocusedField(`achievement_description_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Date Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `achievement_date_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
                        <TouchableOpacity
                          style={styles.input}
                          onPress={() => {
                            setFocusedField(`achievement_date_${index}`);
                            setDatePickerVisibility(true);
                          }}
                        >
                          <Text style={{ color: achievement.date ? "#000" : "#aaa" }}>
                            {achievement.date || "Date (optional, YYYY-MM-DD)"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible && focusedField === `achievement_date_${index}`}
                        mode="date"
                        onConfirm={(date) => {
                          const formattedDate = date.toISOString().split("T")[0];
                          handleAchievementChange(index, "date", formattedDate);
                          setDatePickerVisibility(false);
                          setFocusedField("");
                        }}
                        onCancel={() => {
                          setDatePickerVisibility(false);
                          setFocusedField("");
                        }}
                      /> 
                      {/* Remove Achievement Button */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeAchievement(index)}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))} 
                  {/* Add Achievement Button */}
                  <TouchableOpacity style={styles.addButton} onPress={addAchievement}>
                    <Text style={styles.addButtonText}>Add Achievement *</Text>
                  </TouchableOpacity> 
                  {/* Back and Next Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.nextButton, styles.backButton]}
                      onPress={() => setCurrentSection("certifications")}
                    >
                      <Ionicons name="arrow-back-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
                      <Text style={styles.nextButtonText}>Back</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => {
                        if (achievements.length === 0) {
                          Alert.alert("Error", "Please add at least one achievement entry marked with *", [{ text: "OK" }]);
                          return;
                        }
                        for (const achievement of achievements) {
                          if (!achievement.title || !achievement.description) {
                            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
                            return;
                          }
                        }
                        setCurrentSection("languages");
                      }}
                    >
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Ionicons name="arrow-forward-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            ) : currentSection === "languages" ? (
              <>
                <Text style={styles.header}>Languages Known</Text>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {languages.map((language, index) => (
                    <View key={index}>
                      {/* Language Name Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `language_name_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="language-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={language.language_name}
                          onChangeText={(text) => handleLanguageChange(index, "language_name", text)}
                          placeholder="Language Name *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`language_name_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Proficiency Level Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `proficiency_level_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="bar-chart-outline" size={20} color="#888" style={styles.icon} />
                        <Picker
                          selectedValue={language.proficiency_level}
                          style={{ flex: 1, color: "#000" }}
                          onValueChange={(value) => handleLanguageChange(index, "proficiency_level", value)}
                          onFocus={() => setFocusedField(`proficiency_level_${index}`)}
                          onBlur={() => setFocusedField("")}
                        >
                          <Picker.Item label="Select Proficiency Level *" value="" color="#aaa" />
                          <Picker.Item label="Beginner" value="beginner" />
                          <Picker.Item label="Intermediate" value="intermediate" />
                          <Picker.Item label="Fluent" value="fluent" />
                        </Picker>
                      </View> 
                      {/* Remove Language Button */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeLanguage(index)}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))} 
                  {/* Add Language Button */}
                  <TouchableOpacity style={styles.addButton} onPress={addLanguage}>
                    <Text style={styles.addButtonText}>Add Language *</Text>
                  </TouchableOpacity> 
                  {/* Back and Next Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.nextButton, styles.backButton]}
                      onPress={() => setCurrentSection("achievements")}
                    >
                      <Ionicons name="arrow-back-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
                      <Text style={styles.nextButtonText}>Back</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => {
                        if (languages.length === 0) {
                          Alert.alert("Error", "Please add at least one language entry marked with *", [{ text: "OK" }]);
                          return;
                        }
                        for (const language of languages) {
                          if (!language.language_name || !language.proficiency_level) {
                            Alert.alert("Error", "Please fill all mandatory fields marked with *", [{ text: "OK" }]);
                            return;
                          }
                        }
                        setCurrentSection("hobbies");
                      }}
                    >
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Ionicons name="arrow-forward-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            ) : currentSection === "hobbies" ? (
              <>
                <Text style={styles.header}>Hobbies / Interests</Text>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {hobbies.map((hobby, index) => (
                    <View key={index}>
                      {/* Hobby Name Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `hobby_name_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="heart-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={hobby.hobby_name}
                          onChangeText={(text) => handleHobbyChange(index, text)}
                          placeholder="Hobby or Interest Area"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`hobby_name_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Remove Hobby Button */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeHobby(index)}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))} 
                  {/* Add Hobby Button */}
                  <TouchableOpacity style={styles.addButton} onPress={addHobby}>
                    <Text style={styles.addButtonText}>Add Hobby *</Text>
                  </TouchableOpacity> 
                  {/* Back and Next Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.nextButton, styles.backButton]}
                      onPress={() => setCurrentSection("languages")}
                    >
                      <Ionicons name="arrow-back-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
                      <Text style={styles.nextButtonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => {
                        if (hobbies.length === 0) {
                          Alert.alert("Error", "Please add at least one hobby entry marked with *", [{ text: "OK" }]);
                          return;
                        }
                        onNext();
                      }}
                    >
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Ionicons name="arrow-forward-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            ) : currentSection === "references" ? (
              <>
                <Text style={styles.header}>References</Text>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {references.map((reference, index) => (
                    <View key={index}>
                      {/* Reference Name Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `reference_name_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={reference.reference_name}
                          onChangeText={(text) => handleReferenceChange(index, "reference_name", text)}
                          placeholder="Reference Name *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`reference_name_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Relation Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `relation_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="people-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={reference.relation}
                          onChangeText={(text) => handleReferenceChange(index, "relation", text)}
                          placeholder="Relation *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`relation_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View> 
                      {/* Contact Info Field */}
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedField === `contact_info_${index}` && styles.inputWrapperFocused,
                        ]}
                      >
                        <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                          style={styles.input}
                          value={reference.contact_info}
                          onChangeText={(text) => handleReferenceChange(index, "contact_info", text)}
                          placeholder="Contact Info *"
                          placeholderTextColor="#aaa"
                          onFocus={() => setFocusedField(`contact_info_${index}`)}
                          onBlur={() => setFocusedField("")}
                        />
                      </View>  
                    </View>
                  ))}  
                  {/* Profile Photo Upload */}
                  <View style={styles.inputWrapper}>
                    <Ionicons name="image-outline" size={20} color="#888" style={styles.icon} />
                    <TouchableOpacity style={styles.uploadButton} onPress={handleProfilePhotoUpload}>
                      <View style={styles.uploadButtonContent}>
                        <Text style={styles.uploadButtonText}>
                          {optionalAddOns.profile_photo_url ? "Change Photo" : "Upload Profile Photo"}
                        </Text>
                        <Ionicons name="arrow-up-outline" size={16} color="#ccc" style={styles.uploadIcon} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  {optionalAddOns.profile_photo_url ? (
                    <Image
                      source={{ uri: optionalAddOns.profile_photo_url }}
                      style={styles.uploadedImage}
                    />
                  ) : null}

                  {/* Signature Field */}
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "signature" && styles.inputWrapperFocused,
                    ]}
                  >
                    <Ionicons name="create-outline" size={20} color="#888" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={optionalAddOns.signature}
                      onChangeText={(text) => handleOptionalAddOnChange("signature", text)}
                      placeholder="Signature (optional)"
                      placeholderTextColor="#aaa"
                      onFocus={() => setFocusedField("signature")}
                      onBlur={() => setFocusedField("")}
                    />
                  </View> 
                  {/* Checkbox and Statement */}
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.customCheckbox}>
                      <Ionicons
                        name={isChecked ? "checkbox-outline" : "square-outline"}
                        size={24}
                        color={isChecked ? "#002B5B" : "#888"}
                      />
                    </TouchableOpacity>
                    <Text style={styles.checkboxText}>
                      I confirm that the above information given by me is accurate and true to the best of my knowledge.
                    </Text>
                  </View>
                  {/* View Details Button */}
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={handleViewDetails}
                  >
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>

                  {/* Modal for Viewing Details */}
                  <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setIsModalVisible(false)}
                  >
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Review Your Details</Text>
                        <ScrollView>
                          {/* Personal Details */}
                          <Text style={styles.modalSectionTitle}>Personal Details</Text>
                          <Text style={styles.modalText}><Text style={styles.modalLabel}>Full Name:</Text> {inputValues.full_name}</Text>
                          <Text style={styles.modalText}><Text style={styles.modalLabel}>Email:</Text> {inputValues.email}</Text>
                          <Text style={styles.modalText}><Text style={styles.modalLabel}>Date of Birth:</Text> {inputValues.dob}</Text>
                          <Text style={styles.modalText}><Text style={styles.modalLabel}>Phone:</Text> {inputValues.phone}</Text>
                          <Text style={styles.modalText}><Text style={styles.modalLabel}>Address:</Text> {inputValues.address}</Text>
                          <Text style={styles.modalText}><Text style={styles.modalLabel}>Father's Name:</Text> {inputValues.father_name}</Text>
                          <Text style={styles.modalText}><Text style={styles.modalLabel}>Mother's Name:</Text> {inputValues.mother_name}</Text>
                          <Text style={styles.modalText}><Text style={styles.modalLabel}>Gender:</Text> {gender}</Text>
                  
                          {/* Education Details */}
                          <Text style={styles.modalSectionTitle}>Education Details</Text>
                          {educationEntries.map((entry, index) => (
                            <View key={index}>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Institution:</Text> {entry.institution_name}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Degree:</Text> {entry.degree}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Branch:</Text> {entry.branch}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Start Year:</Text> {entry.start_year}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>End Year:</Text> {entry.end_year}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Grade:</Text> {entry.grade}</Text>
                            </View>
                          ))}
                  
                          {/* Skills */}
                          <Text style={styles.modalSectionTitle}>Skills</Text>
                          {skills.map((skill, index) => (
                            <Text key={index} style={styles.modalText}>
                              <Text style={styles.modalLabel}>Skill:</Text> {skill.skill_name} - {skill.proficiency_level}
                            </Text>
                          ))}
                  
                          {/* Work Experience */}
                          <Text style={styles.modalSectionTitle}>Work Experience</Text>
                          {workExperience.map((work, index) => (
                            <View key={index}>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Company:</Text> {work.company_name}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Role:</Text> {work.role}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Start Date:</Text> {work.start_date}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>End Date:</Text> {work.end_date || "Present"}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Description:</Text> {work.description}</Text>
                            </View>
                          ))}
                  
                          {/* Projects */}
                          <Text style={styles.modalSectionTitle}>Projects</Text>
                          {projects.map((project, index) => (
                            <View key={index}>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Title:</Text> {project.project_title}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Technologies:</Text> {project.technologies_used}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Description:</Text> {project.description}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Link:</Text> {project.project_link || "N/A"}</Text>
                            </View>
                          ))}
                  
                          {/* Certifications */}
                          <Text style={styles.modalSectionTitle}>Certifications</Text>
                          {certifications.map((cert, index) => (
                            <View key={index}>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Certificate:</Text> {cert.certificate_name}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Organization:</Text> {cert.issuing_organization}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Issue Date:</Text> {cert.issue_date}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Link:</Text> {cert.certificate_link || "N/A"}</Text>
                            </View>
                          ))}
                  
                          {/* Achievements */}
                          <Text style={styles.modalSectionTitle}>Achievements</Text>
                          {achievements.map((achievement, index) => (
                            <View key={index}>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Title:</Text> {achievement.title}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Description:</Text> {achievement.description}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Date:</Text> {achievement.date || "N/A"}</Text>
                            </View>
                          ))}
                  
                          {/* Languages */}
                          <Text style={styles.modalSectionTitle}>Languages</Text>
                          {languages.map((language, index) => (
                            <Text key={index} style={styles.modalText}>
                              <Text style={styles.modalLabel}>Language:</Text> {language.language_name} - {language.proficiency_level}
                            </Text>
                          ))}
                  
                          {/* Hobbies */}
                          <Text style={styles.modalSectionTitle}>Hobbies</Text>
                          {hobbies.map((hobby, index) => (
                            <Text key={index} style={styles.modalText}>
                              <Text style={styles.modalLabel}>Hobby:</Text> {hobby.hobby_name}
                            </Text>
                          ))}
                  
                          {/* References */}
                          <Text style={styles.modalSectionTitle}>References</Text>
                          {references.map((reference, index) => (
                            <View key={index}>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Name:</Text> {reference.reference_name}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Relation:</Text> {reference.relation}</Text>
                              <Text style={styles.modalText}><Text style={styles.modalLabel}>Contact:</Text> {reference.contact_info}</Text>
                            </View>
                          ))}
                  
                          {/* Optional Add-Ons */}
                          <Text style={styles.modalSectionTitle}>Optional Add-Ons</Text>
                          <Text style={styles.modalText}><Text style={styles.modalLabel}>Profile Photo:</Text> {optionalAddOns.profile_photo_url ? "Uploaded" : "Not Uploaded"}</Text>
                          <Text style={styles.modalText}><Text style={styles.modalLabel}>Signature:</Text> {optionalAddOns.signature || "N/A"}</Text>
                        </ScrollView>
                  
                        {/* Modal Buttons */}
                        <View style={styles.modalButtonRow}>
                          <TouchableOpacity
                            style={[styles.modalButton, styles.modalBackButton]}
                            onPress={() => setIsModalVisible(false)}
                          >
                            <Text style={styles.modalButtonText}>Back</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>

                  {/* Back and Submit Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.nextButton, styles.backButton]}
                      onPress={() => setCurrentSection("hobbies")}
                    >
                      <Ionicons name="arrow-back-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
                      <Text style={styles.nextButtonText}>Back</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={async () => {
                        if (!isChecked) {
                          Alert.alert("Error", "Please confirm the accuracy of the information by checking the box.", [{ text: "OK" }]);
                          return;
                        }
                        await onSubmit();
                      }}
                    >
                      <Text style={styles.nextButtonText}>Submit</Text>
                      <Ionicons name="checkmark-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            ) : (
              <>
                <Text style={styles.header}>Projects</Text>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}  >
                  {projects.map((project, index) => {
                    return (
                      <View key={index}>
                        {/* Project Title Field */}
                        <View
                          style={[
                            styles.inputWrapper,
                            focusedField === `project_title_${index}` && styles.inputWrapperFocused,
                          ]}  >
                          <Ionicons name="folder-outline" size={20} color="#888" style={styles.icon} />
                          <TextInput
                            style={styles.input}
                            value={project.project_title}
                            onChangeText={(text) => handleProjectChange(index, "project_title", text)}
                            placeholder="Project Title *"
                            placeholderTextColor="#aaa"
                            onFocus={() => setFocusedField(`project_title_${index}`)}
                            onBlur={() => setFocusedField("")} />
                        </View> 
                        {/* Technologies Used Field */}
                        <View
                          style={[
                            styles.inputWrapper,
                            focusedField === `technologies_used_${index}` && styles.inputWrapperFocused,
                          ]} >
                          <Ionicons name="code-slash-outline" size={20} color="#888" style={styles.icon} />
                          <TextInput
                            style={styles.input}
                            value={project.technologies_used}
                            onChangeText={(text) => handleProjectChange(index, "technologies_used", text)}
                            placeholder="Technologies Used *"
                            placeholderTextColor="#aaa"
                            onFocus={() => setFocusedField(`technologies_used_${index}`)}
                            onBlur={() => setFocusedField("")}  />
                        </View> 
                        {/* Description Field */}
                        <View
                          style={[
                            styles.inputWrapper,
                            focusedField === `description_${index}` && styles.inputWrapperFocused,
                          ]}  >
                          <Ionicons name="document-text-outline" size={20} color="#888" style={styles.icon} />
                          <TextInput
                            style={styles.input}
                            value={project.description}
                            onChangeText={(text) => handleProjectChange(index, "description", text)}
                            placeholder="Description *"
                            placeholderTextColor="#aaa"
                            multiline
                            onFocus={() => setFocusedField(`description_${index}`)}
                            onBlur={() => setFocusedField("")} />
                        </View> 
                        {/* Project Link Field */}
                        <View
                          style={[
                            styles.inputWrapper,
                            focusedField === `project_link_${index}` && styles.inputWrapperFocused,
                          ]}  >
                          <Ionicons name="link-outline" size={20} color="#888" style={styles.icon} />
                          <TextInput
                            style={styles.input}
                            value={project.project_link}
                            onChangeText={(text) => handleProjectChange(index, "project_link", text)}
                            placeholder="Project Link (optional)"
                            placeholderTextColor="#aaa"
                            onFocus={() => setFocusedField(`project_link_${index}`)}
                            onBlur={() => setFocusedField("")}  />
                        </View> 
                        {/* Remove Project Button */}
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeProject(index)} >
                          <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })} 
                  {/* Add Project Button */}
                  <TouchableOpacity style={styles.addButton} onPress={addProject}>
                    <Text style={styles.addButtonText}>Add Project *</Text>
                  </TouchableOpacity> 
                  {/* Back and Next Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.nextButton, styles.backButton]}
                      onPress={() => setCurrentSection("work_experience")}
                    >
                      <Ionicons name="arrow-back-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
                      <Text style={styles.nextButtonText}>Back</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => {
                        if (projects.length === 0) {
                          Alert.alert("Error", "Please add at least one project entry marked with *", [{ text: "OK" }]);
                          return;
                        }
                        onNext();
                      }} >
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Ionicons name="arrow-forward-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </ScrollView>
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
    shadowOffset: { width: 10, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 20, 
    borderWidth: 2, // Add border width
    borderColor: "#002B5B", // Add border color
    borderRadius: 35, // Optional: Add border radius
    
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#002B5B ",
    marginBottom: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    elevation: 3, // Elevation for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  inputWrapperFocused: {
    borderColor: "#002B5B",  
    elevation: 12,  
    shadowOpacity: 0.2,  
  },
  icon: {
    marginRight: 8,
    color: "#002B5B",
    fontSize: 22,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    marginTop: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#002B5B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioSelected: {  backgroundColor: "#002B5B", 
  },
  radioText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    flex: 1,
    backgroundColor: "#ff9900",
    padding: 10, 
    borderRadius: 20, 
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,  
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,     
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  footerText: {
    color: "#666",
    fontSize: 18,
  },
  footerLink: {
    color: "#002B5B",
    fontWeight: "bold",
    fontSize: 18,
    textDecorationLine: "underline",
  },
  addButton: {
    backgroundColor: "#ff9900",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#5A86AD",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  backButton: {   backgroundColor: "#002B5B", 
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15, 
    columnGap: 95, 
  },
  nextButton: {
    flexDirection: "row",
    backgroundColor: "#002B5B",
    paddingVertical: 8,  
    paddingHorizontal: 15,  
    borderRadius: 55,  
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",  
    elevation: 3, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  nextButtonText: {  color: "#fff",  fontSize: 22,   fontWeight: "bold",
  },
  uploadButton: {  flex: 1,  backgroundColor: "#fff",  padding: 10,  borderRadius: 10,  alignItems: "center",
  },
  uploadButtonContent: { flexDirection: "row",   alignItems: "center",  justifyContent: "center",
  },
  uploadButtonText: {  color: "#ccc", fontSize: 16,  fontWeight: "bold",
  },
  uploadIcon: {  marginLeft: 5,
  },
  uploadedImage: { width: 100,  height: 100,  borderRadius: 50,  marginTop: 10, alignSelf: "center",
  },
  progressBar: {
    backgroundColor: "#D9E3F0"
  },
  progressBarContainer: {
    flexDirection: "row",
    height: 6,
    backgroundColor: "#D9E3F0",
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 18,
  },
  progressSegment: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  activeSegment: {
    backgroundColor: "#002B5B",
  },
  stepIndicator: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
     marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  customCheckbox: {
    marginRight: 10,
  },
  viewButton: {
    backgroundColor: "#ff9900",
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    marginBottom:90,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    marginTop:89,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalLabel: {
    fontWeight: "bold",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalBackButton: {
    backgroundColor: "#002B5B",
  },
  modalSubmitButton: {
    backgroundColor: "#002B5B",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
}); 
export default Registration;