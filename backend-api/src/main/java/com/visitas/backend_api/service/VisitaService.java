package com.visitas.backend_api.service;

import com.visitas.backend_api.dto.RequerimientoCreateDTO;
import com.visitas.backend_api.dto.VisitaCreateDTO;
import com.visitas.backend_api.dto.VisitaFilterDTO;
import com.visitas.backend_api.dto.VisitaResponseDTO;
import com.visitas.backend_api.entity.AsignaturaEntity;
import com.visitas.backend_api.entity.RequerimientoVisitaEntity;
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
import com.visitas.backend_api.dto.DashboardAuditorStatsDTO;
import com.visitas.backend_api.enums.EstadoRequerimiento;
import com.visitas.backend_api.enums.EstadoVisita;
import com.visitas.backend_api.enums.Rol;
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
import com.visitas.backend_api.repository.RequerimientoVisitaEntityRepository;
import com.visitas.backend_api.repository.ResponsableVisitaEntityRepository;
import com.visitas.backend_api.repository.SedeEntityRepository;
import com.visitas.backend_api.repository.UsuarioSistemaEntityRepository;
import com.visitas.backend_api.repository.VisitaInopinadaEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import com.visitas.backend_api.enums.EstadoVisita;
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
    private final RequerimientoVisitaEntityRepository requerimientoRepository;
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

        // Crear requerimientos si vienen en el DTO
        if (dto.getRequerimientos() != null && !dto.getRequerimientos().isEmpty()) {
            for (RequerimientoCreateDTO reqDTO : dto.getRequerimientos()) {
                if (reqDTO.getDescripcion() != null && !reqDTO.getDescripcion().trim().isEmpty()) {
                    RequerimientoVisitaEntity requerimiento = new RequerimientoVisitaEntity();
                    requerimiento.setVisita(visita);
                    requerimiento.setDescripcion(reqDTO.getDescripcion().trim());
                    requerimiento.setEstado(EstadoRequerimiento.PENDIENTE);
                    requerimiento.setFechaSolicitud(LocalDate.now());
                    requerimientoRepository.save(requerimiento);
                }
            }
        }

        return visitaMapper.toResponseDTO(visita);
    }

    public VisitaResponseDTO obtenerVisitaPorId(Integer id) {
        VisitaInopinadaEntity visita = visitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visita", id));

        Rol currentRole = authService.getCurrentUserRole();
        Integer currentUserId = authService.getCurrentUserId();
        
        // ADMIN puede ver cualquier visita
        if (currentRole == Rol.ADMIN) {
            return visitaMapper.toResponseDTO(visita);
        }
        
        // AUDITOR solo puede ver las visitas que él creó
        if (currentRole == Rol.AUDITOR) {
            if (visita.getUsuarioAuditor() == null || !visita.getUsuarioAuditor().getId().equals(currentUserId)) {
                throw new UnauthorizedAccessException("No puedes ver visitas de otros evaluadores");
            }
            return visitaMapper.toResponseDTO(visita);
        }
        
        // DOCENTE solo puede ver sus propias visitas
        if (currentRole == Rol.DOCENTE) {
            Integer currentDocenteId = authService.getCurrentDocenteId();
            if (!visita.getDocente().getId().equals(currentDocenteId)) {
                throw new UnauthorizedAccessException("No puedes ver visitas de otros docentes");
            }
        }

        return visitaMapper.toResponseDTO(visita);
    }

    @Transactional
    public VisitaResponseDTO actualizarVisita(Integer id, VisitaCreateDTO dto) {
        VisitaInopinadaEntity visita = visitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visita", id));

        // Solo se puede editar en estado BORRADOR
        if (visita.getEstadoVisita() != EstadoVisita.BORRADOR) {
            throw new InvalidStateException("Solo se pueden editar visitas en estado BORRADOR");
        }

        // Verificar que el auditor actual sea el creador de la visita
        Integer currentUserId = authService.getCurrentUserId();
        if (visita.getUsuarioAuditor() == null || !visita.getUsuarioAuditor().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException("No puedes editar visitas de otros evaluadores");
        }

        // Actualizar campos básicos
        if (dto.getFechaVisita() != null) {
            visita.setFechaVisita(dto.getFechaVisita());
        }
        if (dto.getHoraInicio() != null) {
            visita.setHoraInicio(dto.getHoraInicio());
        }
        if (dto.getHoraTermino() != null) {
            visita.setHoraTermino(dto.getHoraTermino());
        }
        if (dto.getLugarVisita() != null) {
            visita.setLugarVisita(dto.getLugarVisita());
        }
        if (dto.getTipoClase() != null) {
            visita.setTipoClase(dto.getTipoClase());
        }
        if (dto.getSemanaNumero() != null) {
            visita.setSemanaNumero(dto.getSemanaNumero());
        }

        visita = visitaRepository.save(visita);
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

    public List<VisitaResponseDTO> filtrarVisitas(VisitaFilterDTO filter) {
        EstadoVisita estadoEnum = null;
        if (filter.getEstado() != null && !filter.getEstado().isBlank()) {
            try {
                estadoEnum = EstadoVisita.valueOf(filter.getEstado().toUpperCase());
            } catch (IllegalArgumentException ex) {
                estadoEnum = null;
            }
        }

        return visitaRepository.filtrarVisitas(
                filter.getBusqueda(),
                filter.getIdSede(),
                estadoEnum,
                filter.getFechaDesde(),
                filter.getFechaHasta()
        ).stream()
                .map(visitaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<VisitaResponseDTO> filtrarVisitasAuditor(VisitaFilterDTO filter) {
        Integer currentUserId = authService.getCurrentUserId();
        EstadoVisita estadoEnum = null;
        if (filter.getEstado() != null && !filter.getEstado().isBlank()) {
            try {
                estadoEnum = EstadoVisita.valueOf(filter.getEstado().toUpperCase());
            } catch (IllegalArgumentException ex) {
                estadoEnum = null;
            }
        }

        return visitaRepository.filtrarVisitasPorAuditor(
                currentUserId,
                filter.getBusqueda(),
                filter.getIdSede(),
                estadoEnum,
                filter.getFechaDesde(),
                filter.getFechaHasta()
        ).stream()
                .map(visitaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<VisitaResponseDTO> filtrarVisitasDocente(VisitaFilterDTO filter) {
        Integer currentDocenteId = authService.getCurrentDocenteId();
        EstadoVisita estadoEnum = null;
        if (filter.getEstado() != null && !filter.getEstado().isBlank()) {
            try {
                estadoEnum = EstadoVisita.valueOf(filter.getEstado().toUpperCase());
            } catch (IllegalArgumentException ex) {
                estadoEnum = null;
            }
        }

        return visitaRepository.filtrarVisitasPorDocente(
                currentDocenteId,
                filter.getBusqueda(),
                filter.getIdSede(),
                estadoEnum,
                filter.getFechaDesde(),
                filter.getFechaHasta()
        ).stream()
                .map(visitaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public DashboardAuditorStatsDTO obtenerEstadisticasDashboardAuditor() {
        Integer currentUserId = authService.getCurrentUserId();
        
        // Estadísticas básicas
        long visitasEsteMes = visitaRepository.countVisitasEsteMesByAuditor(currentUserId);
        long docentesEvaluados = visitaRepository.countDocentesEvaluadosByAuditor(currentUserId);
        
        // Requerimientos pendientes (PENDIENTE y EN_PROCESO)
        List<EstadoRequerimiento> estadosPendientes = List.of(EstadoRequerimiento.PENDIENTE, EstadoRequerimiento.EN_PROCESO);
        long requerimientosPendientes = requerimientoRepository.countRequerimientosPendientesByAuditor(currentUserId, estadosPendientes);
        
        // Próximas visitas (desde hoy en adelante)
        List<DashboardAuditorStatsDTO.VisitaResumenDTO> proximasVisitas = visitaRepository
                .findProximasVisitasByAuditor(currentUserId, java.time.LocalDate.now())
                .stream()
                .limit(5)
                .map(v -> new DashboardAuditorStatsDTO.VisitaResumenDTO(
                        v.getId(),
                        v.getDocente().getNombres() + " " + v.getDocente().getApellidos(),
                        v.getAsignatura().getNombre(),
                        v.getFechaVisita().toString(),
                        v.getHoraInicio().toString(),
                        v.getSede().getNombre(),
                        v.getEstadoVisita().toString()
                ))
                .collect(Collectors.toList());
        
        // Visitas recientes (últimas 5)
        List<DashboardAuditorStatsDTO.VisitaResumenDTO> visitasRecientes = visitaRepository
                .findRecentVisitasByAuditor(currentUserId)
                .stream()
                .limit(5)
                .map(v -> new DashboardAuditorStatsDTO.VisitaResumenDTO(
                        v.getId(),
                        v.getDocente().getNombres() + " " + v.getDocente().getApellidos(),
                        v.getAsignatura().getNombre(),
                        v.getFechaVisita().toString(),
                        v.getHoraInicio().toString(),
                        v.getSede().getNombre(),
                        v.getEstadoVisita().toString()
                ))
                .collect(Collectors.toList());
        
        return new DashboardAuditorStatsDTO(
                visitasEsteMes,
                docentesEvaluados,
                requerimientosPendientes,
                proximasVisitas,
                visitasRecientes
        );
    }
}
