package vacantes.sgvespringboot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vacantes.sgvespringboot.dto.SolicitudDTO;
import vacantes.sgvespringboot.entity.Solicitud;
import vacantes.sgvespringboot.entity.Usuario;
import vacantes.sgvespringboot.entity.Vacante;
import vacantes.sgvespringboot.service.SolicitudService;
import vacantes.sgvespringboot.service.UsuarioService;
import vacantes.sgvespringboot.service.VacanteService;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private final SolicitudService solicitudService;
    private final UsuarioService usuarioService;
    private final VacanteService vacanteService;

    public SolicitudController(SolicitudService solicitudService, UsuarioService usuarioService, VacanteService vacanteService) {
        this.solicitudService = solicitudService;
        this.usuarioService = usuarioService;
        this.vacanteService = vacanteService;
    }

    @GetMapping
    public ResponseEntity<List<Solicitud>> getAllSolicitudes() {
        List<Solicitud> solicitudes = solicitudService.findAll();
        return ResponseEntity.ok(solicitudes);
    }

    @PutMapping("/{idSolicitud}")
    public ResponseEntity<?> actualizarSolicitud(@PathVariable Integer idSolicitud, @RequestBody SolicitudDTO solicitudDTO) {
        try {
            SolicitudDTO actualizada = solicitudService.actualizarSolicitud(idSolicitud, solicitudDTO);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            System.err.println("Error al actualizar: " + e.getMessage()); // DEBUG
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Solicitud no encontrada.");
        } catch (Exception e) {
            e.printStackTrace(); // DEBUG
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la solicitud.");
        }
    }

    @PostMapping
    public ResponseEntity<?> crearSolicitud(@RequestBody SolicitudDTO dto) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();

            Usuario usuario = usuarioService.findById(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Vacante vacante = vacanteService.findById(dto.getIdVacante())
                    .orElseThrow(() -> new RuntimeException("Vacante no encontrada"));

            // Generar nombre único para el archivo
            String nombreArchivo = "cv_" + email.replace("@", "_") + "_" + System.currentTimeMillis() + ".pdf";

            // Generar nombre para el curriculum, puede ser el mismo o diferente
            String nombreCurriculum = "curriculum_" + email.replace("@", "_").replace(".", "_") + ".pdf";

            // Guardar archivo base64 en disco (archivo)
            solicitudService.guardarArchivoBase64(dto.getArchivo(), nombreArchivo);

            // Crear y guardar la solicitud
            Solicitud solicitud = new Solicitud();
            solicitud.setFecha(new Date());
            solicitud.setArchivo(nombreArchivo); // Solo nombre, o ruta si prefieres
            solicitud.setCurriculum(nombreCurriculum); // Aquí se agrega el campo curriculum
            solicitud.setComentarios(dto.getComentarios());
            solicitud.setEstado(0);
            solicitud.setVacante(vacante);
            solicitud.setUsuario(usuario);

            // Guardar la solicitud
            solicitudService.save(solicitud);

            return ResponseEntity.ok("Solicitud guardada correctamente");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{idSolicitud}")
    public ResponseEntity<Void> deleteSolicitud(@PathVariable Integer idSolicitud) {
        solicitudService.deleteById(idSolicitud);
        return ResponseEntity.noContent().build();
    }


}
