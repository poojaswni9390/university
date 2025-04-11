import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, Switch } from 'react-native'; // Import ScrollView and Switch
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

const Register = () => {
    const navigation = useNavigation();
    const [step, setStep] = useState(1);  // To track the current step
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState(new Date()); // State for Date of Birth
    const [showDatePicker, setShowDatePicker] = useState(false); // State to toggle date picker
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [objective, setObjective] = useState('');
    const [languages, setLanguages] = useState([{ language: '', proficiency: 'Beginner' }]);
    const [hobbies, setHobbies] = useState([{ hobbyName: '' }]);
    const [institutionName, setInstitutionName] = useState('');
    const [degree, setDegree] = useState('');
    const [branch, setBranch] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [grade, setGrade] = useState('');
    const [skills, setSkills] = useState([{ skillName: '', proficiencyLevel: 'Beginner' }]);
    const [certifications, setCertifications] = useState([{ name: '', organization: '', issueDate: new Date(), link: '' }]);
    const [certificateName, setCertificateName] = useState('');
    const [issuingOrganization, setIssuingOrganization] = useState('');
    const [issueDate, setIssueDate] = useState(new Date());
    const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
    const [certificateLink, setCertificateLink] = useState('');
    const [workExperience, setWorkExperience] = useState([{ companyName: '', role: '', startDate: new Date(), endDate: new Date(), isCurrent: false, description: '' }]);
    const [projects, setProjects] = useState([{ projectTitle: '', technologiesUsed: '', description: '', projectLink: '' }]);
    const [achievements, setAchievements] = useState([{ title: '', description: '', date: new Date() }]);
    const [references, setReferences] = useState([{ referenceName: '', relation: '', contactInfo: '' }]);
    const [signature, setSignature] = useState('');
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

    const [showWorkStartDatePicker, setShowWorkStartDatePicker] = useState(null); // Index of the work experience start date picker
    const [showWorkEndDatePicker, setShowWorkEndDatePicker] = useState(null); // Index of the work experience end date picker
    const [showAchievementDatePicker, setShowAchievementDatePicker] = useState(null); // Index of the achievement date picker

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false); // Hide the date picker
        if (selectedDate) {
            setDob(selectedDate); // Update the dob state with the selected date
        }
    };

    const handleIssueDateChange = (event, selectedDate) => {
        setShowIssueDatePicker(false);
        if (selectedDate) {
            setIssueDate(selectedDate);
        }
    };

    const handleWorkStartDateChange = (index, event, selectedDate) => {
        setShowWorkStartDatePicker(null); // Hide the picker
        if (selectedDate) {
            const updatedWorkExperience = [...workExperience];
            updatedWorkExperience[index].startDate = selectedDate;
            setWorkExperience(updatedWorkExperience);
        }
    };

    const handleWorkEndDateChange = (index, event, selectedDate) => {
        setShowWorkEndDatePicker(null); // Hide the picker
        if (selectedDate) {
            const updatedWorkExperience = [...workExperience];
            updatedWorkExperience[index].endDate = selectedDate;
            setWorkExperience(updatedWorkExperience);
        }
    };

    const handleAchievementDateChange = (index, event, selectedDate) => {
        setShowAchievementDatePicker(null); // Hide the picker
        if (selectedDate) {
            const updatedAchievements = [...achievements];
            updatedAchievements[index].date = selectedDate;
            setAchievements(updatedAchievements);
        }
    };

    const handleAddSkill = () => {
        setSkills([...skills, { skillName: '', proficiencyLevel: 'Beginner' }]);
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = [...skills];
        updatedSkills.splice(index, 1);
        setSkills(updatedSkills);
    };

    const handleAddCertification = () => {
        setCertifications([
            ...certifications,
            {
                name: certificateName,
                organization: issuingOrganization,
                issueDate,
                link: certificateLink,
            },
        ]);
        setCertificateName('');
        setIssuingOrganization('');
        setIssueDate(new Date());
        setCertificateLink('');
    };

    const handleRemoveCertification = (index) => {
        const updatedCertifications = [...certifications];
        updatedCertifications.splice(index, 1);
        setCertifications(updatedCertifications);
    };

    const handleAddWorkExperience = () => {
        setWorkExperience([...workExperience, { companyName: '', role: '', startDate: new Date(), endDate: new Date(), isCurrent: false, description: '' }]);
    };

    const handleAddProject = () => {
        setProjects([...projects, { projectTitle: '', technologiesUsed: '', description: '', projectLink: '' }]);
    };

    const handleAddAchievement = () => {
        setAchievements([...achievements, { title: '', description: '', date: new Date() }]);
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (!name || !email || !password || !contact || !address || !dob || !fatherName || !motherName || !linkedinUrl || languages.some(lang => !lang.language || !lang.proficiency) || hobbies.some(hobby => !hobby.hobbyName)) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        try {
            const registerData = {
                fullname: name,
                email,
                password,
                contactnumber: contact,
                address,
                dob: dob.toISOString().split('T')[0],
                fatherName,
                motherName,
                linkedinUrl,
                githubUrl: githubUrl || null,
                portfolioUrl: portfolioUrl || null,
                objective,
                languages,
                hobbies: hobbies.map(hobby => hobby.hobbyName),
            };

            console.log('Register API Data:', registerData);
            await axios.post('http://192.168.29.26:3000/register', registerData);

            const educationData = {
                institutionName,
                degree,
                branch,
                startYear: parseInt(startYear, 10),
                endYear: parseInt(endYear, 10),
                grade: grade || null,
                skills: skills.map(skill => ({
                    skillName: skill.skillName,
                    proficiencyLevel: skill.proficiencyLevel,
                })),
                certificateName,
                issuingOrganization,
                issueDate: issueDate.toISOString().split('T')[0],
                certificateLink,
            };

            console.log('Education API Data:', educationData);
            await axios.post('http://192.168.29.26:3000/education', educationData);

            // Extract the first item from each array
            const project = projects[0] || {};
            const achievement = achievements[0] || {};
            const work = workExperience[0] || {};
            const reference = references[0] || {};

            const projectExperienceData = {
                userId: email,
                projectTitle: project.projectTitle,
                technologiesUsed: project.technologiesUsed,
                description: project.description,
                projectLink: project.projectLink || null,
                achievementTitle: achievement.title,
                achievementDescription: achievement.description,
                achievementDate: achievement.date ? achievement.date.toISOString().split('T')[0] : null,
                companyName: work.companyName,
                roleOrDesignation: work.role,
                startDate: work.startDate ? work.startDate.toISOString().split('T')[0] : null,
                endDate: work.isCurrent ? null : work.endDate ? work.endDate.toISOString().split('T')[0] : null,
                isCurrent: work.isCurrent || false,
                workDescription: work.description || null,
                referenceName: reference.referenceName,
                referenceRelation: reference.relation,
                referenceContactInfo: reference.contactInfo,
                profilePhotoUrl: profilePhotoUrl || null,
                signature: signature || null,
            };

            console.log('Project Experience API Data:', projectExperienceData);
            await axios.post('http://192.168.29.26:3000/project-experience', projectExperienceData);

            Alert.alert('Success', 'Registration successful');
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            Alert.alert('Error', error.response?.data?.message || 'Registration failed');
        }
    };

    const handleNextStep = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };
    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>
                    {step === 1
                        ? 'Personal Details'
                        : step === 2
                        ? 'Education Details'
                        : step === 3
                        ? 'Experience & Projects'
                        : 'Review & Submit'} {/* Added fallback value */}
                </Text>
                {step === 1 && (
                    <View>
                        <TextInput style={styles.input} placeholder="FullName" value={name} onChangeText={setName} />
                        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
                        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
                        <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
                        <TextInput style={styles.input} placeholder="Contact" value={contact} onChangeText={setContact} />
                        <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
                        
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                            <Text style={styles.dateText}>
                                {dob ? dob.toISOString().split('T')[0] : 'Select Date of Birth'}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={dob}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                        <TextInput style={styles.input} placeholder="Father's Name" value={fatherName} onChangeText={setFatherName} />
                        <TextInput style={styles.input} placeholder="Mother's Name" value={motherName} onChangeText={setMotherName} />
                        <TextInput style={styles.input} placeholder="LinkedIn URL" value={linkedinUrl} onChangeText={setLinkedinUrl} />
                        <TextInput style={styles.input} placeholder="GitHub URL" value={githubUrl} onChangeText={setGithubUrl} />
                        <TextInput style={styles.input} placeholder="Portfolio URL (optional)" value={portfolioUrl} onChangeText={setPortfolioUrl} />
                        <TextInput style={styles.input} placeholder="Objective/Summary" value={objective} onChangeText={setObjective} />
                        <Text style={styles.label}>Languages Known:</Text>
                        {languages.map((lang, index) => (
                            <View key={index} style={styles.languageContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Language Name"
                                    value={lang.language}
                                    onChangeText={(text) => {
                                        const updatedLanguages = [...languages];
                                        updatedLanguages[index].language = text;
                                        setLanguages(updatedLanguages);
                                    }}
                                />
                                <Picker
                                    selectedValue={lang.proficiency}
                                    onValueChange={(itemValue) => {
                                        const updatedLanguages = [...languages];
                                        updatedLanguages[index].proficiency = itemValue;
                                        setLanguages(updatedLanguages);
                                    }}
                                    style={styles.picker}>
                                    <Picker.Item label="Beginner" value="Beginner" />
                                    <Picker.Item label="Intermediate" value="Intermediate" />
                                    <Picker.Item label="Expert" value="Expert" />
                                </Picker>
                            </View>
                        ))}

                        <Text style={styles.label}>Hobbies/Interests:</Text>
                        {hobbies.map((hobby, index) => (
                            <View key={index} style={styles.hobbyContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Hobby/Interest"
                                    value={hobby.hobbyName}
                                    onChangeText={(text) => {
                                        const updatedHobbies = [...hobbies];
                                        updatedHobbies[index].hobbyName = text;
                                        setHobbies(updatedHobbies);
                                    }}
                                />
                            </View>
                        ))}
                    </View>
                )}
                {step === 2 && (
                    <View>
                        <Text style={styles.label}>Degree Details:</Text>
                        <Picker
                            selectedValue={degree}
                            onValueChange={(itemValue) => setDegree(itemValue)}
                            style={styles.picker}>
                            <Picker.Item label="Select Degree" value="" />
                            <Picker.Item label="B.Tech" value="B.Tech" />
                            <Picker.Item label="MBA" value="MBA" />
                            <Picker.Item label="B.Com" value="B.Com" />
                            <Picker.Item label="M.Tech" value="M.Tech" />
                            <Picker.Item label="PhD" value="PhD" />
                        </Picker>
                        <TextInput style={styles.input} placeholder="Institution Name" value={institutionName} onChangeText={setInstitutionName} />
                        <TextInput style={styles.input} placeholder="Branch" value={branch} onChangeText={setBranch} />
                        <TextInput style={styles.input} placeholder="Start Year" value={startYear} onChangeText={setStartYear} />
                        <TextInput style={styles.input} placeholder="End Year" value={endYear} onChangeText={setEndYear} />
                        <TextInput style={styles.input} placeholder="Grade or Percentage" value={grade} onChangeText={setGrade} />

                        <Text style={styles.label}>Skills:</Text>
                        {skills.map((skill, index) => (
                            <View key={index} style={styles.skillContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Skill Name"
                                    value={skill.skillName}
                                    onChangeText={(text) => {
                                        const updatedSkills = [...skills];
                                        updatedSkills[index].skillName = text;
                                        setSkills(updatedSkills);
                                    }}/>
                                <Picker
                                    selectedValue={skill.proficiencyLevel}
                                    onValueChange={(itemValue) => {
                                        const updatedSkills = [...skills];
                                        updatedSkills[index].proficiencyLevel = itemValue;
                                        setSkills(updatedSkills);
                                    }}
                                    style={styles.picker}>
                                    <Picker.Item label="Beginner" value="Beginner" />
                                    <Picker.Item label="Intermediate" value="Intermediate" />
                                    <Picker.Item label="Expert" value="Expert" />
                                </Picker>
                                {skills.length > 1 && (
                                    <Button title="Remove" onPress={() => handleRemoveSkill(index)} />
                                )}
                            </View>
                        ))}
                        <Button title="Add Skill" onPress={handleAddSkill} />
                        <Text style={styles.label}>Certifications:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Certification Name"
                            value={certificateName}
                            onChangeText={setCertificateName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Issuing Organization"
                            value={issuingOrganization}
                            onChangeText={setIssuingOrganization}
                        />
                        <TouchableOpacity onPress={() => setShowIssueDatePicker(true)} style={styles.datePicker}>
                            <Text style={styles.dateText}>
                                {issueDate ? issueDate.toISOString().split('T')[0] : 'Select Issue Date'}
                            </Text>
                        </TouchableOpacity>
                        {showIssueDatePicker && (
                            <DateTimePicker
                                value={issueDate}
                                mode="date"
                                display="default"
                                onChange={handleIssueDateChange}
                            />
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Certificate Link (optional)"
                            value={certificateLink}
                            onChangeText={setCertificateLink}
                        />
                        <Button title="Add Certification" onPress={handleAddCertification} />
                        {certifications.map((cert, index) => (
                            <View key={index} style={styles.skillContainer}>
                                
                            </View>
                        ))}
                    </View>
                )}
                {step === 3 && (
                    <View>
                        <Text style={styles.label}>Work Experience:</Text>
                        {workExperience.map((work, index) => (
                            <View key={index} style={styles.workContainer}>
                                <TextInput style={styles.input} placeholder="Company Name" value={work.companyName} onChangeText={(text) => {
                                    const updatedWork = [...workExperience];
                                    updatedWork[index].companyName = text;
                                    setWorkExperience(updatedWork);
                                }} />
                                <TextInput style={styles.input} placeholder="Role/Designation" value={work.role} onChangeText={(text) => {
                                    const updatedWork = [...workExperience];
                                    updatedWork[index].role = text;
                                    setWorkExperience(updatedWork);
                                }} />
                                <TextInput style={styles.input} placeholder="Description" value={work.description} onChangeText={(text) => {
                                    const updatedWork = [...workExperience];
                                    updatedWork[index].description = text;
                                    setWorkExperience(updatedWork);
                                }} />
                                <TouchableOpacity onPress={() => setShowWorkStartDatePicker(index)} style={styles.datePicker}>
                                    <Text style={styles.dateText}>
                                        {work.startDate ? work.startDate.toISOString().split('T')[0] : 'Select Start Date'}
                                    </Text>
                                </TouchableOpacity>
                                {showWorkStartDatePicker === index && (
                                    <DateTimePicker
                                        value={work.startDate || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => handleWorkStartDateChange(index, event, date)}
                                    />
                                )}
                                <TouchableOpacity onPress={() => setShowWorkEndDatePicker(index)} style={styles.datePicker}>
                                    <Text style={styles.dateText}>
                                        {work.endDate ? work.endDate.toISOString().split('T')[0] : 'Select End Date'}
                                    </Text>
                                </TouchableOpacity>
                                {showWorkEndDatePicker === index && (
                                    <DateTimePicker
                                        value={work.endDate || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => handleWorkEndDateChange(index, event, date)}
                                    />
                                )}
                                <View style={styles.checkboxContainer}>
                                    <Text>Is Current:</Text>
                                    <Switch
                                        value={work.isCurrent}
                                        onValueChange={(value) => {
                                            const updatedWork = [...workExperience];
                                            updatedWork[index].isCurrent = value;
                                            setWorkExperience(updatedWork);
                                        }}
                                    />
                                </View>
                            </View>
                        ))}
                        <Button title="Add Work Experience" onPress={handleAddWorkExperience} />
                        <Text style={styles.label}>Projects:</Text>
                        {projects.map((project, index) => (
                            <View key={index} style={styles.projectContainer}>
                                <TextInput style={styles.input} placeholder="Project Title" value={project.projectTitle} onChangeText={(text) => {
                                    const updatedProjects = [...projects];
                                    updatedProjects[index].projectTitle = text;
                                    setProjects(updatedProjects);
                                }} />
                                <TextInput style={styles.input} placeholder="Technologies Used" value={project.technologiesUsed} onChangeText={(text) => {
                                    const updatedProjects = [...projects];
                                    updatedProjects[index].technologiesUsed = text;
                                    setProjects(updatedProjects);
                                }} />
                                <TextInput style={styles.input} placeholder="Description" value={project.description} onChangeText={(text) => {
                                    const updatedProjects = [...projects];
                                    updatedProjects[index].description = text;
                                    setProjects(updatedProjects);
                                }} />
                                <TextInput style={styles.input} placeholder="Project Link (optional)" value={project.projectLink} onChangeText={(text) => {
                                    const updatedProjects = [...projects];
                                    updatedProjects[index].projectLink = text;
                                    setProjects(updatedProjects);
                                }} />
                            </View>
                        ))}
                        <Button title="Add Project" onPress={handleAddProject} />
                        <Text style={styles.label}>Achievements:</Text>
                        {achievements.map((achievement, index) => (
                            <View key={index} style={styles.achievementContainer}>
                                <TextInput style={styles.input} placeholder="Title" value={achievement.title} onChangeText={(text) => {
                                    const updatedAchievements = [...achievements];
                                    updatedAchievements[index].title = text;
                                    setAchievements(updatedAchievements);
                                }} />
                                <TextInput style={styles.input} placeholder="Description" value={achievement.description} onChangeText={(text) => {
                                    const updatedAchievements = [...achievements];
                                    updatedAchievements[index].description = text;
                                    setAchievements(updatedAchievements);
                                }} />
                                <TouchableOpacity onPress={() => setShowAchievementDatePicker(index)} style={styles.datePicker}>
                                    <Text style={styles.dateText}>
                                        {achievement.date ? achievement.date.toISOString().split('T')[0] : 'Select Date'}
                                    </Text>
                                </TouchableOpacity>
                                {showAchievementDatePicker === index && (
                                    <DateTimePicker
                                        value={achievement.date || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => handleAchievementDateChange(index, event, date)}
                                    />
                                )}
                            </View>
                        ))}
                        <Button title="Add Achievement" onPress={handleAddAchievement} />
                        <Text style={styles.label}>References:</Text>
                        {references.map((reference, index) => (
                            <View key={index} style={styles.referenceContainer}>
                                <TextInput style={styles.input} placeholder="Reference Name" value={reference.referenceName} onChangeText={(text) => {
                                    const updatedReferences = [...references];
                                    updatedReferences[index].referenceName = text;
                                    setReferences(updatedReferences);
                                }} />
                                <TextInput style={styles.input} placeholder="Relation" value={reference.relation} onChangeText={(text) => {
                                    const updatedReferences = [...references];
                                    updatedReferences[index].relation = text;
                                    setReferences(updatedReferences);
                                }} />
                                <TextInput style={styles.input} placeholder="Contact Info" value={reference.contactInfo} onChangeText={(text) => {
                                    const updatedReferences = [...references];
                                    updatedReferences[index].contactInfo = text;
                                    setReferences(updatedReferences);
                                }} />
                            </View>
                        ))}
                        <Text style={styles.label}>Optional Add-ons:</Text>
                        <TextInput style={styles.input} placeholder="Signature" value={signature} onChangeText={setSignature} />
                        <TextInput style={styles.input} placeholder="Profile Photo URL" value={profilePhotoUrl} onChangeText={setProfilePhotoUrl} />
                        {/* <Button title="Register" onPress={handleRegister} /> */}
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}>Already have an account? Login here</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.buttonContainer}>
                    {step > 1 && <Button title="Previous" onPress={handlePrevStep} />}
                    {step < 3 ? <Button title="Next" onPress={handleNextStep} /> : <Button title="Register" onPress={handleRegister} />}
                </View>
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        fontSize: 18,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    languageContainer: {
        marginBottom: 12,
    },
    hobbyContainer: {
        marginBottom: 12,
    },
    datePicker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        justifyContent: 'center',
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    dateText: {
        fontSize: 18,
        color: '#000',
    },
    skillContainer: {
        marginBottom: 12,
    },
    workContainer: {
        marginBottom: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    projectContainer: {
        marginBottom: 12,
    },
    achievementContainer: {
        marginBottom: 12,
    },
    referenceContainer: {
        marginBottom: 12,
    },
    link: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
    },
});
export default Register;
