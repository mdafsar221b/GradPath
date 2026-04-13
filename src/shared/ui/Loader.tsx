import { Loader2 } from 'lucide-react';

interface LoaderProps {
  text?: string;
  fullPage?: boolean;
}

export const Loader = ({ text = 'Loading...', fullPage = false }: LoaderProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-gray-500 text-sm font-medium">{text}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
