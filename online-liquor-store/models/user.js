const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    async create(userData) {
        const { name, username, email, password, address, aadhaar_id } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (name, username, email, password_hash, address, aadhaar_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`;
        const values = [name, username, email, hashedPassword, address, aadhaar_id];
        const result = await pool.query(query, values);
        return result.rows[0]; // Return the created user
    },

    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0]; // Return the user if found
    },

    async verifyPassword(user, password) {
        return await bcrypt.compare(password, user.password_hash); // Compare the provided password with the hashed password
    }
};

module.exports = User;
