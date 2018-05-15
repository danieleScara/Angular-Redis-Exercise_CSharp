import { Component, OnInit, Input } from '@angular/core';

import { IPerson } from '../../models/IPerson';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html'
})
export class ModalFormComponent implements OnInit {

  @Input() person:IPerson;
  @Input() title: string;

  constructor() { }

  ngOnInit() { }
}
