CREATE DATABASE database_platypus;

USE database_platypus;

-- USERS TABLE
CREATE TABLE users(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL
);

DESCRIBE users;

-- PRODUCTS TABLE
CREATE TABLE products(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    quantity INT(11) NOT NULL,
    type TEXT,
    user_id INT,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(id),
    brand VARCHAR(60)
);

DESCRIBE products;

-- PROVIDERS TABLE
CREATE TABLE providers(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(100),
    comments TEXT,
    user_id INT,
    CONSTRAINT fk_providers_users FOREIGN KEY (user_id) REFERENCES users(id)
);

DESCRIBE providers;