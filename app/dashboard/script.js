class DashboardPage {
  constructor() {
    this.api = window.api;

    this.currentUserId = null;
    this.categories = [];
    this.tasks = [];
    this.editingTask = null;
    this.editingCategory = null;

    this.init();
  }

  async init() {
    if (!this.api.isAuthenticated()) {
      window.location.href = "../auth/index.html";
      return;
    }

    this.currentUserId = this.api.getCurrentUserId();
    this.bindEvents();

    await this.loadData();

    // this.displayUserName();
  }

  bindEvents() {
    // Logout
    document
      .getElementById("logoutBtn")
      .addEventListener("click", () => this.handleLogout());

    // Tasks
    document
      .getElementById("addTaskBtn")
      .addEventListener("click", () => this.showTaskModal());
    document
      .getElementById("taskForm")
      .addEventListener("submit", (e) => this.handleTaskSubmit(e));
    document
      .getElementById("cancelTaskBtn")
      .addEventListener("click", () => this.hideTaskModal());

    // Categories
    document
      .getElementById("addCategoryBtn")
      .addEventListener("click", () => this.showCategoryModal());
    document
      .getElementById("categoryForm")
      .addEventListener("submit", (e) => this.handleCategorySubmit(e));
    document
      .getElementById("cancelCategoryBtn")
      .addEventListener("click", () => this.hideCategoryModal());

    // Filters
    document
      .getElementById("categoryFilter")
      .addEventListener("change", () => this.applyFilters());
    document
      .getElementById("statusFilter")
      .addEventListener("change", () => this.applyFilters());

    // Modal close buttons
    document.querySelectorAll(".close-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        modal.classList.remove("active");
      });
    });

    // Close modals on backdrop click
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });
    });
  }

  async handleLogout() {
    try {
      await this.api.logout();
      window.location.href = "../auth/index.html";
    } catch (error) {
      alert("Erro ao fazer logout");
    }
  }

  async loadData() {
    try {
      window.loading.show();

      const response = await this.api.getCategories();
      // this.tasks = await this.api.getTasks();
      this.categories = response.categories;

      // console.log("tasks", this.tasks);

      this.renderCategories();
      // this.renderTasks();
      // this.updateFilters();
    } catch (error) {
      alert("Erro ao carregar dados");
    } finally {
      window.loading.hide();
    }
  }

  renderCategories() {
    const container = document.getElementById("categoriesList");

    console.log("categories", this.categories, this.categories.length);

    if (!this.categories.length > 0) {
      container.innerHTML = "<p>Nenhuma categoria encontrada.</p>";
      return;
    }

    container.innerHTML = this.categories
      .map(
        (category) => `
        <div class="category-item">
          <span>${category.nome}</span>
          <div class="category-actions">
            <button onclick="dashboard.editCategory(${category.id})" title="Editar">✏️</button>
            <button onclick="dashboard.deleteCategory(${category.id})" title="Excluir">🗑️</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  renderTasks() {
    const container = document.getElementById("tasksList");

    if (this.tasks.length === 0) {
      container.innerHTML = "<p>Nenhuma tarefa encontrada.</p>";
      return;
    }

    container.innerHTML = this.tasks
      .map((task) => {
        const category = this.categories.find(
          (c) => c.id === task.categoria_id
        );
        const isCompleted = task.status === "concluida";

        return `
          <div class="task-item ${isCompleted ? "completed" : ""}">
            <div class="task-header">
              <h4 class="task-title ${isCompleted ? "completed" : ""}">${
          task.titulo
        }</h4>
              <div class="task-actions">
                <button onclick="dashboard.toggleTaskStatus(${
                  task.id
                })" title="${
          isCompleted ? "Marcar como pendente" : "Marcar como concluída"
        }">
                  ${isCompleted ? "↩️" : "✅"}
                </button>
                <button onclick="dashboard.editTask(${
                  task.id
                })" title="Editar">✏️</button>
                <button onclick="dashboard.deleteTask(${
                  task.id
                })" title="Excluir">🗑️</button>
              </div>
            </div>
            ${
              task.descricao
                ? `<p class="task-description">${task.descricao}</p>`
                : ""
            }
            <div class="task-meta">
              <div>
                ${
                  category
                    ? `<span class="task-category">${category.nome}</span>`
                    : ""
                }
                <span class="task-status ${task.status}">${
          task.status === "pendente" ? "Pendente" : "Concluída"
        }</span>
              </div>
              ${
                task.data_vencimento
                  ? `<span>${this.formatDate(task.data_vencimento)} ${
                      task.hora_vencimento || ""
                    }</span>`
                  : ""
              }
            </div>
          </div>
        `;
      })
      .join("");
  }
  
  // IN REVIEW
  displayUserName() {
    if (this.currentUserId) {
      // document.getElementById("userName").textContent = this.currentUser.nome;
    }
  }

  updateFilters() {
    const categoryFilter = document.getElementById("categoryFilter");
    const taskCategory = document.getElementById("taskCategory");

    categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
    taskCategory.innerHTML =
      '<option value="">Selecione uma categoria</option>';

    this.categories.forEach((category) => {
      const option1 = new Option(category.nome, category.id);
      const option2 = new Option(category.nome, category.id);
      categoryFilter.appendChild(option1);
      taskCategory.appendChild(option2);
    });
  }

  async applyFilters() {
    const categoryId = document.getElementById("categoryFilter").value;
    const status = document.getElementById("statusFilter").value;

    const filters = {};
    if (categoryId) filters.categoria_id = categoryId;
    if (status) filters.status = status;

    try {
      this.tasks = await this.api.getTasks(filters);
      this.renderTasks();
    } catch (error) {
      alert("Erro ao aplicar filtros");
    }
  }

  // Task Modal
  showTaskModal(task = null) {
    this.editingTask = task;
    const modal = document.getElementById("taskModal");
    const title = document.getElementById("taskModalTitle");

    if (task) {
      title.textContent = "Editar Tarefa";
      this.fillTaskForm(task);
    } else {
      title.textContent = "Nova Tarefa";
      document.getElementById("taskForm").reset();
    }

    modal.classList.add("active");
  }

  hideTaskModal() {
    document.getElementById("taskModal").classList.remove("active");
    this.editingTask = null;
  }

  fillTaskForm(task) {
    document.getElementById("taskTitle").value = task.titulo;
    document.getElementById("taskDescription").value = task.descricao || "";
    document.getElementById("taskCategory").value = task.categoria_id || "";
    document.getElementById("taskDate").value = task.data_vencimento || "";
    document.getElementById("taskTime").value = task.hora_vencimento || "";
    document.getElementById("taskStatus").value = task.status;
  }

  async handleTaskSubmit(e) {
    e.preventDefault();

    const taskData = {
      titulo: document.getElementById("taskTitle").value,
      descricao: document.getElementById("taskDescription").value,
      categoria_id: document.getElementById("taskCategory").value,
      data_vencimento: document.getElementById("taskDate").value,
      hora_vencimento: document.getElementById("taskTime").value,
      status: document.getElementById("taskStatus").value,
    };

    try {
      if (this.editingTask) {
        await this.api.updateTask(this.editingTask.id, taskData);
      } else {
        await this.api.createTask(taskData);
      }

      this.hideTaskModal();
      await this.loadData();
    } catch (error) {
      alert("Erro ao salvar tarefa");
    }
  }

  async editTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      this.showTaskModal(task);
    }
  }

  async deleteTask(id) {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await this.api.deleteTask(id);
        await this.loadData();
      } catch (error) {
        alert("Erro ao excluir tarefa");
      }
    }
  }

  async toggleTaskStatus(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      const newStatus = task.status === "pendente" ? "concluida" : "pendente";
      try {
        await this.api.updateTask(id, { status: newStatus });
        await this.loadData();
      } catch (error) {
        alert("Erro ao atualizar status da tarefa");
      }
    }
  }

  // Category Modal
  showCategoryModal(category = null) {
    this.editingCategory = category;
    const modal = document.getElementById("categoryModal");
    const title = document.getElementById("categoryModalTitle");

    if (category) {
      title.textContent = "Editar Categoria";
      document.getElementById("categoryName").value = category.nome;
    } else {
      title.textContent = "Nova Categoria";
      document.getElementById("categoryForm").reset();
    }

    modal.classList.add("active");
  }

  hideCategoryModal() {
    document.getElementById("categoryModal").classList.remove("active");
    this.editingCategory = null;
  }

  async handleCategorySubmit(e) {
    e.preventDefault();

    const categoryData = {
      nome: document.getElementById("categoryName").value,
    };

    try {
      if (this.editingCategory) {
        await this.api.updateCategory(this.editingCategory.id, categoryData);
      } else {
        await this.api.createCategory(categoryData);
      }

      this.hideCategoryModal();
      await this.loadData();
    } catch (error) {
      alert("Erro ao salvar categoria");
    }
  }

  async editCategory(id) {
    const category = this.categories.find((c) => c.id === id);
    if (category) {
      this.showCategoryModal(category);
    }
  }

  async deleteCategory(id) {
    if (
      confirm(
        "Tem certeza que deseja excluir esta categoria? As tarefas associadas ficarão sem categoria."
      )
    ) {
      try {
        await this.api.deleteCategory(id);
        await this.loadData();
      } catch (error) {
        alert("Erro ao excluir categoria");
      }
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.dashboard = new DashboardPage();
});
