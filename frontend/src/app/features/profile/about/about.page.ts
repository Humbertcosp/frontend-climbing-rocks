import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: false
})
export class AboutPage implements OnInit {

   appVersion = '1.0.0'; // o cárgalo dinámicamente

  constructor(private router: Router) {}
  ngOnInit(): void {}

  openWebsite() {
    window.open('https://tu-sitio-web.com', '_blank');
  }

  openLicenses() {
    this.router.navigate(['/profile/licenses']); 
    // crea luego esa ruta o modal con detalles de licencias
  }

}
