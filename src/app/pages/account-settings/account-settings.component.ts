import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private _document) { }

  ngOnInit() {



  }

  cambiarColor(tema: string) {
    // console.log(tema);
    let url = `assets/css/colors/${tema}.css`;
    this._document.getElementById('tema').setAttribute('href', url);

  }

}
