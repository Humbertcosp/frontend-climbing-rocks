import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { IonicModule }         from '@ionic/angular';
import { RouterModule }        from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuedadasRoutingModule }   from './quedadas-routing.module';
import { QuedadasListPage }        from './quedadas-list/quedadas-list.page';
import { QuedadasDetailsPage }     from './quedadas-details/quedadas-details.page';
import { QuedadasCreatePage }      from './quedadas-create/quedadas-create.page';
import { MapComponent } from 'src/app/shared/map/map.component';


@NgModule({
  declarations: [          // ⬅ TODAS tus páginas / componentes
    QuedadasListPage,
    QuedadasDetailsPage,
    QuedadasCreatePage,
    MapComponent,
  ],
  imports: [               // ⬅ Módulos que usan las plantillas
    CommonModule,          // *ngIf, |date, etc.
    IonicModule,           // <ion-…>
    RouterModule,          // routerLink, <router-outlet>
    FormsModule,           // [(ngModel)]  (si lo usas)
    ReactiveFormsModule,   // [formGroup]
    QuedadasRoutingModule  // rutas de la característica
  ]
})
export class QuedadasModule {}