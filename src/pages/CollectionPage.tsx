import { useCollection } from "../hooks/useCollection";
import { getPokemonStats, getTypeColor } from "../utils/pokemonUtils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical } from "lucide-react";
import { type CollectedPokemon } from "../types/pokemon";

// Individual sortable Pokemon card component
interface SortablePokemonCardProps {
  pokemon: CollectedPokemon;
  onRemove: (id: number) => void;
}

const SortablePokemonCard = ({
  pokemon,
  onRemove,
}: SortablePokemonCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pokemon.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const stats = getPokemonStats(pokemon);

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, cursor: isDragging ? 'grabbing' : 'grab' }}
      {...attributes}
      {...listeners}
      className={`group relative bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden border-2 select-none ${
        isDragging
          ? "shadow-2xl rotate-3 scale-110 border-blue-400 bg-blue-50 z-50"
          : "border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200"
      }`}
    >
      {/* Drag Handle Indicator */}
      <div
        className={`absolute top-2 left-2 p-1 rounded-md transition-all pointer-events-none ${
          isDragging
            ? "bg-blue-200"
            : "bg-gray-100 opacity-0 group-hover:opacity-100"
        }`}
      >
        <GripVertical size={16} className="text-gray-500" />
      </div>

      <div className="relative p-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(pokemon.id);
          }}
          className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
        >
          <Trash2 size={14} />
        </button>

        <div className="text-center mb-4">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
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
              <div className="font-semibold text-green-600">{stats.hp}</div>
              <div className="text-xs">HP</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{stats.attack}</div>
              <div className="text-xs">ATK</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{stats.defense}</div>
              <div className="text-xs">DEF</div>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center mt-3">
            Added: {new Date(pokemon.dateAdded).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionPage = () => {
  const { collection, removePokemon, reorderPokemon } = useCollection();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    console.log('Drag started');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag ended', event);
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const oldIndex = collection.findIndex((item) => item.id === active.id);
      const newIndex = collection.findIndex((item) => item.id === over.id);

      console.log('Moving from', oldIndex, 'to', newIndex);
      const newCollection = arrayMove(collection, oldIndex, newIndex);
      reorderPokemon(newCollection);
    }
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            My Pokémon Collection ({collection.length})
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <GripVertical size={18} className="text-gray-400" />
            Drag and drop to reorder your collection
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={collection.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collection.map((pokemon) => (
                <SortablePokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onRemove={removePokemon}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CollectionPage;
