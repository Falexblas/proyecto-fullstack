# Test de Login - Instrucciones

## Paso 1: Verificar datos maestros
En MySQL Workbench, ejecuta:
```sql
USE db_visitas_inopinadas;
SELECT * FROM Rol;
SELECT * FROM Docente;
SELECT * FROM ResponsableVisita;
```

## Paso 2: Si faltan datos maestros, inserta estos:
```sql
-- Roles
INSERT INTO Rol (nombre_rol) VALUES ('ADMIN'), ('AUDITOR'), ('DOCENTE');

-- Docente de prueba
INSERT INTO Docente (nombres, apellidos, email, estado_activo) 
VALUES ('MIGUEL ANGEL', 'HUERTA ROJAS', 'm.huerta@universidad.edu.pe', TRUE);

-- Responsable de prueba  
INSERT INTO ResponsableVisita (nombres, apellidos, cargo, email)
VALUES ('VICTOR', 'GUADALUPE MORI', 'Auditor', 'v.guadalupe@universidad.edu.pe');
```

-- admin de prueba
INSERT INTO UsuarioSistema (email, password_hash, nombres, apellidos, id_rol, id_docente, id_responsable, estado, firma_hash) 
VALUES ('admin@universidad.edu.pe','$2a$10$JnWtYwpitWzonOVCuqGWvuzTGCJVJFHyNXks5dBkQTaJxmBU5cMS', 'ADMINISTRADOR', 'SISTEMAS', 1, NULL, NULL, TRUE, NULL),

## Paso 3: Crear usuario con hash correcto via backend
Ejecuta en terminal (PowerShell):
```powershell
cd C:\Users\alex1\Desktop\ProyectoFullStack\backend-api

# Crear usuario Admin
mvn spring-boot:run
```

Luego en otra terminal, ejecuta:
```powershell
curl -X POST http://localhost:8080/api/usuarios `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@test.com","nombres":"Admin","apellidos":"Test","idRol":1,"estado":true}'
```

Esto creará un usuario con contraseña: **password123**

## Paso 4: Probar login
En el frontend, usa:
- Email: `admin@universidad.edu.pe`
- Password: `123456`

Si funciona, el problema era solo el hash. 

-- Nota final, el admin ya a sido creado solo inicie sesión con las crendenciales escritas en el paso 4
