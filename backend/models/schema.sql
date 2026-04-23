// PostgreSQL Schema Definition

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) CHECK (role IN ('restaurant', 'volunteer', 'shelter')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volunteers Table (extends Users)
CREATE TABLE volunteers (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_deliveries INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT false,
    last_lat DECIMAL(10,8),
    last_lng DECIMAL(10,8),
    fcm_token TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_volunteer_location ON volunteers(last_lat, last_lng);

-- Restaurants Table (extends Users)
CREATE TABLE restaurants (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    address TEXT,
    lat DECIMAL(10,8),
    lng DECIMAL(10,8)
);

-- Shelters Table (extends Users)
CREATE TABLE shelters (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    address TEXT,
    lat DECIMAL(10,8),
    lng DECIMAL(10,8),
    capacity INTEGER,
    demand_score DECIMAL(5,2) DEFAULT 0
);

-- Donations Table
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(user_id),
    food_details TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'picked_up', 'delivered', 'expired', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_donation_status ON donations(status);

-- Deliveries Table
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    donation_id INTEGER REFERENCES donations(id),
    volunteer_id INTEGER REFERENCES volunteers(user_id),
    shelter_id INTEGER REFERENCES shelters(user_id),
    status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'en_route_pickup', 'picked_up', 'delivering', 'delivered', 'failed')),
    pickup_photo_url TEXT,
    delivery_photo_url TEXT,
    notes TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255),
    body TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
