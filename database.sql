CREATE DATABASE greenovate;

CREATE TABLE organization (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Factor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE SubFactor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    factor_id INT NOT NULL,
    FOREIGN KEY (factor_id) REFERENCES Factor(id)
);

CREATE TABLE SubSubFactor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sub_factor_id INT NOT NULL,
    emission_factor FLOAT NOT NULL,
    description VARCHAR(255), 
    unit VARCHAR(50)
    FOREIGN KEY (sub_factor_id) REFERENCES SubFactor(id)
);

INSERT INTO SubFactor (name, factor_id) VALUES 
('Car', 1),
('Bus', 1),
('Vans', 1),
('Transportation', 1),
('Grid Electricity', 2),
('Energy Generation', 2),
('Gas', 2),
('Pipeline', 2),
('Facility', 2),
('Other', 2),
('Fugitive Gases', 2),
('Accomodation', 2);


INSERT INTO SubSubFactor (name, sub_factor_id, emission_factor, description, unit)
VALUES
    ('diesel', 1, 0.1708, 'Specific emission for diesel cars', 'Kgco2e'),
    ('gasoline', 1, 0.1705, 'Specific emission for gasoline cars', 'Kgco2e'),
    ('ev', 1, 0.0514, 'Specific emission for electric cars', 'Kgco2e'),
    ('cng', 1, 0.1752, 'Specific emission for CNG cars', 'Kgco2e'),
    ('lpg', 1, 0.1978, 'Specific emission for LPG cars', 'Kgco2e');

-- Insert data for 'bus' sub-sub-factor
INSERT INTO SubSubFactor (name, sub_factor_id, emission_factor, description, unit)
VALUES
    ('passenger-km', 2, 0.1778, 'Specific emission per passenger-kilometer for buses', 'Kgco2e/pass-km');

-- Insert data for 'vans' sub-sub-factors
INSERT INTO SubSubFactor (name, sub_factor_id, emission_factor, description, unit)
VALUES
    ('Battery EV vans - average (up to 3.5 tonnes)', 3, 0.057, 'Specific emission for Battery EV vans', 'Kgco2e/km'),
    ('Petrol van - Class I (up to 1.305 tonnes)', 3, 0.1969, 'Specific emission for Petrol vans (Class I)', 'Kgco2e/km'),
    ('Diesel van - Class I (up to 1.305 tonnes)', 3, 0.1467, 'Specific emission for Diesel vans (Class I)', 'Kgco2e/km'),
    ('Diesel van - Class II (1.305 to 1.74 tonnes)', 3, 0.1751, 'Specific emission for Diesel vans (Class II)', 'Kgco2e/km'),
    ('Petrol van - Class II (1.305 to 1.74 tonnes)', 3, 0.2046, 'Specific emission for Petrol vans (Class II)', 'Kgco2e/km'),
    ('Diesel van - Class III (1.74 to 3.5 tonnes)', 3, 0.2548, 'Specific emission for Diesel vans (Class III)', 'Kgco2e/km'),
    ('Petrol van - Class III (1.74 to 3.5 tonnes)', 3, 0.3261, 'Specific emission for Petrol vans (Class III)', 'Kgco2e/km');

-- Insert data for 'transportation' sub-sub-factor
INSERT INTO SubSubFactor (name, sub_factor_id, emission_factor, description, unit)
VALUES
    ('Warehousing and support services for transportation', 4, 0.181, 'Specific emission for warehousing and support services', 'kg/GBP'),
    ('Upstream transportation and distribution', 4, 0.484, 'Specific emission for upstream transportation and distribution', 'kg/USD'),
    ('Air freight', 4, 1.6372, 'Specific emission for air freight', 'Kgco2e/USD'),
    ('Water freight transport services', 4, 1.9324, 'Specific emission for water freight transport services', 'Kgco2e/USD'),
    ('Rail (freight)', 4, 0.776, 'Specific emission for rail freight', 'Kgco2e/USD'),
    ('Road Freight/Inland transport', 4, 0.776, 'Specific emission for road freight and inland transport', 'Kgco2e/USD'),
    ('other', 4, 1.4529, 'Specific emission for other transportation', 'kg/EUR');

INSERT INTO SubSubFactor (name, sub_factor_id, emission_factor, description, unit)
VALUES
    ('Ele', 5, 0.7132, 'Specific emission for warehousing and support services', 'kg/GBP'),