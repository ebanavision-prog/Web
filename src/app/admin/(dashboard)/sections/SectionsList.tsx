"use client";

import { useState, useTransition } from "react";
import type { Section } from "@prisma/client";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SECTION_LABELS } from "@/lib/section-labels";
import { toggleSection, reorderSections } from "./actions";

function SortableRow({
  section,
  onToggle,
}: {
  section: Section;
  onToggle: (id: number, enabled: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 ${
        isDragging ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-zinc-500 hover:text-white"
          aria-label="Arrastrar para reordenar"
        >
          ⠿
        </button>
        <span>{SECTION_LABELS[section.key] ?? section.key}</span>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          checked={section.enabled}
          onChange={(e) => onToggle(section.id, e.target.checked)}
        />
        Activada
      </label>
    </li>
  );
}

export default function SectionsList({ sections }: { sections: Section[] }) {
  const [items, setItems] = useState(sections);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  function handleToggle(id: number, enabled: boolean) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)));
    startTransition(() => {
      toggleSection(id, enabled);
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((s) => s.id === active.id);
    const newIndex = items.findIndex((s) => s.id === over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);
    setItems(newOrder);
    startTransition(() => {
      reorderSections(newOrder.map((s) => s.id));
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <ul className="max-w-xl space-y-2">
          {items.map((section) => (
            <SortableRow key={section.id} section={section} onToggle={handleToggle} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
