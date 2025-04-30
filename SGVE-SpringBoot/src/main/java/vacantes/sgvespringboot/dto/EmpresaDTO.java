package vacantes.sgvespringboot.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vacantes.sgvespringboot.entity.Usuario;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDTO {
    private Integer idEmpresa;
    private String cif;
    private String nombreEmpresa;
    private String direccionFiscal;
    private String pais;
    private Usuario usuario;
}
