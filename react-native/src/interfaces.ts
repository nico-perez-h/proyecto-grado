export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  foto: string;
  celsius: boolean;
  oscuro: boolean;
  token_not: string | null;
}
