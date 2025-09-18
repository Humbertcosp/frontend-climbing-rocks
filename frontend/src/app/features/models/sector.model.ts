// SOLO FRONTEND: interfaz TS (sin mongoose)

export interface Sector {
  id: string;                       // mapea _id -> id en el servicio
  nombre: string;                   // mapea name|nombre -> nombre
  imageUrl?: string;                // para la tarjeta (puede venir vacío)

  area?: string;
  country?: string;
  region?: string;
  location?: { type: 'Point'; coordinates: [number, number] };
    
  lat?: number;
  lon?: number;
  parkingLat?: number;
  parkingLon?: number;
  approachMin?: number;
  vias?: number;

  rock?: string;
  styles?: string[];
  orientation?: string[];
  season?: string[];
  shade?: string[];
  approach_min?: number;
  family_friendly?: boolean;
  rain_proof?: boolean;
  routes?: number;
  grade_min?: string;
  grade_max?: string;
  description_md?: string;

  source?: string;
  source_url?: string;
  license?: string;
  last_scraped_at?: string | Date;
  last_ai_enriched_at?: string | Date;
  status?: 'draft' | 'review' | 'published';
}
