const API_URL = "http://localhost:3000";

const btnRegister = document.getElementById("btnRegister");
const btnLogin = document.getElementById("btnLogin");
const msg = document.getElementById("msg");

// Registro
if (btnRegister) {
  btnRegister.addEventListener("click", async (e) => {
    e.preventDefault();

    const registerForm = document.getElementById("registerForm");

    // Validar formulario antes de enviar
    if (!registerForm.checkValidity()) {
      registerForm.classList.add("was-validated");
      return; // no enviar si hay campos vacíos
    }

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (data.success) {
        msg.style.color = "green";
        msg.innerText = "Usuario registrado! Ahora haz login.";
      } else {
        msg.style.color = "red";
        msg.innerText = "Error: Email ya registrado";
      }

      // limpiar inputs
      document.getElementById("regName").value = "";
      document.getElementById("regEmail").value = "";
      document.getElementById("regPassword").value = "";

    } catch (error) {
      console.error("Error al registrar:", error);
      msg.style.color = "red";
      msg.innerText = "Error en la conexión con el servidor";
    }
  });
}

// Login
if (btnLogin) {
  btnLogin.addEventListener("click", async (e) => {
    e.preventDefault();

    const loginForm = document.getElementById("loginForm");

    // Validar formulario antes de enviar
    if (!loginForm.checkValidity()) {
      loginForm.classList.add("was-validated");
      return; // no enviar si hay campos vacíos
    }

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("userId", data.userId);
        window.location.href = "tasks.html"; // redirige a tareas
      } else {
        msg.style.color = "red";
        msg.innerText = "Credenciales inválidas";
      }

      // limpiar inputs
      document.getElementById("loginEmail").value = "";
      document.getElementById("loginPassword").value = "";

    } catch (error) {
      console.error("Error al loguear:", error);
      msg.style.color = "red";
      msg.innerText = "Error en la conexión con el servidor";
    }
  });
}
