package vacantes.sgvespringboot.service;

import vacantes.sgvespringboot.dto.SolicitudDTO;
import vacantes.sgvespringboot.entity.Solicitud;

import java.io.IOException;
import java.util.List;

public interface SolicitudService extends GenericService<Solicitud, Integer> {

    String guardarArchivoBase64(String base64, String nombreArchivo) throws IOException;

    SolicitudDTO actualizarSolicitud(Integer idSolicitud, SolicitudDTO solicitudDTO);

    List<Solicitud> obtenerSolicitudesPorEmail(String email);
}
