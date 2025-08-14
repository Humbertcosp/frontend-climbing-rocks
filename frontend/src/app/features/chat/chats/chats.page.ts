import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatThread } from '../../models/chat.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: false
})
export class ChatsPage implements OnInit {

   filter = '';
  chats: ChatThread[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // Datos de ejemplo
    this.chats = [
      {
        id: '1',
        title: 'Marta',
        avatarUrl: '/assets/icon/favicon.png',
        lastMessage: '¡Nos vemos mañana!',
        lastTimestamp: new Date(),
      },
      {
        id: '2',
        title: 'Grupo Siurana',
        avatarUrl: '/assets/icon/favicon.png',
        lastMessage: '¿Quién sube hoy?',
        lastTimestamp: new Date(),
      },
      
    ];
  }

  openChat(c: ChatThread) {
    this.router.navigate(['/chats', c.id]);
  }

  deleteChat(c: ChatThread) {
    this.chats = this.chats.filter(x => x.id !== c.id);
  }

  archiveChat(c: ChatThread) {
    console.log('Archivar chat', c);
    // tu lógica de archivar
  }
  get filteredChats(): ChatThread[] {
  if (!this.filter) return this.chats;
  const term = this.filter.toLowerCase();
  return this.chats.filter(c =>
    c.title.toLowerCase().includes(term) ||
    c.lastMessage.toLowerCase().includes(term)
  );
 
}

}