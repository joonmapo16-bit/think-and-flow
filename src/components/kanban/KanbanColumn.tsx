import { Column, Task } from "@/types/kanban";
import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  column: Column;
  tasks: Task[];
  onAddTask: (title: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanColumn({ column, tasks, onAddTask, onTaskClick, onDeleteTask }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAddTask(newTitle.trim());
      setNewTitle("");
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col w-[320px] min-w-[320px] shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: column.color }}
        />
        <h2 className="font-semibold text-foreground text-sm tracking-wide">
          {column.title}
        </h2>
        <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
        <button
          onClick={() => setIsAdding(true)}
          className="ml-auto p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 flex flex-col gap-3 rounded-2xl p-3 min-h-[200px] transition-colors",
              snapshot.isDraggingOver
                ? "bg-primary/5 ring-2 ring-primary/10"
                : "bg-muted/40"
            )}
          >
            {/* Add task input */}
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input
                    autoFocus
                    placeholder="Task title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAdd();
                      if (e.key === "Escape") {
                        setIsAdding(false);
                        setNewTitle("");
                      }
                    }}
                    onBlur={() => {
                      if (!newTitle.trim()) {
                        setIsAdding(false);
                        setNewTitle("");
                      }
                    }}
                    className="bg-card border-primary/20 text-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {tasks.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                index={i}
                onClick={() => onTaskClick(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
