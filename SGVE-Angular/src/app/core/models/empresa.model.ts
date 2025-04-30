import { IUsuario } from "./usuario.model"

export interface IEmpresa {
    idEmpresa?: number
    cif: string
    nombreEmpresa: string
    direccionFiscal: string
    pais: string
    usuario: IUsuario
}
