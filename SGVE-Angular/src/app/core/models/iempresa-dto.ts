export interface IEmpresaDTO {
    idEmpresa?: number;
    cif: string;
    nombreEmpresa: string;
    direccionFiscal: string;
    pais: string;
    usuario: {
      email: string;
      nombre: string;
      apellidos: string;
      password?: string;
      rol?: 'EMPRESA' | 'ADMON' | 'CLIENTE';
      enabled?: number;
      fechaRegistro?: string;
    };
}
