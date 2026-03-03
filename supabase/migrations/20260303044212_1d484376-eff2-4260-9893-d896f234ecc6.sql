
-- Create boards table
CREATE TABLE public.boards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Project Board',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  column_id TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMPTZ,
  labels TEXT[] DEFAULT '{}',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subtasks table
CREATE TABLE public.subtasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

-- Boards policies
CREATE POLICY "Users can view own boards" ON public.boards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own boards" ON public.boards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own boards" ON public.boards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own boards" ON public.boards FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies (through board ownership)
CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.boards WHERE boards.id = tasks.board_id AND boards.user_id = auth.uid()));
CREATE POLICY "Users can create own tasks" ON public.tasks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.boards WHERE boards.id = tasks.board_id AND boards.user_id = auth.uid()));
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.boards WHERE boards.id = tasks.board_id AND boards.user_id = auth.uid()));
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.boards WHERE boards.id = tasks.board_id AND boards.user_id = auth.uid()));

-- Subtasks policies (through task -> board ownership)
CREATE POLICY "Users can view own subtasks" ON public.subtasks FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.tasks JOIN public.boards ON boards.id = tasks.board_id WHERE tasks.id = subtasks.task_id AND boards.user_id = auth.uid()));
CREATE POLICY "Users can create own subtasks" ON public.subtasks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.tasks JOIN public.boards ON boards.id = tasks.board_id WHERE tasks.id = subtasks.task_id AND boards.user_id = auth.uid()));
CREATE POLICY "Users can update own subtasks" ON public.subtasks FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.tasks JOIN public.boards ON boards.id = tasks.board_id WHERE tasks.id = subtasks.task_id AND boards.user_id = auth.uid()));
CREATE POLICY "Users can delete own subtasks" ON public.subtasks FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.tasks JOIN public.boards ON boards.id = tasks.board_id WHERE tasks.id = subtasks.task_id AND boards.user_id = auth.uid()));

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON public.boards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
