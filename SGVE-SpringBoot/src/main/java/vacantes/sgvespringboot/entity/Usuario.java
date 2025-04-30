package vacantes.sgvespringboot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @Column(length = 45, nullable = false)
    private String email;

    @Column(length = 45, nullable = false)
    private String nombre;

    @Column(length = 100, nullable = false)
    private String apellidos;

    @Column(length = 100, nullable = false)
    private String password;

    @Column(nullable = false)
    private int enabled = 1;

    @Temporal(TemporalType.DATE)
    private Date fechaRegistro;

    @Enumerated(EnumType.STRING)
    @Column(length = 15, nullable = false)
    private Rol rol;

    public enum Rol {
        EMPRESA, ADMON, CLIENTE
    }

}