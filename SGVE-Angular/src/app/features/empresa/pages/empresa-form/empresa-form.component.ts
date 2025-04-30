import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VacanteService } from '../../../../core/services/api/vacante.service';
import { IVacante } from '../../../../core/models/vacante.model';
import { EmpresaService } from '../../../../core/services/api/empresa.service';
import { CategoriaService } from '../../../../core/services/api/categoria.service';
import { IEmpresa } from '../../../../core/models/empresa.model';
import { ICategoria } from '../../../../core/models/categoria.model';
import { AuthService } from '../../../../core/services/api/auth.service';
import { UsuarioService } from '../../../../core/services/api/usuario.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { catchError, finalize, firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-empresa-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './empresa-form.component.html',
  styleUrl: './empresa-form.component.css'
})
export class EmpresaFormComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private categoriaService = inject(CategoriaService);
  private empresaService = inject(EmpresaService);
  private vacanteService = inject(VacanteService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);
  public authService = inject(AuthService);

  // Propiedades
  vacanteForm!: FormGroup;
  categorias: ICategoria[] = [];
  empresas: IEmpresa[] = [];
  isEdit = false;
  vacanteId: number | null = null;
  errorMessage: string | null = '';
  showEmpresaSelector = false;
  isLoading = false;

  ngOnInit(): void {
    this.initForm();
    this.loadCategorias();

    // Verificar rol de usuario
    const userRole = localStorage.getItem('userRole');
    this.showEmpresaSelector = userRole === 'ADMON';

    if (this.showEmpresaSelector) {
      this.loadEmpresas();
    }

    // Verificar si es edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.vacanteId = +params['id'];
        this.cargarVacante(+params['id']);
      } else if (!this.showEmpresaSelector) {
        this.setEmpresaIdFromAuthUser();
      }
    });
  }

  initForm(): void {
    this.vacanteForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      salario: [0, [Validators.required, Validators.min(0)]],
      destacado: [false],
      imagen: [''],
      detalles: [''],
      idEmpresa: [null, Validators.required],
      idCategoria: [null, Validators.required],
      estado: ['CREADA']
    });
  }

  // Método al estilo del componente que funciona
  async cargarVacante(idVacante: number) {
    try {
      this.isLoading = true;
      this.errorMessage = null;
      
      const vacante = await firstValueFrom(this.vacanteService.getVacanteById(idVacante));
      
      if (vacante) {
        this.vacanteForm.patchValue({
          nombre: vacante.nombre || '',
          descripcion: vacante.descripcion || '',
          salario: vacante.salario || 0,
          destacado: vacante.destacado || false,
          imagen: vacante.imagen || '',
          detalles: vacante.detalles || '',
          idCategoria: vacante.categoria?.idCategoria || null,
          idEmpresa: vacante.empresa?.idEmpresa || null,
          estado: vacante.estatus || 'CREADA'
        });
      } else {
        this.errorMessage = 'No se pudo cargar la información de la vacante';
      }
    } catch (error) {
      console.error('Error al cargar la vacante:', error);
      this.errorMessage = 'No se pudo cargar la vacante para editar';
      
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar la información de la vacante',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.router.navigate(['/empresa/vacantes']);
      });
    } finally {
      this.isLoading = false;
    }
  }

  async loadCategorias(): Promise<void> {
    try {
      this.categorias = await firstValueFrom(this.categoriaService.getCategorias());
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      this.errorMessage = 'Error al cargar categorías';
    }
  }

  async loadEmpresas(): Promise<void> {
    try {
      this.empresas = await firstValueFrom(this.empresaService.getEmpresas());
    } catch (err) {
      console.error('Error al cargar empresas:', err);
      this.errorMessage = 'Error al cargar empresas';
    }
  }

  async setEmpresaIdFromAuthUser(): Promise<void> {
    try {
      const res = await firstValueFrom(this.usuarioService.getEmpresaId());
      if (res && res.idEmpresa) {
        this.vacanteForm.patchValue({ idEmpresa: res.idEmpresa });
      } else {
        this.errorMessage = 'No se encontró el idEmpresa en la respuesta';
      }
    } catch (err) {
      console.error('Error al obtener empresa del usuario:', err);
      this.errorMessage = 'Error al obtener empresa del usuario';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.vacanteForm.invalid) {
      Object.keys(this.vacanteForm.controls).forEach(key => {
        this.vacanteForm.get(key)?.markAsTouched();
      });
      
      this.errorMessage = 'Por favor completa todos los campos requeridos.';
      
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos obligatorios',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      
      return;
    }

    const formData = this.vacanteForm.value;

    if (!formData.idEmpresa) {
      this.errorMessage = 'No se ha asignado la empresa al formulario.';
      return;
    }

    try {
      this.isLoading = true;
      
      if (this.isEdit && this.vacanteId) {
        // Actualizar vacante existente
        await firstValueFrom(this.vacanteService.updateVacante(this.vacanteId, formData));
        
        Swal.fire({
          icon: 'success',
          title: 'Vacante actualizada',
          text: 'La vacante se ha actualizado exitosamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/empresa/vacantes']);
        });
      } else {
        // Crear nueva vacante
        await firstValueFrom(this.vacanteService.createVacante(formData));
        
        Swal.fire({
          icon: 'success',
          title: 'Vacante creada',
          text: 'La vacante se ha creado exitosamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/empresa/vacantes']);
        });
      }
    } catch (error) {
      console.error('Error al guardar/actualizar vacante:', error);
      this.errorMessage = this.isEdit ? 'Error al actualizar la vacante.' : 'Error al guardar la vacante.';
      
      let mensajeError = 'No se pudo crear la vacante.';
      if (this.isEdit) {
        mensajeError = 'No se pudo actualizar la vacante.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensajeError,
        confirmButtonText: 'Aceptar'
      });
    } finally {
      this.isLoading = false;
    }
  }
}