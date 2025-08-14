import { Component, ElementRef, OnInit } from '@angular/core';
import { SectoresService }  from '../../../services/sector.service';
import { Sector }  from '../../models/sector.model';
import { Router } from '@angular/router';
import { ViewWillLeave }   from '@ionic/angular';


@Component({
  selector   : 'app-sectores-list',
  templateUrl: './sectores-list.page.html',
  styleUrls  : ['./sectores-list.page.scss'],
  standalone:false
})
export class SectoresListPage implements OnInit, ViewWillLeave {

  sectores: Sector[] = [];
    

  constructor(private sectoresSrv: SectoresService,
              private router: Router,
              private el : ElementRef<HTMLElement>  
  ) {}

  ngOnInit(): void { this.loadSectores(); }
 

  private loadSectores(): void {
    this.sectoresSrv.list().subscribe({
      next : data => this.sectores = data,
      error: err  => console.error('Error cargando sectores', err)
    });
  }

   /** Justo antes de que la página entre en pantalla, quitamos inert */
  ionViewWillEnter(): void {
    this.el.nativeElement.removeAttribute('inert');
  }

  /** Justo antes de que la página quede oculta, la marcamos inert */
  ionViewWillLeave(): void {
    // 1) quitamos cualquier foco residual
    (document.activeElement as HTMLElement | null)?.blur();
    
  }

  


}