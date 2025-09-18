import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuedadasService } from 'src/app/services/quedadas.service';
import { SectoresService } from 'src/app/services/sector.service';
import { Sector } from '../../models/sector.model';
import { AuthService } from 'src/app/services/auth.service'; // si ya lo usas

@Component({
  selector: 'app-quedadas-create',
  templateUrl: './quedadas-create.page.html',
  styleUrls: ['./quedadas-create.page.scss'],
  standalone: false
})
export class QuedadasCreatePage implements OnInit {
  fg!: FormGroup;
  sectores: Sector[] = [];
  /** para limitar fechas pasadas en el datepicker */
  minDate = new Date().toISOString().slice(0, 10);

  constructor(
    private fb: FormBuilder,
    private qSrv: QuedadasService,
    private sSrv: SectoresService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.fg = this.fb.group({
      sectorId:    ['', Validators.required],
      titulo:      ['', [Validators.required, Validators.minLength(3)]],
      fecha:       ['', Validators.required],   // yyyy-MM-dd
      hora:        ['', Validators.required],   // HH:mm
      descripcion: ['']
    });

    this.sSrv.list().subscribe((secs: Sector[]) => this.sectores = secs);
  }

  trackById = (_: number, s: Sector) => s.id;

  async onSubmit() {
    if (this.fg.invalid) return;

    const { sectorId, titulo, fecha, hora, descripcion } = this.fg.value;

    const sector = this.sectores.find(s => s.id === sectorId);
    const sectorNombre = sector?.nombre || '';

    // Monta ISO combinando fecha + hora
    const fechaISO = new Date(`${fecha}T${hora}:00`).toISOString();

    const me = await this.auth.getCurrentUser().catch(() => null);

    this.qSrv.create({
      sectorId,
      sectorNombre,
      titulo,
      fecha: fechaISO,
      hora,
      descripcion,
      creador: me?.id ?? 'yo',
      asistentes: []   // el backend añadirá al creador si así lo deseas
    }).subscribe(() => this.router.navigate(['/quedadas']));
  }

  onFechaChange(ev: CustomEvent) {
  const v = (ev.detail as any).value as string; // 'YYYY-MM-DD' o ISO
  // nos quedamos con sólo la parte de fecha
  const soloFecha = v.includes('T') ? v.slice(0, 10) : v;
  this.fg.patchValue({ fecha: soloFecha });
}

onHoraChange(ev: CustomEvent) {
  const v = (ev.detail as any).value as string; // 'HH:mm' o ISO
  const hhmm = v.includes('T') ? v.split('T')[1].slice(0, 5) : v.slice(0, 5);
  this.fg.patchValue({ hora: hhmm });
}
}
