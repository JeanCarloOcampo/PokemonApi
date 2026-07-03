import { Component, Input } from '@angular/core';
import { Pokemon } from '../../model/poke.model';

@Component({
  selector: 'app-poke-card',
  standalone: false,
  templateUrl: './poke-card.component.html',
  styleUrl: './poke-card.component.scss'
})
export class PokeCardComponent {
  @Input() pokemon!: Pokemon;
  get image(): string {
    return this.pokemon.sprites.front_default;
  }
  get firstType(): string {
    return this.pokemon.types[0].type.name;
  }
  private getStat(statName: string): number {
    const stat = this.pokemon.stats.find(s => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  }
  get hp(): number {
    return this.getStat('hp');
  }
  get attack(): number {
    return this.getStat('attack');
  }
  get speed(): number {
    return this.getStat('speed');
  }
  get abilities(): string[] {
    return this.pokemon.abilities
      .slice(0, 3)
      .map(a => a.ability.name);
  }
}