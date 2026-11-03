const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configure MySQL Connection (Update 'password' to your MySQL Workbench password)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_MYSQL_PASSWORD', 
    database: 'student_biodata_db'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL Workbench Database!');
    }
});

// 2. API Endpoint: Validate Login Credentials
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM user_credentials WHERE username = ? AND password_hash = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });

        if (results.length > 0) {
            res.json({ status: 'success', message: 'Login successful!' });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid username or password' });
        }
    });
});

// 3. API Endpoint: Save Student Biodata to 2 Tables
app.post('/api/biodata', (req, res) => {
    const { fullName, dateOfBirth, gender, phone, email, address, matricNumber, faculty, department, level, programme } = req.body;

    // Insert into Table 1: students
    const sqlStudent = `
        INSERT INTO students (full_name, date_of_birth, gender, phone, email, address)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sqlStudent, [fullName, dateOfBirth, gender, phone, email, address], (err, result) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });

        const studentId = result.insertId;

        // Insert into Table 2: academic_records using studentId as Foreign Key
        const sqlAcademic = `
            INSERT INTO academic_records (student_id, matric_number, faculty, department, level, programme)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(sqlAcademic, [studentId, matricNumber, faculty, department, level, programme], (err2) => {
            if (err2) return res.status(500).json({ status: 'error', message: err2.message });

            res.json({ status: 'success', message: 'Student biodata saved to MySQL database!' });
        });
    });
});

// Start Server on Port 5000
app.listen(5000, () => console.log('Node.js server running on http://localhost:5000'));