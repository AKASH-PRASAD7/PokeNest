import { useInfiniteQuery } from "@tanstack/react-query";
import { useCollection } from "../hooks/useCollection";
import { useEffect, useMemo } from "react";
import { getPokemonStats, getTypeColor } from '../utils/pokemonUtils';
import { useInView } from "react-intersection-observer";
import { type Pokemon } from "../types/pokemon";
import { fetchPokemonList, fetchPokemonDetails } from "../services/api";

const DiscoveryPage = () => {
  const { addPokemon, isPokemonInCollection } = useCollection();
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
    triggerOnce: false,
  });

  // Fetch Pokemon list with infinite query
  const {
    data: pokemonListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["pokemon-infinite-list"],
    queryFn: async ({ pageParam = 0 }) => {
      const listData = await fetchPokemonList(pageParam, 6);
      // Fetch details for each Pokemon in this page
      const pokemonDetails = await Promise.all(
        listData.results.map((pokemon) => fetchPokemonDetails(pokemon.url))
      );
      return {
        ...listData,
        pokemonDetails,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const offset = url.searchParams.get("offset");
        return offset ? parseInt(offset) : undefined;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Flatten all Pokemon data from all pages
  const allPokemonData = useMemo(() => {
    return pokemonListData?.pages.flatMap((page) => page.pokemonDetails) || [];
  }, [pokemonListData]);

  // Trigger fetching next page when scroll reaches the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleAddToCollection = (pokemon: Pokemon) => {
    addPokemon(pokemon);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-gray-200 p-4 rounded shadow-sm animate-pulse">
      <div className="w-full h-20 bg-gray-300 mb-2 rounded"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-3 bg-gray-300 rounded mb-1"></div>
      <div className="h-3 bg-gray-300 rounded mb-1"></div>
      <div className="h-3 bg-gray-300 rounded mb-3"></div>
      <div className="h-8 bg-gray-300 rounded"></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Discover Pokémon
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={`initial-skeleton-${index}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-500">
            Failed to load Pokémon data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Discover Pokémon
        </h1>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          {allPokemonData.map((pokemon) => {
            const stats = getPokemonStats(pokemon);
            const isInCollection = isPokemonInCollection(pokemon.id);

            return (
              <div
                key={pokemon.id}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Gradient background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Pokemon Image */}
                <div className="relative p-6 pb-4">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <img
                      src={pokemon.sprites.other["official-artwork"].front_default}
                      alt={pokemon.name}
                      className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Pokemon Name */}
                  <h3 className="text-xl font-bold capitalize text-gray-800 text-center mb-3 group-hover:text-blue-600 transition-colors">
                    {pokemon.name}
                  </h3>
                </div>

                {/* Pokemon Details */}
                <div className="px-6 pb-6 relative z-10">
                  {/* Types */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md ${getTypeColor(type.type.name)} transform hover:scale-105 transition-transform`}
                      >
                        {type.type.name.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center bg-green-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-600">{stats.hp}</div>
                      <div className="text-xs text-green-500 font-medium">HP</div>
                    </div>
                    <div className="text-center bg-red-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-red-600">{stats.attack}</div>
                      <div className="text-xs text-red-500 font-medium">ATK</div>
                    </div>
                    <div className="text-center bg-blue-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-blue-600">{stats.defense}</div>
                      <div className="text-xs text-blue-500 font-medium">DEF</div>
                    </div>
                  </div>

                  {/* Add to Collection Button */}
                  <button
                    onClick={() => handleAddToCollection(pokemon)}
                    disabled={isInCollection}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 transform ${
                      isInCollection
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {isInCollection ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        In Collection
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add to Collection
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Loading skeletons for next page */}
          {isFetchingNextPage &&
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        </div>

        {/* Intersection observer trigger */}
        <div ref={ref} className="text-center py-8">
          {isFetchingNextPage ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-600">Loading more Pokémon...</span>
            </div>
          ) : hasNextPage ? (
            <span className="text-gray-500">Scroll to load more</span>
          ) : (
            <span className="text-gray-500">
              You've discovered all available Pokémon!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;
