package com.visitas.backend_api.entity;

import com.visitas.backend_api.enums.ResultadoControl;
import com.visitas.backend_api.enums.TipoControl;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evaluacionasistenciaestudiantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluacionAsistenciaEstudiantesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_visita", unique = true, nullable = false)
    private VisitaInopinadaEntity visita;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_control")
    private TipoControl tipoControl = TipoControl.AMBIENTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_control")
    private ResultadoControl resultadoControl = ResultadoControl.NO_APLICA;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
}
