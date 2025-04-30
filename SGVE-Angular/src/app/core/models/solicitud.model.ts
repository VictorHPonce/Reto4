import { IUsuario } from "./usuario.model"
import { IVacante } from "./vacante.model"

export interface ISolicitud {
  idSolicitud: number
  fecha: number
  archivo: string
  comentarios: string
  estado: number
  curriculum: string
  vacante: IVacante
  usuario: IUsuario
}




