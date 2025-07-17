// ===== VARIABLES GLOBALES =====
const navMenu = document.getElementById("nav-menu")
const navToggle = document.getElementById("nav-toggle")
const navClose = document.getElementById("nav-close")
const navLinks = document.querySelectorAll(".nav__link")
const header = document.getElementById("header")
const scrollTopBtn = document.getElementById("scroll-top")
const contactForm = document.getElementById("contact-form")

// ===== NAVEGACIÓN MÓVIL =====
// Mostrar menú
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu")
    document.body.style.overflow = "hidden" // Prevenir scroll del body
  })
}

// Ocultar menú
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu")
    document.body.style.overflow = "auto" // Restaurar scroll del body
  })
}

// Cerrar menú al hacer click en un enlace
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show-menu")
    document.body.style.overflow = "auto"
  })
})

// Cerrar menú al hacer click fuera de él
document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    navMenu.classList.remove("show-menu")
    document.body.style.overflow = "auto"
  }
})

// ===== SCROLL EFFECTS =====
window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset

  // Header background on scroll
  if (scrollY >= 50) {
    header.classList.add("scroll-header")
  } else {
    header.classList.remove("scroll-header")
  }

  // Show/hide scroll to top button
  if (scrollY >= 500) {
    scrollTopBtn.classList.add("show")
  } else {
    scrollTopBtn.classList.remove("show")
  }

  // Update active navigation link
  updateActiveNavLink()

  // Animate elements on scroll
  animateOnScroll()
})

// ===== SCROLL TO TOP =====
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// ===== ACTIVE NAVIGATION LINK =====
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const scrollY = window.pageYOffset + 200

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight
    const sectionTop = section.offsetTop
    const sectionId = section.getAttribute("id")
    const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`)

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove("active-link"))
      if (navLink) {
        navLink.classList.add("active-link")
      }
    }
  })
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      const headerHeight = header.offsetHeight
      const targetPosition = targetSection.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// ===== ANIMATE ON SCROLL =====
function animateOnScroll() {
  const elements = document.querySelectorAll(".service__card, .gallery__item, .contact__card, .about__stats .stat")
  const windowHeight = window.innerHeight
  const scrollY = window.pageYOffset

  elements.forEach((element) => {
    const elementTop = element.offsetTop
    const elementHeight = element.offsetHeight

    if (scrollY + windowHeight > elementTop + elementHeight / 4) {
      element.classList.add("animate-on-scroll")
    }
  })
}

// ===== FORMULARIO DE CONTACTO =====
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Obtener datos del formulario
    const formData = new FormData(this)
    const formObject = {}

    formData.forEach((value, key) => {
      formObject[key] = value
    })

    // Validar formulario
    if (validateForm(formObject)) {
      // Simular envío del formulario
      submitForm(formObject)
    }
  })
}

// ===== VALIDACIÓN DEL FORMULARIO =====
function validateForm(data) {
  const errors = []

  // Validar nombre
  if (!data.name || data.name.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres")
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Por favor ingresa un email válido")
  }

  // Validar teléfono
  const phoneRegex = /^[+]?[0-9\s\-$$$$]{10,}$/
  if (!data.phone || !phoneRegex.test(data.phone)) {
    errors.push("Por favor ingresa un teléfono válido")
  }

  // Validar servicio
  if (!data.service) {
    errors.push("Por favor selecciona un servicio")
  }

  // Validar mensaje
  if (!data.message || data.message.trim().length < 10) {
    errors.push("El mensaje debe tener al menos 10 caracteres")
  }

  // Mostrar errores si existen
  if (errors.length > 0) {
    showNotification("Error: " + errors.join(", "), "error")
    return false
  }

  return true
}

// ===== ENVÍO DEL FORMULARIO =====
function submitForm(data) {
  const submitButton = contactForm.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML

  // Mostrar estado de carga
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
  submitButton.disabled = true
  contactForm.classList.add("loading")

  // Simular envío (en producción aquí iría la llamada al servidor)
  setTimeout(() => {
    // Restaurar botón
    submitButton.innerHTML = originalText
    submitButton.disabled = false
    contactForm.classList.remove("loading")

    // Mostrar mensaje de éxito
    showNotification("¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.", "success")

    // Limpiar formulario
    contactForm.reset()

    // Remover clases de labels flotantes
    const labels = contactForm.querySelectorAll(".form__label")
    labels.forEach((label) => {
      label.style.transform = ""
      label.style.color = ""
    })
  }, 2000)
}

// ===== SISTEMA DE NOTIFICACIONES =====
function showNotification(message, type = "info") {
  // Crear elemento de notificación
  const notification = document.createElement("div")
  notification.className = `notification notification--${type}`
  notification.innerHTML = `
        <div class="notification__content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span class="notification__message">${message}</span>
            <button class="notification__close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `

  // Agregar estilos si no existen
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style")
    styles.id = "notification-styles"
    styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification--success {
                border-left: 4px solid #28a745;
            }
            .notification--error {
                border-left: 4px solid #dc3545;
            }
            .notification--info {
                border-left: 4px solid #007bff;
            }
            .notification__content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
            }
            .notification__content i:first-child {
                color: var(--primary-color);
            }
            .notification__message {
                flex: 1;
                font-size: 14px;
                line-height: 1.4;
            }
            .notification__close {
                background: none;
                border: none;
                cursor: pointer;
                color: #666;
                padding: 4px;
            }
            .notification__close:hover {
                color: #333;
            }
        `
    document.head.appendChild(styles)
  }

  // Agregar al DOM
  document.body.appendChild(notification)

  // Mostrar notificación
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Configurar cierre automático
  const autoClose = setTimeout(() => {
    closeNotification(notification)
  }, 5000)

  // Configurar cierre manual
  const closeBtn = notification.querySelector(".notification__close")
  closeBtn.addEventListener("click", () => {
    clearTimeout(autoClose)
    closeNotification(notification)
  })
}

function getNotificationIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    info: "info-circle",
  }
  return icons[type] || "info-circle"
}

function closeNotification(notification) {
  notification.classList.remove("show")
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 300)
}

// ===== LAZY LOADING DE IMÁGENES =====
function initLazyLoading() {
  const images = document.querySelectorAll('img[src*="assets/"]')

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.classList.add("loaded")
          observer.unobserve(img)
        }
      })
    })

    images.forEach((img) => {
      imageObserver.observe(img)
    })
  }
}

// ===== GALERÍA MODAL =====
function initGalleryModal() {
  const galleryItems = document.querySelectorAll(".gallery__item")

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector(".gallery__img")
      const title = item.querySelector(".gallery__title").textContent
      const description = item.querySelector(".gallery__description").textContent

      showImageModal(img.src, title, description)
    })
  })
}

function showImageModal(src, title, description) {
  const modal = document.createElement("div")
  modal.className = "image-modal"
  modal.innerHTML = `
        <div class="image-modal__overlay">
            <div class="image-modal__content">
                <button class="image-modal__close">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${src}" alt="${title}" class="image-modal__img">
                <div class="image-modal__info">
                    <h3 class="image-modal__title">${title}</h3>
                    <p class="image-modal__description">${description}</p>
                </div>
            </div>
        </div>
    `

  // Agregar estilos del modal si no existen
  if (!document.querySelector("#modal-styles")) {
    const styles = document.createElement("style")
    styles.id = "modal-styles"
    styles.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            .image-modal.show {
                opacity: 1;
                visibility: visible;
            }
            .image-modal__overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .image-modal__content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }
            .image-modal.show .image-modal__content {
                transform: scale(1);
            }
            .image-modal__close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 40px;
                height: 40px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                z-index: 10;
                transition: background 0.3s ease;
            }
            .image-modal__close:hover {
                background: rgba(0, 0, 0, 0.9);
            }
            .image-modal__img {
                width: 100%;
                height: auto;
                display: block;
            }
            .image-modal__info {
                padding: 20px;
            }
            .image-modal__title {
                color: var(--primary-color);
                margin-bottom: 8px;
            }
            .image-modal__description {
                color: var(--text-light);
                margin: 0;
            }
        `
    document.head.appendChild(styles)
  }

  document.body.appendChild(modal)
  document.body.style.overflow = "hidden"

  setTimeout(() => {
    modal.classList.add("show")
  }, 100)

  // Cerrar modal
  const closeModal = () => {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal)
      }
    }, 300)
  }

  modal.querySelector(".image-modal__close").addEventListener("click", closeModal)
  modal.querySelector(".image-modal__overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  })

  // Cerrar con ESC
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      closeModal()
      document.removeEventListener("keydown", handleEsc)
    }
  }
  document.addEventListener("keydown", handleEsc)
}

// ===== CONTADOR ANIMADO =====
function initCounterAnimation() {
  const counters = document.querySelectorAll(".stat__number")

  const animateCounter = (counter) => {
    const target = Number.parseInt(counter.textContent.replace(/\D/g, ""))
    const increment = target / 100
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        counter.textContent = counter.textContent.replace(/\d+/, target)
        clearInterval(timer)
      } else {
        counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current))
      }
    }, 20)
  }

  // Observar cuando los contadores entran en viewport
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          counterObserver.unobserve(entry.target)
        }
      })
    })

    counters.forEach((counter) => {
      counterObserver.observe(counter)
    })
  }
}

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar funcionalidades
  initLazyLoading()
  initGalleryModal()
  initCounterAnimation()

  // Configurar formularios flotantes
  const formInputs = document.querySelectorAll(".form__input")
  formInputs.forEach((input) => {
    // Manejar el estado inicial si el input tiene valor
    if (input.value) {
      const label = input.nextElementSibling
      if (label && label.classList.contains("form__label")) {
        label.style.transform = "translateY(-25px) scale(0.8)"
        label.style.color = "var(--primary-color)"
      }
    }

    // Manejar eventos de focus y blur
    input.addEventListener("focus", function () {
      const label = this.nextElementSibling
      if (label && label.classList.contains("form__label")) {
        label.style.transform = "translateY(-25px) scale(0.8)"
        label.style.color = "var(--primary-color)"
      }
    })

    input.addEventListener("blur", function () {
      if (!this.value) {
        const label = this.nextElementSibling
        if (label && label.classList.contains("form__label")) {
          label.style.transform = ""
          label.style.color = ""
        }
      }
    })
  })

  // Ejecutar animación inicial
  setTimeout(() => {
    animateOnScroll()
  }, 500)

  console.log("TNL - Website loaded successfully! 🚛")
})

// ===== MANEJO DE ERRORES =====
window.addEventListener("error", (e) => {
  console.error("Error en la aplicación:", e.error)
})

// ===== PERFORMANCE MONITORING =====
window.addEventListener("load", () => {
  // Medir tiempo de carga
  const loadTime = performance.now()
  console.log(`Página cargada en ${Math.round(loadTime)}ms`)

  // Optimizar imágenes después de la carga
  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", function () {
        this.style.opacity = "1"
      })
    }
  })
})
