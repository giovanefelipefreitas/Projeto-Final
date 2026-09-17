import { Component } from '@angular/core';
import { Menu } from '../../componentes/menu/menu';
import { Footer } from '../../componentes/footer/footer';

@Component({
  selector: 'app-privacidade',
  standalone: true,
  imports: [Menu, Footer],
  templateUrl: './privacidade.html',
  styleUrl: './privacidade.css'
})
export class Privacidade {}
