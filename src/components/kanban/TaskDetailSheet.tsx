import { Task } from "@/types/kanban";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CheckCircle2, Circle, Plus, Tag } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
}

export function TaskDetailSheet({
  task,
  open,
  onClose,
  onUpdate,
  onToggleSubtask,
  onAddSubtask,
}: Props) {
  const [newSubtask, setNewSubtask] = useState("");

  if (!task) return null;

  const completedSubs = task.subtasks.filter((s) => s.completed).length;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">
            <Input
              value={task.title}
              onChange={(e) => onUpdate(task.id, { title: e.target.value })}
              className="text-xl font-bold border-none px-0 focus-visible:ring-0 h-auto"
            />
          </SheetTitle>
        </SheetHeader>

        {/* Priority */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Priority
            </label>
            <Select
              value={task.priority}
              onValueChange={(v) =>
                onUpdate(task.id, { priority: v as Task["priority"] })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Low</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="high">🔴 High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due date */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Due Date
            </label>
            <Input
              type="date"
              value={task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : ""}
              onChange={(e) =>
                onUpdate(task.id, {
                  dueDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                })
              }
              className="w-48"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Description
            </label>
            <Textarea
              value={task.description}
              onChange={(e) =>
                onUpdate(task.id, { description: e.target.value })
              }
              placeholder="Add a description..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Labels */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Labels
            </label>
            <div className="flex flex-wrap gap-1.5">
              {task.labels.map((l) => (
                <Badge key={l} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {l}
                </Badge>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Subtasks{" "}
              {task.subtasks.length > 0 && (
                <span className="text-primary">
                  ({completedSubs}/{task.subtasks.length})
                </span>
              )}
            </label>
            <div className="space-y-2">
              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 group"
                >
                  <Checkbox
                    checked={sub.completed}
                    onCheckedChange={() => onToggleSubtask(task.id, sub.id)}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      sub.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {sub.title}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <Input
                  placeholder="Add subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newSubtask.trim()) {
                      onAddSubtask(task.id, newSubtask.trim());
                      setNewSubtask("");
                    }
                  }}
                  className="text-sm h-8"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (newSubtask.trim()) {
                      onAddSubtask(task.id, newSubtask.trim());
                      setNewSubtask("");
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
