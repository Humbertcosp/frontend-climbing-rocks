import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';        
import { IonicModule } from '@ionic/angular';
import { ExplorePage } from './explore.page';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ExplorePage],
  imports: [
    CommonModule,
    FormsModule,                                 
    IonicModule,
    RouterModule.forChild([{ path: '', component: ExplorePage }]),
  ],
})
export class ExplorePageModule {}