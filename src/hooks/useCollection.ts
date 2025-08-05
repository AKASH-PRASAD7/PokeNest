import { useState, useEffect } from "react";
import { type CollectedPokemon, type Pokemon } from "../types/pokemon";
import {
  getCollection,
  addToCollection,
  removeFromCollection,
  reorderCollection,
} from "../services/localStorage";
import toast from "react-hot-toast";

export const useCollection = () => {
  const [collection, setCollection] = useState<CollectedPokemon[]>([]);

  useEffect(() => {
    setCollection(getCollection());
  }, []);

  const addPokemon = (pokemon: Pokemon) => {
    const collectedPokemon: CollectedPokemon = {
      ...pokemon,
      dateAdded: new Date().toISOString(),
    };

    const updatedCollection = addToCollection(collectedPokemon);

    if (updatedCollection.length > collection.length) {
      setCollection(updatedCollection);
      toast.success(`${pokemon.name} added to collection!`, {
        icon: "✨",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      toast.error(`${pokemon.name} is already in your collection!`, {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const removePokemon = (pokemonId: number) => {
    const updatedCollection = removeFromCollection(pokemonId);
    setCollection(updatedCollection);
    toast.success("Pokémon removed from collection!", {
      icon: "🗑️",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const reorderPokemon = (newCollection: CollectedPokemon[]) => {
    setCollection(newCollection);
    reorderCollection(newCollection);
  };

  const isPokemonInCollection = (pokemonId: number) => {
    return collection.some((p) => p.id === pokemonId);
  };

  return {
    collection,
    addPokemon,
    removePokemon,
    reorderPokemon,
    isPokemonInCollection,
  };
};
