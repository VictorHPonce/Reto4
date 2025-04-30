import { Component, inject, signal } from '@angular/core';
import { RegisterComponent } from "../../../../shared/components/register/register.component";
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../core/services/api/usuario.service';
import { IUsuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-gestion-usuario',
  imports: [RegisterComponent, CommonModule],
  templateUrl: './gestion-usuario.component.html',
  styleUrl: './gestion-usuario.component.css'
})
export class GestionUsuarioComponent {
  private usuarioService = inject(UsuarioService);

  administradores = signal<IUsuario[]>([]);
  adminEditando = signal<IUsuario | null>(null);  // Mantener el administrador editando

  ngOnInit() {
    this.cargarAdministradores();
  }

  cargarAdministradores(): void {
    this.usuarioService.getUsuario().subscribe(usuarios => {
      const administradores = usuarios.filter(u => u.rol === 'ADMON');
      this.administradores.set(administradores);  // Esto actualizará la vista
    });
  }

  // Esta función establece el administrador que estamos editando
  onEditar(admin: IUsuario): void {
    this.adminEditando.set(admin);
  }

  onUsuarioGuardado(): void {
    this.adminEditando.set(null); // Vuelves al modo de crear
    this.cargarAdministradores(); // Recargas la lista de administradores
  }

  toggleEstado(admin: IUsuario): void {
    const nuevoEstado = admin.enabled ? 0 : 1;
    this.usuarioService.updateUsuarioEnable(admin.email, nuevoEstado).subscribe(() => {
      this.cargarAdministradores(); // Recarga la lista después de cambiar el estado
    });
  }
}
