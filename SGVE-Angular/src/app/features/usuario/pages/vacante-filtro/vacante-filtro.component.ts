import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICategoria } from '../../../../core/models/categoria.model';
import { IEmpresa } from '../../../../core/models/empresa.model';
import { CategoriaService } from '../../../../core/services/api/categoria.service';
import { EmpresaService } from '../../../../core/services/api/empresa.service';

@Component({
  standalone: true,
  selector: 'app-vacante-filtro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vacante-filtro.component.html',
  styleUrl: './vacante-filtro.component.css'
})
export class VacanteFiltroComponent {
  @Output() filtroCambiado = new EventEmitter<any>();

  filtroForm: FormGroup;
  categorias: ICategoria[] = [];
  empresas: IEmpresa[] = [];

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private empresaService: EmpresaService
  ) {
    this.filtroForm = this.fb.group({
      nombre: [''],
      nombreEmpresa: [''],
      contrato: [''],
      salarioMin: [null],
      salarioMax: [null]
    });
  }

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe(cats => this.categorias = cats);
    this.empresaService.getEmpresas().subscribe(emps => this.empresas = emps);
  }

  aplicarFiltro(): void {
    const filtros = this.filtroForm.value;
    this.filtroCambiado.emit(filtros);
  }

  limpiarFiltros(): void {
    this.filtroForm.reset();
    this.aplicarFiltro();
  }
}
