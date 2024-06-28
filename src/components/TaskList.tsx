import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskList.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  category: string;
  dueDate: string;
  priority: string;
  comments: string[];
  subtasks: Subtask[];
  sharedWith: string[];
}

interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface TaskListProps {
  token: string;
}

const TaskList: React.FC<TaskListProps> = ({ token }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Work' },
    { id: 2, name: 'Personal' },
    { id: 3, name: 'Shopping' }
  ]);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState<string>('');
  const [editTaskCategory, setEditTaskCategory] = useState<string>('');
  const [editTaskDueDate, setEditTaskDueDate] = useState<string>('');
  const [editTaskPriority, setEditTaskPriority] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/protected', {
          headers: { Authorization: token }
        });
        setTasks(response.data.tasks || []); // Ensure tasks are initialized properly
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };

    fetchTasks();
  }, [token]);

  const addTask = () => {
    if (!newTaskTitle || !selectedCategory || !newTaskDueDate || !newTaskPriority) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
      category: selectedCategory,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      comments: [],
      subtasks: [],
      sharedWith: []
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setSelectedCategory('');
    setNewTaskDueDate('');
    setNewTaskPriority('');
  };

  const addCategory = () => {
    if (!newCategoryName) return;

    const newCategory: Category = {
      id: Date.now(),
      name: newCategoryName
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditingTask = (task: Task) => {
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskCategory(task.category);
    setEditTaskDueDate(task.dueDate);
    setEditTaskPriority(task.priority);
  };

  const saveTask = () => {
    setTasks(tasks.map(task =>
      task.id === editTaskId ? { ...task, title: editTaskTitle, category: editTaskCategory, dueDate: editTaskDueDate, priority: editTaskPriority } : task
    ));
    setEditTaskId(null);
    setEditTaskTitle('');
    setEditTaskCategory('');
    setEditTaskDueDate('');
    setEditTaskPriority('');
  };

  const addComment = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, comments: [...task.comments, newComment] } : task
    ));
    setNewComment('');
  };

  const addSubtask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, subtasks: [...task.subtasks, { id: Date.now(), title: newSubtaskTitle, completed: false }] } : task
    ));
    setNewSubtaskTitle('');
  };

  const toggleSubtaskStatus = (taskId: number, subtaskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? {
        ...task,
        subtasks: task.subtasks.map(subtask =>
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        )
      } : task
    ));
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="task-list">
      <h1>Task List</h1>
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="New task title"
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={newTaskDueDate}
        onChange={(e) => setNewTaskDueDate(e.target.value)}
      />
      <select
        value={newTaskPriority}
        onChange={(e) => setNewTaskPriority(e.target.value)}
      >
        <option value="">Select Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={addTask}>Add Task</button>
      <input
        type="text"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        placeholder="New category name"
      />
      <button onClick={addCategory}>Add Category</button>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks"
      />
      <ul>
        {filteredTasks.map(task => (
          <li key={task.id}>
            {editTaskId === task.id ? (
              <div>
                <input
                  type="text"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                />
                <select
                  value={editTaskCategory}
                  onChange={(e) => setEditTaskCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={editTaskDueDate}
                  onChange={(e) => setEditTaskDueDate(e.target.value)}
                />
                <select
                  value={editTaskPriority}
                  onChange={(e) => setEditTaskPriority(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button onClick={saveTask}>Save</button>
              </div>
            ) : (
              <div>
                <span
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                  onClick={() => toggleTaskStatus(task.id)}
                >
                  {task.title} - {task.category} - {task.dueDate} - {task.priority}
                </span>
                <button onClick={() => startEditingTask(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
                <div>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                  />
                  <button onClick={() => addComment(task.id)}>Add Comment</button>
                  <ul>
                    {task.comments.map((comment, index) => (
                      <li key={index}>{comment}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="New subtask title"
                  />
                  <button onClick={() => addSubtask(task.id)}>Add Subtask</button>
                  <ul>
                    {task.subtasks.map(subtask => (
                      <li key={subtask.id}>
                        <span
                          style={{ textDecoration: subtask.completed ? 'line-through' : 'none' }}
                          onClick={() => toggleSubtaskStatus(task.id, subtask.id)}
                        >
                          {subtask.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
