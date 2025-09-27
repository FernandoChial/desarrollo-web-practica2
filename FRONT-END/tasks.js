const API_URL = "https://desarrollo-web-practica2.onrender.com";

const btnAddTask = document.getElementById("btnAddTask");
const tasksList = document.getElementById("tasksList");
const btnLogout = document.getElementById("btnLogout");

const userId = sessionStorage.getItem("userId");

if (!userId) {
  window.location.href = "index.html";
}

// Cargar tareas
const loadTasks = async () => {
  try {
    const res = await fetch(`${API_URL}/tasks/${userId}`);
    const tasks = await res.json();

    tasksList.innerHTML = "";
    tasks.forEach(t => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div>
          <strong>${t.title}</strong><br>
          ${t.description || ''}<br>
          <span class="badge bg-secondary">${t.status}</span>
        </div>
        <button class="btn btn-sm btn-success">Avanzar Estado</button>
      `;
      li.querySelector("button").addEventListener("click", async () => {
        await fetch(`${API_URL}/tasks/${t.id}/status`, { method: "PUT" });
        loadTasks();
      });
      tasksList.appendChild(li);
    });
  } catch {
    alert("Error cargando tareas");
  }
};

loadTasks();

// Agregar tarea
btnAddTask.addEventListener("click", async () => {
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDesc").value.trim();

  if (!title) return alert("El título es obligatorio.");
    if (!description) return alert("Descripcion obligatoria.");
  

  await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, description })
  });

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDesc").value = "";
  loadTasks();
});

// Logout
btnLogout.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "index.html";
});
