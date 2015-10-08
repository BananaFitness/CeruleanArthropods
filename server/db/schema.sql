CREATE DATABASE IF NOT EXISTS watsi;

USE watsi;

CREATE TABLE IF NOT EXISTS tbl_patients (
  id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  first_name VARCHAR(70) NOT NULL,
  last_name VARCHAR(70) NOT NULL,
  email VARCHAR(70) NOT NULL UNIQUE,
  password VARCHAR(70) NOT NULL,
  signup_data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  condition_id INT(11) NOT NULL,
  photo_url VARCHAR(200) DEFAULT NULL,
  bio TEXT,
  progress INT(20) DEFAULT 0,
  goal INT(20) NOT NULL,
  funded TINYINT(4) NOT NULL DEFAULT 0,
  INDEX(photo_url)
);

CREATE TABLE IF NOT EXISTS tbl_conditions (
  id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  condition_name VARCHAR(200) NOT NULL UNIQUE,
  global_contribution INT(11) NOT NULL DEFAULT 0,
  global_contributers INT(2) NOT NULL DEFAULT 0
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
  donor_first_name VARCHAR(70) NOT NULL,
  donor_last_name VARCHAR(70) NOT NULL,
  donor_email VARCHAR(70) NOT NULL,
  patient_id INT(11) NOT NULL
);

