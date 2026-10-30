import { CATEGORIES, type Category } from "@/lib/videos";

type CategoryChipsProps = {
  selected: Category;
  onSelect: (category: Category) => void;
};

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {CATEGORIES.map((category) => {
        const isSelected = category === selected;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`h-8 shrink-0 rounded-full px-3.5 text-sm ${
              isSelected
                ? "bg-zinc-900 font-medium text-white"
                : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            }`}
            aria-pressed={isSelected}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
