package vacantes.sgvespringboot.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vacantes.sgvespringboot.dto.VacanteDTO;
import vacantes.sgvespringboot.entity.Categoria;
import vacantes.sgvespringboot.entity.Empresa;
import vacantes.sgvespringboot.entity.Vacante;
import vacantes.sgvespringboot.service.CategoriaService;
import vacantes.sgvespringboot.service.EmpresaService;
import vacantes.sgvespringboot.service.UsuarioService;
import vacantes.sgvespringboot.service.VacanteService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vacantes")
public class VacanteController {

    private final VacanteService vacanteService;
    private final EmpresaService empresaService;
    private final CategoriaService categoriaService;
    private final ModelMapper modelMapper;
    private final UsuarioService usuarioService;

    public VacanteController(VacanteService vacanteService, EmpresaService empresaService,
                             CategoriaService categoriaService, ModelMapper modelMapper, UsuarioService usuarioService) {
        this.vacanteService = vacanteService;
        this.empresaService = empresaService;
        this.categoriaService = categoriaService;
        this.modelMapper = modelMapper;
        this.usuarioService = usuarioService;
    }
    @GetMapping
    public ResponseEntity<List<Vacante>> getAllVacantes() {
        List<Vacante> vacantes = vacanteService.findAll();
        return ResponseEntity.ok(vacantes);
    }


    @GetMapping("/{idVacante}")
    public ResponseEntity<Vacante> getVacanteById(@PathVariable Integer idVacante) {
        Optional<Vacante> vacante = vacanteService.findById(idVacante);
        return vacante.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear la vacante desde el rol de Empresa
    @PostMapping
    public ResponseEntity<?> createVacante(@RequestBody VacanteDTO vacanteDTO) {
        // Obtener las entidades relacionadas por sus IDs
        Optional<Empresa> empresaOpt = empresaService.findById(vacanteDTO.getIdEmpresa());
        Optional<Categoria> categoriaOpt = categoriaService.findById(vacanteDTO.getIdCategoria());

        // Verificar si las entidades existen
        if (!empresaOpt.isPresent() || !categoriaOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Empresa o Categoría no válida");
        }

        // Asignar las entidades obtenidas
        Empresa empresa = empresaOpt.get();
        Categoria categoria = categoriaOpt.get();

        // Crear la nueva vacante y asignar las propiedades
        Vacante nuevaVacante = new Vacante();
        nuevaVacante.setNombre(vacanteDTO.getNombre());
        nuevaVacante.setDescripcion(vacanteDTO.getDescripcion());
        nuevaVacante.setSalario(vacanteDTO.getSalario());
        nuevaVacante.setEstatus(vacanteDTO.getEstatus() != null ? vacanteDTO.getEstatus() : Vacante.Estado.CREADA);
        nuevaVacante.setDestacado(vacanteDTO.isDestacado());
        nuevaVacante.setImagen(vacanteDTO.getImagen());
        nuevaVacante.setDetalles(vacanteDTO.getDetalles());
        nuevaVacante.setFecha(vacanteDTO.getFecha() != null ? vacanteDTO.getFecha() : LocalDate.now());
        nuevaVacante.setCategoria(categoria);
        nuevaVacante.setEmpresa(empresa);

        // Intentar guardar la vacante
        try {
            Vacante guardada = vacanteService.save(nuevaVacante);
            return ResponseEntity.ok(guardada);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar la vacante");
        }
    }

    @GetMapping("/mis-vacantes")
    public ResponseEntity<?> getMisVacantes() {
        // Obtener el email del usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = authentication.getName(); // Obtiene el username (email)

        // Obtener el ID de la empresa asociada al usuario
        Optional<Empresa> empresaOpt = empresaService.findByUsuarioEmail(emailUsuario);

        if (!empresaOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró una empresa asociada al usuario: " + emailUsuario);
        }

        // Obtener las vacantes de la empresa
        List<Vacante> vacantes = vacanteService.findByEmpresa(empresaOpt.get());

        // Convertir entidades a DTOs usando ModelMapper
        List<VacanteDTO> vacantesDTO = vacantes.stream()
                .map(vacante -> modelMapper.map(vacante, VacanteDTO.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(vacantesDTO);
    }

    @PutMapping("/{idVacante}/cancelar")
    public ResponseEntity<?> cancelarVacante(@PathVariable Integer idVacante) {
        try {
            // Verificar si la vacante existe
            Optional<Vacante> vacanteOpt = vacanteService.findById(idVacante);
            if (!vacanteOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vacante no encontrada");
            }

            // Obtener el email del usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String emailUsuario = authentication.getName();

            // Obtener la empresa del usuario
            Optional<Empresa> empresaOpt = empresaService.findByUsuarioEmail(emailUsuario);
            if (!empresaOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para cancelar esta vacante");
            }

            // Verificar que la vacante pertenezca a la empresa del usuario
            Vacante vacante = vacanteOpt.get();
            if (!vacante.getEmpresa().getIdEmpresa().equals(empresaOpt.get().getIdEmpresa())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para cancelar esta vacante");
            }

            // Cambiar el estado de la vacante a CANCELADA en lugar de eliminarla
            vacante.setEstatus(Vacante.Estado.CANCELADA);
            Vacante vacanteCancelada = vacanteService.save(vacante);

            // Devolver la vacante actualizada
            return ResponseEntity.ok(modelMapper.map(vacanteCancelada, VacanteDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al cancelar la vacante");
        }
    }


    @PutMapping("/{idVacante}")
    public ResponseEntity<?> updateVacante(@PathVariable Integer idVacante, @RequestBody VacanteDTO vacanteDTO) {
        // Obtener las entidades relacionadas por sus IDs
        Optional<Empresa> empresaOpt = empresaService.findById(vacanteDTO.getIdEmpresa());
        Optional<Categoria> categoriaOpt = categoriaService.findById(vacanteDTO.getIdCategoria());

        // Verificar si las entidades existen
        if (!empresaOpt.isPresent() || !categoriaOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Empresa o Categoría no válida");
        }

        // Buscar la vacante por su ID
        Optional<Vacante> vacanteOpt = vacanteService.findById(idVacante);
        if (!vacanteOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vacante no encontrada");
        }

        // Obtener la vacante a actualizar
        Vacante vacante = vacanteOpt.get();

        // Asignar las nuevas propiedades de la vacante desde el DTO
        vacante.setNombre(vacanteDTO.getNombre());
        vacante.setDescripcion(vacanteDTO.getDescripcion());
        vacante.setSalario(vacanteDTO.getSalario());
        vacante.setEstatus(vacanteDTO.getEstatus() != null ? vacanteDTO.getEstatus() : vacante.getEstatus());  // Mantener el estado si no se actualiza
        vacante.setDestacado(vacanteDTO.isDestacado());
        vacante.setImagen(vacanteDTO.getImagen());
        vacante.setDetalles(vacanteDTO.getDetalles());
        vacante.setFecha(vacanteDTO.getFecha() != null ? vacanteDTO.getFecha() : vacante.getFecha()); // Mantener la fecha si no se actualiza

        // Asignar las entidades relacionadas (empresa y categoría)
        Empresa empresa = empresaOpt.get();
        Categoria categoria = categoriaOpt.get();
        vacante.setEmpresa(empresa);
        vacante.setCategoria(categoria);

        // Intentar guardar la vacante actualizada
        try {
            Vacante vacanteActualizada = vacanteService.save(vacante);
            return ResponseEntity.ok(vacanteActualizada);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la vacante");
        }
    }


    @DeleteMapping("/{idVacante}")
    public ResponseEntity<Void> deleteVacante(@PathVariable Integer idVacante) {
        vacanteService.deleteById(idVacante);
        return ResponseEntity.noContent().build();
    }


}
