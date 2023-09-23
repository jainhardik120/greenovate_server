const express = require('express');
const pool = require('../database.js');

const factorController = {
    allFields: async (req, res, next) => {
        try {
            const query = `
              SELECT
                f.id AS factor_id,
                f.name AS factor_name,
                sf.id AS subfactor_id,
                sf.name AS subfactor_name,
                ssf.id AS subsubfactor_id,
                ssf.name AS subsubfactor_name,
                ssf.emission_factor,
                ssf.description,
                ssf.unit
              FROM
                Factor f
              LEFT JOIN
                SubFactor sf ON f.id = sf.factor_id
              LEFT JOIN
                SubSubFactor ssf ON sf.id = ssf.sub_factor_id
            `;

            const { rows } = await pool.query(query);

            const data = rows.reduce((acc, row) => {
                if (!acc[row.factor_id]) {
                    acc[row.factor_id] = {
                        factor_id: row.factor_id,
                        factor_name: row.factor_name,
                        subfactors: {},
                    };
                }

                if (!acc[row.factor_id].subfactors[row.subfactor_id]) {
                    acc[row.factor_id].subfactors[row.subfactor_id] = {
                        subfactor_id: row.subfactor_id,
                        subfactor_name: row.subfactor_name,
                        subsubfactors: [],
                    };
                }

                acc[row.factor_id].subfactors[row.subfactor_id].subsubfactors.push({
                    subsubfactor_id: row.subsubfactor_id,
                    subsubfactor_name: row.subsubfactor_name,
                    emission_factor: row.emission_factor,
                    description: row.description,
                    unit: row.unit,
                });

                return acc;
            }, {});

            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal server error' });
        }
    }
}
module.exports = factorController;
