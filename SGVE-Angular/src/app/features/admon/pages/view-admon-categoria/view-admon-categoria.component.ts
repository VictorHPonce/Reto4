import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ICategoria } from '../../../../core/models/categoria.model';
import { CategoriaService } from '../../../../core/services/api/categoria.service';
import { AuthService } from '../../../../core/services/api/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-admon-categoria',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './view-admon-categoria.component.html',
  styleUrl: './view-admon-categoria.component.css'
})
export class ViewAdmonCategoriaComponent {
  private categoriaService = inject(CategoriaService);
  private authService = inject(AuthService);

  categorias: ICategoria[] = [];
  isAdmin: boolean = false;

  ngOnInit(): void {
    // Check if user is admin
    this.isAdmin = this.authService.hasRole('ADMON');

    // Load categories
    this.loadCategorias();
  }

  loadCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data: ICategoria[]) => {
        this.categorias = data;
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las categorías',
          icon: 'error'
        });
        console.error('Error al cargar categorías', error);
      }
    });
  }


  eliminarCategoria(idCategoria: number) {
    // Confirm deletion
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.deleteCategoria(idCategoria).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'La categoría ha sido eliminada',
              icon: 'success'
            });
            // Refresh the list
            this.loadCategorias();
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la categoría',
              icon: 'error'
            });
            console.error('Error al eliminar categoría', error);
          }
        });
      }
    });
  }
}
