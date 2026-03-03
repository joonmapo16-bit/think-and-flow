import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useKanban } from "@/hooks/useKanban";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { KanbanHeader } from "@/components/kanban/KanbanHeader";
import { TaskDetailSheet } from "@/components/kanban/TaskDetailSheet";
import { ChatPanel } from "@/components/kanban/ChatPanel";
import { Task } from "@/types/kanban";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const {
    columns,
    tasks,
    getColumnTasks,
    onDragEnd,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
  } = useKanban();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.info("Please sign up or log in to save your board. Feature coming soon!");
        setSaving(false);
        return;
      }

      // Upsert board
      let boardId: string;
      const { data: existingBoard } = await supabase
        .from("boards")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (existingBoard) {
        boardId = existingBoard.id;
      } else {
        const { data: newBoard, error } = await supabase
          .from("boards")
          .insert({ user_id: user.id, name: "Project Board" })
          .select("id")
          .single();
        if (error || !newBoard) throw error;
        boardId = newBoard.id;
      }

      // Delete existing tasks for this board
      await supabase.from("tasks").delete().eq("board_id", boardId);

      // Insert tasks
      for (const task of tasks) {
        const { data: savedTask, error: taskError } = await supabase
          .from("tasks")
          .insert({
            board_id: boardId,
            title: task.title,
            description: task.description,
            column_id: task.columnId,
            priority: task.priority,
            due_date: task.dueDate || null,
            labels: task.labels,
            order: task.order,
          })
          .select("id")
          .single();

        if (taskError || !savedTask) continue;

        // Insert subtasks
        if (task.subtasks.length > 0) {
          await supabase.from("subtasks").insert(
            task.subtasks.map((s) => ({
              task_id: savedTask.id,
              title: s.title,
              completed: s.completed,
            }))
          );
        }
      }

      toast.success("Board saved successfully! 🎉");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save board");
    } finally {
      setSaving(false);
    }
  };

  const currentSelected = selectedTask
    ? tasks.find((t) => t.id === selectedTask.id) || null
    : null;

  return (
    <div className="min-h-screen bg-background">
      <KanbanHeader
        onToggleChat={() => setChatOpen((p) => !p)}
        chatOpen={chatOpen}
        onSave={handleSave}
        saving={saving}
      />

      <main className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Project Board
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop tasks between columns to update their status
          </p>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={getColumnTasks(col.id)}
                onAddTask={(title) => addTask(col.id, title)}
                onTaskClick={setSelectedTask}
                onDeleteTask={deleteTask}
              />
            ))}
          </div>
        </DragDropContext>
      </main>

      <TaskDetailSheet
        task={currentSelected}
        open={!!currentSelected}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
        onToggleSubtask={toggleSubtask}
        onAddSubtask={addSubtask}
      />

      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        tasks={tasks}
      />
    </div>
  );
};

export default Index;
