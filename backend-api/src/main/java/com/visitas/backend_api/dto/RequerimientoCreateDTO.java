package com.visitas.backend_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequerimientoCreateDTO {
    @NotNull(message = "El ID de visita es obligatorio")
    private Integer idVisita;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;
}
