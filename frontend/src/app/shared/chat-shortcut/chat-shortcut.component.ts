import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-shortcut',
  templateUrl: './chat-shortcut.component.html',
  styleUrls: ['./chat-shortcut.component.scss'],
  standalone: false
})
export class ChatShortcutComponent {
  
  @Input() icon: string = 'chatbubble-ellipses-outline';

  
  @Input() to: string = '/chats';

  
  @Input() badge?: number | null = null;

 
  @Input() color: string = 'medium';
}