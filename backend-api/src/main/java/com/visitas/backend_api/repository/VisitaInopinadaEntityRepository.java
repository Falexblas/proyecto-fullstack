package com.visitas.backend_api.repository;

import com.visitas.backend_api.entity.VisitaInopinadaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitaInopinadaEntityRepository extends JpaRepository<VisitaInopinadaEntity, Integer> {
    List<VisitaInopinadaEntity> findByEstadoVisita(String estadoVisita);
    List<VisitaInopinadaEntity> findByDocenteId(Integer idDocente);
    List<VisitaInopinadaEntity> findByUsuarioAuditorId(Integer idAuditor);
}
