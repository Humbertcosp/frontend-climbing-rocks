// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post, Comment } from '../features/models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private base = `${environment.apiUrl}/posts`;

  
  private currentUserId = 'demo'; // cámbialo por el id real si lo tienes

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<any[]>(this.base).pipe(map(ps => ps.map(p => this.toUiPost(p))));
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(p => this.toUiPost(p)));
  }

  createPost(data: Partial<Post>): Observable<Post> {
   
    const payload = {
      texto: data.caption ?? '',
      imagenUrl: data.imageUrl ?? ''
    };
    return this.http.post<any>(this.base, payload).pipe(map(p => this.toUiPost(p)));
  }

  deletePost(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

  toggleLike(id: string): Observable<Post> {
    return this.http
      .post<any>(`${this.base}/${id}/like`, { userId: this.currentUserId })
      .pipe(map(p => this.toUiPost(p)));
  }

  addComment(id: string, comment: Comment): Observable<Post> {
    // backend espera { user, text }
    return this.http.post<any>(`${this.base}/${id}/comments`, comment)
      .pipe(map(p => this.toUiPost(p)));
  }

  // ---------- Adaptador backend → UI (clave) ----------
  private toUiPost(p: any): Post {
    const rawUser = p.user ?? p.author ?? {};
    const likedBy: string[] = Array.isArray(p.likedBy) ? p.likedBy : [];
    const savedBy: string[] = Array.isArray(p.savedBy) ? p.savedBy : [];

    return {
      // campos que tu modelo expone “del backend” (opcionales)
      _id:       p._id ?? p.id,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      likedBy,
      savedBy,

      // comunes (obligatorios en tu interfaz)
      id: String(p._id ?? p.id ?? ''),
      user: {
        // ¡Tu PostUser exige 'name' y 'avatarUrl'! Los rellenamos desde lo que venga:
        name:      rawUser.name ?? rawUser.nombre ?? 'Anónimo',
        avatarUrl: rawUser.avatarUrl ?? rawUser.fotoPerfil ?? 'assets/avatar.svg',
        userId:    rawUser._id ?? rawUser.id
      },
      // imageUrl SIEMPRE presente (evita usar (post as any) en plantillas)
      imageUrl: p.imageUrl ?? p.imagenUrl ?? '',
      // caption desde varias posibles claves del backend
      caption: p.caption ?? p.text ?? p.texto ?? '',
      likesCount: p.likesCount ?? p.likes ?? likedBy.length ?? 0,
      comments: Array.isArray(p.comments) ? p.comments : [],

      // flags de UI
      liked: this.currentUserId ? likedBy.includes(this.currentUserId) : false,
      saved: this.currentUserId ? savedBy.includes(this.currentUserId) : false,
    };
  }
  listFollowing(): Observable<Post[]> {
  return this.http.get<Post[]>(`${this.base}/feed/following`).pipe(
    map(posts => posts.map(p => this.toUiPost(p)))
  );
}
}
