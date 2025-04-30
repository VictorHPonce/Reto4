package vacantes.sgvespringboot.serviceImpl;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import vacantes.sgvespringboot.entity.Categoria;
import vacantes.sgvespringboot.repository.CategoriaRepository;
import vacantes.sgvespringboot.service.CategoriaService;

@Service
public class CategoriaServiceImpl extends GenericServiceImpl<Categoria, Integer> implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaServiceImpl(CategoriaRepository repository, CategoriaRepository categoriaRepository) {
        super(repository);
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public Categoria updateCategoria(Integer idCategoria, Categoria categoria) {
        Categoria existente = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));

        existente.setNombre(categoria.getNombre());
        existente.setDescripcion(categoria.getDescripcion());

        return categoriaRepository.save(existente);
    }


}
