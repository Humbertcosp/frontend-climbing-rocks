import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuedadasCreatePage } from './quedadas-create/quedadas-create.page';
import { QuedadasListPage } from './quedadas-list/quedadas-list.page';
import { QuedadasDetailsPage } from './quedadas-details/quedadas-details.page';



const routes: Routes = [
{
    path: '', component: QuedadasListPage }, 
  
  {
     path: 'create',
     component: QuedadasCreatePage
   },
    {
     path: ':id',
     component: QuedadasDetailsPage
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class QuedadasRoutingModule { }
