package com.visitas.backend_api.controller;

import com.visitas.backend_api.dto.VisitaCreateDTO;
import com.visitas.backend_api.dto.VisitaResponseDTO;
import com.visitas.backend_api.entity.VisitaInopinadaEntity;
import com.visitas.backend_api.repository.VisitaInopinadaEntityRepository;
import com.visitas.backend_api.service.VisitaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitas")
@RequiredArgsConstructor
public class VisitaController {

    private final VisitaService visitaService;
    private final VisitaInopinadaEntityRepository visitaRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VisitaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(visitaService.listarTodas());
    }

    @GetMapping("/mis-visitas-docente")
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<List<VisitaResponseDTO>> listarMisVisitasComoDocente() {
        return ResponseEntity.ok(visitaService.listarMisVisitasComoDocente());
    }

    @GetMapping("/mis-visitas-auditor")
    @PreAuthorize("hasRole('AUDITOR')")
    public ResponseEntity<List<VisitaResponseDTO>> listarMisVisitasComoAuditor() {
        return ResponseEntity.ok(visitaService.listarMisVisitasComoAuditor());
    }

    // Endpoint temporal para depuración - REMOVER EN PRODUCCION
    @GetMapping("/debug-all")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUDITOR')")
    public ResponseEntity<List<VisitaInopinadaEntity>> debugAllVisitas() {
        List<VisitaInopinadaEntity> visitas = visitaRepository.findAll();
        System.out.println("TOTAL VISITAS: " + visitas.size());
        for (VisitaInopinadaEntity v : visitas) {
            System.out.println("Visita ID: " + v.getId() + 
                ", Auditor ID: " + (v.getUsuarioAuditor() != null ? v.getUsuarioAuditor().getId() : "NULL") +
                ", Estado: " + v.getEstadoVisita());
        }
        return ResponseEntity.ok(visitas);
    }

    @GetMapping("/docente/{idDocente}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUDITOR')")
    public ResponseEntity<List<VisitaResponseDTO>> listarPorDocente(@PathVariable Integer idDocente) {
        return ResponseEntity.ok(visitaService.listarPorDocente(idDocente));
    }

    @PostMapping
    @PreAuthorize("hasRole('AUDITOR')")
    public ResponseEntity<VisitaResponseDTO> crearVisita(@Valid @RequestBody VisitaCreateDTO dto) {
        VisitaResponseDTO response = visitaService.crearVisita(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AUDITOR', 'DOCENTE', 'ADMIN')")
    public ResponseEntity<VisitaResponseDTO> obtenerVisitaPorId(@PathVariable Integer id) {
        VisitaResponseDTO response = visitaService.obtenerVisitaPorId(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/evaluaciones")
    @PreAuthorize("hasRole('AUDITOR')")
    public ResponseEntity<VisitaResponseDTO> actualizarEvaluaciones(
            @PathVariable Integer id,
            @Valid @RequestBody VisitaCreateDTO dto) {
        VisitaResponseDTO response = visitaService.actualizarEvaluaciones(id, dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/firma-docente")
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<VisitaResponseDTO> firmarPorDocente(
            @PathVariable Integer id,
            @RequestBody String firmaHash) {
        VisitaResponseDTO response = visitaService.firmarPorDocente(id, firmaHash);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/firma-auditor")
    @PreAuthorize("hasRole('AUDITOR')")
    public ResponseEntity<VisitaResponseDTO> firmarPorAuditor(
            @PathVariable Integer id,
            @RequestBody String firmaHash) {
        VisitaResponseDTO response = visitaService.firmarPorAuditor(id, firmaHash);
        return ResponseEntity.ok(response);
    }
}
