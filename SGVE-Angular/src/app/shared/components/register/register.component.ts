import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/api/usuario.service';
import { IUsuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Input({ required: true }) rol!: 'CLIENTE' | 'ADMON';
  @Input() usuario: IUsuario | null = null;
  @Output() guardado = new EventEmitter<void>();

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] && this.usuario) {
      this.registerForm.patchValue({
        nombre: this.usuario.nombre,
        apellidos: this.usuario.apellidos,
        email: this.usuario.email,
        password: ''
      });
      this.registerForm.get('email')?.disable();
      this.registerForm.get('password')?.clearValidators();
      this.registerForm.get('password')?.updateValueAndValidity();
    }
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.getRawValue();

      const usuario: IUsuario = {
        ...formValue,
        rol: this.rol,
        enabled: 1,
        fechaRegistro: new Date().toISOString()
      };

      const request = this.usuario
        ? this.usuarioService.updateUsuario(this.usuario.email, usuario)
        : this.usuarioService.createUsuario(usuario);

      request.subscribe({
        next: () => {
          this.guardado.emit();
          this.registerForm.reset();
        },
        error: err => console.error('Error al guardar usuario', err)
      });
    }
  }

  get esEdicion(): boolean {
    return !!this.usuario;
  }
  
}