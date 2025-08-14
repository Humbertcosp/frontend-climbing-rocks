import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { QuedadasService }    from 'src/app/services/quedadas.service';
import { Quedada }            from '../../models/quedada.model';



@Component({
  selector: 'app-quedadas-details',
  templateUrl: './quedadas-details.page.html',
  styleUrls: ['./quedadas-details.page.scss'],
  standalone: false
})
export class QuedadasDetailsPage implements OnInit {
   quedada?: Quedada;
  isJoined = false;

  constructor(
    private route: ActivatedRoute,
    private qSrv: QuedadasService,
    private el: ElementRef<HTMLElement>
  ) {}

    ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id')!;
  this.qSrv.getById(id).subscribe(q => {
    if (!q) return;              
    this.quedada = q;
    this.checkJoined();
  });
}

  private checkJoined() {
    this.isJoined = !!this.quedada?.asistentes.find(u => u.id === 'yo');
  }

  toggleJoin() {
    if (!this.quedada) return;

    if (this.isJoined) {
      this.qSrv.leave(this.quedada.id, 'yo')
        .subscribe(() => this.checkJoined());
    } else {
      this.qSrv.join(this.quedada.id, 'yo')
        .subscribe(() => this.checkJoined());
    }
  }

  ionViewDidEnter() {
    const foco = this.el.nativeElement.querySelector('ion-title, ion-card-title');
    if (foco instanceof HTMLElement) {
      foco.setAttribute('tabindex', '-1');
      foco.focus();
    }
  }

  get daysLeft(): number {
    if (!this.quedada) return 0;
    const diff = new Date(this.quedada.fecha).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  openDirections() {
    if (!this.quedada?.sectorCoords) return;
    const { lat, lon } = this.quedada.sectorCoords;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  }

  share() {
    if (!this.quedada) return;
    const shareData = {
      title: this.quedada.titulo,
      text: `Quedada en ${this.quedada.sectorNombre} el ${new Date(this.quedada.fecha).toLocaleDateString()}`,
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Enlace copiado al portapapeles');
    }
  }

}