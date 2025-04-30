import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmpresaService } from '../../../../core/services/api/empresa.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { IEmpresa } from '../../../../core/models/empresa.model';
import { AuthService } from '../../../../core/services/api/auth.service';
import { IEmpresaDTO } from '../../../../core/models/iempresa-dto';

@Component({
  selector: 'app-form-empresa-admon',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './form-empresa-admon.component.html',
  styleUrl: './form-empresa-admon.component.css'
})
export class FormEmpresaAdmonComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private empresaService = inject(EmpresaService);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);

  empresaForm: FormGroup;
  tipo: 'Insertar' | 'Actualizar' = 'Insertar';

  constructor() {
    // Creamos el formulario reactivo
    this.empresaForm = this.fb.group({
      cif: ['', Validators.required],
      nombreEmpresa: ['', Validators.required],
      direccionFiscal: ['', Validators.required],
      pais: ['', Validators.required],
      usuario: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required]
      })
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
      if (params['idEmpresa']) {
        this.tipo = 'Actualizar';
        this.cargarEmpresa(params['idEmpresa']);
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

  private async cargarEmpresa(idEmpresa: number) {
    try {
      const empresa = await firstValueFrom(this.empresaService.getEmpresaById(idEmpresa));
      this.empresaForm.patchValue({
        cif: empresa.cif,
        nombreEmpresa: empresa.nombreEmpresa,
        direccionFiscal: empresa.direccionFiscal,
        pais: empresa.pais,
        usuario: {
          email: empresa.usuario.email,
          nombre: empresa.usuario.nombre,
          apellidos: empresa.usuario.apellidos
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar la empresa',
        icon: 'error'
      });
    }
  }

  async guardar() {
    if (this.empresaForm.invalid) {
      Swal.fire({
        title: 'Formulario Inválido',
        text: 'Por favor completa correctamente los campos',
        icon: 'warning'
      });
      return;
    }

    try {
      const empresaDTO: IEmpresaDTO = this.empresaForm.value;
      // Asegurarse de que los datos del usuario sean correctos
      empresaDTO.usuario.password = empresaDTO.usuario.password || '1234';
      empresaDTO.usuario.rol = 'EMPRESA';
      empresaDTO.usuario.enabled = 1;
      empresaDTO.usuario.fechaRegistro = new Date().toISOString();

      if (this.tipo === 'Actualizar') {
        const idEmpresa = this.activatedRoute.snapshot.params['idEmpresa'];
        await firstValueFrom(this.empresaService.updateEmpresa(idEmpresa, empresaDTO));
        Swal.fire('¡Éxito!', 'Empresa actualizada correctamente', 'success');
      } else {
        await firstValueFrom(this.empresaService.createEmpresa(empresaDTO));
        Swal.fire('¡Éxito!', 'Empresa creada correctamente', 'success');
      }

      this.router.navigate(['/admon/empresas']);
    } catch (error) {
      console.error('Error al guardar:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar la empresa',
        icon: 'error'
      });
    }
  }
  
}
