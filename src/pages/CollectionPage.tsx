import { useCollection } from "../hooks/useCollection";
import { getPokemonStats } from "../utils/pokemonUtils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import { Trash2 } from "lucide-react";
// import { type CollectedPokemon } from '../types/pokemon';

const CollectionPage = () => {
  const { collection, removePokemon, reorderPokemon } = useCollection();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(collection);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderPokemon(items);
  };

  if (collection.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Pokémon in Collection
          </h2>
          <p className="text-gray-500">
            Start discovering and collecting Pokémon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          My Pokémon Collection ({collection.length})
        </h1>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="pokemon-collection">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {collection.map((pokemon, index) => {
                  const stats = getPokemonStats(pokemon);
                  return (
                    <Draggable
                      key={pokemon.id}
                      draggableId={pokemon.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 ${
                            snapshot.isDragging
                              ? "shadow-2xl rotate-2 scale-105"
                              : "hover:shadow-lg hover:-translate-y-1"
                          }`}
                        >
                          <div className="relative">
                            <button
                              onClick={() => removePokemon(pokemon.id)}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>

                            <div className="text-center mb-4">
                              <img
                                src={
                                  pokemon.sprites.other["official-artwork"]
                                    .front_default
                                }
                                alt={pokemon.name}
                                className="w-24 h-24 mx-auto mb-3"
                              />
                              <h3 className="text-lg font-bold capitalize text-gray-800">
                                {pokemon.name}
                              </h3>
                            </div>

                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1 justify-center">
                                {pokemon.types.map((type) => (
                                  <span
                                    key={type.type.name}
                                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(
                                      type.type.name
                                    )}`}
                                  >
                                    {type.type.name}
                                  </span>
                                ))}
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                                <div className="text-center">
                                  <div className="font-semibold text-green-600">
                                    {stats.hp}
                                  </div>
                                  <div className="text-xs">HP</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-red-600">
                                    {stats.attack}
                                  </div>
                                  <div className="text-xs">ATK</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-blue-600">
                                    {stats.defense}
                                  </div>
                                  <div className="text-xs">DEF</div>
                                </div>
                              </div>

                              <div className="text-xs text-gray-400 text-center mt-3">
                                Added:{" "}
                                {new Date(
                                  pokemon.dateAdded
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

// Helper function to get type-specific colors
const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-green-400",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
  };
  return colors[type] || "bg-gray-400";
};

export default CollectionPage;
