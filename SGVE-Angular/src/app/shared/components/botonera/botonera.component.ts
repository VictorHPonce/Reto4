import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VacanteService } from '../../../core/services/api/vacante.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-botonera',
  imports: [RouterLink, IconComponent],
  templateUrl: './botonera.component.html',
  styleUrl: './botonera.component.css'
})
export class BotoneraComponent {

  vacanteSercice = inject(VacanteService);
  router = inject(Router);

  @Input() idVacante: number;
  @Input() parent: string;

  constructor() { 
    this.idVacante = 0;
    this.parent = '';
  } 

  borrarVacante(idVacante: number): void {
    if (confirm('¿Seguro que deseas eliminar esta vacante?')) {
      this.vacanteSercice.deleteVacante(idVacante).subscribe(() => {
        this.router.navigate([this.parent]);
      });
    }
  }
}
