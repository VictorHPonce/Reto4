package vacantes.sgvespringboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vacantes.sgvespringboot.entity.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    Optional<Usuario> findByEmail(String email);

}
