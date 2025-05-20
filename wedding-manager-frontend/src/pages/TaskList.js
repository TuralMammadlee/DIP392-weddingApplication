import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: weddingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getTasksByWeddingId(weddingId);
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tasks. Please try again later.');
        setLoading(false);
      }
    };

    fetchTasks();
  }, [weddingId]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      // Refresh tasks after update
      const response = await taskService.getTasksByWeddingId(weddingId);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to update task status. Please try again.');
    }
  };

  const handleAddTask = () => {
    navigate(`/weddings/${weddingId}/tasks/new`);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  // Mock tasks data until backend is ready
  const mockTasks = [
    {
      id: 1,
      title: 'Send invitations',
      dueDate: '2024-05-15',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Finalize menu selections',
      dueDate: '2024-05-22',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Book hair and makeup trial',
      dueDate: '2024-05-29',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Order wedding favors',
      dueDate: '2024-04-30',
      status: 'overdue',
      priority: 'high'
    }
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Wedding Tasks</h1>
        <button onClick={handleAddTask} className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Add New Task
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Task</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={task.status === 'completed'}
                          onChange={() => handleStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                          id={`task-${task.id}`}
                        />
                      </div>
                    </td>
                    <td>
                      <span className={task.status === 'completed' ? 'text-decoration-line-through' : ''}>
                        {task.title}
                      </span>
                    </td>
                    <td>
                      <span className={task.status === 'overdue' ? 'text-danger' : ''}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${task.priority === 'high' ? 'danger' : 'warning'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList; 