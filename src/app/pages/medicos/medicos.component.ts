import { Component, OnInit } from '@angular/core';
import { MedicoService } from 'src/app/services/medico.service';
import { Medico } from 'src/app/models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  constructor(public _medicoService: MedicoService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this._medicoService.cargarMedicos()
      .subscribe(medicos => this.medicos = medicos)
  }

  buscarMedico(termino: string) {

    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this._medicoService.buscarMedicos(termino)
      .subscribe(medicos => this.medicos = medicos);

  }

  borrarMedico(medico: Medico) {
    this._medicoService.borrarMedico(medico._id)
      .subscribe(() => this.cargarMedicos());
  }

}
