package vacantes.sgvespringboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vacantes.sgvespringboot.dto.SolicitudDTO;
import vacantes.sgvespringboot.entity.Solicitud;

import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {
    List<Solicitud> findByUsuarioEmail(String email);
}
