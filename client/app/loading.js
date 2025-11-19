class LoadingManager {
  constructor() {
    this.loadingCount = 0;
    this.createLoadingOverlay();
  }

  createLoadingOverlay() {
    if (!document.getElementById("loadingOverlay")) {
      const overlay = document.createElement("div");
      overlay.id = "loadingOverlay";
      overlay.className = "loading-overlay";
      overlay.innerHTML = `
          <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Carregando...</p>
          </div>
        `;
      document.body.appendChild(overlay);
    }
  }

  show() {
    this.loadingCount++;
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.classList.add("active");
    }
  }

  hide() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      const overlay = document.getElementById("loadingOverlay");
      if (overlay) {
        overlay.classList.remove("active");
      }
    }
  }

  disableButton(button) {
    if (button) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = "Carregando...";
    }
  }

  enableButton(button) {
    if (button) {
      button.disabled = false;
      button.textContent = button.dataset.originalText || button.textContent;
    }
  }
}

window.loading = new LoadingManager();
