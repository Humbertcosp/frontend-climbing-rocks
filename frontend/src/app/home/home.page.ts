// src/app/home/home.page.ts
import { Component, OnInit }         from '@angular/core';
import { UserService }               from '../services/user.service';
import { PostService }               from '../services/post.service';
import { Usuario }                   from '../features/models/usuario.model';
import { Post, Comment }             from '../features/models/post.model';

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

  constructor(
    private userService: UserService,
     private postService: PostService
  ) {}

  ngOnInit() {
    this.loadUsers();

   
    this.postService.getPosts().subscribe(
     posts => this.posts = posts,
      err   => console.error('Error al cargar posts', err)
     );
    }

  loadUsers() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      err   => console.error('Error al cargar usuarios', err)
    );
  }

  addUser(nombre: string, email: string) {
    if (!nombre || !email) { return; }
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
  // actualizamos en UI inmediatamente
  post.liked      = !post.liked;
  post.likesCount += post.liked ? 1 : -1;

  // persistimos en backend
  this.postService.toggleLike(post.id).subscribe({
    next: updated => {
      // sincronizamos el objeto local con la respuesta del servidor
      Object.assign(post, updated);
    },
    error: err => {
      console.error('Error toggling like', err);
      // opcional: revertir UI si falla
      post.liked      = !post.liked;
      post.likesCount += post.liked ? 1 : -1;
    }
  });
}

  toggleSave(post: Post) {
    post.saved = !post.saved;
    // aquí podrías llamar a un endpoint para guardar post
  }

 addComment(post: Post) {
  const text = this.newComment[post.id]?.trim();
  if (!text) return;

  // opcional: mostrar en UI antes de la llamada
  post.comments.push({ user: 'Yo', text });

  // llamar al backend
  this.postService.addComment(post.id, { user: 'Yo', text }).subscribe({
    next: updated => {
      // actualizamos con la versión que nos devuelve el servidor
      Object.assign(post, updated);
      this.newComment[post.id] = '';
    },
    error: err => {
      console.error('Error al añadir comentario', err);
      // opcional: quitar comentario de UI
      post.comments.pop();
    }
  });
}

  openComments(post: Post) {
    console.log('Abrir comentarios de', post.id);
    // Ejemplo de navegación:
    // this.router.navigate(['/post', post.id, 'comments']);
  }

  share(post: Post) {
    console.log('Compartir post', post.id);
    // aquí tu share sheet nativo
  }

  openMenu(post: Post) {
    console.log('Mostrar menú para post', post.id);
    // ej. this.actionSheetController.create({…})
  }
}
