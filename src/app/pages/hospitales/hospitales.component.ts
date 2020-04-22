import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

// declare var Swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html'
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];

  constructor(public _hospitalService: HospitalService, public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
      .subscribe(() => this.cargarHospitales());
  }

  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
    this._hospitalService.buscarHospital(termino)
      .subscribe((hospitales: any) => this.hospitales = hospitales)
  }

  cargarHospitales() {
    this._hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.hospitales = hospitales;
      });
  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital)
      .subscribe(() => this.cargarHospitales());
  }

  borrarHospital(hospital: Hospital) {
    this._hospitalService.borrarHospital(hospital._id)
      .subscribe(() => this.cargarHospitales())
  }

  crearHospital() {
    Swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      icon: 'info',
      // showCancelButton: true,
      // showLoaderOnConfirm: true
    }).then((valor) => {
      let nombre: string = valor.value;
      // console.log(nombre);
      if (!nombre || nombre.length === 0) {
        return;
      }

      this._hospitalService.crearHospital(nombre)
        .subscribe(() => this.cargarHospitales());

    });
  }

  actualizarImagen(hospital: Hospital) {
    this._modalUploadService.mostrarModal('hospitales', hospital._id);
  }

}
