import { useTurnstile } from '@/hooks/useTurnstile';

interface TurnstileWidgetProps {
  onToken: (token: string | null) => void;
  onError?: (error: string) => void;
  resetRef?: React.MutableRefObject<(() => void) | null>;
}

export function TurnstileWidget({ onToken, onError, resetRef }: TurnstileWidgetProps) {
  const { token, error, reset, containerRef } = useTurnstile();

  // Sync token and error to parent
  if (token) onToken(token);
  if (error && onError) onError(error);

  // Expose reset to parent
  if (resetRef) resetRef.current = reset;

  return (
    <>
      <div ref={containerRef} />
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </>
  );
}
