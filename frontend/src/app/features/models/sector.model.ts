import { Via } from '../models/via.model';

export interface Sector {
  id: string;
  nombre: string;
  provincia?: string;
  gradoMin?: string;
  gradoMax?: string;
  aproximacion?: string;
  descripcion?: string;
  fotos?: string[];       // ¡la primera será imageUrl en la lista!
  imageUrl?: string;      // atajo para la foto principal
  lat?: number;
  lng?: number;
  lon?: number;   // longitud en grados decimales
  parkingLat?: number;
  parkingLon?: number;
}


export type Orientacion = 'Mañana' | 'Tarde' | 'Todo el día' | 'Sombra';

export interface Sector {
  id: string;
  nombre: string;
  foto: string;        // url local o remota
  tipoRoca: 'Limestone' | 'Granite' | 'Slate' | 'Sandstone';
  orientacion: Orientacion;
  minAltura: number;
  maxAltura: number;
  vias: Via[];
  mesesBuenos: ('E'|'F'|'M'|'A'|'MAY'|'J'|'JL'|'A'|'S'|'O'|'N'|'D')[];
}