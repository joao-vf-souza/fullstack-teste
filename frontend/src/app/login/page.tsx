'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';
import styles from './auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      localStorage.setItem('access_token', data.access_token);
      router.push('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Login</h1>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••"
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className={styles.link}>
          Não tem conta? <Link href="/register">Criar conta</Link>
        </p>
      </form>
    </main>
  );
}
