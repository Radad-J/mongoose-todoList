document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');

  const fetchTodos = async () => {
    try {
      const response = await fetch('/todos');
      const todos = await response.json();
      console.log(todos); // Add this line to debug
      todoList.innerHTML = '';
      todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.textContent = todo.text;
        if (todo.completed) {
          todoItem.classList.add('completed');
        }
        todoList.appendChild(todoItem);
      });
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };
  

  // Function to add a new todo
  const addTodo = async (title) => {
    try {
      const response = await fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });
      const newTodo = await response.json();
      const todoItem = document.createElement('li');
      todoItem.textContent = newTodo.title;
      todoList.appendChild(todoItem);
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  // Fetch todos on initial load
  fetchTodos();

  // Handle form submission
  todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = todoInput.value.trim();
    if (title) {
      addTodo(title);
      todoInput.value = '';
    }
  });
});
