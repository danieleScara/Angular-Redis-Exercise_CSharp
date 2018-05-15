import { Component, OnInit, Input, HostListener, ElementRef, Renderer, ViewChild } from '@angular/core';
import { IPerson } from '../../models/IPerson';
import { PersonService } from '../../services/person.service';
import { $ } from 'protractor';

@Component({
  selector: 'app-select-html5',
  templateUrl: './select-html5.component.html',
  styleUrls: ['./select-html5.component.scss'],
})
export class SelectHtml5Component implements OnInit {

  @Input() public values: IPerson[];
  @Input() public value: IPerson;
  @Input() public label: string;
  @ViewChild('dropButton') private dropButton: ElementRef;

  protected editedPerson: IPerson;
  protected highlightedPerson: IPerson;
  protected isDropOpen: boolean = false;
  protected isInsertMode: boolean = true;
  protected formTitle: string = "Insert";
  protected generatedId: number;

  public constructor(private _personService: PersonService,
    private _elementRef: ElementRef,
    private _renderer: Renderer) { }

  public ngOnInit() {
    this.highlightedPerson = this.value;
    this.isDropOpen = false;
    this.editedPerson = this.value;
  }

  private giveFocus(element: ElementRef): void {
    if (element) {
      this._renderer.invokeElementMethod(element.nativeElement, 'focus');
    }
  }

  protected toggleDrop(isOpen?: boolean): void {
    if(isOpen===undefined) {
      this.isDropOpen = !this.isDropOpen;
    }
    else {
      this.isDropOpen = isOpen;
    }
    if (!this.isDropOpen) {
      this.highlightedPerson = this.value;
    }
  }

  protected toggleCurrentPerson(person: IPerson, event: Event): void {
    this.value = person;
    this.highlightedPerson = this.value;
    this.toggleDrop(false);
    this.giveFocus(this.dropButton);
    event.stopPropagation();
  }

  protected add(person: IPerson): void {
    person.id = this.generatedId;
    if (!this.values || !this.values.length) {
      this.value = person;
    }
    this.values.push(person);
    this.values = this.values.sort((a, b) => {
      let greatherThen: number;
      (a.id > b.id) ? greatherThen = 1 : greatherThen = -1;
      return greatherThen;
    });
    this._personService.add(person);
    this.giveFocus(this.dropButton);
  }

  protected delete(person: IPerson): void {
    let index: number = this.values.findIndex((value)=>{return value===person});
    this.values.splice(index,1);
    if (this.value === person) {
      this.value = this.values[0];
    }
    this.highlightedPerson = this.value;
    this._personService.delete(person);
    this.giveFocus(this.dropButton);
  }

  protected update(person: IPerson): void {
    person.birthDate = this.editedPerson.birthDate;
    person.id = this.editedPerson.id;
    let index: number = this.values.findIndex((value)=>{return value.id===this.editedPerson.id});
    this.values.splice(index,1);
    this.values.push(person);
    if (this.value.id === person.id) {
      this.value = person;
      this.highlightedPerson = this.value;
    }
    this.values = this.values.sort((a, b) => {
      let greatherThen: number;
      (a.id > b.id) ? greatherThen = 1 : greatherThen = -1;
      return greatherThen;
    });
    this._personService.update(person);
    this.giveFocus(this.dropButton);
  }

  protected onDateChange(value: Date): void {
    this.editedPerson.birthDate = value;
  }

  protected onEditModalOpen(person: IPerson, event: Event): void {
    event.stopPropagation();
    this.editedPerson = {
      id: person.id,
      name: person.name,
      surname: person.surname,
      birthDate: person.birthDate
    }
    this.isInsertMode = false;
    this.formTitle = 'Edit';
    window['$']('#exampleModal').modal();
  }

  protected onInsertModalOpen(): void {
    this.isInsertMode = true;
    this.formTitle = 'Insert';
    this.generatedId = this.generateId();
  }

  protected onArrowDownAlt(): void {
    if(!this.isDropOpen) {
      this.toggleDrop(true);
    }
  }

  protected onArrow(isArrowUp: boolean): void {
    let newElementIndex: number;
    if(isArrowUp) {
      newElementIndex = this.values.indexOf(this.highlightedPerson) - 1;
    } else {
      newElementIndex = this.values.indexOf(this.highlightedPerson) + 1;
    }
    if (newElementIndex < 0) {
      newElementIndex = this.values.length - 1;
    }
    if (newElementIndex > this.values.length - 1) {
      newElementIndex = 0;
    }
    this.highlightedPerson = this.values[newElementIndex];
    if (!this.isDropOpen) {
      this.value = this.highlightedPerson;
    }
  }

  protected onEnter(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.isDropOpen) {
      this.value = this.highlightedPerson;
      this.toggleDrop(false);
    }
  }

  protected onCanc(): void {
    if (this.isDropOpen) {
      this.delete(this.highlightedPerson);
    }
  }

  protected onEsc(): void {
    this.toggleDrop(false);
    event.preventDefault();
    window['$']('#exampleModal').modal('hide');
  }

  protected onShiftEnter(event : KeyboardEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.isDropOpen) {
      this.onEditModalOpen(this.highlightedPerson, event); 
    }
  }

  protected onCancelClick(event: MouseEvent): void {
    this.giveFocus(this.dropButton);
    window['$']('#exampleModal').modal('hide');
    event.stopPropagation();
  }

  protected onClickedOutside(event: MouseEvent): void {
    this.toggleDrop(false);
  }

  public generateId(): number {
    let newId: number;
    if (this.values && this.values.length != 0) {
      newId = +this.values[this.values.length - 1].id + 1;
    }
    else {
      newId = 0;
    }
    return newId;
  }
}
