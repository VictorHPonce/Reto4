package vacantes.sgvespringboot.service;

import vacantes.sgvespringboot.entity.Usuario;

public interface UsuarioService extends GenericService<Usuario, String> {
    Usuario findByEmail(String email);

    boolean existsByEmail(String email);

    void updateEnabled(String email, int enabled);
}
