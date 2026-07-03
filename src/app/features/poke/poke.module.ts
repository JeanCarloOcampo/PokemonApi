import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { PokeCardComponent } from './components/poke-card/poke-card.component';
import { PokeListComponent } from './pages/poke-list/poke-list.component';



@NgModule({
  declarations: [
    PokeCardComponent,
    PokeListComponent
  ],
  imports: [
    CommonModule, HttpClientModule
  ],

  exports: [PokeListComponent]
})
export class PokeModule { }
