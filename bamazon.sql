CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  Artist VARCHAR(45) NULL,
  Song VARCHAR(45) NULL,
  Year NUMERIC(10) NULL,
  Raw_Popularity_World DECIMAL(10,4) NULL,
  Popularity_US DECIMAL(10,4) NULL,
  Popularity_UK DECIMAL(10,4) NULL,
  Popularity_Europe DECIMAL(10,4) NULL,
  Popularity_the_rest_world DECIMAL(10,4) NULL,
  PRIMARY KEY (position)
);