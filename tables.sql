-- CREATE DATABASE finanservs

use finanservs;

DROP TABLE `institutions`;
CREATE TABLE `institutions` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ;

select * from institutions;

DROP TABLE `planillas_j`;
CREATE TABLE `planillas_j` (
  `id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

select * from planillas_j;

DROP TABLE `profesions_lw`;
CREATE TABLE `profesions_lw` (
  `id` int NOT NULL,
  `titulo` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ;

select * from profesions_lw;

DROP TABLE `profesions_acp`;
CREATE TABLE `profesions_acp` (
  `id` int NOT NULL,
  `titulo` varchar(60) NOT NULL,
  `grupo` varchar(45) DEFAULT NULL,
  `segmento` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

select * from profesions_acp;



DROP TABLE `sectors`;
CREATE TABLE `sectors` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  `short_name` varchar(2) NOT NULL,
  PRIMARY KEY (`id`)
);


insert into sectors values (1, 'Privado', 'P');
insert into sectors values (2, 'Publico', 'Pb');
insert into sectors values (3, 'Jubilado', 'J');


DROP TABLE `profesions`;
CREATE TABLE `profesions` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
);

insert into profesions values (1, 'Empresa Privada');
insert into profesions values (2, 'Medicos/Enfermeras');
insert into profesions values (3, 'Educador');
insert into profesions values (4, 'Administrativo');
insert into profesions values (5, 'ACP');
insert into profesions values (6, 'Seguridad Publica');
insert into profesions values (7, 'Jubilado');


DROP TABLE `civil_status`;
CREATE TABLE `civil_status` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ;

insert into civil_status values (1, 'Casado');
insert into civil_status values (2, 'Soltero');
insert into civil_status values (3, 'Unido');
insert into civil_status values (4, 'Divorciado');
insert into civil_status values (5, 'Viudo');

DROP TABLE `purposes`;
CREATE TABLE `purposes` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  `is_active` boolean,
  PRIMARY KEY (`id`)
) ;

insert into purposes value (0, 'Compra de Auto', true);
insert into purposes value (1, 'Boda', true);
insert into purposes value (2, 'Remodelación', true);
insert into purposes value (3, 'Colegio', true);
insert into purposes value (4, 'Viaje', true);
insert into purposes value (5, 'Quince años', true);


DROP TABLE `laboral_status`;
CREATE TABLE `laboral_status` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  `is_active` boolean,
  PRIMARY KEY (`id`)
) ;

insert into laboral_status value (0, 'Temporal', true);
insert into laboral_status value (1, 'Permanente', true);
insert into laboral_status value (2, 'Serv. Profesional', true);


DROP TABLE `payments`;
CREATE TABLE `payments` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
);


insert into payments value (0, '0 a 30 Días');
insert into payments value (1, '31 a 60 Días');
insert into payments value (2, '61 a 90 Días');
insert into payments value (3, 'Arreglo de Pago');
insert into payments value (4, 'Demanda Judicial/ Cuenta Contra Reserva');


DROP TABLE `housings`;
CREATE TABLE `housings` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  `is_active` boolean,
  PRIMARY KEY (`id`)
) ;


insert into housings value (1, 'Casa Propia', true);
insert into housings value (2, 'Padres o Familiares', true);
insert into housings value (3, 'Casa Hipotecada', true);
insert into housings value (4, 'Casa Alquilada', true);


DROP TABLE `capacidad`;
CREATE TABLE `capacidad` (
  `id` int NOT NULL,
  `id_sector` int NOT NULL,
  `id_profesion` int NOT NULL,
  `descto_chip` float,
  `descto_ship` float,
  `deuda_chip` float,
  `deuda_ship` float,
  `plazo_max` int,
  `tasa` float,
  `comision` float,
  `mount_min` float,
  `mount_max` float,
  PRIMARY KEY (`id`)
) ;


insert into capacidad values (4,1,1,20,20,50,45,120,11,7,3000,25000);
insert into capacidad values (2,1,2,20,20,50,45,144,10,6,3000,30000);
insert into capacidad values (3,1,3,20,20,50,45,144,10,6,3000,30000);

insert into capacidad values (5,2,2,35,35,55,55,360,7.25,9.8,3000,50000);
insert into capacidad values (6,2,3,35,35,55,55,360,7.25,9.8,3000,50000);
insert into capacidad values (7,2,4,35,35,55,45,180,11,6.25,3000,35000);
insert into capacidad values (8,2,5,50,75,50,45,360,9,5.25,0,75000);
insert into capacidad values (9,2,6,35,35,100,100,180,11,6.25,3000,35000);

insert into capacidad values (1,3,7,35,35,100,100,180,11,6.25,3000,35000);



select b.name,c.name,a.* from capacidad a
inner join sectors b on b.id=a.id_sector
inner join profesions c on c.id=a.id_profesion;


select a.id as id, short_name as sector, c.name as name,
  '' as professions,
  0 as discount_capacity,
  0 as debt_capacity,
  0 as debt_capacity_mortgage,
  true as is_active
  from capacidad a
inner join sectors b on b.id=a.id_sector
inner join profesions c on c.id=a.id_profesion;
  


-- // With root
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourRootPassword';
-- -- or
-- CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY 'bar';
-- -- then
-- FLUSH PRIVILEGES;



DROP TABLE `prospects`;
CREATE TABLE `prospects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_personal` varchar(20) NOT NULL,
  `idUser` varchar(20) NOT NULL,
  `name` varchar(60) NOT NULL,
  `fname` varchar(60) NOT NULL,
  `fname_2` varchar(60) DEFAULT NULL,
  `lname` varchar(60) NOT NULL,
  `lname_2` varchar(60) DEFAULT NULL,
  `entity_f` varchar(15) NOT NULL,
  `estado` int NOT NULL,
  `email` varchar(30) NOT NULL,
  `cellphone` varchar(15) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `idUrl` varchar(60) DEFAULT NULL,
  `socialSecurityProofUrl` varchar(60) DEFAULT NULL,
  `publicGoodProofUrl` varchar(60) DEFAULT NULL,
  `workLetterUrl` varchar(60) DEFAULT NULL,
  `payStubUrl` varchar(60) DEFAULT NULL,
  `origin_idUser` varchar(10) NOT NULL,
  `gender` varchar(10) NULL,
  `birthDate` date NULL,
  `contractType` int NULL,
  `jobSector` int NULL,
  `occupation` int NULL,
  `paymentFrecuency` int NULL,
  `profession` int NULL,
  `residenceType` int NULL,
  `civil_status` int NULL,
  `province` int NULL,
  `district` int NULL,
  `salary` decimal(10,2) NULL,
  `fcreate` timestamp NOT NULL,
  `fupdate` timestamp NOT NULL,
  `quotation` text NOT NULL,
  `application` text NOT NULL,
  `sign` blob NULL,
  PRIMARY KEY (`id`)
) ;
  -- UNIQUE KEY `id_personal_UNIQUE` (`id_personal`),
  -- UNIQUE KEY `idUser_UNIQUE` (`idUser`)
ALTER TABLE `finanservs`.`prospects` ADD INDEX `id_personal` (`id_personal` ASC);
ALTER TABLE `finanservs`.`prospects` ADD INDEX `entity_f` (`entity_f` ASC);



DROP TABLE `estados_tramite`;
CREATE TABLE `estados_tramite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
	`is_active` boolean,
  PRIMARY KEY (`id`)
) ;

insert into estados_tramite (name) value ('Nuevo');
insert into estados_tramite (name) value ('Proceso');
insert into estados_tramite (name) value ('Aprobado');
insert into estados_tramite (name) value ('Rechazado');
    

DROP TABLE `entities_f`;
CREATE TABLE `entities_f` (
`id` int NOT NULL AUTO_INCREMENT,
`id_ruta` varchar(10) NOT NULL,
`name` varchar(60) NOT NULL,
`contact` varchar(60) NOT NULL,
`phone_number` varchar(10) NOT NULL,
`cellphone` varchar(10) NOT NULL,
`is_active` tinyint(1) DEFAULT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `id_ruta_UNIQUE` (`id_ruta`)
) ;


insert into entities_f (id_ruta, name, contact, phone_number, cellphone, is_active) value ('100', 'Global Bank', 'Pedro de la Toña', '527898989', '6689-8989', true);
insert into entities_f (id_ruta, name, contact, phone_number, cellphone, is_active) value ('200', 'BAC', 'Pedro de la Toña', '527898989', '6689-8989', true);
insert into entities_f (id_ruta, name, contact, phone_number, cellphone, is_active) value ('300', 'Multibank', 'Pedro de la Toña', '527898989', '6689-8989', true);
insert into entities_f (id_ruta, name, contact, phone_number, cellphone, is_active) value ('400', 'St. George', 'Pedro de la Toña', '527898989', '6689-8989', true);



DROP TABLE `type_dcuments`;
CREATE TABLE `type_dcuments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
	`is_active` boolean,
  PRIMARY KEY (`id`)
) ;

insert into type_dcuments (name, is_active) value ('Cédula', true);
insert into type_dcuments (name, is_active) value ('Comprobante de pago', true);
insert into type_dcuments (name, is_active) value ('Ficha del seguro social', true);
insert into type_dcuments (name, is_active) value ('Recibo de servicio', true);
insert into type_dcuments (name, is_active) value ('Carta de Trabajo', true);


DROP TABLE `terms_loan`;
CREATE TABLE `terms_loan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
	`is_active` boolean,
  PRIMARY KEY (`id`)
) ;


insert into terms_loan (name, is_active) value ('60', true);
insert into terms_loan (name, is_active) value ('120', true);
insert into terms_loan (name, is_active) value ('180', true);
insert into terms_loan (name, is_active) value ('240', true);
insert into terms_loan (name, is_active) value ('360', true);
