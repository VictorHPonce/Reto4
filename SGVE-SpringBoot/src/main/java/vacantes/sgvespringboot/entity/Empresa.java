package vacantes.sgvespringboot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "empresas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEmpresa;

    @Column(length = 10, nullable = false, unique = true)
    private String cif;

    @Column(length = 100, nullable = false)
    private String nombreEmpresa;

    @Column(length = 100)
    private String direccionFiscal;

    @Column(length = 45)
    private String pais;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "email", referencedColumnName = "email", nullable = false)
    private Usuario usuario;
}
