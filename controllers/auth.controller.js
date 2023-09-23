const pool = require("../database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;

const secretKey = process.env.SECRET_KEY

const authController = {
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ msg: 'Email and password are required' });
            }
            const userQuery = 'SELECT * FROM organization WHERE email = $1';
            const { rows } = await pool.query(userQuery, [email]);
            if (rows.length === 0) {
                return res.status(401).json({ msg: 'User not found' });
            }
            const user = rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ msg: 'Incorrect password' });
            }
            const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
            res.json({ msg: 'Login successful', token });
        } catch (error) {
            next(error);
        }
    },

    signup: async (req, res, next) => {
        try {
            const { email, password, organizationName } = req.body;
            if (!email || !password || !organizationName) {
                return res.status(400).json({ msg: 'Email, password, and organizationName are required' });
            }
            const query = 'SELECT * FROM organization WHERE email = $1 OR name = $2';
            const result = await pool.query(query, [email, organizationName]);
            if (result.rows.length > 0) {
                return res.status(400).json({ msg: 'Email or organization name already exists' });
            }
            const organizationId = uuid();
            const hashedPassword = await bcrypt.hash(password, 10);
            const userQuery = 'INSERT INTO organization (id, email, password, name) VALUES ($1, $2, $3, $4)';
            await pool.query(userQuery, [organizationId, email, hashedPassword, organizationName]);
            const token = jwt.sign({ userId: organizationId }, secretKey, { expiresIn: '1h' });
            res.json({ msg: 'Signup successful', token });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = authController;