import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Pokemon, PokemonListItem, PokemonListResponse, TypeDetail } from '../model/poke.model';

@Injectable({
  providedIn: 'root'
})
export class PokeService {

  private POKE_API = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemons(limit: number, offset: number): Observable<Pokemon[]> {
    return this.http.get<PokemonListResponse>(
      `${this.POKE_API}?limit=${limit}&offset=${offset}`
    ).pipe(
      map((response: PokemonListResponse) => response.results),
      switchMap((pokemons: PokemonListItem[]) => {
        const pokemonRequest = pokemons.map((pokemon) => 
          this.getPokemonByUrl(pokemon)
        );

        return forkJoin(pokemonRequest);
      })
    );
  }

  getPokemonByUrl(pokemon: PokemonListItem): Observable<Pokemon>{
    return this.http.get<Pokemon>(pokemon.url);
  }

  getAllPokemonNames(): Observable<PokemonListItem[]> {
    return this.http.get<PokemonListResponse>(`${this.POKE_API}?limit=1300`).pipe(
      map((response: PokemonListResponse) => response.results)
    );
  }

  searchRelated(matches: PokemonListItem[]): Observable<Pokemon[]> {
    if (matches.length === 0) {
      return of([]);
    }

    const requests = matches.map((pokemon) => this.getPokemonByUrl(pokemon));
    return forkJoin(requests);
  }

  getTypeDetail(url: string): Observable<TypeDetail> {
    return this.http.get<TypeDetail>(url);
  }

}