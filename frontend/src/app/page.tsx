'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/tasks');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Carregando...</p>
    </main>
  );
}
