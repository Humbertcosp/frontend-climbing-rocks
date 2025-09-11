import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { QuedadasService } from 'src/app/services/quedadas.service';
import { Quedada } from '../../models/quedada.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-quedadas-list',
  templateUrl: './quedadas-list.page.html',
  styleUrls: ['./quedadas-list.page.scss'],
  standalone: false
})
export class QuedadasListPage implements OnInit, OnDestroy {
  cards: Quedada[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  /** Debe ser pública si la usas en la vista (aunque ahora ya no la usamos directamente). */
  public userId?: string;

  constructor(
    private qSrv: QuedadasService,
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    const u = await this.auth.getCurrentUser();
    // intenta id o _id
    this.userId = (u as any)?._id || (u as any)?.id;

    this.qSrv.quedadas$
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => (this.cards = list ?? []));

    this.loading = true;
    this.qSrv.loadAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => (this.loading = false),
        error: () => (this.loading = false)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById = (_: number, q: Quedada) => q.id;

  /** ¿El usuario logueado está apuntado a esta quedada? (helper para el template) */
  isJoined(q: Quedada): boolean {
    const uid = this.userId;
    if (!uid) return false;
    const list = q.asistentes || [];
    // soporta Usuario completo, {id}, {_id} o string id
    return list.some((a: any) =>
      a === uid || a?.id === uid || a?._id === uid
    );
  }

  /** Click en "Me apunto" / "Salir" */
  apuntarse(q: Quedada, ev?: Event) {
    ev?.stopPropagation();

    if (!this.userId) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    const req$ = this.isJoined(q)
      ? this.qSrv.leave(q.id, this.userId)
      : this.qSrv.join(q.id, this.userId);

    req$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {}, // el servicio ya hace upsert
      error: err => console.error('Error join/leave:', err)
    });
  }

  open(q: Quedada) {
    this.router.navigate(['/quedadas', q.id]);
  }

  doRefresh(event: any) {
    this.qSrv.loadAll().pipe(takeUntil(this.destroy$)).subscribe({
      complete: () => event.target.complete()
    });
  }
}
