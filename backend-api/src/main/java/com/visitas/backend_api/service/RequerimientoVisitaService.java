package com.visitas.backend_api.service;

import com.visitas.backend_api.dto.RequerimientoCreateDTO;
import com.visitas.backend_api.dto.RequerimientoUpdateDTO;
import com.visitas.backend_api.dto.RequerimientoVisitaDTO;
import com.visitas.backend_api.entity.RequerimientoVisitaEntity;
import com.visitas.backend_api.entity.VisitaInopinadaEntity;
import com.visitas.backend_api.enums.EstadoRequerimiento;
import com.visitas.backend_api.exception.ResourceNotFoundException;
import com.visitas.backend_api.repository.RequerimientoVisitaEntityRepository;
import com.visitas.backend_api.repository.VisitaInopinadaEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequerimientoVisitaService {

    private final RequerimientoVisitaEntityRepository requerimientoRepository;
    private final VisitaInopinadaEntityRepository visitaRepository;

    public List<RequerimientoVisitaDTO> listarPorVisita(Integer idVisita) {
        return requerimientoRepository.findByVisitaId(idVisita).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RequerimientoVisitaDTO obtenerPorId(Integer id) {
        RequerimientoVisitaEntity requerimiento = requerimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requerimiento", id));
        return toDTO(requerimiento);
    }

    @Transactional
    public RequerimientoVisitaDTO crear(RequerimientoCreateDTO dto) {
        VisitaInopinadaEntity visita = visitaRepository.findById(dto.getIdVisita())
                .orElseThrow(() -> new ResourceNotFoundException("Visita", dto.getIdVisita()));

        RequerimientoVisitaEntity requerimiento = new RequerimientoVisitaEntity();
        requerimiento.setVisita(visita);
        requerimiento.setDescripcion(dto.getDescripcion());
        requerimiento.setEstado(EstadoRequerimiento.PENDIENTE);
        requerimiento.setFechaSolicitud(LocalDate.now());

        requerimiento = requerimientoRepository.save(requerimiento);
        return toDTO(requerimiento);
    }

    @Transactional
    public RequerimientoVisitaDTO responder(Integer id, RequerimientoUpdateDTO dto) {
        RequerimientoVisitaEntity requerimiento = requerimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requerimiento", id));

        requerimiento.setRespuesta(dto.getRespuesta());
        requerimiento.setEstado(EstadoRequerimiento.ATENDIDO);
        requerimiento.setFechaRespuesta(LocalDate.now());

        requerimiento = requerimientoRepository.save(requerimiento);
        return toDTO(requerimiento);
    }

    @Transactional
    public void eliminar(Integer id) {
        if (!requerimientoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Requerimiento", id);
        }
        requerimientoRepository.deleteById(id);
    }

    private RequerimientoVisitaDTO toDTO(RequerimientoVisitaEntity entity) {
        RequerimientoVisitaDTO dto = new RequerimientoVisitaDTO();
        dto.setId(entity.getId());
        dto.setIdVisita(entity.getVisita().getId());
        dto.setDescripcion(entity.getDescripcion());
        dto.setFechaSolicitud(entity.getFechaSolicitud());
        dto.setEstado(entity.getEstado());
        dto.setRespuesta(entity.getRespuesta());
        dto.setFechaRespuesta(entity.getFechaRespuesta());
        return dto;
    }
}
