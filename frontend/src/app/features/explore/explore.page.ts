import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PostService } from '../../services/post.service';
import { FollowService } from '../../services/follow.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

import { Post } from '../../features/models/post.model';
import { Usuario } from '../../features/models/usuario.model';

type Tab = 'posts' | 'people';

// ViewModel para la rejilla de posts
type PostVM = Omit<Post, 'imageUrl'> & {
  imageUrl: string;
  likesCount: number;
  commentCount: number;
  likeCount?: number; // compat opcional
};

interface Person {
  _id: string;
  nombre: string;
  fotoPerfil?: string;
  ciudad?: string;
  nivelEscalada?: string;
  following?: boolean;
}

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: false,
})
export class ExplorePage implements OnInit {
  tab: Tab = 'posts';

  posts: PostVM[] = [];
  people: Person[] = [];

  loading = false;

  // búsqueda (GENTE)
  searchText = '';

  // paginación (si la usas en backend)
  hasMorePosts = false;
  hasMorePeople = false;
  private postsPage = 1;
  private peoplePage = 1;

  // seguimiento
  private currentUserId: string | null = null;
  private followingIds = new Set<string>(); // ids de usuarios a los que sigo

  constructor(
    private postsSvc: PostService,
    private followSvc: FollowService,
    private userSvc: UserService,
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadPosts(true);
    await this.loadSessionAndFollowing();
  }

  private async loadSessionAndFollowing() {
    // asegúrate de tener usuario en memoria
    const me = (await this.auth.getCurrentUser()) || (await this.auth.refreshMe().toPromise());
    const uid = (me as any)?._id || (me as any)?.id || null;
    this.currentUserId = uid;

    if (!uid) return;

    // carga a quién sigo para pintar el estado en "Gente"
    this.followSvc.following(uid).subscribe({
      next: (arr: any[]) => {
        this.followingIds = new Set(arr.map(u => (u._id || u.id)));
        // si ya hay lista cargada, sincroniza flags
        if (this.people.length) {
          this.people = this.people.map(p => ({ ...p, following: this.followingIds.has(p._id) }));
        }
      },
      error: () => {}
    });
  }

  // ======== SEGMENTO ========
  segmentChanged(ev: CustomEvent): void {
    const val = (ev.detail as any).value as Tab;
    this.tab = val;
    if (val === 'people' && this.people.length === 0) {
      this.loadPeople(true);
    }
  }

  // =============== POSTS ===============
  loadPosts(reset = true): void {
    if (reset) { this.postsPage = 1; this.posts = []; }
    this.loading = true;

    this.postsSvc.getPosts().subscribe({
      next: (r: any) => {
        const raw: any[] = Array.isArray(r) ? r : (r?.data ?? []);
        const mapped: PostVM[] = raw.map(x => {
          const likes =
            Array.isArray((x as any).likes)
              ? (x as any).likes.length
              : Number((x as any).likesCount ?? (x as any).likeCount ?? 0);

          const comments =
            Array.isArray((x as any).comments)
              ? (x as any).comments.length
              : Number((x as any).commentsCount ?? 0);

          return {
            ...(x as Post),
            imageUrl: String((x as any).imageUrl ?? (x as any).imagenUrl ?? ''),
            likesCount: likes,
            commentCount: comments,
            likeCount: likes,
          };
        });

        this.posts = reset ? mapped : this.posts.concat(mapped);
        this.hasMorePosts = false; // activa si tu backend pagina
        this.postsPage++;
        this.loading = false;
      },
      error: _ => { this.loading = false; }
    });
  }

  loadMorePosts(ev: any): void {
    this.loadPosts(false);
    setTimeout(() => ev?.target?.complete?.(), 300);
  }

  openPost(_p: PostVM): void {
    // this.router.navigate(['/posts', (_p as any)._id ?? (_p as any).id]);
  }
  trackByPost = (_: number, p: any) => p._id ?? p.id ?? _;

  // =============== GENTE ===============
  onSearch(ev: CustomEvent): void {
    this.searchText = String((ev.detail as any)?.value ?? '').trim();
    this.loadPeople(true);
  }

  private filterPeople(arr: Person[], q: string): Person[] {
    if (!q) return arr;
    const s = q.toLowerCase();
    return arr.filter(u =>
      [u.nombre, u.ciudad, u.nivelEscalada]
        .map(v => (v ?? '').toLowerCase())
        .some(v => v.includes(s))
    );
  }

  loadPeople(reset = true): void {
    if (reset) { this.peoplePage = 1; this.people = []; }
    this.loading = true;

    this.userSvc.getUsers().subscribe({
      next: (users: any[]) => {
        const mapped: Person[] = (users || []).map(u => ({
          _id: u._id || u.id,
          nombre: u.nombre || u.name,
          fotoPerfil: u.fotoPerfil || u.avatarUrl,
          ciudad: u.ciudad,
          nivelEscalada: u.nivelEscalada,
          following: this.followingIds.has(u._id || u.id)
        }));

        const filtered = this.filterPeople(mapped, this.searchText);
        this.people = reset ? filtered : this.people.concat(filtered);

        this.hasMorePeople = false; // activa si paginas
        this.peoplePage++;
        this.loading = false;
      },
      error: _ => { this.loading = false; }
    });
  }

  loadMorePeople(ev: any): void {
    this.loadPeople(false);
    setTimeout(() => ev?.target?.complete?.(), 300);
  }

  toggleFollow(u: Person, ev?: Event): void {
    ev?.stopPropagation();
    const req$ = u.following ? this.followSvc.unfollow(u._id) : this.followSvc.follow(u._id);
    req$.subscribe({
      next: () => {
        u.following = !u.following;
        if (u.following) this.followingIds.add(u._id);
        else this.followingIds.delete(u._id);
        this.auth.refreshMe().subscribe();
      },
      error: _ => {}
    });
  }

  openProfile(u: Person): void {
    // this.router.navigate(['/perfil', u._id]);
  }

  goToChats(): void { this.router.navigate(['/chats']); }

  trackByUser = (_: number, u: Person) => u._id;
}
