# 🔍 VALIDACIÓN DE REQUERIMIENTOS - GUÍA PASO A PASO

## Problema Encontrado
Los requerimientos NO se cargaban en el PDF porque:
1. Estaban con **lazy loading** en la relación `@OneToMany` de `VisitaInopinadaEntity`
2. Después de guardar los requerimientos, la entidad visita en memoria no tenía la lista actualizada
3. El mapper no tenía configuración explícita para los requerimientos

## Soluciones Aplicadas ✅

### 1. Backend - VisitaInopinadaEntity
- ✅ Cambié `fetch = FetchType.LAZY` a `fetch = FetchType.EAGER`
- Ahora Hibernate carga automáticamente los requerimientos

### 2. Backend - VisitaMapper
- ✅ Agregué `@Mapping` explícito para requerimientos en `toResponseDTO()`
- ✅ Agregué método `toRequerimientoListDTO()` para convertir la lista
- ✅ Agregué método `toRequerimientoDTO()` para mapear cada requerimiento

### 3. Backend - VisitaService
- ✅ Agregué logging con `@Slf4j` para seguimiento
- ✅ Agrego logs en cada paso: recepción del DTO, creación de visita, guardado de requerimientos
- ✅ **IMPORTANTE**: Después de guardar los requerimientos, recargo la visita desde la BD con `findById()`
- Esto asegura que la entidad tenga todos los requerimientos cargados

## Cómo Validar 🔧

### Opción 1: Ver los logs en tiempo real
```
1. Inicia el backend (Run: BackendApiApplication)
2. Crea una visita con requerimientos
3. En la consola verás:
   - "=== INICIANDO CREACION DE VISITA ==="
   - "DTO recibido con X requerimientos"
   - "Visita guardada con ID: X"
   - "Guardando X requerimientos para la visita ID: X"
   - "Requerimiento guardado: ID -> descripción"
   - "Visita recargada con X requerimientos"
```

### Opción 2: Consultar directamente la BD
Usa el archivo: `VALIDAR_REQUERIMIENTOS.sql`

**Pasos:**
1. Abre tu herramienta MySQL (MySQLWorkbench, DBeaver, etc.)
2. Conecta a tu BD
3. Copia los queries del archivo SQL
4. Ejecuta el query #3 para ver TODAS las visitas con sus requerimientos

**Ejemplo esperado:**
```
id_visita | fecha_visita | cantidad_requerimientos | requerimientos
1         | 2026-06-22   | 3                       | Req1 | Req2 | Req3
2         | 2026-06-23   | 2                       | ReqA | ReqB
3         | 2026-06-24   | 0                       | NULL
```

### Opción 3: Verificar en el PDF
Después de compilar y crear una visita con requerimientos:
1. Ve a la visita en la app
2. Descargar PDF
3. Busca la sección "REQUERIMIENTOS SOLICITADOS EN LA VISITA INOPINADA:"
4. Deberías ver tus requerimientos listados

## Pasos para Verificar Ahora 🚀

1. **Compila el backend** (usa Maven):
   ```bash
   cd backend-api
   mvn clean install
   ```

2. **Inicia la aplicación** en VS Code (Terminal: Run: BackendApiApplication)

3. **Crea una visita** con requerimientos:
   - Ve a la app
   - Llena el formulario paso a paso
   - En Paso 3 (Observaciones) agrega algunos requerimientos
   - Completa la visita

4. **Revisa los logs** - Deberías ver algo como:
   ```
   === INICIANDO CREACION DE VISITA ===
   DTO recibido con 3 requerimientos
   Visita guardada con ID: 25
   Guardando 3 requerimientos para la visita ID: 25
   Requerimiento guardado: 1234 -> Mejorar la interacción docente-estudiante
   Requerimiento guardado: 1235 -> Aumentar material virtual
   Requerimiento guardado: 1236 -> Revisar syllabus
   Visita recargada con 3 requerimientos
   ```

5. **Consulta la BD** (si quieres confirmación extra):
   ```sql
   SELECT v.id_visita, COUNT(r.id_requerimiento) as cantidad
   FROM visitainopinada v
   LEFT JOIN requerimientovisita r ON v.id_visita = r.id_visita
   WHERE v.id_visita = 25  -- o el ID de tu visita reciente
   GROUP BY v.id_visita;
   ```

6. **Descarga el PDF** y verifica que aparezcan los requerimientos

## Si SIGUE sin funcionar... 🔴

**Probables causas:**
1. No compilaste el backend después de los cambios
2. El endpoint POST recibe `null` para requerimientos
3. Hay error en la relación `@OneToMany`

**Debug adicional:**
- Revisa en el frontend que `formData.requerimientos` tenga datos antes de enviar
- Verifica que la respuesta del POST tenga los requerimientos en el JSON
- Revisa que no haya error en los logs del backend

## Cambios Realizados - Resumen 📝

### Archivo: `VisitaInopinadaEntity.java`
```diff
- @OneToMany(mappedBy = "visita", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
+ @OneToMany(mappedBy = "visita", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
```

### Archivo: `VisitaMapper.java`
```diff
  @Mapping(target = "evaluacionGuiaPractica", source = "evaluacionGuiaPractica", qualifiedByName = "toDTO")
+ @Mapping(target = "requerimientos", source = "requerimientos", qualifiedByName = "toRequerimientoListDTO")
  VisitaResponseDTO toResponseDTO(VisitaInopinadaEntity entity);

+ @Named("toRequerimientoListDTO")
+ default List<RequerimientoVisitaDTO> toRequerimientoListDTO(List<RequerimientoVisitaEntity> entities) {...}
+ RequerimientoVisitaDTO toRequerimientoDTO(RequerimientoVisitaEntity entity);
```

### Archivo: `VisitaService.java`
```diff
+ import lombok.extern.slf4j.Slf4j;
+ @Slf4j
  public class VisitaService {
    public VisitaResponseDTO crearVisita(VisitaCreateDTO dto) {
+       log.info("=== INICIANDO CREACION DE VISITA ===");
+       // ... más logs ...
        
        // Después de guardar requerimientos:
+       // Recargar la visita desde la BD para que traiga los requerimientos
+       visita = visitaRepository.findById(visita.getId()).orElseThrow(...);
+       log.info("Visita recargada con {} requerimientos", ...);
    }
  }
```

---

**Próximo paso:** Compila y prueba, luego reporta si ves los requerimientos en los logs y/o en la BD.
