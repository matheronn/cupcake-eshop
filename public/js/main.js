// Função para adicionar produtos ao carrinho (será implementada quando tivermos as rotas)
function addToCart(productId, quantity = 1) {
  // Por enquanto só mostra um alert, depois implementaremos via fetch API
  alert('Em breve! Funcionalidade será implementada quando criarmos as rotas do carrinho.');
  
  /*
  fetch('/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId: productId,
      quantity: quantity
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showAlert('Produto adicionado ao carrinho!', 'success');
      updateCartCount();
    } else {
      showAlert('Erro ao adicionar produto', 'error');
    }
  })
  .catch(error => {
    console.error('Erro:', error);
    showAlert('Erro ao adicionar produto', 'error');
  });
  */
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  const main = document.querySelector('main');
  main.insertBefore(alertDiv, main.firstChild);
  
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

// Função para atualizar contador do carrinho
function updateCartCount() {
  // Implementar quando tivermos as rotas do carrinho
  console.log('Atualizando contador do carrinho...');
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      isValid = false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
  });
  
  return isValid;
}

function confirmAction(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('fade-in');
    }, index * 100);
  });
  
  const alerts = document.querySelectorAll('.alert:not(.alert-dismissible)');
  alerts.forEach(alert => {
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  });
  
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// Função para loading em botões
function setButtonLoading(buttonElement, isLoading = true) {
  if (isLoading) {
    buttonElement.disabled = true;
    buttonElement.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Carregando...';
  } else {
    buttonElement.disabled = false;
    const originalText = buttonElement.getAttribute('data-original-text');
    if (originalText) {
      buttonElement.innerHTML = originalText;
    }
  }
}

function previewImage(input, previewElementId) {
  const file = input.files[0];
  const preview = document.getElementById(previewElementId);
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// Função para busca em tempo real (será útil para o catálogo)
function setupRealTimeSearch(inputId, targetSelector) {
  const searchInput = document.getElementById(inputId);
  const targets = document.querySelectorAll(targetSelector);
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      targets.forEach(target => {
        const text = target.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          target.style.display = 'block';
        } else {
          target.style.display = 'none';
        }
      });
    });
  }
}

function applyMask(input, maskType) {
  input.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    
    switch(maskType) {
      case 'phone':
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        break;
      case 'cpf':
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        break;
      case 'cep':
        value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
        break;
    }
    
    this.value = value;
  });
}