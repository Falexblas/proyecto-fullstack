package com.visitas.backend_api.dto;

import com.visitas.backend_api.enums.ResultadoControl;
import com.visitas.backend_api.enums.TipoControl;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluacionAsistenciaEstudiantesDTO {
    private TipoControl tipoControl = TipoControl.AMBIENTE;
    private ResultadoControl resultadoControl = ResultadoControl.NO_APLICA;
    private String observaciones;
}
