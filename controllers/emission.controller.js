const pool = require("../database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;

const secretKey = process.env.SECRET_KEY

const emissionController = {
    newEntries: async (req, res, next) => {
        try {
            const organizationId = req.orgId;
            const { records, year } = req.body;

            if (!Array.isArray(records) || !year) {
                return res.status(400).json({ msg: 'Invalid request format' });
            }
            const factorQuery = 'SELECT id, emission_factor FROM SubSubFactor';
            const { rows } = await pool.query(factorQuery);

            // Create a map for faster lookup
            const subsubfactorData = {};
            rows.forEach((row) => {
                subsubfactorData[row.id] = row.emission_factor;
            });

            for (const record of records) {
                const { subsubfactorId, inputValue } = record;

                if (!(subsubfactorId in subsubfactorData)) {
                    return res.status(400).json({ msg: `SubSubFactor with ID ${subsubfactorId} not found` });
                }

                const emissionFactor = subsubfactorData[subsubfactorId];

                // Calculate the net emission
                const netEmission = inputValue * emissionFactor;

                // Insert the record into the EmissionRecord table
                const insertQuery = `
                  INSERT INTO EmissionRecord (organization_id, subsubfactor_id, input_value, record_year, net_emission)
                  VALUES ($1, $2, $3, $4, $5)
                `;

                await pool.query(insertQuery, [organizationId, subsubfactorId, inputValue, year, netEmission]);
            }
            res.json({ msg: 'Emission records inserted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal server error' });
        }
    }

}

module.exports = emissionController;