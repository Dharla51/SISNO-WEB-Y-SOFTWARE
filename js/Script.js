// Interactive functionality for SISNOT Budget Tracker

document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const mobileMenu = document.querySelector(".mobile-menu")

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }

  // Navigation active state
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      navLinks.forEach((l) => l.classList.remove("active"))
      this.classList.add("active")
    })
  })

  const navButtons = document.querySelectorAll(".nav-button")
  navButtons.forEach((button) => {
    if (!button.disabled) {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        // Remove active state from all buttons
        navButtons.forEach((btn) => btn.classList.remove("active"))
        // Add active state to clicked button
        this.classList.add("active")
      })
    }
  })

  // Expense form submission
  const expenseForm = document.querySelector(".expense-form")
  if (expenseForm) {
    expenseForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const amount = document.getElementById("amount").value
      const category = document.getElementById("category").value
      const description = document.getElementById("description").value
      const date = document.getElementById("date").value

      if (amount && category && description) {
        // Add to recent expenses (simulation)
        addRecentExpense(amount, category, description, date)

        // Reset form
        this.reset()

        // Show success message
        showNotification("Gasto registrado exitosamente", "success")
      } else {
        showNotification("Por favor completa todos los campos", "error")
      }
    })
  }

  // Slider interactions
  const sliders = document.querySelectorAll(".slider")
  sliders.forEach((slider) => {
    const valueDisplay = slider.parentNode.querySelector(".slider-value")

    slider.addEventListener("input", function () {
      const value = this.value
      const label = this.parentNode.querySelector("label").textContent

      if (label.includes("Meta de ahorro")) {
        valueDisplay.textContent = `$${value}`
      } else {
        valueDisplay.textContent = `${value}%`
      }

      // Update simulation results
      updateSimulationResults()
    })
  })

  // Set current date as default
  const dateInput = document.getElementById("date")
  if (dateInput) {
    dateInput.valueAsDate = new Date()
  }

  // Initialize animations
  initializeAnimations()
})

function addRecentExpense(amount, category, description, date) {
  const expensesList = document.querySelector(".expenses-list")
  const categoryIcons = {
    food: "fas fa-utensils",
    transport: "fas fa-car",
    entertainment: "fas fa-gamepad",
    health: "fas fa-heartbeat",
    shopping: "fas fa-shopping-bag",
    bills: "fas fa-file-invoice",
  }

  const expenseItem = document.createElement("div")
  expenseItem.className = "expense-item"
  expenseItem.style.opacity = "0"
  expenseItem.style.transform = "translateY(20px)"

  expenseItem.innerHTML = `
        <div class="expense-icon ${category}">
            <i class="${categoryIcons[category] || "fas fa-receipt"}"></i>
        </div>
        <div class="expense-details">
            <h4>${description}</h4>
            <p>${getCategoryName(category)} • Hoy</p>
        </div>
        <div class="expense-amount">-$${Number.parseFloat(amount).toFixed(2)}</div>
    `

  expensesList.insertBefore(expenseItem, expensesList.firstChild)

  // Animate in
  setTimeout(() => {
    expenseItem.style.transition = "all 0.3s ease"
    expenseItem.style.opacity = "1"
    expenseItem.style.transform = "translateY(0)"
  }, 100)

  // Remove oldest if more than 5 items
  const items = expensesList.querySelectorAll(".expense-item")
  if (items.length > 5) {
    items[items.length - 1].remove()
  }
}

function getCategoryName(category) {
  const names = {
    food: "Alimentación",
    transport: "Transporte",
    entertainment: "Entretenimiento",
    health: "Salud",
    shopping: "Compras",
    bills: "Servicios",
  }
  return names[category] || "Otros"
}

function updateSimulationResults() {
  const sliders = document.querySelectorAll(".slider")
  let foodReduction = 0
  let entertainmentIncrease = 0
  let savingsGoal = 0

  sliders.forEach((slider) => {
    const label = slider.parentNode.querySelector("label").textContent
    const value = Number.parseInt(slider.value)

    if (label.includes("alimentación")) {
      foodReduction = value
    } else if (label.includes("entretenimiento")) {
      entertainmentIncrease = value
    } else if (label.includes("ahorro")) {
      savingsGoal = value
    }
  })

  // Calculate projected savings
  const baseFoodExpense = 1250
  const baseEntertainmentExpense = 420

  const foodSavings = (baseFoodExpense * foodReduction) / 100
  const entertainmentCost = (baseEntertainmentExpense * entertainmentIncrease) / 100
  const netSavings = foodSavings - entertainmentCost + savingsGoal

  // Update results
  const savingsResult = document.querySelector(".result-item .result-value.positive")
  if (savingsResult) {
    savingsResult.textContent = `+$${Math.round(netSavings)}/mes`
  }

  // Update recommendation
  const recommendationResult = document.querySelectorAll(".result-value")[2]
  if (recommendationResult) {
    if (netSavings > 400) {
      recommendationResult.textContent = "Excelente"
      recommendationResult.className = "result-value positive"
    } else if (netSavings > 200) {
      recommendationResult.textContent = "Factible"
      recommendationResult.className = "result-value neutral"
    } else {
      recommendationResult.textContent = "Ajustar metas"
      recommendationResult.className = "result-value"
    }
  }
}

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === "success" ? "background: linear-gradient(135deg, #10b981, #059669);" : "background: linear-gradient(135deg, #ef4444, #dc2626);"}
    `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

function initializeAnimations() {
  // Animate cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe all cards
  document.querySelectorAll(".glass-card, .stat-card, .prediction-card, .goal-card").forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = "all 0.6s ease"
    observer.observe(card)
  })
}

// Simulate real-time updates
setInterval(() => {
  // Update prediction percentages slightly
  const percentages = document.querySelectorAll(".prediction-percentage")
  percentages.forEach((percentage) => {
    const currentValue = Number.parseInt(percentage.textContent)
    const variation = Math.random() > 0.5 ? 1 : -1
    const newValue = Math.max(1, currentValue + variation)
    percentage.textContent = `+${newValue}%`
  })
}, 30000) // Update every 30 seconds
