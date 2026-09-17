import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  aberto = false;

  constructor(public auth: Auth, private router: Router) {}

  alternar(): void {
    this.aberto = !this.aberto;
  }

  fechar(): void {
    this.aberto = false;
  }

  logout(): void {
    this.auth.logout();
    this.fechar();
    this.router.navigate(['/home']);
  }
}
