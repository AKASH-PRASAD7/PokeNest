import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchPokemonList, fetchPokemonDetails } from "../services/api";
import { type Pokemon } from "../types/pokemon";

export const usePokemonList = () => {
  return useInfiniteQuery({
    queryKey: ["pokemon-list"],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(pageParam, 6),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const offset = url.searchParams.get("offset");
        return offset ? parseInt(offset) : undefined;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};

export const usePokemonDetails = (urls: string[]) => {
  return useQuery({
    queryKey: ["pokemon-details", urls],
    queryFn: async (): Promise<Pokemon[]> => {
      const promises = urls.map((url) => fetchPokemonDetails(url));
      return Promise.all(promises);
    },
    enabled: urls.length > 0,
  });
};
