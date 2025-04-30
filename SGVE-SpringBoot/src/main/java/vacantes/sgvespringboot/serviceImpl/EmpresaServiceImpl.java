package vacantes.sgvespringboot.serviceImpl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import vacantes.sgvespringboot.entity.Empresa;
import vacantes.sgvespringboot.entity.Usuario;
import vacantes.sgvespringboot.repository.EmpresaRepository;
import vacantes.sgvespringboot.repository.UsuarioRepository;
import vacantes.sgvespringboot.service.EmpresaService;

import java.util.Optional;


@Service
public class EmpresaServiceImpl extends GenericServiceImpl<Empresa, Integer> implements EmpresaService {

    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final ModelMapper modelMapper;

    public EmpresaServiceImpl(EmpresaRepository repository, UsuarioRepository usuarioRepository, EmpresaRepository empresaRepository, ModelMapper modelMapper) {
        super(repository);
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.modelMapper = modelMapper;
    }


    @Override
    public Optional<Empresa> findByUsuarioEmail(String email) {
        return ((EmpresaRepository) repository).findByUsuarioEmail(email);
    }

    @Override
    public Empresa crearEmpresa(Usuario usuario, Empresa empresa) {
        usuarioRepository.save(usuario);
        return empresaRepository.save(empresa);
    }

}
