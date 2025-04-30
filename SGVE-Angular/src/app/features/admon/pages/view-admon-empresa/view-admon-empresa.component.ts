import { Component, inject } from '@angular/core';
import { EmpresaService } from '../../../../core/services/api/empresa.service';
import { AuthService } from '../../../../core/services/api/auth.service';
import { IEmpresa } from '../../../../core/models/empresa.model';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-admon-empresa',
  imports: [RouterLink],
  templateUrl: './view-admon-empresa.component.html',
  styleUrl: './view-admon-empresa.component.css'
})
export class ViewAdmonEmpresaComponent {
  private empresaService = inject(EmpresaService);
  private authService = inject(AuthService);

  empresas: IEmpresa[] = [];
  isAdmin: boolean = false;

  ngOnInit() {
    this.isAdmin = this.authService.hasRole('ADMON');
    this.cargarEmpresas();
  }

  cargarEmpresas() {
    this.empresaService.getEmpresas().subscribe({
      next: (data) => this.empresas = data,
      error: (err) => {
        console.error('Error al cargar empresas', err);
        Swal.fire('Error', 'No se pudieron cargar las empresas', 'error');
      }
    });
  }

  eliminarEmpresa(idEmpresa: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la empresa de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empresaService.deleteEmpresa(idEmpresa).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La empresa ha sido eliminada', 'success');
            this.cargarEmpresas();
          },
          error: (err) => {
            console.error('Error al eliminar empresa', err);
            Swal.fire('Error', 'No se pudo eliminar la empresa', 'error');
          }
        });
      }
    });
  }
}
