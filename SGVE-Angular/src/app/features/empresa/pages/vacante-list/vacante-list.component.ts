import { Component, Input } from '@angular/core';
import { VacanteCardComponent } from '../../../../shared/components/vacante-card/vacante-card.component';
import { IVacante } from '../../../../core/models/vacante.model';
import { VacanteService } from '../../../../core/services/api/vacante.service';
import { Router } from '@angular/router';
import { VacanteFiltroComponent } from "../../../usuario/pages/vacante-filtro/vacante-filtro.component";


@Component({
  selector: 'app-vacante-list',
  imports: [VacanteCardComponent, VacanteFiltroComponent],
  templateUrl: './vacante-list.component.html',
  styleUrl: './vacante-list.component.css'
})
export class VacanteListComponent {
  filtroActual: any = {
    estatus: 'CREADA'
  };
  vacantesOriginales: IVacante[] = [];
  vacantes: IVacante[] = [];

  constructor(private vacanteService: VacanteService, private router: Router) {}

  ngOnInit(): void {
    this.cargarVacantes();
  }

  cargarVacantes(): void {
    this.vacanteService.getVacantes().subscribe((data) => {
      this.vacantesOriginales = data;
      this.aplicarFiltros(this.filtroActual);
    });
  }
  aplicarFiltros(filtro: any): void {
    console.log('Filtros aplicados:', filtro);  // Verifica los valores del filtro
    this.filtroActual = filtro;
  
    this.vacantes = this.vacantesOriginales.filter(v => {
      const coincideEstatus = !filtro.estatus || v.estatus === filtro.estatus;
      const coincideCategoria = !filtro.categoria || v.categoria?.nombre.toLowerCase().includes(filtro.categoria.toLowerCase());
      const coincideEmpresa = !filtro.empresa || v.empresa?.nombreEmpresa.toLowerCase().includes(filtro.empresa.toLowerCase());
      const coincideSalarioMin = filtro.salarioMin == null || v.salario >= filtro.salarioMin;
      const coincideSalarioMax = filtro.salarioMax == null || v.salario <= filtro.salarioMax;
      const coincideContrato = !filtro.contrato || v.detalles?.toLowerCase().includes(filtro.contrato.toLowerCase());
  
      return coincideEstatus && coincideCategoria && coincideSalarioMin && coincideSalarioMax && coincideEmpresa && coincideContrato;
    });
  
    console.log('Vacantes después del filtro:', this.vacantes);  // Verifica las vacantes después de aplicar el filtro
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
