class MyListApp {
  constructor() {
    this.init();
  }

  async init() {
    this.bindEvents();
    this.showLogin();
  }

  bindEvents() {
    // Login
    document
      .getElementById("loginForm")
      .addEventListener("submit", (e) => this.handleLogin(e));
  }

  showLogin() {
    document.getElementById("loginPage").classList.add("active");
  }

  async handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    alert("Seu login usuário é: " + email + " e sua senha é: " + password);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new MyListApp();
});
