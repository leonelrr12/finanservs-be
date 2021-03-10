use finanservs;

CREATE TABLE `institutions` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `planillas_j` (
  `id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `profesions_acp` (
  `id` int NOT NULL,
  `titulo` varchar(60) NOT NULL,
  `grupo` varchar(45) DEFAULT NULL,
  `segmento` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `professions_lw` (
  `id` int NOT NULL,
  `titulo` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `sectors` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `profesions` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `civil_status` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

insert into civil_status values (1, 'Casado');
insert into civil_status values (2, 'Soltero');
insert into civil_status values (3, 'Unido');
insert into civil_status values (4, 'Divorciado');
insert into civil_status values (5, 'Viudo');

CREATE TABLE `purposes` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  `is_active` boolean,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

insert into purposes value (0, 'Compra de Auto', true);
insert into purposes value (1, 'Boda', true);
insert into purposes value (2, 'Remodelación', true);
insert into purposes value (3, 'Colegio', true);
insert into purposes value (4, 'Viaje', true);
insert into purposes value (5, 'Quince años', true);


CREATE TABLE `housings` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  `is_active` boolean,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

insert into purposes value (1, 'Casa Propia', true);
insert into purposes value (2, 'Padres o Familiares', true);
insert into purposes value (3, 'Casa Hipotecada', true);
insert into purposes value (4, 'Casa Alquilada', true);






insert into sectors values (1, 'Privado', 'P');
insert into sectors values (2, 'Publico', 'Pb');
insert into sectors values (3, 'Jubilado', 'J');

insert into profesions values (1, 'Empresa Privada');
insert into profesions values (2, 'Medicos/Enfermeras');
insert into profesions values (3, 'Educador');
insert into profesions values (4, 'Administrativo');
insert into profesions values (5, 'ACP');
insert into profesions values (6, 'Seguridad Publica');
insert into profesions values (7, 'Jubilado');



select b.name,c.name,a.* from capacidad a
inner join sectors b on b.id=a.id_sector
inner join profesions c on c.id=a.id_profesion;


insert into capacidad values (4,1,1,20,20,50,45,120,11,7,3000,25000);
insert into capacidad values (2,1,2,20,20,50,45,144,10,6,3000,30000);
insert into capacidad values (3,1,3,20,20,50,45,144,10,6,3000,30000);

insert into capacidad values (5,2,2,35,35,55,55,360,7.25,9.8,3000,50000);
insert into capacidad values (6,2,3,35,35,55,55,360,7.25,9.8,3000,50000);
insert into capacidad values (7,2,4,35,35,55,45,180,11,6.25,3000,35000);
insert into capacidad values (8,2,5,50,75,50,45,360,9,5.25,0,75000);
insert into capacidad values (9,2,6,35,35,100,100,180,11,6.25,3000,35000);

insert into capacidad values (1,3,7,35,35,100,100,180,11,6.25,3000,35000);








// With root
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourRootPassword';
-- or
CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY 'bar';
-- then
FLUSH PRIVILEGES;
