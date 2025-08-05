import { useState, useEffect } from "react";
import { useCollection } from "../hooks/useCollection";
import type { Pokemon } from "../types/pokemon";
import { getTypeColor, TYPE_ICONS } from "../utils/pokemonUtils";

interface PokemonCardProps {
  pokemon: Pokemon;
  isInCollection: boolean;
  stats: Record<string, number>;
}

const PokemonCard = ({ pokemon, stats, isInCollection }: PokemonCardProps) => {
  const { addPokemon, removePokemon } = useCollection();
  const [localInCollection, setLocalInCollection] = useState(isInCollection);

  // Update local state when prop changes
  useEffect(() => {
    setLocalInCollection(isInCollection);
  }, [isInCollection]);

  const handleAddToCollection = async (pokemon: Pokemon) => {
    const success = addPokemon(pokemon);
    if (success) {
      setLocalInCollection(true);
    }
  };

  const handleRemoveFromCollection = async (pokemonId: number) => {
    const success = removePokemon(pokemonId);
    if (success) {
      setLocalInCollection(false);
    }
  };

  return (
    <div
      key={pokemon.id}
      className="relative rounded-2xl bg-white/10 backdrop-blur-md p-2 shadow-lg transition-transform duration-300 border border-white/20 hover:scale-[1.03]"
    >
      {/* Background gradient layer */}
      <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/20 pointer-events-none" />

      <div className="relative z-10">
        {/* Image */}
        <div className="flex justify-center mb-4">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-28 h-28 object-contain drop-shadow-xl"
            loading="lazy"
          />
        </div>

        {/* Name */}
        <h3 className="text-center text-2xl font-extrabold capitalize text-white drop-shadow-sm mb-3">
          {pokemon.name}
        </h3>

        {/* Types */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium  ${getTypeColor(
                type.name
              )} bg-opacity-10 text-opacity-90 backdrop-blur-sm shadow-sm`}
              title={type.name.toUpperCase()}
            >
              <span>{TYPE_ICONS[type.name] || "❔"}</span>
              <span className="truncate">{type.name.toUpperCase()}</span>
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 mt-2 text-white text-sm">
          {/* HP */}
          <div className="flex flex-col items-center bg-green-500/10 rounded-lg p-2">
            <div className="text-lg font-bold text-green-400 flex items-center gap-1">
              ❤️ <span>{stats.hp}</span>
            </div>
            <div className="text-xs uppercase tracking-wide text-green-300">
              HP
            </div>
          </div>

          {/* Attack */}
          <div className="flex flex-col items-center bg-red-500/10 rounded-lg p-2">
            <div className="text-lg font-bold text-red-400 flex items-center gap-1">
              ⚔️ <span>{stats.attack}</span>
            </div>
            <div className="text-xs uppercase tracking-wide text-red-300">
              ATK
            </div>
          </div>

          {/* Defense */}
          <div className="flex flex-col items-center bg-blue-500/10 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-400 flex items-center gap-1">
              🛡️ <span>{stats.defense}</span>
            </div>
            <div className="text-xs uppercase tracking-wide text-blue-300">
              DEF
            </div>
          </div>
        </div>

        {/* Add/Remove Icons */}
        <div className="absolute top-2 right-2 flex items-center">
          {localInCollection ? (
            <button
              onClick={() => handleRemoveFromCollection(pokemon.id)}
              className="bg-red-500 hover:bg-red-700  text-white rounded-full cursor-pointer transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => handleAddToCollection(pokemon)}
              className="bg-green-500 hover:bg-green-700 text-white rounded-full  cursor-pointer transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
