// src/app/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  ToastController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { FollowService } from '../services/follow.service';
import { AuthService } from '../services/auth.service';

import { Usuario } from '../features/models/usuario.model';
import { Post } from '../features/models/post.model';
import { CreatePostModal } from '../features/posts/create-post.modal/create-post.modal'; 

import { of } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  posts: Post[] = [];
  users: Usuario[] = [];
  newComment: { [postId: string]: string } = {};
  loadingPosts = false;
  unreadCount = 0;

  meId: string | null = null;
  meName = 'Tú';

  constructor(
    private userService: UserService,
    private postService: PostService,
    private modalCtrl: ModalController,
    private toast: ToastController,
    private followSvc: FollowService,
    private auth: AuthService,
    private actionSheet: ActionSheetController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}
  private getUserIdLoose(u: Usuario | any): string | undefined {
  return (u as any)?._id ?? (u as any)?.id ?? (u as any)?.userId;
}

private getUserNameLoose(u: any): string {
  return u?.nombre ?? u?.name ?? u?.username ?? 'Usuario';
}

  async ngOnInit() {
    const me = await this.auth.getCurrentUser();
    this.meId = (me as any)?._id || (me as any)?.id || null;
    this.meName = (me as any)?.nombre || (me as any)?.name || 'Tú';

    this.loadUsers();
    this.loadPosts();
  }

  // ───────────────────────────────────
  // FEED
  // ───────────────────────────────────
  loadPosts() {
    this.loadingPosts = true;
    this.postService
      .listFollowing()
      .pipe(
        // si viene vacío, pedimos todos
        switchMap((list) =>
          list && list.length ? of(list) : this.postService.getPosts()
        ),
        // si falla feed/following, caemos a getPosts
        catchError((err) => {
          console.error('feed/following error -> fallback a getPosts()', err);
          return this.postService.getPosts();
        }),
        finalize(() => (this.loadingPosts = false))
      )
      .subscribe((posts) => (this.posts = posts));
  }

  // ───────────────────────────────────
  // CREAR POST
  // ───────────────────────────────────
  async openCreate() {
    const modal = await this.modalCtrl.create({ component: CreatePostModal });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'created' && data) this.posts.unshift(data);
  }

  // ───────────────────────────────────
  // FOLLOW / UNFOLLOW
  // ───────────────────────────────────
  toggleFollow(targetId?: string) {
    if (!targetId) return;

    const anyPost = this.posts.find((p) => p.user?.userId === targetId);
    const following = !!anyPost?.user?.following;

    const req$ = following
      ? this.followSvc.unfollow(targetId)
      : this.followSvc.follow(targetId);

    req$.subscribe({
      next: () => {
        // reflejar en todos los posts del mismo usuario
        this.posts.forEach((p) => {
          if (p.user?.userId === targetId)
            (p.user as any).following = !following;
        });
      },
      error: (e) => console.error(e),
    });
  }

  // ───────────────────────────────────
  // LIKES / SAVES
  // ───────────────────────────────────
  toggleLike(post: Post) {
    // UI optimista
    post.liked = !post.liked;
    post.likesCount = (post.likesCount || 0) + (post.liked ? 1 : -1);

    this.postService.toggleLike(post.id).subscribe({
      next: (updated) => Object.assign(post, updated),
      error: (err) => {
        console.error('Error toggling like', err);
        post.liked = !post.liked;
        post.likesCount = (post.likesCount || 0) + (post.liked ? 1 : -1);
      },
    });
  }

  toggleSave(post: Post) {
    post.saved = !post.saved;
    // aquí podrías llamar a un endpoint de guardados si lo tienes
  }

addComment(post: Post) {
  const text = this.newComment[post.id]?.trim();
  if (!text) return;

  const author: any = this.meId
    ? { _id: this.meId, nombre: this.meName }
    : { nombre: this.meName };

  post.comments = post.comments || [];
  post.comments.push({
    user: author,                 // << objeto con nombre
    text,
    createdAt: new Date().toISOString()
  } as any);

  // envía al backend (si tu API requiere user, mantenlo; si usa el user autenticado, basta con text)
  this.postService.addComment(post.id, { user: this.meId, text } as any).subscribe({
    next: updated => {
      Object.assign(post, updated);       // o al menos post.comments = updated.comments
      this.newComment[post.id] = '';
    },
    error: err => {
      console.error('Error al añadir comentario', err);
      post.comments.pop();                // revertir si falla
    }
  });
}

 nameFromComment(c: any): string {
  const u = c?.user;
  if (!u) return 'Usuario';

  // Si viene como string (id)
  if (typeof u === 'string') {
    if (u === this.meId) return this.meName;               // soy yo
    const found = this.users.find(x => this.getUserIdLoose(x) === u);
    return found ? this.getUserNameLoose(found) : 'Usuario';
  }

  // Si viene como objeto poblado
  return this.getUserNameLoose(u);
}

  // ───────────────────────────────────
  // MENÚ (tres puntos)
  // ───────────────────────────────────
  async openMenu(post: Post) {
    const mine = !!(post.user?.userId && post.user.userId === this.meId);
    const following = !!post.user?.following;

    const buttons: any[] = [];

    if (mine) {
      buttons.push(
        {
          text: 'Editar publicación',
          icon: 'create-outline',
          handler: () => this.router.navigate(['/post', post.id, 'edit']),
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash-outline',
          handler: () => this.confirmDelete(post),
        }
      );
    } else {
      buttons.push(
        {
          text: following ? 'Dejar de seguir' : 'Seguir',
          icon: following ? 'person-remove-outline' : 'person-add-outline',
          handler: () => this.toggleFollow(post.user?.userId!),
        },
        {
          text: 'Enviar mensaje',
          icon: 'mail-outline',
          handler: () => this.goToChat(post.user?.userId!),
        },
        {
          text: 'Reportar',
          icon: 'alert-circle-outline',
          handler: () => this.report(post),
        }
      );
    }

    buttons.push({ text: 'Cancelar', role: 'cancel', icon: 'close' });

    const sheet = await this.actionSheet.create({
      header: 'Opciones',
      buttons,
    });
    await sheet.present();
  }

  private async confirmDelete(post: Post) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar publicación',
      message: '¿Seguro que deseas eliminarla?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.postService.deletePost(post.id).subscribe({
              next: async () => {
                this.posts = this.posts.filter((p) => p.id !== post.id);
                (
                  await this.toast.create({
                    message: 'Publicación eliminada',
                    duration: 1200,
                  })
                ).present();
              },
              error: async () =>
                (
                  await this.toast.create({
                    message: 'No se pudo eliminar',
                    color: 'danger',
                    duration: 1400,
                  })
                ).present(),
            });
          },
        },
      ],
    });
    await alert.present();
  }

  private async report(_post: Post) {
    (
      await this.toast.create({
        message: 'Reporte enviado. Gracias por avisar.',
        duration: 1400,
      })
    ).present();
  }

  private goToChat(userId: string) {
    if (!userId) return;
    this.router.navigate(['/chats'], { queryParams: { to: userId } });
  }

 loadUsers() {
  this.userService.getUsers().subscribe({
    next: users => { this.users = users || []; },
    error: err => console.error(err),
  });
}

  addUser(nombre: string, email: string) {
    if (!nombre || !email) return;
    this.userService.createUser({ nombre, email }).subscribe(
      () => this.loadUsers(),
      (err) => console.error('Error al crear usuario', err)
    );
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(
      () => this.loadUsers(),
      (err) => console.error('Error al borrar usuario', err)
    );
  }

  openComments(post: Post) {
    console.log('Abrir comentarios de', post.id);
  }
  share(post: Post) {
    console.log('Compartir post', post.id);
  }
}
