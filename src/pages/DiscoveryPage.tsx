import { usePokemonList, usePokemonDetails } from "../hooks/usePokemon";
import { useCollection } from "../hooks/useCollection";
import { useEffect, useState } from "react";
import { getPokemonStats } from "../utils/pokemonUtils";
import { useInView } from "react-intersection-observer";
import { type Pokemon } from "../types/pokemon";

const DiscoveryPage = () => {
  const {
    data: pokemonListData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = usePokemonList();

  const [allPokemon, setAllPokemon] = useState<string[]>([]);
  const { ref, inView } = useInView({ threshold: 0 });
  const { addPokemon, isPokemonInCollection } = useCollection();

  useEffect(() => {
    const pokemonUrls =
      pokemonListData?.pages.flatMap((page) =>
        page.results.map((pokemon) => pokemon.url)
      ) || [];
    setAllPokemon(pokemonUrls);
  }, [pokemonListData]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const { data: pokemonDetailsData } = usePokemonDetails(allPokemon);

  const handleAddToCollection = (pokemon: Pokemon) => {
    addPokemon(pokemon);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {pokemonDetailsData?.map((pokemon) => {
        const stats = getPokemonStats(pokemon);
        return (
          <div key={pokemon.id} className="bg-white p-4 rounded shadow-sm">
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              className="w-full h-32 object-contain mb-2"
            />
            <h3 className="text-lg font-bold">{pokemon.name}</h3>
            <div className="text-sm">
              <div>
                Type: {pokemon.types.map((t) => t.type.name).join(", ")}
              </div>
              <div>HP: {stats.hp}</div>
              <div>Attack: {stats.attack}</div>
              <div>Defense: {stats.defense}</div>
            </div>
            <button
              onClick={() => handleAddToCollection(pokemon)}
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded text-sm"
            >
              + Add to Collection
            </button>
          </div>
        );
      })}

      <div ref={ref} className="text-center p-4">
        {isFetchingNextPage ? "Loading more..." : "Scroll to load more"}
      </div>
    </div>
  );
};

export default DiscoveryPage;
