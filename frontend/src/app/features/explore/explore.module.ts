import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ExplorePage } from './explore.page';

const routes: Routes = [
  { path: '', component: ExplorePage }
];

@NgModule({
  declarations: [ExplorePage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class ExploreModule {}