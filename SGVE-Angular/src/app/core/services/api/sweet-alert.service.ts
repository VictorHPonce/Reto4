// sweet-alert.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  // Método para mostrar una alerta de éxito
  showSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message
    });
  }

  // Método para mostrar una alerta de error
  showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }

  // Método para mostrar una alerta de advertencia
  showWarning(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: message
    });
  }

  // Método para mostrar una alerta de información
  showInfo(message: string) {
    Swal.fire({
      icon: 'info',
      title: 'Información',
      text: message
    });
  }

  // Método para mostrar una alerta de confirmación con SweetAlert2
  showConfirmation(message: string): Promise<any> {
    return Swal.fire({
      icon: 'question',
      title: 'Confirmación',
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      return { isConfirmed: result.isConfirmed };
    });
  }
}
