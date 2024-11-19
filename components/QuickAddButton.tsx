'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickAddButtonProps {
  amount: number;
  userId: string;
}

export default function QuickAddButton({ amount, userId }: QuickAddButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/water-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add water log');
      }

      router.refresh();
    } catch (error) {
      console.error('Error adding water log:', error);
      alert('Failed to add water log');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleClick}
      disabled={isLoading}
      variant="outline"
      className="w-full"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        `${amount}ml`
      )}
    </Button>
  );
}