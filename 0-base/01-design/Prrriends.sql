CREATE Prrriends;

USE Prrriends;

CREATE TABLE human (
	human_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    human_name VARCHAR(70) NOT NULL,
    human_lastName VARCHAR(100) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    human_img VARCHAR(100),
    description VARCHAR(250),
    human_is_deleted BOOLEAN DEFAULT 0
);

CREATE TABLE animal(
	animal_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    animal_name VARCHAR(70) NOT NULL,
    animal_img VARCHAR(100),
    description VARCHAR(250),
    animal_is_deleted BOOLEAN DEFAULT 0,
    human_id INT UNSIGNED,
    CONSTRAINT fk_id_human FOREIGN KEY (human_id)
    REFERENCES human(human_id) ON DELETE CASCADE ON UPDATE CASCADE
);


SELECT * FROM human;
SELECT * FROM animal;