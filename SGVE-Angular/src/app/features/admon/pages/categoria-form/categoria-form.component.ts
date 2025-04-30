import { Component, inject } from '@angular/core';
import { FormBuilder,FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../../../core/services/api/categoria.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/api/auth.service';

@Component({
  selector: 'app-categoria-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.css'
})
export class CategoriaFormComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);

  categoriaForm: FormGroup;
  tipo = 'Insertar';

  constructor() {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    // Verificar si es admin
    if (!this.authService.hasRole('ADMON')) {
      this.mostrarMensajeNoAutorizado();
      return;
    }

    // Verificar si es edición
    this.activatedRoute.params.subscribe(params => {
      if (params['idCategoria']) {
        this.tipo = 'Actualizar';
        this.cargarCategoria(params['idCategoria']);
      }
    });
  }

  private mostrarMensajeNoAutorizado() {
    Swal.fire({
      title: 'Acceso Denegado',
      text: 'No tienes permisos para realizar esta acción',
      icon: 'error'
    }).then(() => this.router.navigate(['/login']));
  }

  private async cargarCategoria(idCategoria: number) {
    try {
      const categoria = await firstValueFrom(this.categoriaService.getCategoriaById(idCategoria));
      this.categoriaForm.patchValue({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar la categoría',
        icon: 'error'
      });
    }
  }

  async guardar() {
    if (this.categoriaForm.invalid) {
      Swal.fire({
        title: 'Formulario Inválido',
        text: 'Por favor completa correctamente los campos',
        icon: 'warning'
      });
      return;
    }
  
    try {
      const categoriaData = this.categoriaForm.value;
  
      if (this.tipo === 'Actualizar') {
        const idCategoria = this.activatedRoute.snapshot.params['idCategoria'];
        await firstValueFrom(this.categoriaService.updateCategoria(idCategoria, categoriaData));
        Swal.fire('¡Éxito!', 'Categoría actualizada correctamente', 'success');
      } else {
        await firstValueFrom(this.categoriaService.createCategoria(categoriaData));
        Swal.fire('¡Éxito!', 'Categoría creada correctamente', 'success');
      }
  
      this.router.navigate(['/admon/categorias']);
    } catch (error) {
      console.error('Error al guardar:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar la categoría',
        icon: 'error'
      });
    }
  }
  
}
