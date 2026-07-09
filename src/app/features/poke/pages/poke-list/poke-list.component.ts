import { Component, OnInit } from '@angular/core';
import { Pokemon, PokemonListItem, TypeDetail } from '../../model/poke.model';
import { PokeService } from '../../services/poke.service';
import { debounceTime, Observable, of, Subject, switchMap } from 'rxjs';

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

  searchSubject = new Subject<string>();
  searchResults: Pokemon[] = [];
  searching = false;
  searchError = false;
  allPokemonNames: PokemonListItem[] = [];

  selectedType: TypeDetail | null = null;

  constructor(private pokeService: PokeService) { }

  ngOnInit(): void {
    this.loadPokemons();

    this.pokeService.getAllPokemonNames().subscribe({
      next: (names) => this.allPokemonNames = names,
      error: (err) => console.error(err)
    });

    this.searchSubject.pipe(
      debounceTime(500),
      switchMap((name) => {
        this.searching = true;
        this.searchError = false;

        const matches = this.allPokemonNames
          .filter(p => p.name.includes(name))
          .slice(0, 5);

        return this.pokeService.searchRelated(matches);
      })
    ).subscribe({
      next: (pokemons) => {
        this.searchResults = pokemons;
        this.searching = false;
        this.searchError = pokemons.length === 0;
      },
      error: () => {
        this.searchResults = [];
        this.searching = false;
        this.searchError = true;
      }
    });
  }

  onSearch(name: string): void {
    const nombre = name.trim().toLowerCase();

    if (nombre) {
      this.searchSubject.next(nombre);
    } else {
      this.searchResults = [];
      this.searchError = false;
    }
  }

  onTypeSelected(url: string): void {
    this.pokeService.getTypeDetail(url).subscribe({
      next: (type) => this.selectedType = type,
      error: (err) => console.error(err)
    });
  }

  closeTypeDetail(): void {
    this.selectedType = null;
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