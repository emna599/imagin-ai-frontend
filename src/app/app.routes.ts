import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { TransformComponent } from './pages/transform/transform';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'transform', component: TransformComponent }
];
