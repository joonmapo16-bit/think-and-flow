import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useKanban } from "@/hooks/useKanban";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { KanbanHeader } from "@/components/kanban/KanbanHeader";
import { TaskDetailSheet } from "@/components/kanban/TaskDetailSheet";
import { ChatPanel } from "@/components/kanban/ChatPanel";
import { Task } from "@/types/kanban";
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

  const handleSave = () => {
    toast.info(
      "To save your board to a database, we need to enable Lovable Cloud. Click the AI Chat button to learn more!"
    );
  };

  // Keep selected task in sync with state
  const currentSelected = selectedTask
    ? tasks.find((t) => t.id === selectedTask.id) || null
    : null;

  return (
    <div className="min-h-screen bg-background">
      <KanbanHeader
        onToggleChat={() => setChatOpen((p) => !p)}
        chatOpen={chatOpen}
        onSave={handleSave}
      />

      <main className="p-6">
        {/* Board title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Project Board
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop tasks between columns to update their status
          </p>
        </div>

        {/* Columns */}
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

      {/* Task detail sheet */}
      <TaskDetailSheet
        task={currentSelected}
        open={!!currentSelected}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
        onToggleSubtask={toggleSubtask}
        onAddSubtask={addSubtask}
      />

      {/* AI Chat panel */}
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Index;
