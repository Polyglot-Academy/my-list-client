// Authentication page logic
class AuthPage {
  constructor() {
    this.api = window.api;
    this.init();
  }

  init() {
    // Check if already authenticated
    if (this.api.isAuthenticated()) {
      window.location.href = "dashboard.html";
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    // Tab switching
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.switchTab(e.target.dataset.tab)
      );
    });

    // Login form
    document
      .getElementById("loginForm")
      .addEventListener("submit", (e) => this.handleLogin(e));

    // Register form
    document
      .getElementById("registerForm")
      .addEventListener("submit", (e) => this.handleRegister(e));
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${tabName}Tab`).classList.add("active");
  }

  async handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const result = await this.api.login(email, password);

      if (result.success) {
        window.location.href = "dashboard.html";
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Erro ao fazer login");
    }
  }

  async handleRegister(e) {
    e.preventDefault();

    const nome = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const senha = document.getElementById("registerPassword").value;

    try {
      const result = await this.api.register({ nome, email, senha });

      if (result.success) {
        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        this.switchTab("login");
        document.getElementById("registerForm").reset();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Erro ao fazer cadastro");
    }
  }
}

// Initialize auth page
document.addEventListener("DOMContentLoaded", () => {
  new AuthPage();
});
