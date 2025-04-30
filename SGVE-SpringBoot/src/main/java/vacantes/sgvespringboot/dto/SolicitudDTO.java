package vacantes.sgvespringboot.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudDTO {
    private Integer idSolicitud;
    private String comentarios;
    private String archivo;
    private Integer idVacante;
    private String email;

}
