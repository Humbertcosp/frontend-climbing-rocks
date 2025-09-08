// src/app/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';

import { Usuario } from '../features/models/usuario.model';
import { Post }     from '../features/models/post.model';
import { CreatePostModal } from '../features/posts/create-post.modal';
import { FollowService } from '../services/follow.service';

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

  constructor(
    private userService: UserService,
    private postService: PostService,
    private modalCtrl: ModalController,
    private toast: ToastController,
    private followSvc: FollowService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadPosts();
  }

 loadPosts() {
  this.loadingPosts = true;
  this.postService.listFollowing().subscribe({
    next: posts => { this.posts = posts; this.loadingPosts = false; },
    error: err   => { console.error(err); this.loadingPosts = false; }
  });
  }
  async openCreate() {
    const modal = await this.modalCtrl.create({ component: CreatePostModal });
    modal.onWillDismiss().then(({ role, data }) => {
      if (role === 'created' && data) this.posts = [data, ...this.posts]; // UI rápida
      else if (role === 'created') this.loadPosts(); // o recarga si prefieres
    });
    await modal.present();
  }
  toggleFollow(targetId?: string) {
  if (!targetId) return;
  const found = this.posts.find(p => p.user.userId === targetId);
  const following = !!found?.user.following;

  const req$ = following ? this.followSvc.unfollow(targetId) : this.followSvc.follow(targetId);
  req$.subscribe({
    next: () => {
      // marca/desmarca todos los posts de ese usuario en el feed
      this.posts.forEach(p => {
        if (p.user.userId === targetId) p.user.following = !following as any;
      });
    },
    error: (e) => console.error(e)
  });
}

  loadUsers() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      err   => console.error('Error al cargar usuarios', err)
    );
  }

  addUser(nombre: string, email: string) {
    if (!nombre || !email) return;
    this.userService.createUser({ nombre, email }).subscribe(
      () => this.loadUsers(),
      err => console.error('Error al crear usuario', err)
    );
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(
      () => this.loadUsers(),
      err => console.error('Error al borrar usuario', err)
    );
  }

  toggleLike(post: Post) {
    post.liked      = !post.liked;                 // UI optimista
    post.likesCount = (post.likesCount || 0) + (post.liked ? 1 : -1);

    this.postService.toggleLike(post.id).subscribe({
      next: updated => Object.assign(post, updated),
      error: err => {
        console.error('Error toggling like', err);
        // revertir si falla
        post.liked      = !post.liked;
        post.likesCount = (post.likesCount || 0) + (post.liked ? 1 : -1);
      }
    });
  }

  toggleSave(post: Post) {
    post.saved = !post.saved;
    // aquí podrías llamar a un endpoint de guardados
  }

  addComment(post: Post) {
    const text = this.newComment[post.id]?.trim();
    if (!text) return;

    post.comments = post.comments || [];
    post.comments.push({ user: 'Yo', text });  // UI optimista

    this.postService.addComment(post.id, { user: 'Yo', text }).subscribe({
      next: updated => {
        Object.assign(post, updated);
        this.newComment[post.id] = '';
      },
      error: err => {
        console.error('Error al añadir comentario', err);
        post.comments.pop(); 
      }
    });
  }

  openComments(post: Post) {
    console.log('Abrir comentarios de', post.id);
  }

  share(post: Post) {
    console.log('Compartir post', post.id);
  }

  openMenu(post: Post) {
    console.log('Mostrar menú para post', post.id);
  }


}
