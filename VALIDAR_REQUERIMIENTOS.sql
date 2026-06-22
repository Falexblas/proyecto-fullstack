-- ============================================================================
-- SCRIPT PARA VALIDAR SI LOS REQUERIMIENTOS SE ESTÁN GUARDANDO EN LA BD
-- ============================================================================

-- 1. Ver todas las visitas registradas (últimas 5)
SELECT 
    id_visita,
    fecha_visita,
    hora_inicio,
    estado_visita,
    fecha_registro
FROM visitainopinada
ORDER BY fecha_registro DESC
LIMIT 5;

-- 2. Ver los requerimientos de una visita específica
-- Reemplaza X con el ID de la visita que quieres verificar
SELECT 
    r.id_requerimiento,
    r.id_visita,
    r.descripcion,
    r.estado,
    r.fecha_solicitud
FROM requerimientovisita r
WHERE r.id_visita = X;  -- CAMBIA X POR EL ID DE LA VISITA

-- 3. Ver TODAS las visitas con su cantidad de requerimientos
SELECT 
    v.id_visita,
    v.fecha_visita,
    COUNT(r.id_requerimiento) AS cantidad_requerimientos,
    GROUP_CONCAT(r.descripcion SEPARATOR ' | ') AS requerimientos
FROM visitainopinada v
LEFT JOIN requerimientovisita r ON v.id_visita = r.id_visita
GROUP BY v.id_visita, v.fecha_visita
ORDER BY v.fecha_registro DESC;

-- 4. Ver el total de requerimientos registrados
SELECT COUNT(*) AS total_requerimientos FROM requerimientovisita;

-- 5. Ver estructura de la tabla requerimientos
DESCRIBE requerimientovisita;

-- 6. Ver visitas SIN requerimientos (esto puede ser normal)
SELECT 
    v.id_visita,
    v.fecha_visita,
    'SIN REQUERIMIENTOS' AS estado
FROM visitainopinada v
WHERE v.id_visita NOT IN (SELECT DISTINCT id_visita FROM requerimientovisita)
ORDER BY v.fecha_registro DESC;
