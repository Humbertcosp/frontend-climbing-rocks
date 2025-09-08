import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CreatePostModal } from './features/posts/create-post.modal';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {constructor(
  private modalCtrl: ModalController, 
  private toast: ToastController) {}

   async openCreatePost() {
    const modal = await this.modalCtrl.create({ component: CreatePostModal });
    modal.onWillDismiss().then(async ({ role }) => {
      if (role === 'created') {
        // feedback opcional
        (await this.toast.create({ message: 'Publicado ✅', duration: 1000, color: 'success' })).present();
      }
    });
    await modal.present();
  }
}