import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CreatePostModal } from '../../features/posts/create-post.modal/create-post.modal';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  standalone: false,
})
export class BottomNavComponent implements OnInit, OnDestroy {
  current = '';
  hidden  = false;
  private sub?: Subscription;

  constructor(private router: Router, private modalCtrl: ModalController) {}

  ngOnInit() {
    const update = (url: string) => {
      this.current = url.split('?')[0];
      // Ocultar en auth u otras pantallas donde no quieres tabs
      this.hidden = this.current.startsWith('/auth');
    };
    update(this.router.url);
    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => update(e.urlAfterRedirects || e.url));
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  isActive(path: string) {
    return this.current === path || this.current.startsWith(path + '/');
  }

  go(path: string) {
    if (this.current !== path) this.router.navigateByUrl(path);
  }

  async openCreatePost() {
    const m = await this.modalCtrl.create({ component: CreatePostModal });
    await m.present();
  }
}
