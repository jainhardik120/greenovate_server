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
    FOREIGN KEY (sub_factor_id) REFERENCES SubFactor(id)
);