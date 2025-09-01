export const LoadingGrid: React.FC = () => (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3 p-4 bg-tg-secondary-bg rounded-lg animate-pulse">
          <div className="w-20 h-20 bg-tg-hint/20 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-tg-hint/20 rounded w-3/4" />
            <div className="h-3 bg-tg-hint/20 rounded w-1/2" />
            <div className="h-4 bg-tg-hint/20 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );