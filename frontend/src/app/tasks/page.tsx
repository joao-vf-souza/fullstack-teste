'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, createTask, updateTask, deleteTask, Task } from '@/lib/api';
import styles from './tasks.module.css';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadTasks();
  }, [router, loadTasks]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '' });
    setShowModal(true);
    setError('');
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description || '' });
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('O título é obrigatório');
      return;
    }

    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      setShowModal(false);
      loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar tarefa');
    }
  };

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      await updateTask(task.id, { status: newStatus });
      loadTasks();
    } catch {
      alert('Erro ao atualizar status');
    }
  };

  const confirmDelete = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask(taskToDelete.id);
      setShowDeleteModal(false);
      setTaskToDelete(null);
      loadTasks();
    } catch {
      alert('Erro ao excluir tarefa');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pendente': return styles.statusPending;
      case 'em progresso': return styles.statusProgress;
      case 'concluída': return styles.statusDone;
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Minhas Tarefas</h1>
        <div className={styles.headerActions}>
          <button onClick={openCreateModal} className={styles.addButton}>
            + Nova Tarefa
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {tasks.length === 0 ? (
          <div className={styles.empty}>
            <p>Nenhuma tarefa encontrada</p>
            <button onClick={openCreateModal} className={styles.addButton}>
              Criar primeira tarefa
            </button>
          </div>
        ) : (
          <div className={styles.taskList}>
            {tasks.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <h3 className={styles.taskTitle}>{task.title}</h3>
                  <span className={`${styles.status} ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                
                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}
                
                <div className={styles.taskMeta}>
                  <span>Criada em: {formatDate(task.createdAt)}</span>
                  {task.completedAt && (
                    <span>Concluída em: {formatDate(task.completedAt)}</span>
                  )}
                </div>

                <div className={styles.taskActions}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em progresso">Em Progresso</option>
                    <option value="concluída">Concluída</option>
                  </select>
                  <button
                    onClick={() => openEditModal(task)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => confirmDelete(task)}
                    className={styles.deleteButton}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Criar/Editar */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
            
            {error && <p className={styles.error}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="title">Título *</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Digite o título da tarefa"
                  autoFocus
                />
              </div>
              
              <div className={styles.field}>
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Digite uma descrição (opcional)"
                  rows={4}
                />
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  {editingTask ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && taskToDelete && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar Exclusão</h2>
            <p className={styles.deleteMessage}>
              Tem certeza que deseja excluir a tarefa <strong>&quot;{taskToDelete.title}&quot;</strong>?
            </p>
            <p className={styles.deleteWarning}>Esta ação não pode ser desfeita.</p>
            
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button onClick={handleDelete} className={styles.confirmDeleteButton}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
