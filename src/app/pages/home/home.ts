import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Menu } from '../../componentes/menu/menu';
import { Footer } from '../../componentes/footer/footer';
import { Carousel } from '../../componentes/carousel/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Menu, Footer, Carousel],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
