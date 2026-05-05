package com.visitas.backend_api.dto;

import com.visitas.backend_api.enums.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {

    private Integer id;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    private String email;

    @NotBlank(message = "Los nombres son obligatorios")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    @NotNull(message = "El rol es obligatorio")
    private Integer idRol;

    private Rol nombreRol;

    private Integer idDocente;

    private Integer idResponsable;

    private Boolean estado;

    private String nombreDocente;

    private String nombreResponsable;
}
