import { type Pokemon } from "../types/pokemon";

export const getPokemonStats = (pokemon: Pokemon) => {
  const stats: Record<string, number> = {};

  pokemon.stats.forEach((stat) => {
    stats[stat.stat.name] = stat.base_stat;
  });

  return stats;
};
