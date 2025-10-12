export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  foto: string;
  celsius: boolean;
  oscuro: boolean;
  token_not: string | null;
}

export interface Acuario {
  id: number;
  id_usuario: number;
  nombre: string;
  capacidad: number;
  temp_min: number;
  temp_max: number;
  ph_min: number;
  ph_max: number;
  luz: boolean;
  luz_programada: boolean;
  luz_inicio: string;
  luz_final: string;
  filtro: boolean;
  filtro_programado: boolean;
  filtro_inicio: string;
  filtro_final: string;
}
