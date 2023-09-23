const pool = require("../database.js");
const format = require('pg-format');

const emissionController = {
    newEntries: async (req, res, next) => {
        try {
            const organizationId = req.orgId;
            const { records, year } = req.body;

            if (!Array.isArray(records) || !year) {
                return res.status(400).json({ msg: 'Invalid request format' });
            }

            const inputValuesMap = new Map();
            records.forEach((record) => {
                inputValuesMap.set(record.subsubfactorId, record.inputValue);
            });
            const factorQuery = 'SELECT id, emission_factor FROM SubSubFactor';
            const { rows } = await pool.query(factorQuery);
            const insertData = [];
            rows.forEach((subsubfactor) => {
                const subsubfactorId = subsubfactor.id;
                const inputValue = inputValuesMap.get(subsubfactorId);

                const emissionFactor = subsubfactor.emission_factor;
                const netEmission = inputValue !== undefined ? inputValue * emissionFactor : 0;

                insertData.push([organizationId, subsubfactorId, inputValue || 0, year, netEmission]);
            });
            const insertQuery = format(
                'INSERT INTO EmissionRecord (organization_id, subsubfactor_id, input_value, record_year, net_emission) VALUES %L',
                insertData
            );

            await pool.query(insertQuery);

            res.json({ msg: 'Emission records inserted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal server error' });
        }
    },
    yearWiseEmission: async (req, res, next) => {
        try {
            const organizationId = req.orgId;
            const query = `
      SELECT record_year, SUM(net_emission) AS total_emission
      FROM EmissionRecord
      WHERE organization_id = $1
      GROUP BY record_year
      ORDER BY record_year;
    `;

            const { rows } = await pool.query(query, [organizationId]);

            const yearWiseEmissionSum = rows.map((row) => ({
                year: row.record_year,
                totalEmission: row.total_emission,
            }));

            res.json(yearWiseEmissionSum);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal server error' });
        }
    },
    factorWiseEmission: async (req, res, next) => {
        try {
            const organizationId = req.orgId;
            const year = req.query.year;

            if (!year) {
                return res.status(400).json({ msg: 'Year is required' });
            }

            const query = `
              SELECT f.id AS factor_id, f.name AS factor_name, SUM(er.net_emission) AS total_emission
              FROM EmissionRecord er
              JOIN SubSubFactor ssf ON er.subsubfactor_id = ssf.id
              JOIN SubFactor sf ON ssf.sub_factor_id = sf.id
              JOIN Factor f ON sf.factor_id = f.id
              WHERE er.organization_id = $1 AND er.record_year = $2
              GROUP BY f.id, f.name
              ORDER BY f.name;
            `;

            const { rows } = await pool.query(query, [organizationId, year]);

            // Format the result as an array of objects
            const factorWiseEmissionSum = rows.map((row) => ({
                factorId: row.factor_id,
                factorName: row.factor_name,
                totalEmission: row.total_emission,
            }));

            res.json(factorWiseEmissionSum);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal server error' });
        }
    }

}

module.exports = emissionController;