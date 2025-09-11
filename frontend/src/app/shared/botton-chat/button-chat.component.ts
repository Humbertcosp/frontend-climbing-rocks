import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-chat',
  templateUrl: './button-chat.component.html',
  styleUrls: ['./button-chat.component.scss'],
  standalone: false,
})
export class BottonChatComponent  implements OnInit {

    constructor(private router: Router) {}
  go() { this.router.navigate(['/chats']); }
    ngOnInit() {}


}



