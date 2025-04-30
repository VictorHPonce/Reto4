import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudService } from '../../../../core/services/api/solicitud.service';
import { AuthService } from '../../../../core/services/api/auth.service';
import { IVacante } from '../../../../core/models/vacante.model';
import { VacanteService } from '../../../../core/services/api/vacante.service';
import Swal from 'sweetalert2';
import { SweetAlertService } from '../../../../core/services/api/sweet-alert.service';
import { ISolicitudDTO } from '../../../../core/models/isolicitud-dto';

@Component({
  selector: 'app-postulacion-form',
  imports: [ReactiveFormsModule],
  templateUrl: './postulacion-form.component.html',
  styleUrl: './postulacion-form.component.css'
})
export class PostulacionFormComponent {
  form!: FormGroup;
  vacante!: IVacante;
  pdfBase64: string = '';
  solicitudId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private vacanteService: VacanteService,
    private solicitudService: SolicitudService,
    private authService: AuthService,
    private router: Router,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      comentarios: ['', Validators.required],
      archivo: ['', Validators.required]
    });

    const idSolicitud = this.route.snapshot.paramMap.get('idSolicitud');
    const idVacante = this.route.snapshot.paramMap.get('id');

// Al obtener la solicitud con el ID en la URL
if (idSolicitud) {
  this.solicitudId = +idSolicitud;
  this.solicitudService.getSolicitudById(this.solicitudId).subscribe({
    next: (solicitud: ISolicitudDTO) => {
      this.form.patchValue({
        comentarios: solicitud.comentarios,
        archivo: solicitud.archivo // Esto es correcto, no cambies este campo
      });
      this.pdfBase64 = solicitud.archivo;
    },
    error: () => {
      this.sweetAlertService.showError('Error al cargar la solicitud.');
    }
  });
} else if (idVacante) {
  // Código para obtener la vacante si no es solicitud
  this.vacanteService.getVacanteById(+idVacante).subscribe({
    next: (vacante) => (this.vacante = vacante),
    error: () => this.sweetAlertService.showError('Error al cargar la vacante.')
  });
}

  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        this.pdfBase64 = (reader.result as string).split(',')[1];
        this.form.patchValue({ archivo: file.name });
      };
      reader.readAsDataURL(file);
    } else {
      this.sweetAlertService.showWarning('Solo se permiten archivos PDF.');
      this.form.patchValue({ archivo: '' });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.sweetAlertService.showError('Por favor, complete todos los campos.');
      return;
    }
  
    const email = this.authService.getCurrentEmail();
    if (!email) {
      this.sweetAlertService.showError('Usuario no autenticado.');
      this.router.navigate(['/login']);
      return;
    }
  
    const solicitud: ISolicitudDTO = {
      idSolicitud: this.solicitudId ?? 0, // Aquí se mantiene el ID de la solicitud.
      comentarios: this.form.value.comentarios,
      archivo: this.pdfBase64,
      email,
      idVacante: this.vacante?.idVacante ?? 0
    };
  
    if (this.solicitudId) {
      // Usamos el servicio de actualización con el idSolicitud
      this.solicitudService.updateSolicitud(solicitud).subscribe({
        next: () => {
          this.sweetAlertService.showSuccess('Solicitud actualizada correctamente.');
          this.router.navigate(['/usuario/solicitudes']);
        },
        error: () => this.sweetAlertService.showError('Error al actualizar la solicitud.')
      });
    } else {
      // Código para crear una nueva solicitud
      this.solicitudService.createSolicitud(solicitud).subscribe({
        next: () => {
          this.sweetAlertService.showSuccess('Solicitud enviada correctamente.');
          this.router.navigate(['/usuario/solicitudes']);
        },
        error: () => this.sweetAlertService.showError('Error al enviar la solicitud.')
      });
    }
  }
  
}
