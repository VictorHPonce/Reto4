package vacantes.sgvespringboot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vacantes.sgvespringboot.dto.AuthRequest;
import vacantes.sgvespringboot.dto.AuthResponse;
import vacantes.sgvespringboot.entity.Usuario;
import vacantes.sgvespringboot.security.jwt.JwtService;
import vacantes.sgvespringboot.service.UsuarioService;
import vacantes.sgvespringboot.serviceImpl.CustomUserDetails;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioService usuarioService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, PasswordEncoder passwordEncoder, UsuarioService usuarioService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Usuario usuario) {
        // Verificar si el usuario ya existe
        if (usuarioService.existsById(usuario.getEmail())) {
            return ResponseEntity.badRequest().body("El usuario ya existe");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setEnabled(1);
        usuario.setFechaRegistro(new Date());

        // Guardar el nuevo usuario
        usuarioService.save(usuario);
        return ResponseEntity.ok("Usuario registrado con éxito");
    }

//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
//        );
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//
//        // Crear el mapa de claims adicionales
//        Map<String, Object> extraClaims = new HashMap<>();
//
//        // Agregar el rol del usuario como claim
//        extraClaims.put("rol", userDetails.getRol().name());
//
//        // Agregar ID de empresa si existe
//        if (userDetails.getIdEmpresa() != null) {
//            extraClaims.put("idEmpresa", userDetails.getIdEmpresa());
//        }
//
//        String token = jwtService.generateToken(userDetails, extraClaims);
//
//        AuthResponse response = new AuthResponse();
//        response.setToken(token);
//        response.setType("Bearer");
//
//        return ResponseEntity.ok(response);
//    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Mapa de claims adicionales
            Map<String, Object> extraClaims = new HashMap<>();

            // Obtener el objeto principal
            Object principal = authentication.getPrincipal();

            // Verificar el tipo de UserDetails que estamos recibiendo
            if (principal instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) principal;
                extraClaims.put("rol", userDetails.getRol().name());

                if (userDetails.getIdEmpresa() != null) {
                    extraClaims.put("idEmpresa", userDetails.getIdEmpresa());
                }
            } else if (principal instanceof UserDetails) {
                // Si es otro tipo de UserDetails, intentar obtener el rol de las autoridades
                UserDetails userDetails = (UserDetails) principal;
                if (!userDetails.getAuthorities().isEmpty()) {
                    String authority = userDetails.getAuthorities().iterator().next().getAuthority();
                    // Si el rol tiene prefijo "ROLE_", quitarlo
                    if (authority.startsWith("ROLE_")) {
                        authority = authority.substring(5);
                    }
                    extraClaims.put("rol", authority);
                }

                // Para el ID de empresa, podríamos consultar la base de datos
                // o simplemente no incluirlo si no está disponible
            }

            // Generar el token con los claims disponibles
            String token = jwtService.generateToken((UserDetails) principal, extraClaims);

            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setType("Bearer");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Para debugging
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


}
