import { useCollection } from "../hooks/useCollection";
import {
  getPokemonStats,
  getTypeColor,
  TYPE_ICONS,
} from "../utils/pokemonUtils";
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
      style={{ ...style, cursor: isDragging ? "grabbing" : "grab" }}
      {...attributes}
      {...listeners}
      className={`group rounded-2xl bg-white/10 backdrop-blur-md p-4 shadow-lg transition-all duration-300 border border-white/20 overflow-hidden select-none ${
        isDragging
          ? "shadow-2xl rotate-3 scale-105 border-blue-400 bg-blue-50 z-50"
          : "hover:shadow-xl hover:-translate-y-1"
      }`}
    >
      {/* Drag Handle */}
      <div
        className={`absolute top-2 left-2 p-1 rounded-md transition-all pointer-events-none ${
          isDragging
            ? "bg-blue-200"
            : "bg-gray-100 opacity-0 group-hover:opacity-100"
        }`}
      >
        <GripVertical size={16} className="text-gray-500" />
      </div>

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(pokemon.id);
        }}
        className="absolute top-2 right-2  bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md z-30 cursor-pointer"
      >
        <Trash2 size={14} />
      </button>

      {/* Content */}
      <div className="relative z-10">
        {/* Image */}
        <div className="flex justify-center mb-4">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-24 h-24 object-contain drop-shadow-xl"
          />
        </div>

        {/* Name */}
        <h3 className="text-center text-lg font-extrabold capitalize text-white mb-3">
          {pokemon.name}
        </h3>

        {/* Type Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                type.name
              )} text-white shadow-md`}
              title={type.name.toUpperCase()}
            >
              <span>{TYPE_ICONS[type.name] || "❔"}</span>
              <span className="truncate">{type.name.toUpperCase()}</span>
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-3 text-white text-sm">
          <div className="flex flex-col items-center bg-green-500/10 rounded-lg p-2">
            <div className="text-lg font-bold text-green-400 flex items-center gap-1">
              ❤️ <span>{stats.hp}</span>
            </div>
            <div className="text-xs uppercase tracking-wide text-green-300">
              HP
            </div>
          </div>

          <div className="flex flex-col items-center bg-red-500/10 rounded-lg p-2">
            <div className="text-lg font-bold text-red-400 flex items-center gap-1">
              ⚔️ <span>{stats.attack}</span>
            </div>
            <div className="text-xs uppercase tracking-wide text-red-300">
              ATK
            </div>
          </div>

          <div className="flex flex-col items-center bg-blue-500/10 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-400 flex items-center gap-1">
              🛡️ <span>{stats.defense}</span>
            </div>
            <div className="text-xs uppercase tracking-wide text-blue-300">
              DEF
            </div>
          </div>
        </div>

        {/* Date Added */}
        <div className="text-xs text-gray-400 text-center">
          Added: {new Date(pokemon.dateAdded).toLocaleDateString()}
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
    console.log("Drag started");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("Drag ended", event);
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const oldIndex = collection.findIndex((item) => item.id === active.id);
      const newIndex = collection.findIndex((item) => item.id === over.id);

      console.log("Moving from", oldIndex, "to", newIndex);
      const newCollection = arrayMove(collection, oldIndex, newIndex);
      reorderPokemon(newCollection);
    }
  };

  if (collection.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
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
    <div className="min-h-screen  p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            My Pokémon Collection ({collection.length})
          </h1>
          <p className="text-gray-400 flex items-center justify-center gap-2">
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
