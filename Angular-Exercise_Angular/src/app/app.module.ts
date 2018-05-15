import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SelectHtml5Component } from './components/select-html5/select-html5.component';
import { PersonService } from './services/person.service';
import { DateItFirstUpperPipe } from './pipes/date-it-first-upper.pipe';
import { ModalFormComponent } from './components/modal-form/modal-form.component';

import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [
    AppComponent,
    SelectHtml5Component,
    DateItFirstUpperPipe,
    ModalFormComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ClickOutsideModule,
    HttpModule
  ],
  providers: [
    PersonService,
    { provide: LOCALE_ID, useValue: 'it' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){
    registerLocaleData(localeIt, 'it');
  }
}
