async function fetchTodos() {
  try {
    const response = await fetch('http://localhost:3000/todos');
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    const todos = await response.json();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.textContent = todo.text;
      const button = document.createElement('button');
      button.textContent = 'Delete';
      button.onclick = async () => {
        try {
          const deleteResponse = await fetch(`http://localhost:3000/todos/${todo._id}`, { method: 'DELETE' });
          if (!deleteResponse.ok) {
            throw new Error('Failed to delete todo');
          }
          fetchTodos();
        } catch (error) {
          alert(`Error deleting todo: ${error.message}`);
        }
      };
      li.appendChild(button);
      todoList.appendChild(li);
    });
  } catch (error) {
    alert(`Error fetching todos: ${error.message}`);
  }
}

document.getElementById('todo-form').onsubmit = async (e) => {
  e.preventDefault();
  const input = document.getElementById('todo-input');
  
  if (!input.value.trim()) {
    alert('Todo text cannot be empty');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: input.value })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      alert(`Error: ${errorText || 'Failed to create todo'}`);
      return;
    }
    
    input.value = '';
    fetchTodos();
  } catch (error) {
    alert(`Error creating todo: ${error.message}`);
  }
};

fetchTodos();
