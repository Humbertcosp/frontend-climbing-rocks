import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SectoresListPage} from './sectores-list/sectores-list.page';
import { SectoresDetailsPage } from './sectores-details/sectores-details.page';
import { SectoresRoutingModule } from './sectores-routing.module';
import { SectorCreatePage } from './sector-create/sector-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SectoresRoutingModule,
  ],
  declarations: [SectoresListPage,SectoresDetailsPage,SectorCreatePage]
})
export class SectoresModule {}
