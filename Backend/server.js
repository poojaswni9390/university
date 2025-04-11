const express = require('express');
const mysql = require('mysql2'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 
const app = express();
app.use(express.json()); 
app.use(cors());

// MySQL Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '12345', 
  database: 'university',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM personal WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('Database Query Error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ userId: result[0].id }, 'your_jwt_secret_key', { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token, id: result[0].id }); // Ensure `id` is included in the response
    });
  });
});

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Register Route
app.post('/register', (req, res) => {
  const {
    fullname, email, password, contactnumber, address, dob, fatherName, motherName,
    linkedinUrl, githubUrl, portfolioUrl, objective, languages, hobbies
  } = req.body;

  if (!fullname || !email || !password || !contactnumber || !address || !dob || !fatherName || !motherName || !linkedinUrl) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    const personalQuery = `
      INSERT INTO personal (
        full_name, email, password, dob, phone, address, father_name, mother_name,
        linkedin_url, github_url, portfolio_url, objective, languages, hobbies
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const personalValues = [
      fullname, email, hashedPassword, formatDate(dob), contactnumber, address, fatherName, motherName,
      linkedinUrl, githubUrl || null, portfolioUrl || null, objective,
      JSON.stringify(languages), hobbies.join(', ')
    ];

    db.query(personalQuery, personalValues, (err, result) => {
      if (err) {
        console.error('Database Insert Error (Personal):', err);
        return res.status(500).json({ message: 'Error inserting personal data into the database' });
      }
      res.status(201).json({ message: 'Registration successful' });
    });
  });
});

// Education Route
app.post('/education', (req, res) => {
  const {
    institutionName, degree, branch, startYear, endYear, grade, skills,
    certificateName, issuingOrganization, issueDate, certificateLink
  } = req.body;

  if (!institutionName || !degree || !branch || !startYear || !endYear) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  const educationQuery = `
    INSERT INTO education (
      institution_name, degree, branch_or_major, start_year, end_year, grade_or_percentage, skills,
      certificate_name, issuing_organization, issue_date, certificate_link
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const educationValues = [
    institutionName, degree, branch, startYear, endYear, grade || null,
    JSON.stringify(skills || []), certificateName || null, issuingOrganization || null,
    issueDate ? formatDate(issueDate) : null, certificateLink || null
  ];

  db.query(educationQuery, educationValues, (err, result) => {
    if (err) {
      console.error('Database Insert Error (Education):', err);
      return res.status(500).json({ message: 'Error inserting education data into the database' });
    }
    res.status(201).json({ message: 'Education data inserted successfully' });
  });
});

// Route to store project experience, achievements, work experience, references, profile photo, and signature
app.post('/project-experience', (req, res) => {
  const {
    projectTitle, technologiesUsed, description, projectLink,
    achievementTitle, achievementDescription, achievementDate,
    companyName, roleOrDesignation, startDate, endDate, isCurrent, workDescription,
    referenceName, referenceRelation, referenceContactInfo,
    profilePhotoUrl, signature
  } = req.body;

  // Validate required fields
  if (!projectTitle || !technologiesUsed || !description || !achievementTitle || !achievementDescription || !companyName || !roleOrDesignation || !startDate || !referenceName || !referenceRelation || !referenceContactInfo) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  const formattedAchievementDate = achievementDate ? formatDate(achievementDate) : null;
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = endDate ? formatDate(endDate) : null;

  const query = `
    INSERT INTO project_experience (
      project_title, technologies_used, description, project_link,
      achievement_title, achievement_description, achievement_date,
      company_name, role_or_designation, start_date, end_date, is_current, work_description,
      reference_name, reference_relation, reference_contact_info,
      profile_photo_url, signature
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    projectTitle, technologiesUsed, description, projectLink || null,
    achievementTitle, achievementDescription, formattedAchievementDate,
    companyName, roleOrDesignation, formattedStartDate, formattedEndDate, isCurrent || false, workDescription || null,
    referenceName, referenceRelation, referenceContactInfo,
    profilePhotoUrl || null, signature || null
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database Insert Error (Project Experience):', err);
      return res.status(500).json({ message: 'Error inserting data into the database' });
    }
    res.status(201).json({ message: 'Project experience and related details added successfully' });
  });
});

app.get('/api/personal/:id', (req, res) => {
  const { id } = req.params;

  const personalQuery = 'SELECT * FROM personal WHERE id = ?';
  const educationQuery = 'SELECT * FROM education WHERE user_id = ?';
  const projectExperienceQuery = 'SELECT * FROM project_experience WHERE user_id = ?';

  db.query(personalQuery, [id], (err, personalResult) => {
    if (err) {
      console.error('Database Query Error (Fetch Personal):', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (personalResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    db.query(educationQuery, [id], (err, educationResult) => {
      console.log('Education Query Result:', educationResult); // Debugging log
      if (err) {
        console.error('Database Query Error (Fetch Education):', err);
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      db.query(projectExperienceQuery, [id], (err, projectExperienceResult) => {
        console.log('Project Experience Query Result:', projectExperienceResult); // Debugging log
        if (err) {
          console.error('Database Query Error (Fetch Project Experience):', err);
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        // Filter work experience details from project_experience
        const workExperienceResult = projectExperienceResult.filter(
          (project) => project.company_name && project.role_or_designation
        );

        res.status(200).json({
          personal: personalResult[0],
          education: educationResult,
          project_experience: projectExperienceResult,
          work_experience: workExperienceResult, // Include filtered work experience
        });
      });
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});