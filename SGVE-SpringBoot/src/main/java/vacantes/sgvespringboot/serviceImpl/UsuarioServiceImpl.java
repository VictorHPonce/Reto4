package vacantes.sgvespringboot.serviceImpl;

import org.springframework.stereotype.Service;
import vacantes.sgvespringboot.entity.Usuario;
import vacantes.sgvespringboot.repository.UsuarioRepository;
import vacantes.sgvespringboot.service.UsuarioService;

@Service
public class UsuarioServiceImpl extends GenericServiceImpl<Usuario, String> implements UsuarioService {
    public UsuarioServiceImpl(UsuarioRepository repository) {
        super(repository);
    }

    @Override
    public Usuario findByEmail(String email) {
        return ((UsuarioRepository) repository).findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el email: " + email));
    }

    @Override
    public boolean existsByEmail(String email) {
        return ((UsuarioRepository) repository).findByEmail(email).isPresent();
    }

    @Override
    public void updateEnabled(String email, int enabled) {
        Usuario usuario = findByEmail(email);
        usuario.setEnabled(enabled);
        repository.save(usuario);
    }

}
