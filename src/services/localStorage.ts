import { type CollectedPokemon } from "../types/pokemon";

const STORAGE_KEY = "pokemon-collection";

export const getCollection = (): CollectedPokemon[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

export const saveCollection = (collection: CollectedPokemon[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const addToCollection = (
  pokemon: CollectedPokemon
): CollectedPokemon[] => {
  const collection = getCollection();
  const exists = collection.find((p) => p.id === pokemon.id);

  if (!exists) {
    const newCollection = [...collection, pokemon];
    saveCollection(newCollection);
    return newCollection;
  }

  return collection;
};

export const removeFromCollection = (pokemonId: number): CollectedPokemon[] => {
  const collection = getCollection();
  const newCollection = collection.filter((p) => p.id !== pokemonId);
  saveCollection(newCollection);
  return newCollection;
};

export const reorderCollection = (collection: CollectedPokemon[]): void => {
  saveCollection(collection);
};
