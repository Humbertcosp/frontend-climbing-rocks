import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { GestureController, } from '@ionic/angular';
import { QuedadasService } from 'src/app/services/quedadas.service';
import { Quedada } from '../../models/quedada.model';
import { ViewWillLeave }   from '@ionic/angular';

@Component({
  selector: 'app-quedadas-list',
  templateUrl: './quedadas-list.page.html',
  styleUrls: ['./quedadas-list.page.scss'],
  standalone: false
})
export class QuedadasListPage implements OnInit, AfterViewInit, ViewWillLeave {
  cards: Quedada[] = [];

  @ViewChildren('cardEl', { read: ElementRef })
  cardElements!: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private qSrv: QuedadasService,
    private gestureCtrl: GestureController,
    private el: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    // 1) dispara la carga inicial
    this.qSrv.loadAll().subscribe();
    // 2) suscríbete al stream de quedadas
    this.qSrv.quedadas$.subscribe(list => this.cards = [...list]);
  }

  ngAfterViewInit() {
    this.cardElements.forEach((elRef, i) => {
      const nativeEl = elRef.nativeElement;
      const gesture = this.gestureCtrl.create({
        el: nativeEl,
        gestureName: 'swipe-card',
        onMove: ev => {
          nativeEl.style.transform =
            `translateX(${ev.deltaX}px) rotate(${ev.deltaX/15}deg)`;
        },
        onEnd: ev => this.onEnd(ev, nativeEl, i)
      });
      gesture.enable();
    });
  }

  private onEnd(detail: any, el: HTMLElement, index: number) {
    const threshold = el.clientWidth * 0.4;
    if (Math.abs(detail.deltaX) > threshold) {
      const dir = detail.deltaX > 0 ? 1 : -1;
      el.style.transition = 'transform 0.3s ease-out';
      el.style.transform = `translateX(${dir * window.innerWidth}px) rotate(${dir * 30}deg)`;
      setTimeout(() => this.cards.splice(index, 1), 300);
      if (dir > 0) this.apuntarse(this.cards[index]);
    } else {
      el.style.transition = 'transform 0.2s ease-out';
      el.style.transform = 'translateX(0px) rotate(0deg)';
    }
  }

  apuntarse(q: Quedada) {
    // asume que tu usuario “yo” ya lo defines en el servicio o viene del Auth
    this.qSrv.join(q.id, 'yo').subscribe();
  }

  ionViewWillEnter(): void {
    this.el.nativeElement.removeAttribute('inert');
  }
  ionViewWillLeave(): void {
    (document.activeElement as HTMLElement | null)?.blur();
    this.el.nativeElement.setAttribute('inert', '');
  }
}