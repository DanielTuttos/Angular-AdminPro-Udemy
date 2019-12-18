import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;

  auth2: any;

  constructor(private router: Router, private _usuarioServicio: UsuarioService, public _ngZone: NgZone) { }

  ngOnInit() {
    init_plugins();

    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }

  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '172369363266-v914rvj5oo0elnl58hbgh6msk4cmmkpq.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin(document.getElementById('btnGoogle'));

    });
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      // let profile = googleUser.getBasicProfile();

      let token = googleUser.getAuthResponse().id_token;

      this._usuarioServicio.loginGoogle(token)
        .subscribe(() => this._ngZone.run(() => this.router.navigate(['/dashboard'])));
      //forma con vanilla js
      //this._usuarioServicio.loginGoogle(token)
      //.subscribe(() => window.location.href='#/dashboard');

      //console.log(token);


    });
  }


  ingresar(forma: NgForm) {

    if (forma.invalid) {
      return;
    }

    let usuario = new Usuario(
      null,
      forma.value.email,
      forma.value.password
    );

    this._usuarioServicio.login(usuario, forma.value.recuerdame)
      .subscribe(() => this.router.navigate(['/dashboard']));


    //this.router.navigate(['/dashboard']);
    console.log(forma.valid);
    console.log(forma.value);
  }

}
