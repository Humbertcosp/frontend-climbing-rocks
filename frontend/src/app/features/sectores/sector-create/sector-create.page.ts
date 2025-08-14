import { Component, OnInit } from '@angular/core';
import { HomePage } from 'src/app/home/home.page';

@Component({
  selector: 'app-sector-create',
  templateUrl: './sector-create.page.html',
  styleUrls: ['./sector-create.page.scss'],
  standalone: false
})
export class SectorCreatePage  implements OnInit {

  constructor() { }

  ngOnInit() {}
  Routes = [{ path: '', component: HomePage }];
}
