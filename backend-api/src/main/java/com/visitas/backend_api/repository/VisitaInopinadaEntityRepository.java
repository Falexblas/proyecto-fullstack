package com.visitas.backend_api.repository;

import com.visitas.backend_api.entity.VisitaInopinadaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VisitaInopinadaEntityRepository extends JpaRepository<VisitaInopinadaEntity, Integer> {
    List<VisitaInopinadaEntity> findByEstadoVisita(String estadoVisita);
    List<VisitaInopinadaEntity> findByDocenteId(Integer idDocente);
    List<VisitaInopinadaEntity> findByUsuarioAuditorId(Integer idAuditor);
    
    // Estadísticas para dashboard
    @Query("SELECT COUNT(v) FROM VisitaInopinadaEntity v WHERE v.usuarioAuditor.id = :auditorId AND MONTH(v.fechaVisita) = MONTH(CURRENT_DATE) AND YEAR(v.fechaVisita) = YEAR(CURRENT_DATE)")
    long countVisitasEsteMesByAuditor(@Param("auditorId") Integer auditorId);
    
    @Query("SELECT COUNT(DISTINCT v.docente.id) FROM VisitaInopinadaEntity v WHERE v.usuarioAuditor.id = :auditorId")
    long countDocentesEvaluadosByAuditor(@Param("auditorId") Integer auditorId);
    
    @Query("SELECT v FROM VisitaInopinadaEntity v WHERE v.usuarioAuditor.id = :auditorId ORDER BY v.fechaVisita DESC")
    List<VisitaInopinadaEntity> findRecentVisitasByAuditor(@Param("auditorId") Integer auditorId);
    
    @Query("SELECT v FROM VisitaInopinadaEntity v WHERE v.usuarioAuditor.id = :auditorId AND v.fechaVisita >= :fecha ORDER BY v.fechaVisita ASC")
    List<VisitaInopinadaEntity> findProximasVisitasByAuditor(@Param("auditorId") Integer auditorId, @Param("fecha") LocalDate fecha);
}
