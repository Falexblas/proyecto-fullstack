package com.visitas.backend_api.service;

import com.visitas.backend_api.dto.VisitaCreateDTO;
import com.visitas.backend_api.dto.VisitaResponseDTO;
import com.visitas.backend_api.entity.AsignaturaEntity;
import com.visitas.backend_api.entity.DocenteEntity;
import com.visitas.backend_api.entity.EvaluacionAsistenciaEstudiantesEntity;
import com.visitas.backend_api.entity.EvaluacionAvanceSilabicoEntity;
import com.visitas.backend_api.entity.EvaluacionControlDocenteEntity;
import com.visitas.backend_api.entity.EvaluacionGuiaPracticaEntity;
import com.visitas.backend_api.entity.EvaluacionMaterialVirtualEntity;
import com.visitas.backend_api.entity.ResponsableVisitaEntity;
import com.visitas.backend_api.entity.SedeEntity;
import com.visitas.backend_api.entity.UsuarioSistemaEntity;
import com.visitas.backend_api.entity.VisitaInopinadaEntity;
import com.visitas.backend_api.enums.EstadoVisita;
import com.visitas.backend_api.exception.InvalidStateException;
import com.visitas.backend_api.exception.ResourceNotFoundException;
import com.visitas.backend_api.exception.UnauthorizedAccessException;
import com.visitas.backend_api.mapper.VisitaMapper;
import com.visitas.backend_api.repository.AsignaturaEntityRepository;
import com.visitas.backend_api.repository.DocenteEntityRepository;
import com.visitas.backend_api.repository.EvaluacionAsistenciaEstudiantesEntityRepository;
import com.visitas.backend_api.repository.EvaluacionAvanceSilabicoEntityRepository;
import com.visitas.backend_api.repository.EvaluacionControlDocenteEntityRepository;
import com.visitas.backend_api.repository.EvaluacionGuiaPracticaEntityRepository;
import com.visitas.backend_api.repository.EvaluacionMaterialVirtualEntityRepository;
import com.visitas.backend_api.repository.ResponsableVisitaEntityRepository;
import com.visitas.backend_api.repository.SedeEntityRepository;
import com.visitas.backend_api.repository.UsuarioSistemaEntityRepository;
import com.visitas.backend_api.repository.VisitaInopinadaEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitaService {

    private final VisitaInopinadaEntityRepository visitaRepository;
    private final SedeEntityRepository sedeRepository;
    private final DocenteEntityRepository docenteRepository;
    private final AsignaturaEntityRepository asignaturaRepository;
    private final ResponsableVisitaEntityRepository responsableRepository;
    private final UsuarioSistemaEntityRepository usuarioRepository;
    private final EvaluacionControlDocenteEntityRepository evaluacionControlDocenteRepository;
    private final EvaluacionMaterialVirtualEntityRepository evaluacionMaterialVirtualRepository;
    private final EvaluacionAsistenciaEstudiantesEntityRepository evaluacionAsistenciaEstudiantesRepository;
    private final EvaluacionAvanceSilabicoEntityRepository evaluacionAvanceSilabicoRepository;
    private final EvaluacionGuiaPracticaEntityRepository evaluacionGuiaPracticaRepository;
    private final VisitaMapper visitaMapper;
    private final AuthService authService;

    @Transactional
    public VisitaResponseDTO crearVisita(VisitaCreateDTO dto) {
        Integer currentUserId = authService.getCurrentUserId();

        SedeEntity sede = sedeRepository.findById(dto.getIdSede())
                .orElseThrow(() -> new ResourceNotFoundException("Sede", dto.getIdSede()));
        DocenteEntity docente = docenteRepository.findById(dto.getIdDocente())
                .orElseThrow(() -> new ResourceNotFoundException("Docente", dto.getIdDocente()));
        AsignaturaEntity asignatura = asignaturaRepository.findById(dto.getIdAsignatura())
                .orElseThrow(() -> new ResourceNotFoundException("Asignatura", dto.getIdAsignatura()));
        ResponsableVisitaEntity responsable = responsableRepository.findById(dto.getIdResponsable())
                .orElseThrow(() -> new ResourceNotFoundException("Responsable", dto.getIdResponsable()));
        UsuarioSistemaEntity usuarioAuditor = usuarioRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", currentUserId));

        VisitaInopinadaEntity visita = visitaMapper.toEntity(dto);
        visita.setSede(sede);
        visita.setDocente(docente);
        visita.setAsignatura(asignatura);
        visita.setResponsable(responsable);
        visita.setUsuarioAuditor(usuarioAuditor);
        visita.setEstadoVisita(EstadoVisita.BORRADOR);

        visita = visitaRepository.save(visita);

        EvaluacionControlDocenteEntity evaluacionControlDocente = new EvaluacionControlDocenteEntity();
        evaluacionControlDocente.setVisita(visita);
        if (dto.getEvaluacionControlDocente() != null) {
            visitaMapper.updateEntityFromDTO(dto.getEvaluacionControlDocente(), evaluacionControlDocente);
        }
        evaluacionControlDocenteRepository.save(evaluacionControlDocente);

        EvaluacionMaterialVirtualEntity evaluacionMaterialVirtual = new EvaluacionMaterialVirtualEntity();
        evaluacionMaterialVirtual.setVisita(visita);
        if (dto.getEvaluacionMaterialVirtual() != null) {
            visitaMapper.updateEntityFromDTO(dto.getEvaluacionMaterialVirtual(), evaluacionMaterialVirtual);
        }
        evaluacionMaterialVirtualRepository.save(evaluacionMaterialVirtual);

        EvaluacionAsistenciaEstudiantesEntity evaluacionAsistenciaEstudiantes = new EvaluacionAsistenciaEstudiantesEntity();
        evaluacionAsistenciaEstudiantes.setVisita(visita);
        if (dto.getEvaluacionAsistenciaEstudiantes() != null) {
            visitaMapper.updateEntityFromDTO(dto.getEvaluacionAsistenciaEstudiantes(), evaluacionAsistenciaEstudiantes);
        }
        evaluacionAsistenciaEstudiantesRepository.save(evaluacionAsistenciaEstudiantes);

        EvaluacionAvanceSilabicoEntity evaluacionAvanceSilabico = new EvaluacionAvanceSilabicoEntity();
        evaluacionAvanceSilabico.setVisita(visita);
        if (dto.getEvaluacionAvanceSilabico() != null) {
            visitaMapper.updateEntityFromDTO(dto.getEvaluacionAvanceSilabico(), evaluacionAvanceSilabico);
        }
        evaluacionAvanceSilabicoRepository.save(evaluacionAvanceSilabico);

        EvaluacionGuiaPracticaEntity evaluacionGuiaPractica = new EvaluacionGuiaPracticaEntity();
        evaluacionGuiaPractica.setVisita(visita);
        if (dto.getEvaluacionGuiaPractica() != null) {
            visitaMapper.updateEntityFromDTO(dto.getEvaluacionGuiaPractica(), evaluacionGuiaPractica);
        }
        evaluacionGuiaPracticaRepository.save(evaluacionGuiaPractica);

        visita.setEvaluacionControlDocente(evaluacionControlDocente);
        visita.setEvaluacionMaterialVirtual(evaluacionMaterialVirtual);
        visita.setEvaluacionAsistenciaEstudiantes(evaluacionAsistenciaEstudiantes);
        visita.setEvaluacionAvanceSilabico(evaluacionAvanceSilabico);
        visita.setEvaluacionGuiaPractica(evaluacionGuiaPractica);

        visita = visitaRepository.save(visita);

        return visitaMapper.toResponseDTO(visita);
    }

    public VisitaResponseDTO obtenerVisitaPorId(Integer id) {
        VisitaInopinadaEntity visita = visitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visita", id));

        Integer currentDocenteId = authService.getCurrentDocenteId();
        if (visita.getDocente().getId().equals(currentDocenteId)) {
            return visitaMapper.toResponseDTO(visita);
        }

        return visitaMapper.toResponseDTO(visita);
    }

    @Transactional
    public VisitaResponseDTO actualizarEvaluaciones(Integer id, VisitaCreateDTO dto) {
        VisitaInopinadaEntity visita = visitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visita", id));

        if (visita.getEstadoVisita() != EstadoVisita.BORRADOR) {
            throw new InvalidStateException("Solo se pueden editar evaluaciones en estado BORRADOR");
        }

        if (dto.getEvaluacionControlDocente() != null && visita.getEvaluacionControlDocente() != null) {
            visitaMapper.updateEntityFromDTO(dto.getEvaluacionControlDocente(), visita.getEvaluacionControlDocente());
            evaluacionControlDocenteRepository.save(visita.getEvaluacionControlDocente());
        }

        if (dto.getEvaluacionMaterialVirtual() != null && visita.getEvaluacionMaterialVirtual() != null) {
            visitaMapper.updateEntityFromDTO(dto.getEvaluacionMaterialVirtual(), visita.getEvaluacionMaterialVirtual());
            evaluacionMaterialVirtualRepository.save(visita.getEvaluacionMaterialVirtual());
        }

        if (dto.getEvaluacionAsistenciaEstudiantes() != null && visita.getEvaluacionAsistenciaEstudiantes() != null) {
            visitaMapper.updateEntityFromDTO(dto.getEvaluacionAsistenciaEstudiantes(), visita.getEvaluacionAsistenciaEstudiantes());
            evaluacionAsistenciaEstudiantesRepository.save(visita.getEvaluacionAsistenciaEstudiantes());
        }

        if (dto.getEvaluacionAvanceSilabico() != null && visita.getEvaluacionAvanceSilabico() != null) {
            visitaMapper.updateEntityFromDTO(dto.getEvaluacionAvanceSilabico(), visita.getEvaluacionAvanceSilabico());
            evaluacionAvanceSilabicoRepository.save(visita.getEvaluacionAvanceSilabico());
        }

        if (dto.getEvaluacionGuiaPractica() != null && visita.getEvaluacionGuiaPractica() != null) {
            visitaMapper.updateEntityFromDTO(dto.getEvaluacionGuiaPractica(), visita.getEvaluacionGuiaPractica());
            evaluacionGuiaPracticaRepository.save(visita.getEvaluacionGuiaPractica());
        }

        return visitaMapper.toResponseDTO(visita);
    }

    @Transactional
    public VisitaResponseDTO firmarPorDocente(Integer id, String firmaHash) {
        VisitaInopinadaEntity visita = visitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visita", id));

        Integer currentDocenteId = authService.getCurrentDocenteId();
        if (!visita.getDocente().getId().equals(currentDocenteId)) {
            throw new UnauthorizedAccessException("No puedes firmar una visita que no es tuya");
        }

        if (visita.getEstadoVisita() != EstadoVisita.BORRADOR) {
            throw new InvalidStateException("Solo se puede firmar en estado BORRADOR");
        }

        visita.setFirmaDocenteHash(firmaHash);
        visita.setFechaFirmaDocente(LocalDateTime.now());
        visita.setEstadoVisita(EstadoVisita.FIRMADA_DOCENTE);

        visita = visitaRepository.save(visita);
        return visitaMapper.toResponseDTO(visita);
    }

    @Transactional
    public VisitaResponseDTO firmarPorAuditor(Integer id, String firmaHash) {
        VisitaInopinadaEntity visita = visitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visita", id));

        if (visita.getEstadoVisita() != EstadoVisita.FIRMADA_DOCENTE) {
            throw new InvalidStateException("El docente debe firmar antes que el auditor");
        }

        if (visita.getFirmaDocenteHash() == null) {
            throw new InvalidStateException("El docente aún no ha firmado");
        }

        visita.setFirmaResponsableHash(firmaHash);
        visita.setFechaFirmaResponsable(LocalDateTime.now());
        visita.setEstadoVisita(EstadoVisita.COMPLETADA);

        visita = visitaRepository.save(visita);
        return visitaMapper.toResponseDTO(visita);
    }

    public List<VisitaResponseDTO> listarTodas() {
        return visitaRepository.findAll().stream()
                .map(visitaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<VisitaResponseDTO> listarPorDocente(Integer idDocente) {
        return visitaRepository.findByDocenteId(idDocente).stream()
                .map(visitaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<VisitaResponseDTO> listarPorAuditor(Integer idAuditor) {
        return visitaRepository.findByUsuarioAuditorId(idAuditor).stream()
                .map(visitaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<VisitaResponseDTO> listarMisVisitasComoDocente() {
        Integer currentDocenteId = authService.getCurrentDocenteId();
        return listarPorDocente(currentDocenteId);
    }

    public List<VisitaResponseDTO> listarMisVisitasComoAuditor() {
        Integer currentUserId = authService.getCurrentUserId();
        return listarPorAuditor(currentUserId);
    }
}
