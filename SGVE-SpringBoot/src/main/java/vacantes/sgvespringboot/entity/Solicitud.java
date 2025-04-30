package vacantes.sgvespringboot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "solicitudes",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"idVacante", "email"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSolicitud;

    @Temporal(TemporalType.DATE)
    private Date fecha;

    @Column(length = 250, nullable = false)
    private String archivo;

    @Column(length = 2000)
    private String comentarios;

    @Column(nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private int estado; // 0: presentada, 1: adjudicada

    @Column(length = 45)
    private String curriculum;

    @ManyToOne
    @JoinColumn(name = "idVacante", nullable = false)
    private Vacante vacante;

    @ManyToOne
    @JoinColumn(name = "email", nullable = false)
    private Usuario usuario;
}