CREATE TABLE "users" IF NOT EXISTS (
    "id" SERIAL PRIMARY KEY NOT NULL ,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type_user" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id")
);


INSERT INTO "users" ("username", "email", "password", "created_at", "type_user") VALUES ('admin1', 'admin1@diabetes.com', '123456', '2022-01-01 00:00:00', 'admin');
INSERT INTO "users" ("username", "email", "password", "created_at", "type_user") VALUES ('usurio1', 'usurio1@diabetes.com', '123456', '2022-01-01 00:00:00', 'user');

CREATE TABLE "Pacientes" IF NOT EXISTS(
    "id" PRIMARY KEY NOT NULL,
    "primer_nombre" VARCHAR (255) NOT NULL,
    "segundo_nombre" VARCHAR(255) NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "genero" ENUM("M","F") NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT ,
)

CREATE TABLE "Predicciones" IF NOT EXISTS(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "id_paciente" SERIAL NOT NULL,
    "fecha_prediccion" TIMESTAMP NOT NULL,
    "IMC" DECIMAL NOT NULL,
    "glucosa" INTEGER NOT NULL,
    "insulina" INTEGER NOT NULL,
    "edad" INTEGER NOT NULL,
    "puntaje_riesgo" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
)


CREATE TABLE "Historia_Clinica_Paciente" IF NOT EXISTS (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "id_paciente" SERIAL NOT NULL,
    "evaluacion_fecha" TIMESTAMP NOT NULL,
    "antecedente_familiar" VARCHAR(255) NOT NULL,
    "nivel_actividad_fisica" INTEGER NOT NULL,
    "habitos_alimenticios" INTEGER NOT NULL,
)


--version 2.0

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    rol VARCHAR(50) NOT NULL
);

CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    id_rol INTEGER NOT NULL DEFAULT 2,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE TABLE Pacientes (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255),
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(10) NOT NULL,
    telefono VARCHAR(9),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (id) ON DELETE CASCADE
);

CREATE TABLE Historia_Clinica_Paciente (
    id SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    nivel_de_actividad_fisica VARCHAR(50),
    habitos_alimenticios TEXT,
    antecedente_familiar BOOLEAN,
    alergias TEXT,
    consumo_tabaco INTEGER,
    frecuencia_tabaco VARCHAR(50),
    consumo_alcohol INTEGER,
    frecuencia_alcohol VARCHAR(50),
    creado_por INTEGER,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES Pacientes (id) ON DELETE CASCADE,
    FOREIGN KEY (creado_por) REFERENCES Usuarios (id) ON DELETE CASCADE
);

CREATE TABLE Predicciones (
    id SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    fecha_prediccion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IMC DECIMAL(5, 2),
    glucosa INTEGER,
    insulina INTEGER,
    fuma BOOLEAN,
    frecuencia_fumar VARCHAR(50),
    duracion_fumar INTEGER,
    nivel_actividad_fisica VARCHAR(50),
    frecuencia_actividad_fisica VARCHAR(50),
    consumo_alcohol BOOLEAN,
    frecuencia_alcohol VARCHAR(50),
    puntaje_riesgo DECIMAL(5, 2),
    nivel_riesgo VARCHAR(50),
    creado_por INTEGER,
    FOREIGN KEY (id_paciente) REFERENCES Pacientes (id) ON DELETE CASCADE,
    FOREIGN KEY (creado_por) REFERENCES Usuarios (id) ON DELETE CASCADE
);