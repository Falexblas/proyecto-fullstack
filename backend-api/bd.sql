-- TABLAS MAESTRAS
CREATE TABLE Rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol ENUM('ADMIN', 'AUDITOR', 'DOCENTE') NOT NULL UNIQUE
);

CREATE TABLE Universidad (
    id_universidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    vicerrectorado VARCHAR(255),
    facultad VARCHAR(255),
    escuela_profesional VARCHAR(255),
    codigo_formulario VARCHAR(100),
    version VARCHAR(50),
    fecha_version DATE
);

CREATE TABLE Sede (
    id_sede INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    id_universidad INT,
    FOREIGN KEY (id_universidad) REFERENCES Universidad(id_universidad)
);

CREATE TABLE Docente (
    id_docente INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    estado_activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Asignatura (
    id_asignatura INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    campo_formativo VARCHAR(255),
    ciclo_academico VARCHAR(50),
    turno VARCHAR(50),
    tipo_horario VARCHAR(50)
);

CREATE TABLE ResponsableVisita (
    id_responsable INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    email VARCHAR(255) UNIQUE
);

-- USUARIOS DEL SISTEMA (ROLES EXCLUSIVOS)
CREATE TABLE UsuarioSistema (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL, -- FK a Rol
    id_docente INT NULL, -- Solo si es DOCENTE
    id_responsable INT NULL, -- Solo si es AUDITOR
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (id_docente) REFERENCES Docente(id_docente),
    FOREIGN KEY (id_responsable) REFERENCES ResponsableVisita(id_responsable)
);

-- VISITA INOPINADA (TABLA PRINCIPAL)
CREATE TABLE VisitaInopinada (
    id_visita INT AUTO_INCREMENT PRIMARY KEY,
    fecha_visita DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
    semana_numero INT,
    lugar_visita VARCHAR(255),
    tipo_clase ENUM('teorica', 'practica', 'mixta') DEFAULT 'teorica',
    
    id_sede INT,
    id_docente INT,
    id_asignatura INT,
    id_responsable INT, -- Perfil físico del auditor
    id_usuario_auditor INT, -- Usuario login que creó la visita
    
    estado_visita ENUM('borrador', 'firmada_docente', 'completada', 'auditada') DEFAULT 'borrador',
    
    firma_docente_hash VARCHAR(64) NULL,
    firma_responsable_hash VARCHAR(64) NULL,
    fecha_firma_docente DATETIME NULL,
    fecha_firma_responsable DATETIME NULL,
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_sede) REFERENCES Sede(id_sede),
    FOREIGN KEY (id_docente) REFERENCES Docente(id_docente),
    FOREIGN KEY (id_asignatura) REFERENCES Asignatura(id_asignatura),
    FOREIGN KEY (id_responsable) REFERENCES ResponsableVisita(id_responsable),
    FOREIGN KEY (id_usuario_auditor) REFERENCES UsuarioSistema(id_usuario)
);

-- EVALUACIONES (HIJAS 1:1)
CREATE TABLE EvaluacionControlDocente (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_visita INT UNIQUE NOT NULL,
    docente_presente BOOLEAN DEFAULT FALSE,
    horario_cumplido BOOLEAN DEFAULT FALSE,
    interaccion_adecuada BOOLEAN DEFAULT FALSE,
    actividad_desarrollada TEXT,
    observaciones TEXT,
    FOREIGN KEY (id_visita) REFERENCES VisitaInopinada(id_visita) ON DELETE CASCADE
);

CREATE TABLE EvaluacionMaterialVirtual (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_visita INT UNIQUE NOT NULL,
    cumple BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    FOREIGN KEY (id_visita) REFERENCES VisitaInopinada(id_visita) ON DELETE CASCADE
);

CREATE TABLE EvaluacionAsistenciaEstudiantes (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_visita INT UNIQUE NOT NULL,
    tipo_control ENUM('ambiente', 'intranet', 'mixto') DEFAULT 'ambiente',
    resultado_control ENUM('cumple', 'no_cumple', 'no_aplica') DEFAULT 'no_aplica',
    observaciones TEXT,
    FOREIGN KEY (id_visita) REFERENCES VisitaInopinada(id_visita) ON DELETE CASCADE
);

CREATE TABLE EvaluacionAvanceSilabico (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_visita INT UNIQUE NOT NULL,
    tema_coincide_visita BOOLEAN DEFAULT FALSE,
    tema_coincide_anterior BOOLEAN DEFAULT FALSE,
    ingreso_aula_virtual BOOLEAN DEFAULT FALSE,
    -- Campo calculado en BD, pero manejado como lectura en Java
    cumple BOOLEAN GENERATED ALWAYS AS (tema_coincide_visita AND tema_coincide_anterior AND ingreso_aula_virtual) STORED,
    observaciones TEXT,
    FOREIGN KEY (id_visita) REFERENCES VisitaInopinada(id_visita) ON DELETE CASCADE
);

CREATE TABLE EvaluacionGuiaPractica (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_visita INT UNIQUE NOT NULL,
    tema_programado_cumple ENUM('cumple', 'no_cumple', 'no_aplica') DEFAULT 'no_aplica',
    logro_evidenciado ENUM('cumple', 'no_cumple', 'no_aplica') DEFAULT 'no_aplica',
    rubrica_evaluacion ENUM('cumple', 'no_cumple', 'no_aplica') DEFAULT 'no_aplica',
    observaciones TEXT,
    FOREIGN KEY (id_visita) REFERENCES VisitaInopinada(id_visita) ON DELETE CASCADE
);

-- REQUERIMIENTOS (HIJA 1:N)
CREATE TABLE RequerimientoVisita (
    id_requerimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_visita INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_solicitud DATE DEFAULT (CURDATE()),
    estado ENUM('pendiente', 'en_proceso', 'atendido', 'rechazado') DEFAULT 'pendiente',
    respuesta TEXT,
    fecha_respuesta DATE NULL,
    FOREIGN KEY (id_visita) REFERENCES VisitaInopinada(id_visita) ON DELETE CASCADE
);