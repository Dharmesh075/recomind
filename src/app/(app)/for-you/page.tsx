'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForYouRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/recommendations');
  }, [router]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
