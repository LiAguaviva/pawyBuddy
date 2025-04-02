CREATE DATABASE purrfriends;
-- DROP DATABASE purrfriends;

USE purrfriends;

CREATE TABLE human (
	human_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    human_name VARCHAR(70) NOT NULL,
    human_lastName VARCHAR(100) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
	human_description VARCHAR(250),
    phone VARCHAR(25),
    human_img VARCHAR(100),
    human_is_deleted BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE animal(
	animal_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    animal_name VARCHAR(70) NOT NULL,
    description VARCHAR(250),
    adopt_year YEAR NOT NULL, 
    species VARCHAR(50),
    animal_img VARCHAR(100),    
    animal_is_deleted BOOLEAN NOT NULL DEFAULT 0,
    human_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_id_human FOREIGN KEY (human_id)
    REFERENCES human(human_id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE animal;

INSERT INTO human (human_name, human_lastname, email, password, human_description, phone) 
VALUES ('Jaja', 'Juju', 'jaja@juju.com', 'j', 
'kjsdf eijj i jsdfoiewj djoi jsdiofj ej jsojaoisja sjfojas jasiojfaiofsjinm j ojio joi', '000 000 000');

INSERT INTO	animal (animal_name, description, adopt_year, species, human_id)
VALUES ('Luchín', 'es un hamster canela y su nombre hace referencia a Víctor Jara', 2015, 'hámster', 1);

INSERT INTO	animal (animal_name, description, adopt_year, species, human_id)
VALUES ('Borrar', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae ea corrupti quae. Aliquid doloremque ipsa nobis labore neque, voluptates sit.', 2008, 'gato', 1);

INSERT INTO	animal (animal_name, description, adopt_year, species, human_id)
VALUES ('Mushu', 'Tiene carácter pero es majo', 1998, 'dragon', 2);

INSERT INTO	animal (animal_name, description, adopt_year, species, human_id)
VALUES ('Kratos', 'Perrete bruto, negro, fuerte y temeroso', 1998, 'perro', 2);

UPDATE animal SET animal_is_deleted = 0 WHERE animal_id = 2;
UPDATE animal SET human_id = 2 WHERE animal_id = 2;

UPDATE human SET human_id = 13 WHERE human_id = 14;

SELECT * FROM human;
SELECT * FROM animal;

