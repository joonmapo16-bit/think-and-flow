import { useState, useCallback } from "react";
import { Task, Subtask, DEFAULT_COLUMNS, SAMPLE_TASKS } from "@/types/kanban";
import type { DropResult } from "@hello-pangea/dnd";

export function useKanban() {
  const [columns] = useState(DEFAULT_COLUMNS);
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);

  const getColumnTasks = useCallback(
    (columnId: string) =>
      tasks
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.order - b.order),
    [tasks]
  );

  const onDragEnd = useCallback((result: DropResult) => {
    const { draggableId, source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    setTasks((prev) => {
      const task = prev.find((t) => t.id === draggableId);
      if (!task) return prev;

      // Remove from source column and reorder
      const sourceTasks = prev
        .filter(
          (t) => t.columnId === source.droppableId && t.id !== draggableId
        )
        .sort((a, b) => a.order - b.order);

      const destTasks =
        source.droppableId === destination.droppableId
          ? sourceTasks
          : prev
              .filter((t) => t.columnId === destination.droppableId)
              .sort((a, b) => a.order - b.order);

      // Insert at new position
      const movedTask = {
        ...task,
        columnId: destination.droppableId,
      };
      destTasks.splice(destination.index, 0, movedTask);

      // Reorder
      const reorderedDest = destTasks.map((t, i) => ({ ...t, order: i }));
      const reorderedSource =
        source.droppableId !== destination.droppableId
          ? sourceTasks.map((t, i) => ({ ...t, order: i }))
          : [];

      const otherTasks = prev.filter(
        (t) =>
          t.columnId !== source.droppableId &&
          t.columnId !== destination.droppableId
      );

      return [
        ...otherTasks,
        ...reorderedDest,
        ...(source.droppableId !== destination.droppableId
          ? reorderedSource
          : []),
      ];
    });
  }, []);

  const addTask = useCallback(
    (columnId: string, title: string, description: string = "") => {
      const colTasks = tasks.filter((t) => t.columnId === columnId);
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        description,
        columnId,
        priority: "medium",
        labels: [],
        subtasks: [],
        createdAt: new Date().toISOString(),
        order: colTasks.length,
      };
      setTasks((prev) => [...prev, newTask]);
    },
    [tasks]
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s
              ),
            }
          : t
      )
    );
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    const sub: Subtask = {
      id: `sub-${Date.now()}`,
      title,
      completed: false,
    };
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, subtasks: [...t.subtasks, sub] } : t
      )
    );
  }, []);

  return {
    columns,
    tasks,
    getColumnTasks,
    onDragEnd,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
  };
}
