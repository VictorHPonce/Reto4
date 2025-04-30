package vacantes.sgvespringboot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "vacantes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vacante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idVacante;

    @Column(length = 200, nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @Temporal(TemporalType.DATE)
    private LocalDate fecha;

    @Column(nullable = false)
    private Double salario;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private Estado estatus;

    @Column(nullable = false)
    private boolean destacado;

    @Column(length = 250, nullable = false)
    private String imagen;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String detalles;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    public enum Estado {
        CREADA, CUBIERTA, CANCELADA
    }
}