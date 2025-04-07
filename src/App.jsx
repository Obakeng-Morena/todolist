import React, { useState, useEffect } from 'react';
import './TodoList.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [blogs, setBlogs] = useState(() => {
    const savedBlogs = localStorage.getItem('blogs');
    return savedBlogs ? JSON.parse(savedBlogs) : [];
  });
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [editBlogId, setEditBlogId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('blogs', JSON.stringify(blogs));
  }, [blogs]);

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const handleToggleComplete = (index) => {
    const updatedTasks = tasks.map((task, taskIndex) => {
      if (taskIndex === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
    setTasks(updatedTasks);
  };

  const handleAddBlog = () => {
    if (blogTitle.trim() !== '' && blogContent.trim() !== '') {
      setBlogs([...blogs, { id: Date.now(), title: blogTitle, content: blogContent, read: false, response: '' }]);
      setBlogTitle('');
      setBlogContent('');
    }
  };

  const handleReadBlog = (id) => {
    setBlogs(blogs.map(blog => blog.id === id ? { ...blog, read: true } : blog));
  };

  const handleResponseBlog = (id, response) => {
    setBlogs(blogs.map(blog => blog.id === id ? { ...blog, response } : blog));
  };

  const handleDeleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  const handleEditBlog = (id, title, content) => {
    setEditBlogId(id);
    setEditText(content);
    setEditTitle(title);
  };

  const handleSaveEditBlog = (id) => {
    setBlogs(blogs.map(blog => blog.id === id ? { ...blog, content: editText, title: editTitle } : blog));
    setEditBlogId(null);
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="input-container">
        <input type="text" value={newTask} onChange={handleInputChange} placeholder="Task" />
        <button onClick={handleAddTask}>ADD TASK</button>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <input type="checkbox" checked={task.completed} onChange={() => handleToggleComplete(index)} />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>
            <button className="delete-button" onClick={() => handleDeleteTask(index)}>❌</button>
          </li>
        ))}
      </ul>

      <h2>Blog Posts</h2>
      <div className="blog-form">
        <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="Blog Title" />
        <textarea value={blogContent} onChange={(e) => setBlogContent(e.target.value)} placeholder="Blog Content" />
        <button onClick={handleAddBlog}>Post Blog</button>
      </div>
      <ul className="blog-list">
        {blogs.map(blog => (
          <li key={blog.id} className="blog-item">
            {editBlogId === blog.id ? (
              <div>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button onClick={() => handleSaveEditBlog(blog.id)}>Save</button>
              </div>
            ) : (
              <div>
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
                <p>Read: {blog.read ? 'Yes' : 'No'}</p>
                {blog.read && <p>Response: {blog.response}</p>}
                <button onClick={() => handleReadBlog(blog.id)}>Mark Read</button>
                <input type="text" placeholder="Response" onChange={(e) => handleResponseBlog(blog.id, e.target.value)}/>
                <button onClick={() => handleEditBlog(blog.id, blog.title, blog.content)}>Edit</button>
                <button onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;