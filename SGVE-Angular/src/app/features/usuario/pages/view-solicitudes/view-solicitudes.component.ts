import { Component } from '@angular/core';
import { SolicitudService } from '../../../../core/services/api/solicitud.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ISolicitud } from '../../../../core/models/solicitud.model';
import { AuthService } from '../../../../core/services/api/auth.service';
import { SweetAlertService } from '../../../../core/services/api/sweet-alert.service';

@Component({
  selector: 'app-view-solicitudes',
  imports: [CommonModule, RouterLink],
  templateUrl: './view-solicitudes.component.html',
  styleUrl: './view-solicitudes.component.css'
})
export class ViewSolicitudesComponent {
  solicitudes: ISolicitud[] = [];

  constructor(
    private solicitudService: SolicitudService,
    private authService: AuthService,
    private sweetAlertService: SweetAlertService // Inyectar SweetAlertService
  ) {}

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes(): void {
    this.solicitudService.getSolicitudes().subscribe({
      next: (data) => {
        const email = this.authService.getCurrentEmail(); // Obtener el email del usuario logueado
        if (email) {
          this.solicitudes = data.filter(solicitud => solicitud.usuario.email === email); // Filtrar solicitudes por email
        }
      },
      error: (err) => {
        console.error('Error al obtener solicitudes', err);
      }
    });
  }

  eliminarSolicitud(idSolicitud: number): void {
    // Mostrar alerta de confirmación antes de eliminar
    this.sweetAlertService.showConfirmation('¿Estás seguro de que quieres eliminar esta solicitud?').then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para eliminar la solicitud si el usuario confirma
        this.solicitudService.deleteSolicitud(idSolicitud).subscribe({
          next: () => {
            // Eliminar la solicitud del arreglo localmente para que la UI se actualice
            this.solicitudes = this.solicitudes.filter(solicitud => solicitud.idSolicitud !== idSolicitud);
            this.sweetAlertService.showSuccess('Solicitud eliminada con éxito');
          },
          error: (err) => {
            console.error('Error al eliminar la solicitud', err);
            this.sweetAlertService.showError('Hubo un error al eliminar la solicitud');
          }
        });
      }
    });
  }
}
