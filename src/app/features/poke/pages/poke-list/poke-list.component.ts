import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../model/poke.model';
import { PokeService } from '../../services/poke.service';
import { finalize, Observable, of } from 'rxjs';

@Component({
  selector: 'app-poke-list',
  standalone: false,
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss'
})
export class PokeListComponent implements OnInit {
  pokemons$: Observable<Pokemon[]> = of([]);
  pokemons: Pokemon[] = [];
  limit = 20;
  offset = 0;
  loading = true;
  error = false;
  constructor(private pokeService: PokeService) { }
  ngOnInit(): void {
    this.loadPokemons();
  }
  loadPokemons(): void {
    this.loading = true;
    this.error = false;
    this.pokeService
      .getPokemons(this.limit, this.offset)
      .subscribe({
        next: (pokemons) => {
          this.pokemons$ = of(pokemons);
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.error = true;
          this.loading = false;
        }
      });
  }
  nextPage(): void {
    this.offset += this.limit;
    this.loadPokemons();
  }
  previousPage(): void {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadPokemons();
    }
  }
}