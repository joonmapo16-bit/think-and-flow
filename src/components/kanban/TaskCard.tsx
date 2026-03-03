import { Task } from "@/types/kanban";
import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Circle, MoreHorizontal, Trash2 } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LABEL_COLORS: Record<string, string> = {
  "MOTION DESIGN": "bg-[hsl(var(--label-motion))]",
  "UI/UX DESIGN": "bg-[hsl(var(--label-design))]",
  RESEARCH: "bg-[hsl(var(--label-research))]",
  DEVELOPMENT: "bg-[hsl(var(--label-development))]",
  TESTING: "bg-[hsl(var(--label-testing))]",
};

const PRIORITY_DOTS: Record<string, string> = {
  high: "bg-[hsl(var(--priority-high))]",
  medium: "bg-[hsl(var(--priority-medium))]",
  low: "bg-[hsl(var(--priority-low))]",
};

interface Props {
  task: Task;
  index: number;
  onClick: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, index, onClick, onDelete }: Props) {
  const completedSubs = task.subtasks.filter((s) => s.completed).length;
  const totalSubs = task.subtasks.length;
  const progress = totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0;

  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj && isPast(dueDateObj) && !isToday(dueDateObj);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "group rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md cursor-pointer",
              snapshot.isDragging && "shadow-lg rotate-2 scale-105 ring-2 ring-primary/30"
            )}
            onClick={onClick}
          >
            {/* Labels */}
            {task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {task.labels.map((label) => (
                  <span
                    key={label}
                    className={cn(
                      "text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full text-white",
                      LABEL_COLORS[label] || "bg-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="font-semibold text-sm text-card-foreground leading-snug mb-1">
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {task.description}
              </p>
            )}

            {/* Progress bar */}
            {totalSubs > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span className="font-semibold">
                    {completedSubs} / {totalSubs}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Priority dot */}
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    PRIORITY_DOTS[task.priority]
                  )}
                />
                {/* Due date */}
                {dueDateObj && (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-[10px]",
                      isOverdue
                        ? "text-destructive font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    <Calendar className="w-3 h-3" />
                    {format(dueDateObj, "d MMM")}
                  </span>
                )}
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
