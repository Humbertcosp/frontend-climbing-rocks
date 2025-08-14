// src/app/features/chat/chat/chat.page.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';
import { Message } from '../../models/chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  // ---- Header (lo que pide tu HTML)
  chatAvatarUrl = 'assets/icon/favicon.png';
  chatTitle = 'Chat';
  participantsCount = 1;

  // ---- Estado del chat
  roomId = 'general';
  messages: Message[] = [];          // el HTML usa "messages"
  newText = '';                      // [(ngModel)]="newText"
  typing = false;                    // *ngIf="typing"

  // picker de iconos
  showIcons = false;
  icons = ['😀','😂','😍','😎','🤔','😢','👍','👎','🎉','⚠️'];

  // usuario actual (stub)
  myUserId = 'demo-user-1';
  myUserName = 'Yo';

  constructor(
    private route: ActivatedRoute,
    private chat: ChatService
  ) {}

  ngOnInit() {
    // room id opcional vía ruta
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.roomId = id;
      this.chatTitle = `Chat ${id}`;
    }

    // unirse a la sala
    this.chat.join(this.roomId);

    // suscribirse a mensajes y normalizar campos que usa el HTML
    this.chat.messages$.subscribe((msgs) => {
      this.messages = msgs.map(m => {
        // asegurar timestamp como Date
        const ts = (m as any).timestamp ? new Date((m as any).timestamp) : new Date();
        // marcar si es mío (por si usas estilos me/other)
        const from = (m as any).userId === this.myUserId ? 'me' : 'other';
        return { ...m, timestamp: ts, from } as any;
      });

      // scroll al final cuando llegan mensajes
      setTimeout(() => this.content?.scrollToBottom(200), 0);
    });
  }

  // Debe ser pública (la plantilla la llama)
  groupMessagesByDate(msgs: Message[]) {
    const blocks: { dateLabel: string; msgs: Message[] }[] = [];
    let last = '';
    for (const m of msgs) {
      const d = new Date((m as any).timestamp);
      const isToday = d.toDateString() === new Date().toDateString();
      const label = isToday ? 'Hoy' : d.toLocaleDateString();
      if (label !== last) {
        blocks.push({ dateLabel: label, msgs: [] });
        last = label;
      }
      blocks[blocks.length - 1].msgs.push(m);
    }
    return blocks;
  }

  openGroupInfo() {
    console.log('Abrir info de grupo…');
  }

  toggleIcons() {
    this.showIcons = !this.showIcons;
  }

  insertIcon(icon: string) {
    this.newText += icon;
    this.showIcons = false;
  }

  send() {
    const text = this.newText.trim();
    if (!text) return;
    // si tu ChatService solo acepta (roomId, text), perfecto:
    this.chat.send(this.roomId, text);
    // si aceptara metadata, podrías mandar { text, userId, userName }…
    this.newText = '';
  }
}
