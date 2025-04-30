package vacantes.sgvespringboot.serviceImpl;


import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vacantes.sgvespringboot.entity.Empresa;
import vacantes.sgvespringboot.entity.Usuario;
import vacantes.sgvespringboot.repository.EmpresaRepository;
import vacantes.sgvespringboot.repository.UsuarioRepository;

import java.util.Collections;

@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;

    public CustomUserDetailsServiceImpl(UsuarioRepository usuarioRepository, EmpresaRepository empresaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + username));

        // Si es una empresa, buscar su ID
        Integer idEmpresa = null;
        if (usuario.getRol() == Usuario.Rol.EMPRESA) {
            Empresa empresa = empresaRepository.findByUsuarioEmail(username).orElse(null);
            if (empresa != null) {
                idEmpresa = empresa.getIdEmpresa();
            }
        }

        return new CustomUserDetails(usuario, idEmpresa);
    }
}