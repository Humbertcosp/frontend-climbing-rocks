// frontend/src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message } from '../features/models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket!: Socket;
  private _messages = new BehaviorSubject<Message[]>([]);
  messages$ = this._messages.asObservable();

  private ensureConn() {
    if (this.socket) return;
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      // path: '/socket.io', // sólo si lo cambiaste en el server
      autoConnect: true,
      reconnection: true,
    });

    this.socket.on('connect', () => console.log('[chat] conectado', this.socket.id));
    this.socket.on('disconnect', (r) => console.log('[chat] disconnect', r));
    this.socket.on('connect_error', (e) => console.error('[chat] connect_error', e));

    this.socket.on('message', (msg: Message) => {
      // normalizar timestamp a Date para la UI
      const fixed: Message = {
        ...msg,
        timestamp: (typeof msg.timestamp === 'string')
          ? new Date(msg.timestamp)
          : msg.timestamp
      };
      this._messages.next([...this._messages.value, fixed]);
    });
  }

  join(roomId: string) {
    this.ensureConn();
    this.socket.emit('join', { roomId });
  }

  send(roomId: string, text: string) {
    this.ensureConn();
    this.socket.emit('message', {
      roomId,
      text,
      from: 'Yo',
      timestamp: new Date().toISOString()
    });
  }

  disconnect() {
    this.socket?.disconnect();
    // opcional: limpiar el buffer de mensajes
    // this._messages.next([]);
    // @ts-expect-error reset
    this.socket = undefined;
  }
}
