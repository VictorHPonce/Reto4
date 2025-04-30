package vacantes.sgvespringboot.service;

import vacantes.sgvespringboot.entity.Categoria;

public interface CategoriaService extends GenericService<Categoria, Integer> {

    Categoria updateCategoria(Integer idCategoria, Categoria categoria);
}
