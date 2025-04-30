import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VacanteCardComponent } from "../../../../shared/components/vacante-card/vacante-card.component";
import { IVacante } from '../../../../core/models/vacante.model';
import { VacanteService } from '../../../../core/services/api/vacante.service';

@Component({
  selector: 'app-empresa-view',
  imports: [RouterLink, VacanteCardComponent],
  templateUrl: './empresa-view.component.html',
  styleUrl: './empresa-view.component.css'
})
export class EmpresaViewComponent {
  vacantes: IVacante[] = [];

  constructor(private vacanteService: VacanteService, private router: Router) {}

  ngOnInit(): void {
    this.cargarVacantes();
  }

  cargarVacantes(): void {
    this.vacanteService.getVacantes().subscribe((data) => {
      this.vacantes = data;
    });
  }

  editarVacante(id: number): void {
    this.router.navigate(['/empresa/vacantes/editar', id]);
  }

  eliminarVacante(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta vacante?')) {
      this.vacanteService.deleteVacante(id).subscribe(() => {
        this.cargarVacantes();
      });
    }
  }
}
