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
  constructor() {
    this.initializeData();
  }

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

  //IN REVIEW
  initializeData() {
    // Dados iniciais baseados no script SQL
    if (!localStorage.getItem("mylist_users")) {
      const users = [
        {
          id: 1,
          nome: "Bruno Teste",
          email: "bruno.teste@gmail.com",
          senha: "123456", // Em produção seria hash
          criado_em: new Date().toISOString(),
        },
      ];
      localStorage.setItem("mylist_users", JSON.stringify(users));
    }

    if (!localStorage.getItem("mylist_categories")) {
      const categories = [
        {
          id: 1,
          usuario_id: 1,
          nome: "Trabalho",
          criado_em: new Date().toISOString(),
        },
        {
          id: 2,
          usuario_id: 1,
          nome: "Pessoal",
          criado_em: new Date().toISOString(),
        },
        {
          id: 3,
          usuario_id: 1,
          nome: "Compras",
          criado_em: new Date().toISOString(),
        },
      ];
      localStorage.setItem("mylist_categories", JSON.stringify(categories));
    }

    if (!localStorage.getItem("mylist_tasks")) {
      const tasks = [
        {
          id: 1,
          usuario_id: 1,
          categoria_id: 1,
          titulo: "Reunião de projeto",
          descricao: "Reunião da semana referente ao projeto de semestre.",
          data_vencimento: "2025-08-26",
          hora_vencimento: "10:00",
          status: "pendente",
          criado_em: new Date().toISOString(),
        },
        {
          id: 2,
          usuario_id: 1,
          categoria_id: 2,
          titulo: "Ler livros",
          descricao: "Editora Dark Side.",
          data_vencimento: "2025-08-27",
          hora_vencimento: "18:30",
          status: "pendente",
          criado_em: new Date().toISOString(),
        },
        {
          id: 3,
          usuario_id: 1,
          categoria_id: 3,
          titulo: "Comprar novos Livros",
          descricao: "Editora Dark Side.",
          data_vencimento: "2025-08-29",
          hora_vencimento: "17:20",
          status: "pendente",
          criado_em: new Date().toISOString(),
        },
      ];
      localStorage.setItem("mylist_tasks", JSON.stringify(tasks));
    }
  }
  
  getCurrentUser() {
    const user = localStorage.getItem("mylist_current_user");
    return user ? JSON.parse(user) : null;
  }

  // Categories CRUD
  async getCategories() {
    const categories = JSON.parse(
      localStorage.getItem("mylist_categories") || "[]"
    );
    const currentUser = this.getCurrentUser();
    return categories.filter((c) => c.usuario_id === currentUser?.id);
  }

  async createCategory(categoryData) {
    const categories = JSON.parse(
      localStorage.getItem("mylist_categories") || "[]"
    );
    const currentUser = this.getCurrentUser();

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
    const currentUser = this.getCurrentUser();
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
    const currentUser = this.getCurrentUser();

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
