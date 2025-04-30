package vacantes.sgvespringboot.serviceImpl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import vacantes.sgvespringboot.dto.SolicitudDTO;
import vacantes.sgvespringboot.entity.Solicitud;
import vacantes.sgvespringboot.repository.SolicitudRepository;
import vacantes.sgvespringboot.service.SolicitudService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitudServiceImpl extends GenericServiceImpl<Solicitud, Integer> implements SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final ModelMapper modelMapper;

    public SolicitudServiceImpl(SolicitudRepository repository, SolicitudRepository solicitudRepository, ModelMapper modelMapper) {
        super(repository);
        this.solicitudRepository = solicitudRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public String guardarArchivoBase64(String base64, String nombreArchivo) throws IOException {
        byte[] bytes = Base64.getDecoder().decode(base64);
        Path path = Paths.get("uploads/" + nombreArchivo);
        Files.createDirectories(path.getParent()); // crea carpeta si no existe
        Files.write(path, bytes);
        return path.toString(); // aquí devuelves la ruta o el nombre
    }

    @Override
    public SolicitudDTO actualizarSolicitud(Integer idSolicitud, SolicitudDTO solicitudDTO) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con ID: " + idSolicitud));

        // Actualizamos solo los campos permitidos
        solicitud.setComentarios(solicitudDTO.getComentarios());
        solicitud.setArchivo(solicitudDTO.getArchivo());

        // Guardamos y devolvemos como DTO
        solicitud = solicitudRepository.save(solicitud);
        return modelMapper.map(solicitud, SolicitudDTO.class);
    }

    // Método que obtiene las solicitudes por email
    public List<Solicitud> obtenerSolicitudesPorEmail(String email) {
        return solicitudRepository.findByUsuarioEmail(email);
    }

}
