import { Component, inject, signal } from '@angular/core';
import { IVacante } from '../../../../core/models/vacante.model';
import { VacanteService } from '../../../../core/services/api/vacante.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/api/auth.service';

@Component({
  selector: 'app-vacantes-empresa',
  imports: [CommonModule, RouterLink],
  templateUrl: './vacantes-empresa.component.html',
  styleUrl: './vacantes-empresa.component.css'
})
export class VacantesEmpresaComponent {
  // Inyección de servicios
  private vacanteService = inject(VacanteService);
  private router = inject(Router);

  // Estado con signal
  vacantes = signal<IVacante[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.cargarMisVacantes();
  }

  cargarMisVacantes(): void {
    this.loading.set(true);
    
    this.vacanteService.getMisVacantes().subscribe({
      next: (data) => {
        // Usar el signal para actualizar los datos
        this.vacantes.set(data);
        this.loading.set(false);
        console.log('Vacantes cargadas:', this.vacantes());
      },
      error: (error) => {
        console.error('Error al cargar vacantes:', error);
        this.loading.set(false);
        
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las vacantes',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  cancelarVacante(idVacante: number): void {
    Swal.fire({
      title: '¿Cancelar vacante?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.set(true);
        
        this.vacanteService.cancelarVacante(idVacante).subscribe({
          next: () => {
            // Actualizar el estado de la vacante en el array usando signal
            this.vacantes.update(vacantes => 
              vacantes.map(v => 
                v.idVacante === idVacante 
                  ? { ...v, estatus: 'CANCELADA' } 
                  : v
              )
            );
            
            this.loading.set(false);
            
            Swal.fire('Cancelada', 'La vacante ha sido cancelada.', 'success');
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo cancelar la vacante.', 'error');
            console.error('Error al cancelar vacante:', error);
            this.loading.set(false);
          }
        });
      }
    });
  }

  editarVacante(idVacante: number): void {
    this.router.navigate(['/empresa/vacantes/', idVacante]);
  }
  
  // Función para manejar errores en imágenes
  handleImageError(event: any): void {
    event.target.src = 'https://webescuela.com/wp-content/uploads/2020/08/desarrollador-web.png.webp'; // Imagen por defecto
  }
  
  // Función para verificar si un campo existe y es seguro acceder a él
  isSafe(obj: any, path: string): boolean {
    if (!obj) return false;
    
    const props = path.split('.');
    let current = obj;
    
    for (const prop of props) {
      if (current[prop] === undefined || current[prop] === null) {
        return false;
      }
      current = current[prop];
    }
    
    return true;
  }
  
  }
