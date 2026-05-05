package com.visitas.backend_api.repository;

import com.visitas.backend_api.entity.RequerimientoVisitaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequerimientoVisitaEntityRepository extends JpaRepository<RequerimientoVisitaEntity, Integer> {
    List<RequerimientoVisitaEntity> findByVisitaId(Integer idVisita);
}
