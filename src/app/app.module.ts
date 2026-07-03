import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PokeModule } from './features/poke/poke.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, PokeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
