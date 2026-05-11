DROP DATABASE IF EXISTS db_visitas_inopinadas;
CREATE DATABASE db_visitas_inopinadas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_visitas_inopinadas;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- 2.1 TABLAS MAESTRAS Y CATÁLOGOS
-- ============================================================================

CREATE TABLE Rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol ENUM('ADMIN', 'AUDITOR', 'DOCENTE') NOT NULL UNIQUE
);

CREATE TABLE Universidad (
    id_universidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL DEFAULT 'UNIVERSIDAD PRIVADA...',
    vicerrectorado VARCHAR(255) DEFAULT 'VICERRECTORADO ACADÉMICO',
    facultad VARCHAR(255) DEFAULT 'FACULTAD DE INGENIERÍAS',
    escuela_profesional VARCHAR(255) DEFAULT 'ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS',
    codigo_formulario VARCHAR(100) DEFAULT 'VRA-FR-040',
    version VARCHAR(50) DEFAULT 'V.2.0',
    fecha_version DATE DEFAULT '2025-09-26'
);

CREATE TABLE Sede (
    id_sede INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    id_universidad INT DEFAULT 1,
    FOREIGN KEY (id_universidad) REFERENCES Universidad(id_universidad) ON DELETE SET NULL
);

CREATE TABLE Docente (
    id_docente INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    estado_activo BOOLEAN DEFAULT TRUE,
    INDEX idx_docente_nombre (apellidos, nombres)
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

-- ============================================================================
-- 2.2 GESTIÓN DE USUARIOS (con columna firma_hash integrada)
-- ============================================================================

CREATE TABLE UsuarioSistema (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    id_docente INT NULL,
    id_responsable INT NULL,
    estado BOOLEAN DEFAULT TRUE,
    firma_hash TEXT NULL,  -- ✅ Columna agregada directamente
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol) ON DELETE RESTRICT,
    FOREIGN KEY (id_docente) REFERENCES Docente(id_docente) ON DELETE SET NULL,
    FOREIGN KEY (id_responsable) REFERENCES ResponsableVisita(id_responsable) ON DELETE SET NULL
);

-- ============================================================================
-- 2.3 TABLA PRINCIPAL: VISITA INOPINADA (con hashes en TEXT)
-- ============================================================================

CREATE TABLE VisitaInopinada (
    id_visita INT AUTO_INCREMENT PRIMARY KEY,
    fecha_visita DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
    semana_numero INT,
    lugar_visita VARCHAR(255),
    tipo_clase ENUM('TEORICA', 'PRACTICA', 'MIXTA') DEFAULT 'TEORICA',
    
    id_sede INT,
    id_docente INT,
    id_asignatura INT,
    id_responsable INT,
    id_usuario_auditor INT,
    
    estado_visita ENUM('BORRADOR', 'FIRMADA_DOCENTE', 'COMPLETADA', 'AUDITADA') DEFAULT 'BORRADOR',
    
    firma_docente_hash TEXT NULL,        -- ✅ Modificado de VARCHAR(64) a TEXT
    firma_responsable_hash TEXT NULL,    -- ✅ Modificado de VARCHAR(64) a TEXT
    fecha_firma_docente DATETIME NULL,
    fecha_firma_responsable DATETIME NULL,
    
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_sede) REFERENCES Sede(id_sede) ON DELETE SET NULL,
    FOREIGN KEY (id_docente) REFERENCES Docente(id_docente) ON DELETE RESTRICT,
    FOREIGN KEY (id_asignatura) REFERENCES Asignatura(id_asignatura) ON DELETE RESTRICT,
    FOREIGN KEY (id_responsable) REFERENCES ResponsableVisita(id_responsable) ON DELETE SET NULL,
    FOREIGN KEY (id_usuario_auditor) REFERENCES UsuarioSistema(id_usuario) ON DELETE SET NULL
);

-- ============================================================================
-- 2.4 TABLAS DE EVALUACIÓN (Hijas 1:1)
-- ============================================================================

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
    ambiente_cumple ENUM('CUMPLE', 'NO_CUMPLE') DEFAULT NULL,
    ambiente_observaciones TEXT,
    intranet_cumple ENUM('CUMPLE', 'NO_CUMPLE') DEFAULT NULL,
    intranet_observaciones TEXT,
    observaciones_generales TEXT,
    FOREIGN KEY (id_visita) REFERENCES VisitaInopinada(id_visita) ON DELETE CASCADE
);

CREATE TABLE EvaluacionAvanceSilabico (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_visita INT UNIQUE NOT NULL,
    tema_coincide_visita BOOLEAN DEFAULT FALSE,
    tema_coincide_anterior BOOLEAN DEFAULT FALSE,
    ingreso_aula_virtual BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    FOREIGN KEY (id_visita) REFERENCES VisitaInopinada(id_visita) ON DELETE CASCADE
);

CREATE TABLE EvaluacionGuiaPractica (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_visita INT UNIQUE NOT NULL,
    tema_programado_cumple ENUM('CUMPLE', 'NO_CUMPLE', 'NO_APLICA') DEFAULT 'NO_APLICA',
    logro_evidenciado ENUM('CUMPLE', 'NO_CUMPLE', 'NO_APLICA') DEFAULT 'NO_APLICA',
    rubrica_evaluacion ENUM('CUMPLE', 'NO_CUMPLE', 'NO_APLICA') DEFAULT 'NO_APLICA',
    observaciones TEXT,
    FOREIGN KEY (id_visita) REFERENCES VisitaInopinada(id_visita) ON DELETE CASCADE
);

-- ============================================================================
-- 2.5 REQUERIMIENTOS (Hija 1:N)
-- ============================================================================

CREATE TABLE RequerimientoVisita (
    id_requerimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_visita INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_solicitud DATE DEFAULT (CURDATE()),
    estado ENUM('PENDIENTE', 'EN_PROCESO', 'ATENDIDO', 'RECHAZADO') DEFAULT 'PENDIENTE',
    respuesta TEXT,
    fecha_respuesta DATE NULL,
    FOREIGN KEY (id_visita) REFERENCES VisitaInopinada(id_visita) ON DELETE CASCADE
);

-- ============================================================================
-- 2.6 EVIDENCIAS DE REQUERIMIENTOS (Hija 1:N)
-- ============================================================================

CREATE TABLE EvidenciaRequerimiento (
    id_evidencia INT AUTO_INCREMENT PRIMARY KEY,
    id_requerimiento INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    tipo_archivo VARCHAR(50) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamaño_bytes BIGINT DEFAULT 0,
    descripcion TEXT,
    fecha_carga DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_requerimiento) REFERENCES RequerimientoVisita(id_requerimiento) ON DELETE CASCADE
);

-- Reactivar verificación de FK
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 3. INSERCIÓN DE CATÁLOGOS BÁSICOS
-- ============================================================================

-- Roles
INSERT INTO Rol (nombre_rol) VALUES 
('ADMIN'), 
('AUDITOR'), 
('DOCENTE');

-- Universidad
INSERT INTO Universidad (
    nombre, 
    vicerrectorado, 
    facultad, 
    escuela_profesional, 
    codigo_formulario, 
    version, 
    fecha_version
) VALUES (
    'UNIVERSIDAD PRIVADA SAN PEDRO', 
    'VICERRECTORADO ACADÉMICO', 
    'FACULTAD DE INGENIERÍAS', 
    'ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS', 
    'VRA-FR-040', 
    'V.2.0', 
    '2025-09-26'
);

-- Sedes
INSERT INTO Sede (nombre, id_universidad) VALUES 
('LIMA-CHORRILLOS', 1),
('LIMA-CENTRO', 1),
('AREQUIPA', 1);

-- Asignaturas
INSERT INTO Asignatura (
    nombre, 
    campo_formativo, 
    ciclo_academico, 
    turno, 
    tipo_horario
) VALUES
('INGENIERÍA DE SOFTWARE I', 'FORMACIÓN ESPECIALIZADA', 'VI CICLO', 'NOCHE', 'TEORIA'),
('BASE DE DATOS II', 'FORMACIÓN ESPECIALIZADA', 'V CICLO', 'TARDE', 'PRACTICA'),
('GESTIÓN DE PROYECTOS TI', 'FORMACIÓN GENERAL', 'VII CICLO', 'NOCHE', 'TEORIA'),
('DESARROLLO WEB FULLSTACK', 'FORMACIÓN ESPECIALIZADA', 'VIII CICLO', 'SABADO', 'PRACTICA');

-- ============================================================================
-- 4. INSERCIÓN DE ENTIDADES ACADÉMICAS Y USUARIOS
-- ============================================================================

-- Docentes (Entidad Académica)
INSERT INTO Docente (nombres, apellidos, email, estado_activo) VALUES
('MIGUEL ANGEL', 'HUERTA ROJAS', 'm.huerta@universidad.edu.pe', TRUE);

-- Responsables de Visita (Entidad Académica)
INSERT INTO ResponsableVisita (nombres, apellidos, cargo, email) VALUES
('VICTOR', 'GUADALUPE MORI', 'VICERRECTOR ACADÉMICO', 'v.guadalupe@universidad.edu.pe');

-- Usuarios del Sistema (Login)
-- Contraseña para todos: "123456" 
-- Hash BCrypt: $2a$10$JnWtYwpitWzonOVCuqGWvuzTGCJVJFHyNXks5d.BkQTaJxmBU5cMS

-- Admin: id_rol=1, sin vinculación académica
INSERT INTO UsuarioSistema (
    email, 
    password_hash, 
    nombres, 
    apellidos, 
    id_rol, 
    id_docente, 
    id_responsable, 
    estado,
    firma_hash
) VALUES (
    'admin@universidad.edu.pe', 
    '$2a$10$JnWtYwpitWzonOVCuqGWvuzTGCJVJFHyNXks5d.BkQTaJxmBU5cMS', 
    'ADMINISTRADOR', 
    'SISTEMAS', 
    1, 
    NULL, 
    NULL, 
    TRUE,
    NULL
);

-- Auditor: id_rol=2, vinculado a ResponsableVisita id=1
INSERT INTO UsuarioSistema (
    email, 
    password_hash, 
    nombres, 
    apellidos, 
    id_rol, 
    id_docente, 
    id_responsable, 
    estado,
    firma_hash
) VALUES (
    'v.guadalupe@universidad.edu.pe', 
    '$2a$10$JnWtYwpitWzonOVCuqGWvuzTGCJVJFHyNXks5d.BkQTaJxmBU5cMS', 
    'VICTOR', 
    'GUADALUPE MORI', 
    2, 
    NULL, 
    1, 
    TRUE,
    NULL
);

-- Docente: id_rol=3, vinculado a Docente id=1
INSERT INTO UsuarioSistema (
    email, 
    password_hash, 
    nombres, 
    apellidos, 
    id_rol, 
    id_docente, 
    id_responsable, 
    estado,
    firma_hash
) VALUES (
    'm.huerta@universidad.edu.pe', 
    '$2a$10$JnWtYwpitWzonOVCuqGWvuzTGCJVJFHyNXks5d.BkQTaJxmBU5cMS', 
    'MIGUEL ANGEL', 
    'HUERTA ROJAS', 
    3, 
    1, 
    NULL, 
    TRUE,
    NULL
);

-- ============================================================================
-- 5. INSERCIÓN DE VISITAS DE EJEMPLO Y EVALUACIONES
-- ============================================================================

-- 5.1 Visita COMPLETADA (Histórica)
INSERT INTO VisitaInopinada (
    fecha_visita, 
    hora_inicio, 
    hora_termino, 
    semana_numero, 
    lugar_visita, 
    tipo_clase,
    id_sede, 
    id_docente, 
    id_asignatura, 
    id_responsable, 
    id_usuario_auditor,
    estado_visita, 
    firma_docente_hash, 
    firma_responsable_hash, 
    fecha_firma_docente, 
    fecha_firma_responsable
) VALUES (
    '2026-05-05', 
    '19:00:00', 
    '20:30:00', 
    12, 
    'LABORATORIO DE CÓMPUTO 3', 
    'PRACTICA',
    1, 
    1, 
    2, 
    1, 
    2,
    'COMPLETADA', 
    'hash_firma_docente_simulado_12345', 
    'hash_firma_auditor_simulado_67890',
    '2026-05-05 20:35:00',
    '2026-05-05 20:40:00'
);

SET @id_visita_completada = LAST_INSERT_ID();

-- Evaluaciones de la Visita Completada
INSERT INTO EvaluacionControlDocente (
    id_visita, 
    docente_presente, 
    horario_cumplido, 
    interaccion_adecuada, 
    actividad_desarrollada, 
    observaciones
) VALUES (
    @id_visita_completada, 
    TRUE, 
    TRUE, 
    TRUE, 
    'Desarrollo de práctica calificada N°2 sobre Normalización', 
    'El docente mostró puntualidad y dominio del tema.'
);

INSERT INTO EvaluacionMaterialVirtual (
    id_visita, 
    cumple, 
    observaciones
) VALUES (
    @id_visita_completada, 
    TRUE, 
    'La guía de práctica y el dataset estaban cargados en el aula virtual desde el día anterior.'
);

INSERT INTO EvaluacionAsistenciaEstudiantes (
    id_visita, 
    tipo_control, 
    resultado_control, 
    observaciones
) VALUES (
    @id_visita_completada, 
    'MIXTO', 
    'CUMPLE', 
    'Se verificó la asistencia física mediante ficha y se cruzó con la asistencia registrada en la intranet. Coincidencia del 100%.'
);

INSERT INTO EvaluacionAvanceSilabico (
    id_visita, 
    tema_coincide_visita, 
    tema_coincide_anterior, 
    ingreso_aula_virtual, 
    observaciones
) VALUES (
    @id_visita_completada, 
    TRUE, 
    TRUE, 
    TRUE, 
    'El tema "Normalización hasta 3FN" coincide exactamente con lo programado en el sílabo para la semana 12.'
);

INSERT INTO EvaluacionGuiaPractica (
    id_visita, 
    tema_programado_cumple, 
    logro_evidenciado, 
    rubrica_evaluacion, 
    observaciones
) VALUES (
    @id_visita_completada, 
    'CUMPLE', 
    'CUMPLE', 
    'CUMPLE', 
    'Los estudiantes trabajaron en equipos resolviendo los casos planteados. Se evidenció el logro de análisis de dependencias funcionales.'
);

-- ✅ REQUERIMIENTOS DEL EVALUADOR HACIA EL DOCENTE (Observaciones/Acciones Correctivas)
-- Estos son hallazgos que el docente debe subsanar

-- Requerimiento 1: Actualización de material virtual
INSERT INTO RequerimientoVisita (
    id_visita, 
    descripcion, 
    fecha_solicitud, 
    estado,
    respuesta,
    fecha_respuesta
) VALUES (
    @id_visita_completada, 
    'El docente debe actualizar la guía de práctica N°3 en el aula virtual con los ejercicios de normalización BCNF, según lo programado en el sílabo.', 
    '2026-05-05', 
    'PENDIENTE',
    NULL,
    NULL
);

-- Requerimiento 2: Registro de asistencia
INSERT INTO RequerimientoVisita (
    id_visita, 
    descripcion, 
    fecha_solicitud, 
    estado,
    respuesta,
    fecha_respuesta
) VALUES (
    @id_visita_completada, 
    'Se observó que el registro de asistencia en intranet no coincide con la ficha física. El docente debe regularizar el ingreso de los estudiantes ausentes antes de 48 horas.', 
    '2026-05-05', 
    'EN_PROCESO',
    'Docente indica que ya realizó la regularización en intranet. Pendiente de verificación por coordinación.',
    '2026-05-06'
);

-- Requerimiento 3: Evidencia de evaluación
INSERT INTO RequerimientoVisita (
    id_visita, 
    descripcion, 
    fecha_solicitud, 
    estado,
    respuesta,
    fecha_respuesta
) VALUES (
    @id_visita_completada, 
    'Adjuntar en el repositorio institucional las rúbricas de evaluación aplicadas en la práctica calificada N°2, con las observaciones por estudiante.', 
    '2026-05-05', 
    'ATENDIDO',
    'Rúbricas cargadas en el repositorio. Enlace: https://repositorio.universidad.edu.pe/handle/1234/5678',
    '2026-05-07'
);


-- 5.2 Visita en BORRADOR (Para probar flujo de edición)
INSERT INTO VisitaInopinada (
    fecha_visita, 
    hora_inicio, 
    hora_termino, 
    semana_numero, 
    lugar_visita, 
    tipo_clase,
    id_sede, 
    id_docente, 
    id_asignatura, 
    id_responsable, 
    id_usuario_auditor,
    estado_visita
) VALUES (
    '2026-05-06', 
    '18:00:00', 
    '19:30:00', 
    12, 
    'AULA 402', 
    'TEORICA',
    1, 
    1, 
    1, 
    1, 
    2,
    'BORRADOR'
);

SET @id_visita_borrador = LAST_INSERT_ID();

-- Evaluaciones Vacías/Default para la Visita en Borrador
INSERT INTO EvaluacionControlDocente (
    id_visita, 
    docente_presente, 
    horario_cumplido, 
    interaccion_adecuada
) VALUES (
    @id_visita_borrador, 
    FALSE, 
    FALSE, 
    FALSE
);

INSERT INTO EvaluacionMaterialVirtual (
    id_visita, 
    cumple
) VALUES (
    @id_visita_borrador, 
    FALSE
);

INSERT INTO EvaluacionAsistenciaEstudiantes (
    id_visita, 
    tipo_control, 
    resultado_control
) VALUES (
    @id_visita_borrador, 
    'AMBIENTE', 
    'NO_APLICA'
);

INSERT INTO EvaluacionAvanceSilabico (
    id_visita, 
    tema_coincide_visita, 
    tema_coincide_anterior, 
    ingreso_aula_virtual
) VALUES (
    @id_visita_borrador, 
    FALSE, 
    FALSE, 
    FALSE
);

INSERT INTO EvaluacionGuiaPractica (
    id_visita, 
    tema_programado_cumple, 
    logro_evidenciado, 
    rubrica_evaluacion
) VALUES (
    @id_visita_borrador, 
    'NO_APLICA', 
    'NO_APLICA', 
    'NO_APLICA'
);

-- Requerimientos para la visita en borrador (ejemplos de observaciones del evaluador)
INSERT INTO RequerimientoVisita (
    id_visita, 
    descripcion, 
    fecha_solicitud, 
    estado
) VALUES (
    @id_visita_borrador, 
    'El docente debe incluir en la planificación de la sesión los indicadores de logro específicos para la actividad de cierre.', 
    '2026-05-06', 
    'PENDIENTE'
);

INSERT INTO RequerimientoVisita (
    id_visita, 
    descripcion, 
    fecha_solicitud, 
    estado
) VALUES (
    @id_visita_borrador, 
    'Se requiere que el docente evidencie en el aula virtual la retroalimentación brindada a los estudiantes en la actividad anterior.', 
    '2026-05-06', 
    'PENDIENTE'
);

-- ============================================================================
-- 6. VERIFICACIÓN FINAL
-- ============================================================================

SELECT '✅ DATOS INSERTADOS CORRECTAMENTE' AS MENSAJE;

-- Listado de usuarios con sus roles
SELECT 
    u.id_usuario, 
    u.email, 
    u.nombres, 
    u.apellidos, 
    r.nombre_rol AS rol 
FROM UsuarioSistema u 
JOIN Rol r ON u.id_rol = r.id_rol;

-- Listado de visitas
SELECT 
    id_visita, 
    fecha_visita, 
    estado_visita, 
    lugar_visita,
    tipo_clase 
FROM VisitaInopinada;

-- Listado de sedes
SELECT * FROM Sede;

-- Listado de asignaturas
SELECT * FROM Asignatura;

