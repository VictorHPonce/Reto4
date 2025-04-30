import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../../core/services/api/usuario.service';
import { IUsuario } from '../../../../core/models/usuario.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-usuarios-admon',
  imports: [CommonModule],
  templateUrl: './gestion-usuarios-admon.component.html',
  styleUrl: './gestion-usuarios-admon.component.css'
})
export class GestionUsuariosAdmonComponent {
  private usuarioService = inject(UsuarioService);
  usuarios: IUsuario[] = [];

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuario().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => {
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        console.error(err);
      },
    });
  }

  deshabilitarUsuario(email: string) {
    Swal.fire({
      title: '¿Deshabilitar usuario?',
      text: 'Esto lo dejará sin acceso al sistema',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, deshabilitar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.updateUsuarioEnable(email, 0).subscribe({
          next: () => {
            Swal.fire('Usuario deshabilitado', '', 'success');
            this.cargarUsuarios();
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo deshabilitar el usuario', 'error');
            console.error(err);
          },
        });
      }
    });
  }
  

  toggleUsuarioEstado(usuario: IUsuario) {
    const nuevoEstado = usuario.enabled === 1 ? 0 : 1;
  
    Swal.fire({
      title: `${nuevoEstado ? '¿Habilitar' : '¿Deshabilitar'} usuario?`,
      text: nuevoEstado
        ? 'El usuario podrá acceder al sistema nuevamente'
        : 'Esto lo dejará sin acceso al sistema',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: nuevoEstado ? 'Sí, habilitar' : 'Sí, deshabilitar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.updateUsuarioEnable(usuario.email, nuevoEstado).subscribe({
          next: () => {
            Swal.fire(
              nuevoEstado ? 'Usuario habilitado' : 'Usuario deshabilitado',
              '',
              'success'
            );
            this.cargarUsuarios();
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
            console.error(err);
          },
        });
      }
    });
  }
  
}
