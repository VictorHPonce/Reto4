import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/api/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Verificar si el usuario ya está autenticado
    if (this.authService.isLoggedIn()) {
      this.redirectUserBasedOnRole();
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.redirectUserBasedOnRole();
      },
      error: (error) => {
        this.loading = false;
        
        // Mensajes de error más descriptivos basados en el error del servidor
        if (error.status === 401) {
          this.errorMessage = 'Email o contraseña incorrectos';
        } else if (error.status === 0) {
          this.errorMessage = 'Error de conexión con el servidor';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Por favor intente nuevamente.';
        }
        
        console.error('Error al iniciar sesión:', error);
      }
    });
  }

  /**
   * Redirecciona al usuario basado en su rol
   */
  private redirectUserBasedOnRole(): void {
    const user = this.authService.getCurrentUser();

    switch (user?.rol) {
      case 'ADMON': 
        this.router.navigate(['/admon/empresas']); 
        break;
      case 'EMPRESA': 
        this.router.navigate(['/empresa/vacantes']);
        break;
      case 'CLIENTE': 
        this.router.navigate(['/vacantes']); 
        break;
      default: 
        this.router.navigate(['/login']);
    }
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  testDirectLogin() {
    if (this.loginForm.invalid) return;
    
    const data = { 
      email: this.loginForm.value.email, 
      password: this.loginForm.value.password 
    };
    
    console.log('Intentando login directo con:', data);
    
    this.http.post('https://urbanink.es/api/auth/login', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .subscribe({
      next: response => console.log('Login directo exitoso:', response),
      error: error => console.error('Error en login directo:', error)
    });
  }
}
