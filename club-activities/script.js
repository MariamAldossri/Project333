document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const activitiesSection = document.querySelector(".row")
  const searchInput = document.querySelector('input[type="text"]')
  const sortNameBtn = document.querySelector(".btn.btn-info:nth-of-type(1)")
  const sortDateBtn = document.querySelector(".btn.btn-info:nth-of-type(2)")
  const createForm = document.querySelector("form")
  const detailsSection = document.getElementById("details")
  const pagination = document.querySelector(".pagination")
  const BASE_API_URL =
    "https://455bd13e-1e37-46a3-a804-c14e07a6bd7d-00-35yx9vpg7td4l.sisko.replit.dev/"

  let activities = []
  let filteredActivities = []
  let currentPage = 1
  const itemsPerPage = 3

  const loadingIndicator = createLoadingIndicator()
  activitiesSection.parentNode.insertBefore(loadingIndicator, activitiesSection)

  setupEventListeners()

  loadActivities()

  // ==================== FUNCTIONS ====================

  function createLoadingIndicator() {
    const indicator = document.createElement("div")
    indicator.className = "text-center py-4"
    indicator.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-2">Loading activities...</p>
    `
    return indicator
  }

  function setupEventListeners() {
    searchInput.addEventListener("input", debounce(handleSearch, 300))
    sortNameBtn.addEventListener("click", () => sortActivities("title"))
    sortDateBtn.addEventListener("click", () => sortActivities("date"))
    createForm.addEventListener("submit", handleFormSubmit)
    pagination.addEventListener("click", handlePaginationClick)
  }

  function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
      }, timeout)
    }
  }

  async function loadActivities() {
    showLoading()

    try {
      const response = await fetch(`${BASE_API_URL}/activities.php`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      activities = Array.isArray(data) ? data : data.data || []

      if (!activities.length) {
        showEmptyState("No activities found")
        return
      }

      filteredActivities = [...activities]
      renderActivities()
      renderPagination()
    } catch (error) {
      console.error("Failed to load activities:", error)
      showErrorState("Failed to load activities. Please try again later.")
    } finally {
      hideLoading()
    }
  }

  function showLoading() {
    loadingIndicator.style.display = "block"
    activitiesSection.style.display = "none"
    pagination.style.display = "none"
  }

  function hideLoading() {
    loadingIndicator.style.display = "none"
    activitiesSection.style.display = "flex"
  }

  function showEmptyState(message) {
    activitiesSection.innerHTML = `
      <div class="col-12 text-center py-4">
        <div class="alert alert-info">
          <i class="bi bi-info-circle"></i> ${message}
        </div>
      </div>
    `
  }

  function showErrorState(message) {
    activitiesSection.innerHTML = `
      <div class="col-12 text-center py-4">
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i> ${message}
        </div>
      </div>
    `
  }

  function sortActivities(sortBy) {
    filteredActivities.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "date") {
        return new Date(a.date) - new Date(b.date)
      }
      return 0
    })
    currentPage = 1
    renderActivities()
    renderPagination()
  }

  function renderActivities() {
    activitiesSection.innerHTML = ""

    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    const toShow = filteredActivities.slice(start, end)

    if (toShow.length === 0) {
      showEmptyState("No activities match your search")
      return
    }

    toShow.forEach((activity) => {
      const card = document.createElement("div")
      card.className = "col-md-4 mb-4"
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${escapeHtml(activity.title)}</h5>
            <div class="card-text">
              <p class="text-muted mb-1">
                <i class="bi bi-calendar"></i> ${formatDate(activity.date)}
              </p>
              <p class="text-muted mb-2">
                <i class="bi bi-tag"></i> ${escapeHtml(activity.category)}
              </p>
              <p class="text-truncate">${escapeHtml(
                activity.description || "No description"
              )}</p>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <button data-id="${
              activity.id
            }" class="btn btn-primary view-details">
              <i class="bi bi-eye"></i> View Details
            </button>
          </div>
        </div>
      `
      activitiesSection.appendChild(card)
    })

    // Add event listeners to detail buttons
    document.querySelectorAll(".view-details").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = parseInt(this.dataset.id)
        showDetails(id)
      })
    })
  }

  function formatDate(dateString) {
    if (!dateString) return "No date"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return ""
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  async function showDetails(id) {
    try {
      const response = await fetch(`${BASE_API_URL}/activities.php?id=${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const activity = await response.json()

      if (!activity) {
        alert("Activity not found")
        return
      }

      renderActivityDetails(activity)
      detailsSection.style.display = "block"
      detailsSection.scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      console.error("Failed to load activity details:", error)
      alert("Failed to load activity details. Please try again.")
    }
  }

  function renderActivityDetails(activity) {
    detailsSection.querySelector("h5").textContent = activity.title
    detailsSection.querySelector("p:nth-of-type(1)").innerHTML = `
      <strong><i class="bi bi-people"></i> Club:</strong> ${escapeHtml(
        activity.club
      )}
    `
    detailsSection.querySelector("p:nth-of-type(2)").innerHTML = `
      <strong><i class="bi bi-calendar"></i> Date:</strong> ${formatDate(
        activity.date
      )}
    `
    detailsSection.querySelector("p:nth-of-type(3)").innerHTML = `
      <strong><i class="bi bi-tag"></i> Category:</strong> ${escapeHtml(
        activity.category
      )}
    `
    detailsSection.querySelector("p:nth-of-type(4)").innerHTML = `
      <strong><i class="bi bi-card-text"></i> Description:</strong> 
      <p>${escapeHtml(activity.description || "No description provided")}</p>
    `

    // Setup edit and delete buttons
    detailsSection.querySelector(".btn-warning").onclick = () =>
      editActivity(activity)
    detailsSection.querySelector(".btn-danger").onclick = () =>
      confirmDelete(activity.id)
  }

  function confirmDelete(id) {
    const modal = new bootstrap.Modal(document.getElementById("confirmModal"))

    // Set up event listeners
    const confirmBtn = document.getElementById("confirmDeleteBtn")
    const cancelBtn = modal._element.querySelector('[data-bs-dismiss="modal"]')

    // Clean up any previous listeners
    confirmBtn.replaceWith(confirmBtn.cloneNode(true))
    cancelBtn.replaceWith(cancelBtn.cloneNode(true))

    // Get fresh references after cloning
    const newConfirmBtn = document.getElementById("confirmDeleteBtn")
    const newCancelBtn = modal._element.querySelector(
      '[data-bs-dismiss="modal"]'
    )

    // Show the modal
    modal.show()

    // Handle confirmation
    newConfirmBtn.onclick = async () => {
      try {
        // Show loading state on button
        newConfirmBtn.disabled = true
        newConfirmBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Deleting...
            `

        await deleteActivity(id)
        modal.hide()
      } catch (error) {
        console.error("Delete failed:", error)
        newConfirmBtn.disabled = false
        newConfirmBtn.textContent = "Delete Activity"
      }
    }

    // Handle cancellation
    newCancelBtn.onclick = () => {
      modal.hide()
    }

    // Clean up when modal is hidden
    modal._element.addEventListener(
      "hidden.bs.modal",
      () => {
        newConfirmBtn.disabled = false
        newConfirmBtn.textContent = "Delete Activity"
      },
      { once: true }
    )
  }
  async function deleteActivity(id) {
    try {
      const response = await fetch(`${BASE_API_URL}/activities.php?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Remove from local state
      activities = activities.filter((a) => a.id !== id)
      filteredActivities = filteredActivities.filter((a) => a.id !== id)

      // Update UI
      renderActivities()
      renderPagination()
      detailsSection.style.display = "none"

      showToast("Activity deleted successfully", "success")
    } catch (error) {
      console.error("Failed to delete activity:", error)
      showToast("Failed to delete activity", "danger")
    }
  }

  function editActivity(activity) {
    document.getElementById("clubName").value = activity.club || ""
    document.getElementById("activityTitle").value = activity.title || ""
    document.getElementById("activityDate").value = activity.date || ""
    document.getElementById("activityCategory").value = activity.category || ""
    document.getElementById("activityDescription").value =
      activity.description || ""

    createForm.dataset.mode = "edit"
    createForm.dataset.id = activity.id
    createForm.querySelector('button[type="submit"]').textContent =
      "Update Activity"

    document.getElementById("create").scrollIntoView({ behavior: "smooth" })
  }

  async function handleFormSubmit(e) {
    e.preventDefault()

    // Validate form
    const requiredFields = {
      clubName: "Club name",
      activityTitle: "Activity title",
      activityDate: "Date",
      activityCategory: "Category",
    }

    for (const [fieldId, fieldName] of Object.entries(requiredFields)) {
      if (!document.getElementById(fieldId).value.trim()) {
        showToast(`${fieldName} is required`, "warning")
        return
      }
    }

    const formData = {
      club: document.getElementById("clubName").value.trim(),
      title: document.getElementById("activityTitle").value.trim(),
      date: document.getElementById("activityDate").value.trim(),
      category: document.getElementById("activityCategory").value.trim(),
      description: document.getElementById("activityDescription").value.trim(),
    }

    try {
      if (createForm.dataset.mode === "edit") {
        const id = createForm.dataset.id
        await updateActivity(id, formData)
      } else {
        await createActivity(formData)
      }

      // Reset form
      createForm.reset()
      delete createForm.dataset.mode
      delete createForm.dataset.id
      createForm.querySelector('button[type="submit"]').textContent = "Submit"

      // Reload activities
      await loadActivities()
    } catch (error) {
      console.error("Failed to save activity:", error)
      showToast("Failed to save activity. Please try again.", "danger")
    }
  }

  async function createActivity(data) {
    const response = await fetch(`${BASE_API_URL}/activities.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    showToast("Activity created successfully", "success")
  }

  async function updateActivity(id, data) {
    const response = await fetch(`${BASE_API_URL}/activities.php?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    showToast("Activity updated successfully", "success")
  }

  function handleSearch() {
    const term = searchInput.value.trim().toLowerCase()

    if (!term) {
      filteredActivities = [...activities]
    } else {
      filteredActivities = activities.filter((activity) =>
        Object.values(activity).some(
          (value) => value && value.toString().toLowerCase().includes(term)
        )
      )
    }

    currentPage = 1
    renderActivities()
    renderPagination()
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)

    if (totalPages <= 1) {
      pagination.style.display = "none"
      return
    }

    pagination.style.display = "flex"
    let html = ""

    // Previous button
    html += `
      <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" data-page="prev" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    `

    // Page numbers
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      html += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`
      if (startPage > 2) {
        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      html += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`
      }
      html += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`
    }

    // Next button
    html += `
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a class="page-link" href="#" data-page="next" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    `

    pagination.innerHTML = html
  }

  function handlePaginationClick(e) {
    e.preventDefault()
    if (e.target.tagName !== "A") return

    const action = e.target.dataset.page
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)

    if (action === "prev" && currentPage > 1) {
      currentPage--
    } else if (action === "next" && currentPage < totalPages) {
      currentPage++
    } else if (!isNaN(action)) {
      currentPage = parseInt(action)
    }

    renderActivities()
    renderPagination()
  }

  function showToast(message, type = "info") {
    const toastContainer = document.getElementById("toastContainer")
    const toastId = `toast-${Date.now()}`

    const toast = document.createElement("div")
    toast.className = `toast align-items-center text-white bg-${type} border-0`
    toast.id = toastId
    toast.setAttribute("role", "alert")
    toast.setAttribute("aria-live", "assertive")
    toast.setAttribute("aria-atomic", "true")

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `

    toastContainer.appendChild(toast)

    const bsToast = new bootstrap.Toast(toast)
    bsToast.show()

    // Remove toast after it's hidden
    toast.addEventListener("hidden.bs.toast", () => {
      toast.remove()
    })

    // Auto-hide after 5 seconds
    setTimeout(() => {
      bsToast.hide()
    }, 5000)
  }

  async function postComment(activityId) {
    const commentText = document.getElementById("commentText").value.trim()

    if (!commentText) {
      showToast("Please enter a comment", "warning")
      return
    }

    try {
      const response = await fetch(
        `${BASE_API_URL}/comments.php?id=${activityId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activity_id: activityId,
            content: commentText,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      showToast(result.message, "success")

      // Refresh comments
      await showDetails(activityId)
      document.getElementById("commentText").value = ""
    } catch (error) {
      console.error("Failed to post comment:", error)
      showToast("Failed to post comment", "danger")
    }
  }
})
