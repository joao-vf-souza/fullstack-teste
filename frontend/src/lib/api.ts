const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Email ou senha inválidos');
  return res.json();
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Erro ao registrar');
  return res.json();
}

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Erro ao buscar tarefas');
  return res.json();
}

export async function createTask(data: { title: string; description?: string }): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar tarefa');
  return res.json();
}

export async function updateTask(id: number, data: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar tarefa');
  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Erro ao excluir tarefa');
}
