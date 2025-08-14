import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SectoresListPage } from './sectores-list/sectores-list.page';
import { SectoresDetailsPage } from './sectores-details/sectores-details.page';
import { SectorCreatePage } from './sector-create/sector-create.page';


const routes: Routes = [
   {
      path: '', component: SectoresListPage }, 
  {
     path: 'create',
     component: SectorCreatePage
   },
    {
     path: ':sectorId',
     component: SectoresDetailsPage
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectoresRoutingModule {}
