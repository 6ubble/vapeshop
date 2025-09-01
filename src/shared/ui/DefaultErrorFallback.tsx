import React from 'react';

interface DefaultErrorFallbackProps {
  error: Error;
  retry: () => void;
}

export const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ error, retry }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-tg-bg">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">😵</div>
      <h1 className="text-xl font-bold text-tg-text mb-2">
        Что-то пошло не так
      </h1>
      <p className="text-tg-hint mb-6">
        Произошла ошибка в приложении. Попробуйте перезагрузить страницу.
      </p>
      <details className="mb-6 p-3 bg-tg-secondary-bg rounded-lg text-left">
        <summary className="cursor-pointer text-tg-hint text-sm">
          Подробности ошибки
        </summary>
        <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">
          {error.message}
        </pre>
      </details>
      <div className="space-y-2">
        <button 
          onClick={retry}
          className="btn-tg w-full"
        >
          Попробовать снова
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="btn-tg-secondary w-full"
        >
          Перезагрузить страницу
        </button>
      </div>
    </div>
  </div>
);
