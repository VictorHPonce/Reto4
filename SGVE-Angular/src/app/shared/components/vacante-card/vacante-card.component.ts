import { Component, Input } from '@angular/core';
import { IVacante } from '../../../core/models/vacante.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vacante-card',
  imports: [RouterLink],
  templateUrl: './vacante-card.component.html',
  styleUrl: './vacante-card.component.css'
})
export class VacanteCardComponent {

  @Input() vacante!: IVacante;

  calcularHorasDesde(fechaArray: number[]): { valor: number, unidad: string } {
    const [year, month, day, ...rest] = fechaArray;
    const fechaVacante = new Date(year, month - 1, day, ...rest);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fechaVacante.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 24) {
      return { valor: diffHrs, unidad: "Horas" };
    } else {
      return { valor: Math.floor(diffHrs / 24), unidad: "Días" };
    }
  }
  
}
