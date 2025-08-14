import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { IonicModule }   from '@ionic/angular';
import { RouterModule }  from '@angular/router';

import { BottomNavComponent } from './bottom-nav.component';

@NgModule({
  declarations: [BottomNavComponent],
  imports:      [CommonModule, IonicModule, RouterModule],
  exports:      [BottomNavComponent]          // ⬅ para usarlo fuera
})
export class BottomNavModule {}
