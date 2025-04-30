export interface IUsuario {
    email: string
    nombre?: string
    apellidos?: string
    password?: string
    enabled?: number
    fechaRegistro?: string;
    rol?: 'EMPRESA' | 'ADMON' | 'CLIENTE';
    // rol?: string; // Cambiado a string para mayor flexibilidad';
}
