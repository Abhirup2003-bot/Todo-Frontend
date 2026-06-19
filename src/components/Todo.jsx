import React from "react";
import { useState, useEffect } from "react";

const Todo = () => {
  const BASE_URL = "http://localhost:8000/api/v1/todo";
  const [todo, setTodo] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);

  async function addTodoHandler() {
    const trimTodo = inputValue.trim();
    if (trimTodo === "") {
      alert("Please enter a todo");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/add-todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todoName: trimTodo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTodo([...todo, data.createTodo]);
        setInputValue("");
        console.log("Todo added successfully:", data.createTodo);
      } else {
        alert(data.message || "Failed to add todo");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Error adding todo");
    }
  }

  async function deleteTodoHandler(todoId) {
    try {
      const response = await fetch(`${BASE_URL}/delete-todo/${todoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTodo(todo.filter((item) => item._id !== todoId));
        console.log("Todo deleted successfully");
      } else {
        alert(data.message || "Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Error deleting todo");
    }
  }

  async function updateTodoHandler(todoId, currentTodoName) {
    if (!inputValue.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/update-todo/${editTodoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todoName: inputValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTodo(
          todo.map((item) =>
            item._id === editTodoId ? data.updateTodo : item,
          ),
        );

        setInputValue("");
        setEditTodoId(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleEditClick(todo) {
    setInputValue(todo.todoName);
    setEditTodoId(todo._id);
  }

  useEffect(() => {
    async function fetchAllTodos() {
      try {
        const response = await fetch(`${BASE_URL}/get-all-todo`);
        const data = await response.json();
        setTodo(data.getAllTodo);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
    fetchAllTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">My Todo List</h1>
          <p className="text-white text-opacity-90">
            Stay organized and productive
          </p>
        </div>

        {/* Add Todo Section */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodoHandler()}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-200"
            />
            <button
              onClick={editTodoId ? updateTodoHandler : addTodoHandler}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold"
            >
              {editTodoId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* Todo List Section */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {todo.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-lg">
                📝 No todos yet. Add one to get started!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todo.map((item, index) => (
                <li
                  key={item._id}
                  className="p-4 hover:bg-gray-50 transition duration-150 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-gray-400 font-semibold text-sm w-6">
                      {index + 1}.
                    </span>
                    <span className="text-gray-800 text-lg">
                      {item.todoName}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                    <button
                      onClick={() => {
                        handleEditClick(item);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => deleteTodoHandler(item._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {todo.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 text-center text-gray-600">
              <p className="font-semibold">
                {todo.length} {todo.length === 1 ? "task" : "tasks"} total
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
