package vacantes.sgvespringboot.service;

import vacantes.sgvespringboot.dto.VacanteDTO;
import vacantes.sgvespringboot.entity.Empresa;
import vacantes.sgvespringboot.entity.Vacante;

import java.util.List;

public interface VacanteService extends GenericService<Vacante, Integer> {

    List<Vacante> findByEmpresa(Empresa empresa);
}
