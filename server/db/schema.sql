CREATE DATABASE IF NOT EXISTS watsi;

USE watsi;

CREATE TABLE IF NOT EXISTS tbl_conditions (
  id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  condition_name VARCHAR(200) NOT NULL UNIQUE,
  global_contribution INT(11) NOT NULL DEFAULT 0,
  global_contributers INT(2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tbl_patients (
  id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  first_name VARCHAR(70) NOT NULL,
  last_name VARCHAR(70) NOT NULL,
  latitude DECIMAL(15, 11) NOT NULL, 
  longitude DECIMAL(15, 11) NOT NULL,
  email VARCHAR(70) NOT NULL UNIQUE,
  password VARCHAR(70) NOT NULL,
  signup_data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  condition_id INT(11) NOT NULL,
  photo_url VARCHAR(200) DEFAULT NULL,
  bio TEXT,
  progress INT(20) DEFAULT 0,
  goal INT(20) NOT NULL,
  funded TINYINT(4) NOT NULL DEFAULT 0,
  FOREIGN KEY (condition_id) REFERENCES tbl_conditions(id)
);

CREATE TABLE IF NOT EXISTS tbl_patient_photos (
  id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  photo_url VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tbl_users (
  id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  username VARCHAR(70) NOT NULL UNIQUE,
  password VARCHAR(70),
  provider VARCHAR(70) NOT NULL DEFAULT "local",
  token VARCHAR(255),
  profile_id VARCHAR(70),
  first_name VARCHAR(70) NOT NULL DEFAULT "Not Available",
  last_name VARCHAR(70) NOT NULL DEFAULT "Not Available",
  email VARCHAR(70),
  age INT(20),
  location VARCHAR(100) NOT NULL DEFAULT "San Francisco, CA"
);

CREATE TABLE IF NOT EXISTS tbl_donations (
  id INT(20) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  amount INT(20) NOT NULL,
  patient_id INT(11) NOT NULL,
  donor_id INT(11) NOT NULL,
  FOREIGN KEY (donor_id) REFERENCES tbl_users(id),
  FOREIGN KEY (patient_id) REFERENCES tbl_patients(id)
);

INSERT INTO tbl_conditions (condition_name) VALUES ('Cancer');
INSERT INTO tbl_conditions (condition_name) VALUES ('AIDS');
INSERT INTO tbl_conditions (condition_name) VALUES ('SARS');

INSERT INTO tbl_patients (first_name, last_name, longitude, latitude, email, password, condition_id, goal) VALUES ('Bob', 'Shallowits', 40.689060, 74.044636, 'bs@gmail.com', 'password', 1, 2000);
INSERT INTO tbl_patients (first_name, last_name, longitude, latitude, email, password, condition_id, goal) VALUES ('John', 'Chander', 35.976895, 119.619141, 'jc@gmail.com', 'password', 2, 4000);
INSERT INTO tbl_patients (first_name, last_name, longitude, latitude, email, password, condition_id, goal) VALUES ('Saul', 'Aradia', 19.056926, 45.703125, 'sa@gmail.com', 'password', 3, 9000);

INSERT INTO tbl_donations (amount, patient_id, donor_id) VALUES (4000, 1, 1);
INSERT INTO tbl_donations (amount, patient_id, donor_id) VALUES (7000, 2, 1);
INSERT INTO tbl_donations (amount, patient_id, donor_id) VALUES (52000, 3, 1);











