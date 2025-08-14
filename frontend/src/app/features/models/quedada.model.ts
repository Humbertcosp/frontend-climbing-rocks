import { Usuario } from "./usuario.model";

export interface Quedada {
  id: string;
  sectorId: string;
  sectorNombre: string;
  titulo: string;
  fecha: string;  // ISO string
  hora?: string;
  descripcion?: string;
  grado?: number;
  creador: string;
  asistentes: Usuario[];
  notas?: string;
  maxAsistentes?: number;
  sectorCoords?: { lat: number; lon: number };
  vehiculo?: number;
  mascotas?: number;
  imageUrl?: string;
}