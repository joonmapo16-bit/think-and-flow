import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  MessageSquare,
  Search,
  Save,
  Sparkles,
} from "lucide-react";

interface Props {
  onToggleChat: () => void;
  chatOpen: boolean;
  onSave: () => void;
}

export function KanbanHeader({ onToggleChat, chatOpen, onSave }: Props) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
        </div>
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 w-64 bg-muted/50 border-transparent focus:border-primary/30 h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button
          variant={chatOpen ? "default" : "outline"}
          size="sm"
          onClick={onToggleChat}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI Chat</span>
        </Button>
      </div>
    </header>
  );
}
