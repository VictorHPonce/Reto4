import { Routes } from '@angular/router';
import { EmpresaFormComponent} from './features/empresa/pages/empresa-form/empresa-form.component';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { VacanteListComponent } from './features/empresa/pages/vacante-list/vacante-list.component';
import { VacantesEmpresaComponent } from './features/empresa/pages/vacantes-empresa/vacantes-empresa.component';
import { ViewAdmonEmpresaComponent } from './features/admon/pages/view-admon-empresa/view-admon-empresa.component';
import { CategoriaFormComponent } from './features/admon/pages/categoria-form/categoria-form.component';
import { ViewAdmonCategoriaComponent } from './features/admon/pages/view-admon-categoria/view-admon-categoria.component';
import { GestionUsuariosAdmonComponent } from './features/admon/pages/gestion-usuarios-admon/gestion-usuarios-admon.component';
import { FormEmpresaAdmonComponent } from './features/admon/pages/form-empresa-admon/form-empresa-admon.component';
import { PostulacionFormComponent } from './features/usuario/pages/postulacion-form/postulacion-form.component';
import { ViewSolicitudesComponent } from './features/usuario/pages/view-solicitudes/view-solicitudes.component';
import { EmpresaDetalleComponent } from './features/admon/pages/empresa-detalle/empresa-detalle.component';
import { GestionUsuarioComponent } from './features/admon/pages/gestion-usuario/gestion-usuario.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: VacanteListComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'vacantes', component: VacanteListComponent },
    { path: 'empresa/vacantes/nueva', component: EmpresaFormComponent },
    { path: 'empresa/vacantes', component: VacantesEmpresaComponent},
    { path: 'empresa/vacantes/:id', component: EmpresaFormComponent },
    { path: 'admon/empresa/nueva', component: FormEmpresaAdmonComponent },
    {path: 'admon/empresas' , component: ViewAdmonEmpresaComponent},
    {path: 'admon/empresa/:idEmpresa' , component: FormEmpresaAdmonComponent},
    {path: 'admon/empresa/detalle/:idEmpresa' , component: EmpresaDetalleComponent },
    {path: 'admon/categorias', component: ViewAdmonCategoriaComponent},
    {path: 'admon/categoria/nueva' , component: CategoriaFormComponent},
    {path: 'admon/categoria/:idCategoria' , component: CategoriaFormComponent},
    {path: 'admon/gestion/usuarios' , component: GestionUsuariosAdmonComponent},
    {path: 'admon/usuarios/crear' , component: GestionUsuarioComponent},
    {path: 'admon/usuarios/editar/:id' , component: RegisterComponent},
    { path: 'usuario/postulacion/:id', component: PostulacionFormComponent },
    { path: 'usuario/solicitudes', component: ViewSolicitudesComponent },
    { path: 'usuario/solicitudes/edit/:idSolicitud', component: PostulacionFormComponent },
    {path: '**', redirectTo: 'home'},
    
];

// { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
// { path: 'login', component: LoginComponent },
// { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
// { path: 'admin', component: AdminComponent, canActivate: [roleGuard(['ADMON'])] },
// { path: 'empresa', component: EmpresaComponent, canActivate: [roleGuard(['EMPRESA'])] },
// { path: 'cliente', component: ClienteComponent, canActivate: [roleGuard(['CLIENTE'])] },
// { path: 'access-denied', component: AccessDeniedComponent },
// { path: '**', redirectTo: '/dashboard' }
