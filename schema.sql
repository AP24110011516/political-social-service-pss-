
-- CivicConnect PostgreSQL Schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    aadhaar_number VARCHAR(12) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15),
    user_type VARCHAR(20) DEFAULT 'citizen',
    state VARCHAR(50),
    district VARCHAR(50),
    constituency VARCHAR(50),
    village VARCHAR(50),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    author_id INTEGER REFERENCES users(id),
    author_name VARCHAR(100),
    reactions INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT FALSE,
    state VARCHAR(50),
    district VARCHAR(50),
    constituency VARCHAR(50),
    village VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Mock Data
INSERT INTO users (aadhaar_number, name, user_type, state, district, constituency, village)
VALUES ('123456789012', 'Ramesh Kumar', 'citizen', 'Andhra Pradesh', 'Amaravati', 'Tulluru', 'Village A');
