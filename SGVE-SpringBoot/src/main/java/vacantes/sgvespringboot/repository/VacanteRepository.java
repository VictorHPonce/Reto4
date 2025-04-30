package vacantes.sgvespringboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vacantes.sgvespringboot.entity.Empresa;
import vacantes.sgvespringboot.entity.Vacante;

import java.util.List;

public interface VacanteRepository extends JpaRepository<Vacante, Integer> {

    List<Vacante> findByEmpresa(Empresa empresa);
}
