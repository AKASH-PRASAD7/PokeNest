import { type Pokemon, type PokemonListResponse } from "../types/pokemon";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchPokemonList = async (
  offset: number = 0,
  limit: number = 6
): Promise<PokemonListResponse> => {
  const response = await fetch(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon list");
  }
  return response.json();
};

export const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon details");
  }
  return response.json();
};

export const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon details");
  }
  return response.json();
};
