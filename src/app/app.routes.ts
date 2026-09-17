import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Adocao } from './pages/adocao/adocao';
import { Comunidade } from './pages/comunidade/comunidade';
import { Publicar } from './pages/publicar/publicar';
import { Perfil } from './pages/perfil/perfil';
import { Privacidade } from './pages/privacidade/privacidade';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'adocao', component: Adocao },
  { path: 'comunidade', component: Comunidade },
  { path: 'privacidade', component: Privacidade },
  { path: 'publicar', component: Publicar, canActivate: [authGuard] },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
