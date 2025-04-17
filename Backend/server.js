const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
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

// ✅ Date formatting function (only one copy)
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : null;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "poojaswinicyetechnology@gmail.com",
    pass: "muapwbxnfxiteyei",
  },
});

// 🔐 Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  db.query('SELECT * FROM personal WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (result.length === 0) return res.status(400).json({ message: 'Invalid email or password' });

    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
      const token = jwt.sign({ userId: result[0].id }, 'your_jwt_secret_key', { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token, id: result[0].id });
    });
  });
});

// 🔐 Forgot Password + OTP
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60000);

  db.query(`UPDATE personal SET otp = ?, otp_expire = ? WHERE email = ?`, [otp, otpExpires, email], (err, result) => {
    if (err || result.affectedRows === 0)
      return res.json({ success: false, message: "Email not found" });

    const mailOptions = {
      from: "poojaswinicyetechnology@gmail.com",
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP code for resetting password is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) return res.json({ success: false, message: "Error sending OTP" });
      res.json({ success: true, message: "OTP sent to email" });
    });
  });
});

app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  db.query("SELECT * FROM personal WHERE email = ? AND otp = ? AND otp_expire > NOW()", [email, otp], (err, results) => {
    if (err) return res.json({ success: false, message: "Database error" });
    if (results.length === 0) return res.json({ success: false, message: "Invalid or expired OTP" });

    db.query("UPDATE personal SET otp = '', otp_expire = NULL, is_verified = 1 WHERE email = ?", [email], (updateErr) => {
      if (updateErr) return res.json({ success: false, message: "Error updating verification status" });
      res.json({ success: true, message: "OTP verified. Proceed to reset password." });
    });
  });
});

app.post("/api/reset-password", async (req, res) => {
  const { email, newPassword, confirmnewPassword } = req.body;

  if (!email || !newPassword || !confirmnewPassword)
    return res.json({ success: false, message: "All fields are required" });

  if (newPassword !== confirmnewPassword)
    return res.json({ success: false, message: "Passwords do not match" });

  db.query(`SELECT * FROM personal WHERE email = ?`, [email], async (err, results) => {
    if (err) return res.json({ success: false, message: "Database error" });
    if (results.length === 0) return res.json({ success: false, message: "Invalid email" });

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.query(`UPDATE personal SET password = ? WHERE email = ?`, [hashedPassword, email], (updateErr) => {
        if (updateErr) return res.json({ success: false, message: "Error resetting password" });
        res.json({ success: true, message: "Password reset successful!" });
      });
    } catch (error) {
      res.json({ success: false, message: "Error hashing password" });
    }
  });
});

// ✅ Register Route
app.post('/register', (req, res) => {
  const {
    fullname, email, password, contactnumber, address, dob, fatherName, motherName,
    linkedinUrl, githubUrl, portfolioUrl, objective, languages, hobbies, gender
  } = req.body;

  if (!fullname || !email || !password || !contactnumber || !address || !dob || !fatherName || !motherName || !linkedinUrl || !gender)
    return res.status(400).json({ message: 'All required fields must be filled' });

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });

    const personalQuery = `
      INSERT INTO personal (
        full_name, email, password, dob, phone, address, father_name, mother_name,
        linkedin_url, github_url, portfolio_url, objective, languages, hobbies, gender
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const personalValues = [
      fullname, email, hashedPassword, formatDate(dob), contactnumber, address, fatherName, motherName,
      linkedinUrl, githubUrl || null, portfolioUrl || null, objective,
      JSON.stringify(languages), hobbies.join(', '), gender
    ];

    db.query(personalQuery, personalValues, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error inserting personal data into the database' });

      // Return the inserted userId
      res.status(201).json({ message: 'Registration successful', userId: result.insertId });
    });
  });
});

// ✅ Education Route
app.post('/education', (req, res) => {
  const {
    userId, // Add userId to the request body
    institutionName,
    degree,
    branch,
    startYear,
    endYear,
    grade,
    skills,
    certificate_info,
  } = req.body;

  if (!userId || !institutionName || !degree || !branch || !startYear || !endYear) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  const educationQuery = `
    INSERT INTO education (
      user_id, institution_name, degree, branch_or_major, start_year, end_year, grade_or_percentage, skills, certificate_info
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const educationValues = [
    userId, institutionName, degree, branch, startYear, endYear, grade || null,
    JSON.stringify(skills || []), JSON.stringify(certificate_info || []),
  ];

  db.query(educationQuery, educationValues, (err) => {
    if (err) {
      console.error('Error inserting education data:', err);
      return res.status(500).json({ message: 'Error inserting education data into the database' });
    }
    res.status(201).json({ message: 'Education data inserted successfully' });
  });
});

// ✅ Project Experience Route
app.post('/project-experience', (req, res) => {
  const {
    userId, // Add userId to the request body
    projectDetails,
    achievements,
    workExperienceInfo,
    referenceName,
    referenceRelation,
    referenceContactInfo,
    profilePhotoUrl,
    signature
  } = req.body;

  if (!userId || !projectDetails?.length || !achievements?.length || !workExperienceInfo?.length || !referenceName || !referenceRelation || !referenceContactInfo) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const formattedProjectDetails = JSON.stringify(projectDetails);
  const formattedAchievements = JSON.stringify(achievements);
  const formattedWorkExperienceInfo = JSON.stringify(workExperienceInfo);

  const query = `
    INSERT INTO project_experience (
      user_id, project_details, achievements, work_experience_info, reference_name, reference_relation, reference_contact_info, profile_photo_url, signature
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId, formattedProjectDetails, formattedAchievements, formattedWorkExperienceInfo,
    referenceName, referenceRelation, referenceContactInfo, profilePhotoUrl || null, signature || null
  ];

  db.query(query, values, (err) => {
    if (err) {
      console.error('Database Insert Error (Project Experience):', err);
      return res.status(500).json({ message: 'Error inserting data into the database' });
    }
    res.status(201).json({ message: 'Project experience and work details added successfully' });
  });
});

// ✅ Get user by ID
app.get('/api/personal/:id', (req, res) => {
  const { id } = req.params;

  const personalQuery = 'SELECT * FROM personal WHERE id = ?';
  const educationQuery = 'SELECT * FROM education WHERE user_id = ?';
  const projectExperienceQuery = 'SELECT * FROM project_experience WHERE user_id = ?';

  db.query(personalQuery, [id], (err, personalResult) => {
    if (err || personalResult.length === 0)
      return res.status(404).json({ message: 'User not found' });

    db.query(educationQuery, [id], (err, educationResult) => {
      if (err) return res.status(500).json({ message: 'Education fetch error' });

      db.query(projectExperienceQuery, [id], (err, projectExperienceResult) => {
        if (err) return res.status(500).json({ message: 'Project experience fetch error' });

        const workExperienceResult = projectExperienceResult.filter(
          (project) => project.company_name && project.role_or_designation
        );

        res.status(200).json({
          personal: personalResult[0],
          education: educationResult,
          project_experience: projectExperienceResult,
          work_experience: workExperienceResult,
        });
      });
    });
  });
});

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
