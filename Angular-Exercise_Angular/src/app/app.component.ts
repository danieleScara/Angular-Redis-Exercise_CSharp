import { Component, OnInit } from '@angular/core';

import { IPerson } from './models/IPerson';
import { PersonService } from './services/person.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{

  persons: IPerson[] = [];
  person: IPerson;
  label: string;

  constructor(private personService: PersonService) {}

  ngOnInit() {
    this.personService.getPersons().subscribe(
      data => { 
        this.persons = data.json(); 
        this.persons = this.persons.sort((a, b) => {
          let greatherThen: number;
          (a.id > b.id) ? greatherThen = 1 : greatherThen = -1;
          return greatherThen;
        });
        this.person = this.persons[0];
    },
      error => console.log("Error: "+error)
    );
    this.label = "Persone";
  }

}
