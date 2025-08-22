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
  rooms: { id: string; title: string; avatarUrl?: string; lastMessage?: string; updatedAt?: Date }[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.rooms = [];
  }

  openChat(c: ChatThread) {
  this.router.navigate(['/chat', c.id]); 
}

  deleteChat(c: ChatThread) {
    this.chats = this.chats.filter(x => x.id !== c.id);
  }

  archiveChat(c: ChatThread) {
    console.log('Archivar chat', c);

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