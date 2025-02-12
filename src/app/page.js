"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Fetch Todos
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  // Add Todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    const newTodo = await response.json();
    setTodos([...todos, newTodo]);
    setTitle("");
  };

  // Delete Todo
  const handleDelete = async (id) => {
    const response = await fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setTodos(todos.filter((todo) => todo.id !== id));
    } else {
      console.error("Failed to delete todo");
    }
  };

  // Edit Todo
  const handleEdit = (id, currentTitle) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  // Update Todo
  const handleUpdate = async (id) => {
    if (!editingTitle.trim()) return;

    const response = await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title: editingTitle }),
    });

    if (response.ok) {
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setEditingId(null);
      setEditingTitle("");
    } else {
      console.error("Failed to update todo");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Todo List</h1>
      
      {/* Add Todo Form */}
      <form onSubmit={handleSubmit} className="flex items-center mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a new todo"
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 mr-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add Todo
        </button>
      </form>
      
      {/* Display Todos */}
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-md shadow-sm bg-white"
          >
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 mr-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleUpdate(todo.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingTitle("");
                  }}
                  className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-lg">{todo.title}</span>
                <div>
                  <button
                    onClick={() => handleEdit(todo.id, todo.title)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
