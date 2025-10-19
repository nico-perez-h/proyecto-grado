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

export interface Alerta {
  id: number;
  id_acuario: number;
  titulo: string;
  descripcion: string;
  fecha_hora: string;
}

export interface Parametro {
  id: number;
  id_acuario: number;
  tipo: ParametroTipo;
  valor: number;
  fecha_hora: string;
}

export enum ParametroTipo {
  TEMPERATURA = "Temperatura",
  PH = "PH",
  DUREZA = "Dureza",
  AMONIO = "Amonio",
  NITRITOS = "Nitritos (No2)",
  NITRATOS = "Nitratos (No3)",
  ALCALINIDAD = "Alcalinidad",
  TDS = "TDS",
}
