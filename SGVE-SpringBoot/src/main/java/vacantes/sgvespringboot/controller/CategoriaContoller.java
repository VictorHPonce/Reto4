package vacantes.sgvespringboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vacantes.sgvespringboot.entity.Categoria;
import vacantes.sgvespringboot.service.CategoriaService;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaContoller {

    private final CategoriaService categoriaService;

    public CategoriaContoller(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }


    @GetMapping
    public ResponseEntity<List<Categoria>> getAllCategorias() {
        List<Categoria> categorias = categoriaService.findAll();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{idCategoria}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable Integer idCategoria) {
        return categoriaService.findById(idCategoria)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Categoria> createCategoria(@RequestBody Categoria categoria) {
        Categoria savedCategoria = categoriaService.save(categoria);
        return ResponseEntity.status(201).body(savedCategoria);
    }

    @PutMapping("/{idCategoria}")
    public ResponseEntity<Categoria> actualizarCategoria(@PathVariable Integer idCategoria, @RequestBody Categoria categoria) {
        return ResponseEntity.ok(categoriaService.updateCategoria(idCategoria, categoria));
    }

    @DeleteMapping("/{idCategoria}")
    public ResponseEntity<Void> deleteCategoria(@PathVariable Integer idCategoria) {
        categoriaService.deleteById(idCategoria);
        return ResponseEntity.noContent().build();
    }

}
