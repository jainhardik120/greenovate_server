const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const pool = require("./database.js");


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/company", async (req, res) => {
    try {
        const { name } = req.body;
        const newCompany = await pool.query("INSERT INTO companies (company_name) VALUES ($1) RETURNING *", [name]);
        return res.json(newCompany.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
})

app.get("/companies", async (req, res)=>{
    try {
        const all = await pool.query("SELECT * FROM companies");
        return res.json(all.rows);
    } catch (error) {
        console.log(error.message);
    }
})

app.get("/company/:id", async(req, res)=>{
    try {
        const id = req.params.id;
        const row = await pool.query("SELECT * FROM companies WHERE company_id = $1", [id]);
        return res.json(row.rows[0]);
    } catch (error) {
        console.log(error.message);
        return res.json({error : error.message});
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});