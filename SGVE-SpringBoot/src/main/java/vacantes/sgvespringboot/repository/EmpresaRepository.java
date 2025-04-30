package vacantes.sgvespringboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vacantes.sgvespringboot.entity.Empresa;

import java.util.Optional;


public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {

    @Query("SELECT e FROM Empresa e JOIN e.usuario u WHERE u.email = :email")
    Optional<Empresa> findByUsuarioEmail(String email);
}
