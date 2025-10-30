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

  // Auth
  isAuthenticated() {
    return !!localStorage.getItem("mylist_token");
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

  // Users
  getCurrentUserId() {
    const id = localStorage.getItem("mylist_current_user");

    return id ? JSON.parse(id) : null;
  }

  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/Usuario`, {
        ...requestHeaders,
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Erro ao buscar usuario.",
        };
      }

      const currentUserId = this.getCurrentUserId();
      const user = data.filter((c) => c.id === currentUserId)[0];

      return { success: true, user: user || null };
    } catch (error) {
      console.error("Erro ao buscar:", error);
      return { success: false, message: "Erro ao conectar com o servidor" };
    }
  }

  // Categories
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

  // Tasks
  async getTasks() {
    try {
      const response = await fetch(`${API_BASE_URL}/Tarefa`, {
        ...requestHeaders,
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Erro ao buscar tarefas.",
        };
      }

      const currentUserId = this.getCurrentUserId();
      const userTasks = data.filter((c) => c.usuarioId === currentUserId);

      return { success: true, tasks: userTasks || [] };
    } catch (error) {
      console.error("Erro ao buscar:", error);
      return { success: false, message: "Erro ao conectar com o servidor" };
    }
  }

  async updateTask(id, taskData) {
    try {
      const userId = this.getCurrentUserId();

      const response = await fetch(`${API_BASE_URL}/Tarefa/${id}`, {
        ...requestHeaders,
        method: "PUT",
        body: JSON.stringify({
          id: id,
          usuarioId: userId,
          categoriaId: taskData.categoriaId
            ? Number.parseInt(taskData.categoriaId)
            : null,
          titulo: taskData.titulo,
          descricao: taskData.descricao,
          dataVencimento: taskData.dataVencimento,
          horaVencimento: taskData.horaVencimento,
          status: taskData.status,
          criadoEm: taskData.criadoEm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Erro ao atualizar tarefa",
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      return { success: false, message: "Erro ao conectar com o servidor" };
    }
  }

  async deleteTask(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/Tarefa/${id}`, {
        ...requestHeaders,
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Erro ao excluir tarefa.",
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Erro ao buscar:", error);
      return { success: false, message: "Erro ao conectar com o servidor" };
    }
  }

  //IN REVIEW
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
}

window.api = new API();
