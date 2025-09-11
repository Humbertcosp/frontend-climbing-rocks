// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post, Comment } from '../features/models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private base = `${environment.apiUrl}/posts`;
  // http://localhost:3000  a partir de  http://localhost:3000/api
  private apiRoot = environment.apiUrl.replace(/\/api\/?$/, '');

  constructor(private http: HttpClient) {}


  getPosts(): Observable<Post[]> {
    return this.http.get<any[]>(this.base).pipe(map(ps => ps.map(p => this.toUiPost(p))));
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(p => this.toUiPost(p)));
  }

  createPost(data: {
    texto?: string;
    imageFile?: File | null;
    imageDataUrl?: string | null;
    disciplina?: string;
    grado?: string;
    ubicacion?: string;
  }): Observable<Post> {
    const fd = new FormData();
    if (data.texto)      fd.append('texto', data.texto);
    if (data.disciplina) fd.append('disciplina', data.disciplina);
    if (data.grado)      fd.append('grado', data.grado);
    if (data.ubicacion)  fd.append('ubicacion', data.ubicacion);

    if (data.imageFile) {
      fd.append('image', data.imageFile);
    } else if (data.imageDataUrl) {
      const blob = this.dataUrlToBlob(data.imageDataUrl);
      fd.append('image', blob, 'post.jpg');
    }

    return this.http.post<any>(this.base, fd).pipe(map(p => this.toUiPost(p)));
  }

  deletePost(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

  toggleLike(id: string): Observable<Post> {
    // el backend toma el user del token
    return this.http.post<any>(`${this.base}/${id}/like`, {})
      .pipe(map(p => this.toUiPost(p)));
  }

  addComment(id: string, comment: Comment): Observable<Post> {
    return this.http.post<any>(`${this.base}/${id}/comments`, comment)
      .pipe(map(p => this.toUiPost(p)));
  }

  listFollowing(): Observable<Post[]> {
    return this.http.get<any[]>(`${this.base}/feed/following`).pipe(
      map(posts => posts.map(p => this.toUiPost(p)))
    );
  }

  // ---------- HELPERS ----------
  private dataUrlToBlob(dataUrl: string): Blob {
    const [head, body] = dataUrl.split(',');
    const mime = head.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
    const bin = atob(body);
    const u8  = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new Blob([u8], { type: mime });
  }

  /** Prefija /uploads y permite URLs absolutas. */
  private fixUrl(u?: string): string {
    if (!u) return '';
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith('/')) return this.apiRoot + u;
    return u;
  }

  /** Lee el userId del token (si existe) para marcar `liked`/`saved` en cliente. */
  private get tokenUserId(): string | null {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      return payload?.id ?? payload?.uid ?? payload?._id ?? null;
    } catch { return null; }
  }

  private toUiPost(p: any): Post {
  const rawUser = p.user ?? p.author ?? {};

  // ✅ normaliza likes (ObjectId -> string)
  const likedBy: string[] =
    Array.isArray(p.likes)   ? p.likes.map((x: any) => String(x)) :
    Array.isArray(p.likedBy) ? p.likedBy.map((x: any) => String(x)) : [];

  const savedBy: string[] =
    Array.isArray(p.savedBy) ? p.savedBy.map((x: any) => String(x)) : [];

  // si ya tienes fixUrl/tokenUserId en tu servicio, se usan aquí
  const avatar = this.fixUrl
    ? this.fixUrl(rawUser.avatarUrl ?? rawUser.fotoPerfil)
    : (rawUser.avatarUrl ?? rawUser.fotoPerfil ?? 'assets/avatar.svg');

  const image = this.fixUrl
    ? this.fixUrl(p.imageUrl ?? p.imagenUrl)
    : (p.imageUrl ?? p.imagenUrl ?? '');

  return {
    _id:       p._id ?? p.id,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    likedBy,
    savedBy,

    id: String(p._id ?? p.id ?? ''),
    user: {
      name:      rawUser.nombre ?? rawUser.name ?? 'Anónimo',
      avatarUrl: avatar || 'assets/avatar.svg',
      userId:    rawUser._id ?? rawUser.id
    },
    imageUrl: image,
    caption:  p.caption ?? p.text ?? p.texto ?? '',

    
    likesCount: typeof p.likesCount === 'number' ? p.likesCount : likedBy.length,
    comments: Array.isArray(p.comments) ? p.comments : [],

    liked: !!(this.tokenUserId && likedBy.includes(this.tokenUserId)),
    saved: !!(this.tokenUserId && savedBy.includes(this.tokenUserId)),
  };
}

updatePost(id: string, data: {
    texto?: string;
    imageFile?: File | null;
    imageDataUrl?: string | null; // para móvil/cámara
    removeImage?: boolean;
    disciplina?: string;
    grado?: string;
    ubicacion?: string;
  }): Observable<Post> {
    const fd = new FormData();
    if (data.texto != null)      fd.append('texto', data.texto);
    if (data.disciplina != null) fd.append('disciplina', data.disciplina);
    if (data.grado != null)      fd.append('grado', data.grado);
    if (data.ubicacion != null)  fd.append('ubicacion', data.ubicacion);

    if (data.imageFile) {
      fd.append('image', data.imageFile);
    } else if (data.imageDataUrl) {
      const blob = this.dataUrlToBlob(data.imageDataUrl);
      fd.append('image', blob, 'post.jpg');
    }
    if (data.removeImage) fd.append('removeImage', 'true');

    return this.http.put<any>(`${this.base}/${id}`, fd).pipe(map(p => this.toUiPost(p)));
  }

}
