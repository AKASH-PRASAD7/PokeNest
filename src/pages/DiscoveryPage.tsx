import { useInfiniteQuery } from "@tanstack/react-query";
import { useCollection } from "../hooks/useCollection";
import { useEffect, useMemo } from "react";
import { getPokemonStats } from "../utils/pokemonUtils";
import { useInView } from "react-intersection-observer";
import { fetchPokemonList, fetchPokemonDetails } from "../services/api";
import PokemonCard from "../components/PokemonCard";
import Loader from "../components/Loader";

const DiscoveryPage = () => {
  const { isPokemonInCollection } = useCollection();
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

  if (isLoading) {
    return (
      <div className="min-h-screen  p-4">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  p-4 flex items-center justify-center">
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
    <div className="min-h-screen  p-4">
      <div className="max-w-6xl mx-auto">
        <h1
          className=" md:text-5xl sm:text-2xl 
        font-bold text-center mb-8 text-gray-100"
        >
          Discover Pokémon
        </h1>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
            {allPokemonData.map((pokemon) => {
              const stats = getPokemonStats(pokemon);
              const isInCollection = isPokemonInCollection(pokemon.id);

              return (
                <PokemonCard
                  pokemon={pokemon}
                  stats={stats}
                  isInCollection={isInCollection}
                />
              );
            })}
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
