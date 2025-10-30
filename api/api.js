const API_BASE_URL =
  "https://listaterefasapi-aea5etf8aqgrf0cm.brazilsouth-01.azurewebsites.net/api";

const requestHeaders = {
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

class API {
  constructor() {}

  isAuthenticated() {
    return !!localStorage.getItem("mylist_token");
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/Usuario`, {
        ...requestHeaders,
        method: "POST",
        body: JSON.stringify({
          nome: userData.nome,
          email: userData.email,
          senha: userData.senha,
          criadoEm: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Erro ao cadastrar usuário",
        };
      }

      return { success: true, user: data.user || data };
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return { success: false, message: "Erro ao conectar com o servidor" };
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        ...requestHeaders,
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Erro ao entrar.",
        };
      }

      if (!!data) {
        const token = data.token;
        localStorage.setItem("mylist_token", token);
        localStorage.setItem(
          "mylist_current_user",
          JSON.stringify(data.userId)
        );

        return { success: true, userId: data.userId, token };
      }

      return { success: true, userId: data.userId || data };
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return { success: false, message: "Erro ao conectar com o servidor" };
    }
  }

  async logout() {
    localStorage.removeItem("mylist_token");
    localStorage.removeItem("mylist_current_user");

    return { success: true };
  }

  getCurrentUserId() {
    const id = localStorage.getItem("mylist_current_user");

    return id ? JSON.parse(id) : null;
  }

  //IN REVIEW
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/Categoria`, {
        ...requestHeaders,
        method: "GET",
      });

      const data = await response.json();


      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Erro ao buscar categorias.",
        };
      }

      const currentUserId = this.getCurrentUserId();
      const userCategories = data.filter((c) => c.usuarioId === currentUserId);

      return { success: true, categories: userCategories || [] };
    } catch (error) {
      console.error("Erro ao buscar:", error);
      return { success: false, message: "Erro ao conectar com o servidor" };
    }
  }

  // Categories CRUD

  async createCategory(categoryData) {
    const categories = JSON.parse(
      localStorage.getItem("mylist_categories") || "[]"
    );
    const currentUser = this.getCurrentUserId();

    const newCategory = {
      id: Math.max(...categories.map((c) => c.id), 0) + 1,
      usuario_id: currentUser.id,
      nome: categoryData.nome,
      criado_em: new Date().toISOString(),
    };

    categories.push(newCategory);
    localStorage.setItem("mylist_categories", JSON.stringify(categories));
    return { success: true, category: newCategory };
  }

  async updateCategory(id, categoryData) {
    const categories = JSON.parse(
      localStorage.getItem("mylist_categories") || "[]"
    );
    const index = categories.findIndex((c) => c.id === id);

    if (index !== -1) {
      categories[index] = { ...categories[index], ...categoryData };
      localStorage.setItem("mylist_categories", JSON.stringify(categories));
      return { success: true, category: categories[index] };
    }

    return { success: false, message: "Categoria não encontrada" };
  }

  async deleteCategory(id) {
    const categories = JSON.parse(
      localStorage.getItem("mylist_categories") || "[]"
    );
    const filteredCategories = categories.filter((c) => c.id !== id);

    // Remove category from tasks
    const tasks = JSON.parse(localStorage.getItem("mylist_tasks") || "[]");
    const updatedTasks = tasks.map((t) =>
      t.categoria_id === id ? { ...t, categoria_id: null } : t
    );

    localStorage.setItem(
      "mylist_categories",
      JSON.stringify(filteredCategories)
    );
    localStorage.setItem("mylist_tasks", JSON.stringify(updatedTasks));

    return { success: true };
  }

  // Tasks CRUD
  async getTasks(filters = {}) {
    const tasks = JSON.parse(localStorage.getItem("mylist_tasks") || "[]");
    const currentUser = this.getCurrentUserId();
    let userTasks = tasks.filter((t) => t.usuario_id === currentUser?.id);

    // Apply filters
    if (filters.categoria_id) {
      userTasks = userTasks.filter(
        (t) => t.categoria_id === Number.parseInt(filters.categoria_id)
      );
    }

    if (filters.status) {
      userTasks = userTasks.filter((t) => t.status === filters.status);
    }

    return userTasks;
  }

  async createTask(taskData) {
    const tasks = JSON.parse(localStorage.getItem("mylist_tasks") || "[]");
    const currentUser = this.getCurrentUserId();

    const newTask = {
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
      usuario_id: currentUser.id,
      categoria_id: taskData.categoria_id
        ? Number.parseInt(taskData.categoria_id)
        : null,
      titulo: taskData.titulo,
      descricao: taskData.descricao || "",
      data_vencimento: taskData.data_vencimento || null,
      hora_vencimento: taskData.hora_vencimento || null,
      status: taskData.status || "pendente",
      criado_em: new Date().toISOString(),
    };

    tasks.push(newTask);
    localStorage.setItem("mylist_tasks", JSON.stringify(tasks));
    return { success: true, task: newTask };
  }

  async updateTask(id, taskData) {
    const tasks = JSON.parse(localStorage.getItem("mylist_tasks") || "[]");
    const index = tasks.findIndex((t) => t.id === id);

    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...taskData,
        categoria_id: taskData.categoria_id
          ? Number.parseInt(taskData.categoria_id)
          : null,
      };
      localStorage.setItem("mylist_tasks", JSON.stringify(tasks));
      return { success: true, task: tasks[index] };
    }

    return { success: false, message: "Tarefa não encontrada" };
  }

  async deleteTask(id) {
    const tasks = JSON.parse(localStorage.getItem("mylist_tasks") || "[]");
    const filteredTasks = tasks.filter((t) => t.id !== id);

    localStorage.setItem("mylist_tasks", JSON.stringify(filteredTasks));
    return { success: true };
  }
}

window.api = new API();
