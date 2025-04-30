package vacantes.sgvespringboot.service;

import vacantes.sgvespringboot.dto.EmpresaDTO;
import vacantes.sgvespringboot.entity.Empresa;
import vacantes.sgvespringboot.entity.Usuario;

import java.util.List;
import java.util.Optional;

public interface EmpresaService extends GenericService<Empresa, Integer> {
    Optional<Empresa> findByUsuarioEmail(String email);
    Empresa crearEmpresa(Usuario usuario, Empresa empresa);
}
