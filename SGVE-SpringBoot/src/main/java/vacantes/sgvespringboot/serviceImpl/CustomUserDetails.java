package vacantes.sgvespringboot.serviceImpl;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import vacantes.sgvespringboot.entity.Usuario;

import java.util.Collections;

public class CustomUserDetails extends User {
    private final Usuario usuario;
    private final Integer idEmpresa;

    public CustomUserDetails(Usuario usuario, Integer idEmpresa) {
        super(
                usuario.getEmail(),
                usuario.getPassword(),
                usuario.getEnabled() == 1,
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()))
        );
        this.usuario = usuario;
        this.idEmpresa = idEmpresa;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public Integer getIdEmpresa() {
        return idEmpresa;
    }

    public Usuario.Rol getRol() {
        return usuario.getRol();
    }
}
