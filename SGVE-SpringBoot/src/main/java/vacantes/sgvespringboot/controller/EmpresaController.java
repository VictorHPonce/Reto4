package vacantes.sgvespringboot.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vacantes.sgvespringboot.dto.EmpresaDTO;
import vacantes.sgvespringboot.entity.Empresa;
import vacantes.sgvespringboot.entity.Usuario;
import vacantes.sgvespringboot.service.EmpresaService;
import vacantes.sgvespringboot.service.UsuarioService;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;
    private final ModelMapper modelMapper;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;


    public EmpresaController(EmpresaService empresaService, ModelMapper modelMapper, UsuarioService usuarioService, PasswordEncoder passwordEncoder) {
        this.empresaService = empresaService;
        this.modelMapper = modelMapper;
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<EmpresaDTO> listarEmpresas() {
        return empresaService.findAll().stream()
                .map(empresa -> {
                    EmpresaDTO dto = modelMapper.map(empresa, EmpresaDTO.class);
                    dto.setUsuario(modelMapper.map(empresa.getUsuario(), Usuario.class));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/{idEmpresa}")
    public ResponseEntity<EmpresaDTO> obtenerEmpresa(@PathVariable Integer idEmpresa) {
        return empresaService.findById(idEmpresa)
                .map(empresa -> {
                    EmpresaDTO dto = modelMapper.map(empresa, EmpresaDTO.class);
                    dto.setUsuario(modelMapper.map(empresa.getUsuario(), Usuario.class));
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EmpresaDTO> crearEmpresa(@RequestBody EmpresaDTO dto) {
        Usuario usuario = dto.getUsuario();

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        usuario.setFechaRegistro(new Date());
        usuario.setRol(Usuario.Rol.EMPRESA);
        usuario.setEnabled(1);
        usuarioService.save(usuario);

        Empresa empresa = modelMapper.map(dto, Empresa.class);
        empresa.setUsuario(usuario);

        Empresa guardada = empresaService.save(empresa);

        EmpresaDTO respuesta = modelMapper.map(guardada, EmpresaDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @PutMapping("/{idEmpresa}")
    public ResponseEntity<EmpresaDTO> actualizarEmpresa(@PathVariable Integer idEmpresa, @RequestBody EmpresaDTO dto) {
        Optional<Empresa> optionalEmpresa = empresaService.findById(idEmpresa);

        if (optionalEmpresa.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Empresa empresaExistente = optionalEmpresa.get();

        // Actualizamos datos de empresa
        empresaExistente.setCif(dto.getCif());
        empresaExistente.setNombreEmpresa(dto.getNombreEmpresa());
        empresaExistente.setDireccionFiscal(dto.getDireccionFiscal());
        empresaExistente.setPais(dto.getPais());

        // Actualizamos datos del usuario
        Usuario usuarioExistente = empresaExistente.getUsuario();
        Usuario usuarioDTO = dto.getUsuario();

        usuarioExistente.setEmail(usuarioDTO.getEmail());
        usuarioExistente.setNombre(usuarioDTO.getNombre());
        usuarioExistente.setApellidos(usuarioDTO.getApellidos());
        // No actualizamos contraseña ni rol por seguridad

        usuarioService.save(usuarioExistente);

        empresaExistente.setUsuario(usuarioExistente);
        Empresa actualizada = empresaService.save(empresaExistente);

        EmpresaDTO respuesta = modelMapper.map(actualizada, EmpresaDTO.class);
        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{idEmpresa}")
    public ResponseEntity<Void> eliminarEmpresa(@PathVariable Integer idEmpresa) {
        Optional<Empresa> optionalEmpresa = empresaService.findById(idEmpresa);

        if (optionalEmpresa.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Se obtiene la empresa directamente desde el Optional
        Empresa empresa = optionalEmpresa.get();

        // Se pasa solo el ID de la empresa para eliminarla
        empresaService.deleteById(idEmpresa);

        return ResponseEntity.noContent().build(); // No hay contenido que devolver tras la eliminación
    }


}
