import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from './subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;


  constructor(private http: HttpClient, private router: Router, private _subirArchivoService: SubirArchivoService) {
    console.log('servicio del usuario listo');
    this.cargarStorage();
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));//es necesario convertirlo en un string

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);

  }

  loginGoogle(token: string) {
    let url = URL_SERVICIOS + '/usuario/login/google';

    return this.http.post(url, { token }).pipe(map((resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario);
      return true;
    }));

  }

  login(usuario: Usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/usuario/login';

    return this.http.post(url, usuario)
      .pipe(map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        //localStorage.setItem('id', resp.id);
        //localStorage.setItem('token', resp.token);
        //localStorage.setItem('usuario', JSON.stringify//(resp.usuario));//es necesario convertirlo en un string
        return true;
      }));

  }

  crearUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
      .pipe(map((resp: any) => {
        swal.fire("Usuario creado", usuario.email, "success");
        return resp.usuario;
      }));

  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;

    url += '?token=' + this.token;

    //console.log(url);
    return this.http.put(url, usuario)
      .pipe(map((resp: any) => {

        if(usuario._id===this.usuario._id){
          let usuarioDB: Usuario = resp.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
        }

        swal.fire("Usuario actualizado", usuario.nombre, "success");
        return true;
      }));
  }


  cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) => {
        //console.log(resp);

        this.usuario.img = resp.usuarioActualizado.img;

        swal.fire("Imagen actualizado", this.usuario.nombre, "success");

        this.guardarStorage(id, this.token, this.usuario);

      })
      .catch(resp => {
        console.log('error: ', resp);
      })
  }

  cargarUsuarios(desde: number = 0) {
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);

  }

  buscarUsuarios(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.usuarios));
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url)
      .pipe(map(resp => {
        swal.fire('Usuario Borrado', 'El usuario a sido eliminado correctamente', 'success');
        return true;
      }));
  }


}
