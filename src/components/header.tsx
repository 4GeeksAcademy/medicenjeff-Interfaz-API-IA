interface HeaderProps {
  onClearChat?: () => void;
  hasMessages?: boolean;
}

export function Header({ onClearChat, hasMessages }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">
            G
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Groq Chat
          </span>
        </div>
        <div className="flex items-center gap-3">
          {hasMessages && onClearChat && (
            <button
              onClick={onClearChat}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              Borrar conversación
            </button>
          )}
          <span className="hidden text-xs text-zinc-500 sm:inline">
            allam-2-7b
          </span>
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
      </div>
    </header>
  );
}