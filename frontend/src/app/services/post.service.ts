// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post, Comment } from '../features/models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
   private base = `${environment.apiUrl}/posts`;
  // mientras no haya auth real, usa un id fijo
  private currentUserId = 'demo'; // debe coincidir con lo que usa tu backend

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.base).pipe(
      map(posts => posts.map(p => this.toUiPost(p)))
    );
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.base}/${id}`).pipe(
      map(p => this.toUiPost(p))
    );
  }

  createPost(data: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(this.base, data).pipe(
      map(p => this.toUiPost(p))
    );
  }

  deletePost(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

  toggleLike(id: string): Observable<Post> {
    return this.http.post<Post>(`${this.base}/${id}/like`, { userId: this.currentUserId }).pipe(
      map(p => this.toUiPost(p))
    );
  }

  addComment(id: string, comment: Comment): Observable<Post> {
    return this.http.post<Post>(`${this.base}/${id}/comments`, comment).pipe(
      map(p => this.toUiPost(p))
    );
  }

  // Adaptador backend → UI
  private toUiPost(p: any): Post {
    const id = p.id ?? p._id ?? '';
    const liked = Array.isArray(p.likedBy) ? p.likedBy.includes(this.currentUserId) : false;
    const saved = Array.isArray(p.savedBy) ? p.savedBy.includes(this.currentUserId) : false;

    return {
      ...p,
      id,
      liked,
      saved,
    };
  }
}