package vacantes.sgvespringboot.serviceImpl;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import vacantes.sgvespringboot.service.GenericService;

import java.util.List;
import java.util.Optional;

@Service
public abstract class GenericServiceImpl <T, ID> implements GenericService<T, ID> {

    protected JpaRepository<T, ID> repository;

    public GenericServiceImpl(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }

    @Override
    public List<T> findAll() {
        try {
            return repository.findAll();
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Override
    public Optional<T> findById(ID id) {
        try {
            return repository.findById(id);
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    @Override
    public T save(T entity) {
        try {
            return repository.save(entity);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al guardar entidad: " + entity, e);
        }
    }

    @Override
    public T update(T entity) {
        try {
            if (repository.existsById((ID) entity)) {
                return repository.save(entity);
            }
            throw new RuntimeException("Entidad no encontrada para actualizar: " + entity);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar entidad: " + entity, e);
        }
    }

    @Override
    public boolean deleteById(ID id) {
        try {
            if (repository.existsById(id)) {
                repository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean existsById(ID id) {
        return repository.existsById(id);
    }

}
