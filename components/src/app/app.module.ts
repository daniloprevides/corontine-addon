import {HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AddonsComponent } from './addons/addons.component';
import  { createCustomElement } from '@angular/elements';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppToastService } from './services/notification-service';
import { CoronaVirusComponent } from './corona-virus/corona-virus';

@NgModule({
  entryComponents: [
    AddonsComponent,
    CoronaVirusComponent
  ],
  declarations: [
    AddonsComponent,
    CoronaVirusComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AppToastService
  ],
  bootstrap: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {
  constructor(private injector : Injector){
    const el = createCustomElement(AddonsComponent, {injector : this.injector});
    customElements.define('addon-store',el as any);

    const elCoronaVirus = createCustomElement(CoronaVirusComponent, {injector : this.injector});
    customElements.define('corona-virus',elCoronaVirus as any);

  }
  ngDoBootstrap(){

  }
}
