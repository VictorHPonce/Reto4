package vacantes.sgvespringboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vacantes.sgvespringboot.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}
