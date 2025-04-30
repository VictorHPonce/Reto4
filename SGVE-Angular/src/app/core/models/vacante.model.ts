import { ICategoria } from "./categoria.model"
import { IEmpresa } from "./empresa.model"

export interface IVacante {
    idVacante: number
    nombre: string
    descripcion: string
    fecha: number[]
    salario: number
    estatus?: 'CREADA' | 'CANCELADA' | 'ASIGNADA';
    destacado: boolean
    imagen: string
    detalles: string
    categoria: ICategoria
    empresa: IEmpresa
}

