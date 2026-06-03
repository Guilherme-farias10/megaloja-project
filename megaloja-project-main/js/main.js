// --- FUNÇÃO DE NAVEGAÇÃO ENTRE TELAS (SPA) ---
// --- SISTEMA DE NAVEGAÇÃO DE TELAS (SPA) ---
function navigateTo(screenId) {
    // 1. Esconde todas as seções/telas
    const screens = document.querySelectorAll('.screen-section');
    screens.forEach(screen => {
        screen.classList.remove('active-screen');
    });

    // 2. Mostra a tela que foi solicitada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active-screen');
    }

    // --- MÁGICA DO MENU HÍBRIDO ---
    const appMenu = document.getElementById('app-menu');
    
    // Lista de telas que NÃO devem mostrar o menu (Telas iniciais de acesso/cadastro)
    const noMenuScreens = [
        'screen-login', 
        'screen-register', 
        'screen-register-success', 
        'screen-forgot-password', 
        'screen-forgot-password-success',
        'screen-employee-login'
    ];

    if (noMenuScreens.includes(screenId)) {
        appMenu.style.display = 'none'; // Esconde o menu
        document.body.style.justifyContent = 'center'; // Centraliza telas de login no desktop
        if (window.innerWidth >= 768) {
            document.getElementById('app-container').style.marginLeft = '0';
            document.getElementById('app-container').style.width = '100%';
        }
    } else {
        // Exibe o menu nas outras telas
        appMenu.style.display = 'flex'; 
        
        if (window.innerWidth >= 768) {
            document.body.style.justifyContent = 'flex-start';
            document.getElementById('app-container').style.marginLeft = '240px';
            document.getElementById('app-container').style.width = 'calc(100vw - 240px)';
            document.getElementById('app-container').style.maxWidth = 'none'; // Libera espaço para a grade de lojas
        }
    }
}

// --- GERENCIADOR DE CLIQUES DO MENU ---
function handleMenuClick(element, targetScreenId) {
    // 1. Remove a classe 'active' de todos os botões do menu
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    // 2. Adiciona a classe 'active' apenas no botão clicado
    element.classList.add('active');

    // 3. Executa a navegação para a tela correspondente
    navigateTo(targetScreenId);
}

// --- CONTROLE DO MODAL DE ERRO ---
function showModal(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-modal').classList.add('active-modal');
}

function closeModal() {
    document.getElementById('error-modal').classList.remove('active-modal');
}

// --- VALIDAÇÃO DE CADASTRO ---
function handleRegister(event) {
    event.preventDefault();

    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;

    // Se as senhas forem diferentes, mostra o modal personalizado
    if (password !== confirmPassword) {
        showModal("As senhas informadas não são idênticas. Por favor, verifique e digite novamente.");
        return; 
    }

    navigateTo('screen-register-success');
}

// --- MOSTRAR/OCULTAR SENHA ---
function togglePassword(iconElement) {
    const inputField = iconElement.previousElementSibling;

    if (inputField.type === "password") {
        inputField.type = "text";
        iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    } else {
        inputField.type = "password";
        iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
}

// --- VALIDAÇÃO E LOGIN DO CLIENTE ---
// --- VALIDAÇÃO E LOGIN DO CLIENTE ---
function handleLogin(event) {
    event.preventDefault();
    
    // RESET DO CARRINHO A CADA LOGIN
    cart = []; 
    if (typeof renderCart === "function") renderCart(); // Atualiza a tela do carrinho para vazio
    
    // Direciona o cliente para a tela de seleção de lojas
    navigateTo('screen-stores');
}

// --- SISTEMA DE FILTRO/PESQUISA DE LOJAS ---
function handleStoreSearch() {
    // 1. Pega o input de texto dentro da caixinha de busca
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;

    // Helper para remover acentos e deixar tudo em minúsculo
    const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    
    const searchTerm = normalize(searchInput.value);

    // 2. Captura todos os cards de lojas da tela
    const storeCards = document.querySelectorAll('.store-card');

    // 3. Varre cada loja aplicando o filtro
    storeCards.forEach(card => {
        const storeName = normalize(card.querySelector('.store-name').textContent);
        const storeAddress = normalize(card.querySelector('.store-address').textContent);

        // Se o termo pesquisado estiver no nome OU no endereço, exibe. Senão, esconde.
        if (storeName.includes(searchTerm) || storeAddress.includes(searchTerm)) {
            card.style.display = 'flex'; 
        } else {
            card.style.display = 'none'; 
        }
    });
}

// BÔNUS: Faz a busca funcionar também ao apertar a tecla "Enter" no teclado
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleStoreSearch();
            }
        });
    }
});

// --- SISTEMA DE GERENCIAMENTO DE NOTIFICAÇÕES ---

/**
 * Altera o estado de uma notificação específica para lida
 * @param {string} notificationId - ID único do card da notificação
 */
function toggleReadState(notificationId) {
    const card = document.getElementById(notificationId);
    if (!card) return;

    if (card.classList.contains('unread')) {
        card.classList.remove('unread');
        
        // Remove o botão secundário "Marcar como lida" de forma limpa
        const secondaryBtn = card.querySelector('.notif-action-btn.secondary');
        if (secondaryBtn) {
            secondaryBtn.remove();
        }
        
        // Remove a bolinha azul indicativa
        const dot = card.querySelector('.unread-dot');
        if (dot) {
            dot.remove();
        }
    }
    
    checkEmptyNotifications();
}

/**
 * Marca todas as notificações ativas como lidas simultaneamente
 */
function markAllNotificationsAsRead() {
    const unreadCards = document.querySelectorAll('.notification-card.unread');
    
    unreadCards.forEach(card => {
        card.classList.remove('unread');
        
        const secondaryBtn = card.querySelector('.notif-action-btn.secondary');
        if (secondaryBtn) {
            secondaryBtn.remove();
        }
        
        const dot = card.querySelector('.unread-dot');
        if (dot) {
            dot.remove();
        }
    });
    
    checkEmptyNotifications();
}

/**
 * Monitora a lista de notificações para exibir o feedback visual caso esteja vazia
 */
function checkEmptyNotifications() {
    const list = document.getElementById('notifications-list');
    const emptyState = document.getElementById('notifications-empty');
    if (!list || !emptyState) return;

    const cards = list.querySelectorAll('.notification-card');
    
    // Se você futuramente adicionar uma opção de "excluir", essa checagem garante o empty state
    if (cards.length === 0) {
        list.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        list.style.display = 'flex';
        emptyState.style.display = 'none';
    }
}

// --- SISTEMA DA TELA DE ESTOQUE (Filtro Inteligente de Variação) ---

let currentSelectedStore = ""; // Armazena o estado global da loja ativa
let cart = []; // Armazena os itens do carrinho

/**
 * Define a loja ativa, limpa a caixa de texto e renderiza o estoque customizado
 */
function selectStore(storeName) {
    currentSelectedStore = storeName;
    
    const titleElement = document.getElementById('stock-screen-title');
    if (titleElement) {
        titleElement.textContent = `Estoque - Loja ${storeName}`;
    }
    
    // Reserta o campo de digitação ao trocar de loja
    const searchInput = document.querySelector('#screen-stock .search-box input');
    if (searchInput) searchInput.value = "";

    // Executa a filtragem inicial pela loja escolhida
    applyProductFilters();

    navigateTo('screen-stock');
}

/**
 * Disparado a cada caractere digitado na busca de produtos
 */
function handleProductSearch() {
    applyProductFilters();
}

/**
 * Core unificado: Valida se o produto pertence à loja selecionada E ao termo digitado
 */
/**
 * Core unificado: Valida se o produto pertence à loja selecionada E ao termo digitado
 */
function applyProductFilters() {
    const searchInput = document.querySelector('#screen-stock .search-box input');
    
    const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const searchTerm = searchInput ? normalize(searchInput.value) : "";

    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const nameElement = card.querySelector('.product-name');
        
        // PROTEÇÃO: Se houver algum erro de tag no HTML, ignora este card e não trava o app
        if (!nameElement) return; 

        const productName = normalize(nameElement.textContent);
        
        // Coleta e mapeia as lojas permitidas declaradas no HTML do card
        const allowedStoresAttr = card.getAttribute('data-stores') || "";
        const allowedStores = allowedStoresAttr.split(',').map(s => s.trim());

        // Validações lógicas cruzadas
        const matchesStore = allowedStores.includes(currentSelectedStore);
        const matchesSearch = productName.includes(searchTerm);

        if (matchesStore && matchesSearch) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- SISTEMA INTERATIVO DE CARRINHO E MODAL ---

// --- SISTEMA INTERATIVO DE CARRINHO E MODAL ---

function addToOrder(productName) {
    let productPriceText = "R$ 0,00";
    let productNumericPrice = 0;

    // Função interna que limpa aspas e formatações para garantir uma comparação perfeita
    const normalizeText = (text) => text.toLowerCase().replace(/['"”'´`]/g, '').trim();

    // Lógica inteligente: Varre a tela para encontrar o preço do produto clicado
    const cards = document.querySelectorAll('.product-card');
    for (let card of cards) {
        const nameElement = card.querySelector('.product-name');
        
        // Agora compara os nomes ignorando diferenças de aspas simples ou duplas
        if (nameElement && normalizeText(nameElement.textContent) === normalizeText(productName)) {
            const priceElement = card.querySelector('.product-price');
            if (priceElement) {
                productPriceText = priceElement.textContent.trim();
                
                // Converte o texto "R$ 3.499,00" para número real de matemática (3499.00)
                let numString = productPriceText.replace('R$', '').trim().replace(/\./g, '').replace(',', '.');
                productNumericPrice = parseFloat(numString);
            }
            break; 
        }
    }

    // Adiciona o produto com todas as informações ao array do carrinho
    cart.push({
        name: productName,
        store: currentSelectedStore,
        priceText: productPriceText,
        priceValue: productNumericPrice
    });
    
    // Chama o Modal de Sucesso
    showSuccessModal(`"${productName}" foi adicionado ao seu pedido com sucesso!`);
    
    renderCart();
}

// Controladores do Pop-up de Sucesso Blindados
function showSuccessModal(message) {
    const modal = document.getElementById('success-modal');
    const msgEl = document.getElementById('success-message');
    
    // Proteção: Se o HTML do modal existir, ele abre. Se não, exibe o alerta padrão para não travar.
    if (modal && msgEl) {
        msgEl.textContent = message;
        modal.classList.add('active-modal');
    } else {
        alert(message); 
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('active-modal');
    }
}

// Renderização do Carrinho com Cálculo de Total
function renderCart() {
    const listContainer = document.getElementById('cart-items-list');
    const emptyMessage = document.getElementById('cart-empty-message');
    const totalContainer = document.getElementById('cart-total-container');
    const totalValueEl = document.getElementById('cart-total-value');
    
    if (!listContainer || !emptyMessage) return;
    
    listContainer.innerHTML = ''; 
    
    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        if (totalContainer) totalContainer.style.display = 'none'; // Esconde o total se vazio
    } else {
        emptyMessage.style.display = 'none';
        if (totalContainer) totalContainer.style.display = 'flex'; // Mostra a barra de total
        
        let totalAmount = 0; // Variável para somar os preços

        // Desenha cada item com o preço embutido
        cart.forEach((item, index) => {
            totalAmount += item.priceValue; // Soma o valor do item atual ao total
            
            listContainer.innerHTML += `
                <div style="background: #1F2937; padding: 15px; border-radius: 8px; border: 1px solid #374151; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="color: #F9FAFB; margin: 0 0 5px 0; font-size: 16px;">${item.name}</h3>
                        <p style="color: #818CF8; margin: 0 0 6px 0; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            Retirada: Loja ${item.store}
                        </p>
                        <p style="color: #10B981; margin: 0; font-weight: bold; font-size: 15px;">${item.priceText}</p>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${index})">Remover</button>
                </div>
            `;
        });
        
        // Formata a soma matemática para a Moeda (R$)
        if (totalValueEl) {
            totalValueEl.textContent = totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}
