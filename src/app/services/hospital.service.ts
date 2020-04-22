import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';
import { UsuarioService } from './usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales: number = 0;

  constructor(private http: HttpClient, private _usuarioService: UsuarioService) { }


  cargarHospitales() {
    let url = URL_SERVICIOS + '/hospital';
    return this.http.get(url)
      .pipe(map((resp: any) => {
        this.totalHospitales = resp.total;
        return resp.hospitales;
      }))
  }

  obtenerHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.hospital))
  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => Swal.fire('Hospital borrado', 'Eliminado correctamente', 'success')))
  }

  crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, { nombre })
      .pipe(map((resp: any) => resp.hospital));
  }

  buscarHospital(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.hospitales));
  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, hospital)
      .pipe(map((resp: any) => {
        Swal.fire('Hospital actualizado', hospital.nombre, 'success');

        return resp.hospital;
      }));
  }


}
