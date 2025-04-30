package vacantes.sgvespringboot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vacantes.sgvespringboot.entity.Usuario;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
    private String email;
    private Integer idEmpresa;
    private String nombre;
    private String apellidos;
    private String password;
    private Date fechaRegistro;
    private Usuario.Rol rol;
    private int enabled;
}
