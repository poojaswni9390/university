import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
// import config from "../screens/config.js";
// const API = config.IP_Address;

 axios.defaults.baseURL = 'http://192.168.65.168:3000';

const Home = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [educationDetails, setEducationDetails] = useState([]);
  const [projectExperienceDetails, setProjectExperienceDetails] = useState([]);
  const [workExperienceDetails, setWorkExperienceDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        console.log('Retrieved userId:', userId);

        if (!userId) {
          Alert.alert('Error', 'User ID not found in storage');
          return;
        }

        const response = await axios.get(`/api/personal/${userId}`);
        console.log('API response:', response.data);

        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Unexpected response format from server');
        }

        setUserDetails(response.data.personal);
        setEducationDetails(response.data.education);

        const parsedProjects = response.data.project_experience.flatMap(entry => {
          try {
            const projectData =
              typeof entry.project_details === 'string'
                ? JSON.parse(entry.project_details)
                : entry.project_details;

            return Array.isArray(projectData)
              ? projectData.map(proj => ({
                  ...proj,
                  user_id: entry.user_id,
                }))
              : [];
          } catch (err) {
            console.error('Error parsing project_details:', err);
            return [];
          }
        });

        setProjectExperienceDetails(parsedProjects);

        const parsedWorkExperience = response.data.project_experience.flatMap(entry => {
          try {
            const workData =
              typeof entry.work_experience_info === 'string'
                ? JSON.parse(entry.work_experience_info)
                : entry.work_experience_info;

            return Array.isArray(workData)
              ? workData.map(work => ({
                  ...work,
                  user_id: entry.user_id,
                }))
              : [];
          } catch (err) {
            console.error('Error parsing work_experience_info:', err);
            return [];
          }
        });

        setWorkExperienceDetails(parsedWorkExperience);

      } catch (error) {
        console.error('Error fetching user details:', error.response?.data || error.message);
        if (error.message === 'Network Error') {
          Alert.alert('Network Error', 'Please check your internet connection and try again.');
        } else {
          Alert.alert('Error', 'Failed to fetch user details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const generatePDF = async () => {
    if (!userDetails) return;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; line-height: 1.6; color: #333; }
          h1, h2 { color: #2c3e50; }
          .section { margin-bottom: 30px; }
          .subsection { margin-bottom: 15px; }
          .label { font-weight: bold; }
          a { color: #2980b9; text-decoration: none; }
          hr { border: none; height: 1px; background-color: #ccc; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>${userDetails.full_name}</h1>
        <p><span class="label">Email:</span> ${userDetails.email}</p>
        <p><span class="label">Phone:</span> ${userDetails.phone}</p>
        <p><span class="label">Address:</span> ${userDetails.address}</p>
        <p><span class="label">Hobbies:</span> ${userDetails.hobbies}</p>
        <hr />
        <div class="section">
          <h2>Education</h2>
          ${educationDetails.map(edu => `
            <div class="subsection">
              <p><strong>${edu.institution_name}</strong></p>
              <p>${edu.degree} in ${edu.branch_or_major} (${edu.start_year} - ${edu.end_year})</p>
              <p>Grade: ${edu.grade_or_percentage}</p>
            </div>
          `).join('')}
        </div>
        <div class="section">
          <h2>Projects</h2>
          ${projectExperienceDetails.map((project, index) => `
            <div class="subsection">
              <p><strong>${index + 1}. ${project.project_title}</strong></p>
              <p>Description: ${project.description}</p>
              <p>Technologies: ${project.technologies_used}</p>
              <p>Link: <a href="${project.project_link}">${project.project_link}</a></p>
            </div>
          `).join('')}
        </div>
        <div class="section">
          <h2>Work Experience</h2>
          ${workExperienceDetails.map(work => `
            <div class="subsection">
              <p><strong>${work.company_name}</strong></p>
              <p>${work.role_or_designation}</p>
              <p>${work.work_description}</p>
              <p>${new Date(work.start_date).toLocaleDateString()} - ${work.is_current ? 'Present' : new Date(work.end_date).toLocaleDateString()}</p>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Sharing is not available on this device.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate or share PDF');
      console.error('PDF generation error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load user details. Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Welcome, {userDetails.full_name}!</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <Text style={styles.subtitle}>Email: {userDetails.email}</Text>
        <Text style={styles.subtitle}>Phone: {userDetails.phone}</Text>
        <Text style={styles.subtitle}>Address: {userDetails.address}</Text>
        <Text style={styles.subtitle}>Hobbies: {userDetails.hobbies}</Text>

        <Text style={styles.sectionTitle}>Education Details</Text>
        {educationDetails.map((edu, index) => (
          <View key={index}>
            <Text style={styles.subtitle}>Institution: {edu.institution_name}</Text>
            <Text style={styles.subtitle}>Degree: {edu.degree}</Text>
            <Text style={styles.subtitle}>Branch: {edu.branch_or_major}</Text>
            <Text style={styles.subtitle}>Years: {edu.start_year} - {edu.end_year}</Text>
            <Text style={styles.subtitle}>Grade: {edu.grade_or_percentage}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Project Details</Text>
        {projectExperienceDetails.map((project, index) => (
          <View key={index}>
            <Text style={styles.subtitle}>{index + 1}. {project.project_title}</Text>
            <Text style={styles.subtitle}>- Description: {project.description}</Text>
            <Text style={styles.subtitle}>- Technologies: {project.technologies_used}</Text>
            <Text style={styles.subtitle}>- Link: {project.project_link}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Work Experience</Text>
        {workExperienceDetails.map((work, index) => (
          <View key={index}>
            <Text style={styles.subtitle}>{index + 1}. Company Name: {work.company_name}</Text>
            <Text style={styles.subtitle}>-Role: {work.role_or_designation}</Text>
            <Text style={styles.subtitle}>-Work: {work.work_description}</Text>
            <Text style={styles.subtitle}>
              -Year: {new Date(work.start_date).toLocaleDateString()} -{' '}
              {work.is_current ? 'Present' : new Date(work.end_date).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Generate PDF" onPress={generatePDF} />
        <View style={styles.spacer} />
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20, // Adjust this based on the content height
  },
  detailsContainer: {
    alignSelf: 'stretch',
  },
  buttonContainer: {
    marginTop: 20,
    width: '50%',
    marginLeft: '25%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
    marginLeft: 30, // For alignment
  },
  spacer: {
    height: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default Home;
