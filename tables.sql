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

CREATE TABLE `profesions_lw` (
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


insert into capacidad values (1,1,1,20,20,50,45,120,11,7,3000,25000);
insert into capacidad values (2,1,2,20,20,50,45,144,10,6,3000,30000);
insert into capacidad values (3,1,3,20,20,50,45,144,10,6,3000,30000);
insert into capacidad values (4,2,2,35,35,55,55,360,7.25,9.8,3000,50000);
insert into capacidad values (5,2,3,35,35,55,55,360,7.25,9.8,3000,50000);
insert into capacidad values (6,2,4,35,35,55,45,180,11,6.25,3000,35000);
insert into capacidad values (7,2,5,50,75,50,45,360,9,5.25,0,75000);
insert into capacidad values (8,2,6,35,35,100,100,180,11,6.25,3000,35000);
insert into capacidad values (9,3,7,35,35,100,100,180,11,6.25,3000,35000);



