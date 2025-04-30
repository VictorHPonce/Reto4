import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmpresaService } from '../../../../core/services/api/empresa.service';
import { firstValueFrom } from 'rxjs';
import { IEmpresa } from '../../../../core/models/empresa.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empresa-detalle',
  imports: [RouterLink, CommonModule],
  templateUrl: './empresa-detalle.component.html',
  styleUrl: './empresa-detalle.component.css'
})
export class EmpresaDetalleComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private empresaService = inject(EmpresaService);

  empresa?: IEmpresa;

  async ngOnInit() {
    const id = this.route.snapshot.params['idEmpresa'];
    try {
      this.empresa = await firstValueFrom(this.empresaService.getEmpresaById(id));
    } catch (error) {
      console.error('Error al cargar empresa:', error);
      this.router.navigate(['/admon/empresas']);
    }
  }

}
