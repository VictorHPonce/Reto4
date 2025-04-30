package vacantes.sgvespringboot.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vacantes.sgvespringboot.dto.UsuarioDTO;
import vacantes.sgvespringboot.entity.Empresa;
import vacantes.sgvespringboot.entity.Usuario;
import vacantes.sgvespringboot.service.EmpresaService;
import vacantes.sgvespringboot.service.UsuarioService;

import java.util.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmpresaService empresaService;

    public UsuarioController(UsuarioService usuarioService, ModelMapper modelMapper, PasswordEncoder passwordEncoder, EmpresaService empresaService) {
        this.usuarioService = usuarioService;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.empresaService = empresaService;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/por-email/{email}")
    public ResponseEntity<Map<String, Integer>> getEmpresaIdByEmail(@PathVariable String email) {
        Optional<Empresa> empresaOpt = empresaService.findByUsuarioEmail(email);
        if (empresaOpt.isPresent()) {
            Map<String, Integer> response = new HashMap<>();
            response.put("idEmpresa", empresaOpt.get().getIdEmpresa());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/{email}")
    public ResponseEntity<UsuarioDTO> getUsuarioByEmail(@PathVariable String email) {
        Usuario usuario = usuarioService.findByEmail(email);
        if (usuario != null) {
            UsuarioDTO usuarioDTO = modelMapper.map(usuario, UsuarioDTO.class);
            return ResponseEntity.ok(usuarioDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        // Crear un nuevo objeto Usuario basado en el DTO
        Usuario usuario = new Usuario();

        // Mapear el DTO a la entidad Usuario
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellidos(usuarioDTO.getApellidos());

        // Hashear la contraseña antes de guardarla
        String hashedPassword = passwordEncoder.encode(usuarioDTO.getPassword());
        usuario.setPassword(hashedPassword);
        // Asegurando valor predeterminado de enabled
        usuario.setFechaRegistro(new Date());

        // Establecer el rol por defecto
//        usuario.setRol(Usuario.Rol.valueOf("CLIENTE"));
        usuario.setRol(usuarioDTO.getRol() != null ? usuarioDTO.getRol() : Usuario.Rol.CLIENTE);;

        // Guardar el usuario en la base de datos
        Usuario savedUsuario = usuarioService.save(usuario);

        // Mapear el usuario guardado a DTO para devolverlo
        UsuarioDTO savedUsuarioDTO = modelMapper.map(savedUsuario, UsuarioDTO.class);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedUsuarioDTO);
    }


    @PatchMapping("/{email}/enable")
    public ResponseEntity<?> updateEnabled(@PathVariable String email, @RequestBody Map<String, Integer> payload) {
        int enabled = payload.get("enabled");
        // System.out.println("Email: " + email + " nuevo estado: " + enabled);
        usuarioService.updateEnabled(email, enabled);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{email}")
    public ResponseEntity<UsuarioDTO> updateUsuario(@PathVariable String email, @RequestBody UsuarioDTO usuarioDTO) {
        Usuario usuarioExistente = usuarioService.findByEmail(email);

        if (usuarioExistente == null) {
            return ResponseEntity.notFound().build();
        }

        usuarioExistente.setNombre(usuarioDTO.getNombre());
        usuarioExistente.setApellidos(usuarioDTO.getApellidos());

        if (usuarioDTO.getPassword() != null && !usuarioDTO.getPassword().isBlank()) {
            String hashedPassword = passwordEncoder.encode(usuarioDTO.getPassword());
            usuarioExistente.setPassword(hashedPassword);
        }

        usuarioExistente.setRol(usuarioDTO.getRol());
        usuarioExistente.setEnabled(usuarioDTO.getEnabled());

        Usuario updatedUsuario = usuarioService.save(usuarioExistente);
        UsuarioDTO updatedUsuarioDTO = modelMapper.map(updatedUsuario, UsuarioDTO.class);

        return ResponseEntity.ok(updatedUsuarioDTO);
    }




}
