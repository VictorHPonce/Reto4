package vacantes.sgvespringboot.serviceImpl;

import org.springframework.stereotype.Service;
import vacantes.sgvespringboot.entity.Empresa;
import vacantes.sgvespringboot.entity.Vacante;
import vacantes.sgvespringboot.repository.VacanteRepository;
import vacantes.sgvespringboot.service.VacanteService;

import java.util.List;

@Service
public class VacanteServiceImpl extends GenericServiceImpl<Vacante, Integer> implements VacanteService {

    public VacanteServiceImpl(VacanteRepository repository) {
        super(repository);
    }

    @Override
    public List<Vacante> findByEmpresa(Empresa empresa) {
        return ((VacanteRepository) repository).findByEmpresa(empresa);
    }


}
