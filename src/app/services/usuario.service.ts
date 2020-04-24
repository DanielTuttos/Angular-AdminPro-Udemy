import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from './subir-archivo.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];


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
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));//es necesario convertirlo en un string
    localStorage.setItem('menu', JSON.stringify(menu));//es necesario convertirlo en un string

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);

  }

  loginGoogle(token: string) {
    let url = URL_SERVICIOS + '/usuario/login/google';

    return this.http.post(url, { token })
      .pipe(map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }))

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
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }), catchError(err => {
        swal.fire("Error en el login", err.error.mensaje, "error");
        return throwError(err);
      }));

  }

  crearUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
      .pipe(map((resp: any) => {
        swal.fire("Usuario creado", usuario.email, "success");
        return resp.usuario;
      }), catchError(err => {
        swal.fire(err.error.mensaje, err.error.errors.message, "error");
        return throwError(err);
      }));

  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;

    url += '?token=' + this.token;

    //console.log(url);
    return this.http.put(url, usuario)
      .pipe(map((resp: any) => {

        if (usuario._id === this.usuario._id) {
          let usuarioDB: Usuario = resp.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }

        swal.fire("Usuario actualizado", usuario.nombre, "success");
        return true;
      }), catchError(err => {
        swal.fire(err.error.mensaje, err.error.errors.message, "error");
        return throwError(err);
      }));
  }


  cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) => {
        //console.log(resp);

        this.usuario.img = resp.usuarioActualizado.img;

        swal.fire("Imagen actualizado", this.usuario.nombre, "success");

        this.guardarStorage(id, this.token, this.usuario, this.menu);

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
