package vacantes.sgvespringboot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vacantes.sgvespringboot.entity.Vacante;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class VacanteDTO {
    private Integer idVacante;
    private String nombre;
    private String descripcion;
    private boolean destacado;
    private String detalles;
    private Vacante.Estado estatus;
    private LocalDate fecha;
    private String imagen;
    private Double salario;
    private Integer idCategoria;
    private Integer idEmpresa;

    // Constructor para valores por defecto (opcional si se maneja en el controller)
    public VacanteDTO() {
        this.estatus = Vacante.Estado.CREADA;
        this.fecha = LocalDate.now();
    }
}
