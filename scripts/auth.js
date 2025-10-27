class AuthPage {
  constructor() {
    this.api = window.api;
    this.init();
  }

  init() {
    if (this.api.isAuthenticated()) {
      window.location.href = "dashboard.html";
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.switchTab(e.target.dataset.tab)
      );
    });

    document
      .getElementById("loginForm")
      .addEventListener("submit", (e) => this.handleLogin(e));

    document
      .getElementById("registerForm")
      .addEventListener("submit", (e) => this.handleRegister(e));
  }

  switchTab(tabName) {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

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

document.addEventListener("DOMContentLoaded", () => {
  new AuthPage();
});
