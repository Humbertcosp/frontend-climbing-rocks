import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuedadasService } from 'src/app/services/quedadas.service';
import { SectoresService } from 'src/app/services/sector.service';
import { Sector } from '../../models/sector.model';

@Component({
  selector: 'app-quedadas-create',
  templateUrl: './quedadas-create.page.html',
  styleUrls: ['./quedadas-create.page.scss'],
  standalone: false
})
export class QuedadasCreatePage implements OnInit {
  fg!: FormGroup;
  sectores: Sector[] = [];

  constructor(
    private fb: FormBuilder,
    private qSrv: QuedadasService,
    private sSrv: SectoresService,
    private router: Router
  ) {}

  ngOnInit() {
  this.fg = this.fb.group({
    sectorId:    ['', Validators.required],
    titulo:      ['', Validators.required],
    fecha:       ['', Validators.required],  // yyyy-MM-dd
    hora:        ['', Validators.required],  // HH:mm
    descripcion: ['']
  });

  this.sSrv.getAll().subscribe((secs: Sector[]) => this.sectores = secs);
}

onSubmit() {
  if (this.fg.invalid) return;
  const { sectorId, titulo, fecha, hora, descripcion } = this.fg.value;

  const sector = this.sectores.find(s => s.id === sectorId);
  const sectorNombre = sector?.nombre || '';

  const fechaISO = new Date(`${fecha}T${hora}:00`).toISOString();

  this.qSrv.create({
    sectorId,
    sectorNombre,
    titulo,
    fecha: fechaISO,
    hora,
    descripcion,
    creador: 'yo',
    asistentes: []
  }).subscribe(() => this.router.navigate(['/quedadas']));
}
}
