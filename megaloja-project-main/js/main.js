// --- FUNÇÃO DE NAVEGAÇÃO ENTRE TELAS (SPA) ---
// --- SISTEMA DE NAVEGAÇÃO DE TELAS (SPA) ---
// --- SISTEMA DE NAVEGAÇÃO DE TELAS (SPA) ---
// --- SISTEMA DE NAVEGAÇÃO DE TELAS (SPA) ---
// --- SISTEMA DE NAVEGAÇÃO DE TELAS (SPA) ---
function navigateTo(screenId) {
    if (!screenId) return;

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

    // 3. Se navegando para tela de pedidos, renderiza os pedidos
    if (screenId === 'screen-orders' && typeof renderOrders === 'function') {
        renderOrders();
    }

    // >>> ADICIONE ESTE NOVO BLOCO AQUI EMBAIXO <<<
    if (screenId === 'screen-employee-stock' && typeof renderEmployeeStock === 'function') {
        renderEmployeeStock();
    }

    // --- SEPARAÇÃO DOS MENUS (CLIENTE VS FUNCIONÁRIO) ---
    const appMenu = document.getElementById('app-menu');
    const employeeMenu = document.getElementById('employee-menu');
    const container = document.getElementById('app-container');
    
    // Lista de telas de login/cadastro (Não mostram nenhum menu)
    const noMenuScreens = [
        'screen-login', 
        'screen-register', 
        'screen-register-success', 
        'screen-forgot-password', 
        'screen-forgot-password-success',
        'screen-employee-login'
    ];

    // Lista de telas exclusivas do funcionário
    const employeeScreens = [
        'screen-employee-orders',
        'screen-employee-stock',
        'screen-employee-reports'
    ];

    // Lógica de exibição dos Menus com base na tela atual
    if (noMenuScreens.includes(screenId)) {
        // Telas de Login: Esconde tudo e centraliza na tela
        if (appMenu) appMenu.style.display = 'none';
        if (employeeMenu) employeeMenu.style.display = 'none';
        document.body.style.justifyContent = 'center';
        if (container) {
            container.style.marginLeft = '0';
            container.style.width = '100%';
        }
    } else if (employeeScreens.includes(screenId)) {
        // TELAS DO FUNCIONÁRIO: Mostra apenas o menu do Staff e esconde o do cliente
        if (appMenu) appMenu.style.display = 'none';
        if (employeeMenu) employeeMenu.style.display = 'flex';
        
        if (window.innerWidth >= 768) {
            document.body.style.justifyContent = 'flex-start';
            if (container) {
                container.style.marginLeft = '240px';
                container.style.width = 'calc(100vw - 240px)';
                container.style.maxWidth = 'none';
            }
        }
    } else {
        // TELAS DO CLIENTE: Mostra apenas o menu do cliente e esconde o do funcionário
        if (appMenu) appMenu.style.display = 'flex';
        if (employeeMenu) employeeMenu.style.display = 'none';
        
        if (window.innerWidth >= 768) {
            document.body.style.justifyContent = 'flex-start';
            if (container) {
                container.style.marginLeft = '240px';
                container.style.width = 'calc(100vw - 240px)';
                container.style.maxWidth = 'none';
            }
        }
    }

    // --- SINCRONIZAÇÃO AUTOMÁTICA DO MENU ATIVO ---
    try {
        const menuItems = document.querySelectorAll('.menu-item'); 
        menuItems.forEach(item => {
            item.classList.remove('active');
        });

        if (!noMenuScreens.includes(screenId)) {
            const activeButtons = document.querySelectorAll(`.menu-item[onclick*="${screenId}"]`);
            activeButtons.forEach(btn => {
                btn.classList.add('active');
            });
        }
    } catch (e) {
        console.error("Erro na sincronização visual do menu:", e);
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

// --- FECHAR MODAL DE ERRO ---
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
function handleLogin(event) {
    event.preventDefault();
    
    // RESET DO CARRINHO A CADA LOGIN
    cart = []; 
    if (typeof renderCart === "function") renderCart(); // Atualiza a tela do carrinho para vazio
    
    // Limpa a memória de estoque ao fazer um novo login
    window.stockCache = {};

    // Direciona o cliente para a tela de seleção de lojas
    navigateTo('screen-stores');
}

// --- VALIDAÇÃO E LOGIN DO FUNCIONÁRIO ---
// --- VALIDAÇÃO E LOGIN DO FUNCIONÁRIO ---
function handleEmployeeLogin(event) {
    event.preventDefault();
    
    // Limpa o cache antigo usando o escopo seguro para forçar uma nova carga coerente
    window.employeeStockCache = null;
    
    navigateTo('screen-employee-orders');
}

// --- SISTEMA DE FILTRO/PESQUISA DE LOJAS ---
// ==================== SISTEMA DE BUSCA DO CLIENTE ====================

/**
 * Filtra as lojas da tela inicial por Nome ou Segmento
 */
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
            card.style.display = ''; // <--- CORREÇÃO: Usa vazio para herdar o layout correto do CSS e não quebrar o espaçamento!
        } else {
            card.style.display = 'none'; 
        }
    });
}

/**
 * Filtra os produtos dentro da loja aberta por Nome ou Categoria
 */
/**
 * Filtra os produtos da loja selecionada por Nome ou Categoria (Fluxo do Cliente)
 */
function handleProductSearch() {
    const searchInput = document.querySelector('.product-search-input');
    if (!searchInput) return;

    const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const searchTerm = normalize(searchInput.value);

    // Seleciona os cards de produtos do cliente
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const nameEl = card.querySelector('.product-name') || card.querySelector('h3');
        const productName = nameEl ? normalize(nameEl.textContent) : '';

        if (productName.includes(searchTerm)) {
            card.style.display = ''; // Mantém o layout original do CSS (grid/flex) sem bugar!
        } else {
            card.style.display = 'none';
        }
    });
}

// BÔNUS: Faz a busca funcionar também ao apertar a tecla "Enter" no teclado
// --- FORMATAÇÃO AUTOMÁTICA: NOME DO TITULAR EM MAIÚSCULAS ---
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('cc-name');
    
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            // Pega o que foi digitado, converte para maiúsculo e devolve ao campo instantaneamente
            e.target.value = e.target.value.toUpperCase();
        });
    }
});

// --- SISTEMA DE GERENCIAMENTO DE NOTIFICAÇÕES ---
/**
 * Conta as notificações com a classe 'unread' e updates a bolinha numérica
 */
function updateNotificationBadge() {
    // 1. Conta quantos cards ainda têm a classe 'unread'
    const unreadCount = document.querySelectorAll('.notification-card.unread').length;
    const badges = document.querySelectorAll('.notif-badge');
    
    // 2. Atualiza a bolinha vermelha
    badges.forEach(badge => {
        if (unreadCount > 0) {
            badge.style.display = 'flex'; // Mostra a bolinha
            badge.textContent = unreadCount; // Coloca o número
        } else {
            badge.style.display = 'none'; // Esconde se zerar
        }
    });
}

// Faz a primeira contagem assim que o site é carregado
document.addEventListener('DOMContentLoaded', () => {
    updateNotificationBadge();
});

/**
 * Altera o estado de uma notificação específica para lida
 */
function toggleReadState(notificationId) {
    const card = document.getElementById(notificationId);
    if (!card) return;

    if (card.classList.contains('unread')) {
        card.classList.remove('unread');
        
        const secondaryBtn = card.querySelector('.notif-action-btn.secondary');
        if (secondaryBtn) {
            secondaryBtn.remove();
        }
        
        const dot = card.querySelector('.unread-dot');
        if (dot) {
            dot.remove();
        }
    }
    
    checkEmptyNotifications();
    updateNotificationBadge(); // <--- MÁGICA: Atualiza o número na hora!
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
    updateNotificationBadge(); // <--- MÁGICA: Zera o número na hora!
}

/**
 * Monitora a lista de notificações para exibir o feedback visual caso esteja vazia
 */
function checkEmptyNotifications() {
    const list = document.getElementById('notifications-list');
    const emptyState = document.getElementById('notifications-empty');
    if (!list || !emptyState) return;

    const cards = list.querySelectorAll('.notification-card');
    
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
let orders = []; // Armazena o histórico de pedidos confirmados

/**
 * Define a loja ativa, limpa a caixa de texto e renderiza o estoque customizado
 */
/**
 * Define a loja ativa, limpa a caixa de texto, simula estoques e renderiza
 */
function selectStore(storeName) {
    currentSelectedStore = storeName;
    
    const titleElement = document.getElementById('stock-screen-title');
    if (titleElement) {
        titleElement.textContent = `Estoque - Loja ${storeName}`;
    }
    
    // Reseta o campo de digitação ao trocar de loja
    const searchInput = document.querySelector('#screen-stock .search-box input');
    if (searchInput) searchInput.value = "";

    // --- NOVA LÓGICA: Sorteia os estoques sempre que entra na loja ---
    assignRandomStockLevels();

    // Executa a filtragem inicial pela loja escolhida
    applyProductFilters();

    navigateTo('screen-stock');
}

/**
 * Gera status aleatórios de estoque para cada produto visualmente
 */
// --- MEMÓRIA DE ESTOQUE GLOBAL ---
window.stockCache = window.stockCache || {};

/**
 * Gera status de estoque apenas se o produto ainda não tiver um, 
 * mantendo a consistência e separando o estoque por FILIAL.
 */
function assignRandomStockLevels() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const nameElement = card.querySelector('.product-name');
        if (!nameElement) return;
        
        const productName = nameElement.textContent.trim();

        const cacheKey = currentSelectedStore + "_" + productName;

        // 1. Limpa etiquetas antigas para não empilhar visualmente
        const existingBadge = card.querySelector('.stock-badge');
        if (existingBadge) existingBadge.remove();

        // 2. Verifica se este produto NESTA LOJA já tem um status guardado
        if (!window.stockCache[cacheKey]) {
            const rand = Math.random();
            if (rand < 0.60) {
                window.stockCache[cacheKey] = { text: 'Disponível', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', state: 'in' };
            } else if (rand < 0.85) {
                window.stockCache[cacheKey] = { text: 'Baixo Estoque', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', state: 'in' };
            } else {
                window.stockCache[cacheKey] = { text: 'Indisponível', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', state: 'out' };
            }
        }

        // Puxa o status definitivo da memória
        const stockInfo = window.stockCache[cacheKey];

        // 3. Cria a Etiqueta Visual (Badge)
        const badge = document.createElement('span');
        badge.className = 'stock-badge';
        badge.style.display = 'inline-block';
        badge.style.padding = '4px 8px';
        badge.style.borderRadius = '4px';
        badge.style.fontSize = '11.5px';
        badge.style.fontWeight = '600';
        badge.style.marginTop = '8px';
        badge.style.color = stockInfo.color;
        badge.style.backgroundColor = stockInfo.bg;
        badge.textContent = stockInfo.text;

        // 4. Injeta a etiqueta logo abaixo do nome/preço do produto
        if (nameElement.parentElement) {
            nameElement.parentElement.appendChild(badge);
        }

        // 5. Altera visualmente o botão e cria a trava invisível
        const addBtn = card.querySelector('button');
        if (addBtn) {
            if (stockInfo.state === 'out') {
                addBtn.style.opacity = '0.5';
                addBtn.style.cursor = 'not-allowed';
                addBtn.textContent = 'Esgotado';
                card.setAttribute('data-stock', 'out'); 
            } else {
                addBtn.style.opacity = '1';
                addBtn.style.cursor = 'pointer';
                addBtn.textContent = 'Adicionar'; 
                card.setAttribute('data-stock', 'in'); 
            }
        }
    });
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
            card.style.display = ''; // <--- CORREÇÃO: Mantém o layout nativo do card de produto intacto!
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
    let isOutOfStock = false; // Variável de controle do estoque

    const normalizeText = (text) => text.toLowerCase().replace(/['"”'´`]/g, '').trim();

    const cards = document.querySelectorAll('.product-card');
    for (let card of cards) {
        const nameElement = card.querySelector('.product-name');
        
        if (nameElement && normalizeText(nameElement.textContent) === normalizeText(productName)) {
            
            // --- NOVA BARREIRA: Verifica se o produto foi sorteado como Indisponível ---
            if (card.getAttribute('data-stock') === 'out') {
                isOutOfStock = true;
                break;
            }

            const priceElement = card.querySelector('.product-price');
            if (priceElement) {
                productPriceText = priceElement.textContent.trim();
                let numString = productPriceText.replace('R$', '').trim().replace(/\./g, '').replace(',', '.');
                productNumericPrice = parseFloat(numString);
            }
            break; 
        }
    }

    // Se o produto acabou, exibe um aviso e INTERROMPE a função
    if (isOutOfStock) {
        if (typeof showModal === "function") {
            showModal(`Puxa! O produto "${productName}" está Indisponível no momento nesta filial.`);
        } else {
            alert(`Puxa! O produto "${productName}" está Indisponível no momento nesta filial.`);
        }
        return; 
    }

    // Adiciona o produto ao array do carrinho normalmente se tiver estoque
    cart.push({
        name: productName,
        store: currentSelectedStore,
        priceText: productPriceText,
        priceValue: productNumericPrice
    });
    
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

    // --- LÓGICA DA BOLINHA DO CARRINHO (BADGE) ---
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        if (cart.length > 0) {
            badge.style.display = 'flex'; // Mostra a bolinha
            badge.textContent = cart.length; // Escreve a quantidade de itens
        } else {
            badge.style.display = 'none'; // Esconde a bolinha se não houver itens
        }
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

/**
 * Redireciona o usuário para a tela de finalização de pedido,
 * validando se existem produtos e renderizando-os dinamicamente.
 */
function goToCheckout() {
    if (!cart || cart.length === 0) {
        if (typeof showModal === "function") {
            showModal("Seu carrinho está vazio! Adicione produtos antes de realizar o pedido.");
        } else {
            alert("Seu carrinho está vazio! Adicione produtos antes de realizar o pedido.");
        }
        return;
    }

    // Limpa seleções de rádio anteriores
    const radioButtons = document.querySelectorAll('input[name="payment_method"]');
    radioButtons.forEach(radio => radio.checked = false);
    
    // Limpa as bordas iluminadas anteriores
    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('active-payment-box');
    });
    
    // Esconde os detalhes de pagamento até o usuário escolher uma opção
    const pixDetails = document.getElementById('pix-details-container');
    const cardDetails = document.getElementById('card-details-container');
    if (pixDetails) pixDetails.style.display = 'none';
    if (cardDetails) cardDetails.style.display = 'none';

    renderCheckoutSummary(cart);
    navigateTo('screen-checkout');
}

/**
 * Constrói a estrutura visual dos cartões de produto dentro do Checkout
 * e realiza as operações matemáticas de soma.
 */
function renderCheckoutSummary(cartItems) {
    const itemsListContainer = document.getElementById('checkout-items-list');
    const totalValueContainer = document.getElementById('checkout-total-value');
    
    if (!itemsListContainer) return;

    itemsListContainer.innerHTML = ''; // Limpa qualquer resíduo anterior
    let orderTotalValue = 0;

    cartItems.forEach(item => {
        // Pega exatamente a propriedade 'priceValue' gerada ao clicar no produto
        let unitPrice = item.priceValue || 0;
        const quantity = item.quantity || 1;
        const subtotal = unitPrice * quantity;
        orderTotalValue += subtotal;

        // Formatação de moedas para o padrão brasileiro (R$)
        const formattedUnitPrice = unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const formattedSubtotal = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Criação do elemento visual do item na lista de checkout
        const itemCard = document.createElement('div');
        itemCard.style.display = 'flex';
        itemCard.style.justifyContent = 'space-between';
        itemCard.style.alignItems = 'center';
        itemCard.style.padding = '12px 15px';
        itemCard.style.background = '#1F2937';
        itemCard.style.border = '1px solid #374151';
        itemCard.style.borderRadius = '8px';
        itemCard.style.marginBottom = '10px';

        itemCard.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <span style="color: #F9FAFB; font-weight: 500;">${item.name}</span>
                <span style="color: #9CA3AF; font-size: 0.85rem;">${quantity}x de ${formattedUnitPrice}</span>
            </div>
            <div style="color: #F3F4F6; font-weight: 600;">${formattedSubtotal}</div>
        `;
        
        itemsListContainer.appendChild(itemCard);
    });

    // Atualiza o display do valor total acumulado da compra
    if (totalValueContainer) {
        totalValueContainer.textContent = orderTotalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    if (typeof updateInstallments === "function") updateInstallments();
}

/**
 * Renderiza todos os pedidos confirmados na tela de "Meus Pedidos"
 */

/**
 * Renderiza todos os pedidos confirmados na tela de "Meus Pedidos"
 */
function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    const emptyState = document.getElementById('orders-empty');
    
    if (!ordersList || !emptyState) return;

    ordersList.innerHTML = ''; // Limpa lista anterior

    if (orders.length === 0) {
        ordersList.style.display = 'none';
        
        emptyState.style.display = 'flex';
        emptyState.style.flexDirection = 'column';
        emptyState.style.alignItems = 'center';
        emptyState.style.justifyContent = 'center';
        emptyState.style.textAlign = 'center';
        emptyState.style.width = '100%';
        emptyState.style.maxWidth = '480px'; 
        emptyState.style.margin = '60px auto'; 
        emptyState.style.padding = '40px 20px';
        emptyState.style.gap = '16px'; 
    } else {
        emptyState.style.display = 'none';
        
        ordersList.style.display = 'flex';
        ordersList.style.flexDirection = 'column';
        ordersList.style.gap = '15px';
        ordersList.style.width = '100%';
        ordersList.style.maxWidth = '800px'; 
        ordersList.style.margin = '0 auto';   
        ordersList.style.padding = '10px';

        // Renderiza cada pedido
        orders.forEach((order, orderIndex) => {
            const orderCard = document.createElement('div');
            orderCard.style.background = '#1F2937';
            orderCard.style.border = '1px solid #374151';
            orderCard.style.borderRadius = '12px';
            orderCard.style.padding = '15px';
            orderCard.style.marginBottom = '10px';

            // Verifica se tem parcelas no cartão
            const isCreditCard = order.paymentMethod === 'credit_card';
            const installments = order.installments || 1;
            const hasInstallments = isCreditCard && installments > 1;

            // Formata o total do pedido
            const totalFormatted = order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            // Cabeçalho do pedido
            const headerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <div>
                        <h3 style="color: #F9FAFB; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Pedido ${order.id}</h3>
                        <p style="color: #9CA3AF; margin: 0; font-size: 13px;">${order.date}</p>
                    </div>
                    <span style="background: #10B981; color: #F9FAFB; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                        ${order.status}
                    </span>
                </div>
                <div style="border-top: 1px solid #374151; margin: 10px 0;"></div>
            `;

            // Lista de itens do pedido com lógica de parcela individual
            let itemsHTML = '<div style="margin-bottom: 12px;">';
            order.items.forEach((item, itemIndex) => {
                let itemInstallmentHTML = '';
                
                // Se o pedido tem parcelas, calcula a divisão no preço do produto
                if (hasInstallments && item.priceValue) {
                    const itemInstValue = item.priceValue / installments;
                    const itemInstFormatted = itemInstValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    itemInstallmentHTML = `<span style="font-size: 11.5px; color: #9CA3AF; font-weight: normal; margin-top: 2px;">(${installments}x de ${itemInstFormatted})</span>`;
                }

                itemsHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; color: #E5E7EB; font-size: 14px;">
                        <div>
                            <p style="margin: 0; color: #F9FAFB; font-weight: 500;">${item.name}</p>
                            
                            <p style="margin: 14px 0 2px 0; color: #9CA3AF; font-size: 12px; display: flex; align-items: center; gap: 4px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                Loja ${item.store}
                            </p>
                        </div>
                        <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
                            <span style="color: #10B981; font-weight: 600;">${item.priceText}</span>
                            ${itemInstallmentHTML}
                        </div>
                    </div>
                `;
            });
            itemsHTML += '</div>';

            // Calcula a parcela do valor Total (para o rodapé)
            let totalInstallmentHTML = '';
            if (hasInstallments) {
                const totalInstValue = order.total / installments;
                const totalInstFormatted = totalInstValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                totalInstallmentHTML = `<span style="color: #10B981; font-size: 13.5px; font-weight: 600; margin-top: 2px;">(${installments}x de ${totalInstFormatted})</span>`;
            }

            // Resumo do pedido (Rodapé)
            // Removemos o caractere especial '#' do ID para usar nas tags HTML
            const safeId = order.id.replace('#', '');

            // Resumo do pedido (Rodapé + NOVO BOTÃO QR CODE)
            const footerHTML = `
                <div style="border-top: 1px solid #374151; padding-top: 12px; margin-top: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <span style="color: #9CA3AF; font-size: 14px; margin-top: 2px;">Total:</span>
                        
                        <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
                            <span style="color: #F9FAFB; font-weight: 700; font-size: 18px;">${totalFormatted}</span>
                            ${totalInstallmentHTML}
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                        <span style="color: #9CA3AF; font-size: 12px;">Pagamento: ${order.paymentMethod === 'pix' ? 'PIX' : `Cartão de Crédito (${installments}x)`}</span>
                    </div>
                    
                    ${order.observation ? `<div style="margin-top: 10px; padding: 8px; background: #111827; border-radius: 6px; border-left: 3px solid #818CF8;">
                        <p style="margin: 0; color: #9CA3AF; font-size: 12px;"><strong>Observação:</strong> ${order.observation}</p>
                    </div>` : ''}

                    <div style="margin-top: 15px; border-top: 1px dashed #4B5563; padding-top: 15px; text-align: center;">
                        <button id="qr-btn-${safeId}" onclick="generateOrderQRCode('${order.id}', 'qr-container-${safeId}', 'qr-btn-${safeId}')" style="background: transparent; border: 1px solid #6366F1; color: #818CF8; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.2s; width: 100%; max-width: 250px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin: 0 auto;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg>
                            Gerar QR Code de Retirada
                        </button>
                        
                        <div id="qr-container-${safeId}" style="display: none; flex-direction: column; align-items: center; justify-content: center; margin-top: 15px; animation: fadeIn 0.4s ease;"></div>
                    </div>

                </div>
            `;

            orderCard.innerHTML = headerHTML + itemsHTML + footerHTML;
            ordersList.appendChild(orderCard);
        });
    }
}

/**
 * Ação executada ao clicar em "Confirmar pedido"
 */
function confirmFinalOrder() {
    const selectedPayment = document.querySelector('input[name="payment_method"]:checked')?.value;
    const observationText = document.querySelector('.checkout-textarea')?.value || '';

    // --- NOVA BARREIRA CRÍTICA: MÉTODO DE PAGAMENTO OBRIGATÓRIO ---
    if (!selectedPayment) {
        if (typeof showModal === "function") {
            showModal("Por favor, selecione um método de pagamento antes de finalizar o seu pedido.");
        } else {
            alert("Por favor, selecione um método de pagamento antes de finalizar o seu pedido.");
        }
        return; // Interrompe o envio
    }

    // --- BARREIRA DO CARTÃO DE CRÉDITO ---
    // --- BARREIRA DO CARTÃO DE CRÉDITO ---
    if (selectedPayment === 'credit_card') {
        const ccNumber = document.getElementById('cc-number').value.trim();
        const ccName = document.getElementById('cc-name').value.trim();
        const ccExpiry = document.getElementById('cc-expiry').value.trim();
        const ccCvv = document.getElementById('cc-cvv').value.trim();

        // Verifica se algum campo está vazio
        if (!ccNumber || !ccName || !ccExpiry || !ccCvv) {
            if (typeof showModal === "function") {
                showModal("Por favor, preencha todos os dados obrigatórios do cartão de crédito.");
            } else {
                alert("Por favor, preencha todos os dados obrigatórios do cartão de crédito.");
            }
            return;
        }

        // Verifica se a validade está completa (MM/AA)
        if (ccExpiry.length < 5) {
            if (typeof showModal === "function") {
                showModal("Por favor, insira uma data de validade válida no formato MM/AA (ex: 12/29).");
            } else {
                alert("Por favor, insira uma data de validade válida no formato MM/AA.");
            }
            return;
        }

        // NOVA VALIDAÇÃO: Verifica se o CVV tem pelo menos 3 dígitos
        if (ccCvv.length < 3) {
            if (typeof showModal === "function") {
                showModal("O código de segurança (CVV) do cartão deve ter pelo menos 3 dígitos.");
            } else {
                alert("O código de segurança (CVV) do cartão deve ter pelo menos 3 dígitos.");
            }
            return;
        }
    }

    // Calcula o total
    let orderTotal = 0;
    cart.forEach(item => {
        orderTotal += item.priceValue;
    });

    const ccInstallments = document.getElementById('cc-installments') ? document.getElementById('cc-installments').value : 1;

    // Cria um objeto de pedido com todas as informações
    const newOrder = {
        id: `#BR-${Math.floor(Math.random() * 900000) + 100000}`, // ID único aleatório
        date: new Date().toLocaleString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        items: JSON.parse(JSON.stringify(cart)), // Cria uma cópia profunda dos itens
        total: orderTotal,
        paymentMethod: selectedPayment || 'pix',
        installments: selectedPayment === 'credit_card' ? ccInstallments : 1,
        observation: observationText,
        status: 'Confirmado' // Status inicial do pedido
    };

    // Armazena o pedido no histórico
    if (typeof orders !== 'undefined') {
        orders.push(newOrder);
    }

    // --- NOVA LÓGICA: SIMULAÇÃO DE SEPARAÇÃO (TEMPO REAL) ---
    // Descobre o nome da loja baseada no primeiro item do carrinho
    const storeName = newOrder.items.length > 0 ? newOrder.items[0].store : "Matriz";
    const generatedOrderId = newOrder.id;

    // Define um tempo (Ex: 8 segundos) após a compra para disparar a notificação
    setTimeout(() => {
        addOrderNotification(generatedOrderId, storeName);
    }, 8000); 
    // --------------------------------------------------------

    // (O resto da função continua normal abaixo: esvazia o carrinho, etc...)
    cart = [];
    if (typeof renderCart === "function") renderCart();
    
    // Atualiza badges se existirem no sistema
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(b => b.style.display = 'none');

    // Renderiza os pedidos na tela de pedidos (background)
    if (typeof renderOrders === "function") renderOrders();

    // Abre o nosso Pop-up de Sucesso (em vez do alert)
    if (typeof showOrderSuccessModal === "function") {
        showOrderSuccessModal(`O pedido ${newOrder.id} foi realizado com sucesso e já está no sistema da loja.`);
    } else {
        alert(`Pedido ${newOrder.id} confirmado com sucesso!`);
        navigateTo('screen-orders');
    }
}

// --- CONTROLADORES DO MODAL DE PEDIDO CONFIRMADO ---
function showOrderSuccessModal(message) {
    const modal = document.getElementById('order-success-modal');
    const msgEl = document.getElementById('order-success-message');
    
    if (modal && msgEl) {
        msgEl.textContent = message;
        modal.classList.add('active-modal');
    }
}

function closeOrderSuccessModal() {
    const modal = document.getElementById('order-success-modal');
    if (modal) {
        modal.classList.remove('active-modal');
    }
    // Ao fechar o pop-up de sucesso, direciona o cliente direto para a tela de Pedidos
    navigateTo('screen-orders');
}

// --- SISTEMA DE SELEÇÃO DE PAGAMENTO ---
function togglePaymentDetails() {
    const checkedRadio = document.querySelector('input[name="payment_method"]:checked');
    const pixDetails = document.getElementById('pix-details-container');
    const cardDetails = document.getElementById('card-details-container');

    // 1. Limpa todas as bordas brilhantes
    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('active-payment-box');
    });

    if (!checkedRadio) return; 

    // 2. Acende o botão clicado
    const selectedCard = checkedRadio.closest('.payment-card');
    if (selectedCard) {
        selectedCard.classList.add('active-payment-box');
    }

    const selectedPayment = checkedRadio.value;

    // 3. Mostra a aba correta e gera o Pix se for necessário
    if (selectedPayment === 'pix') {
        if (pixDetails) pixDetails.style.display = 'block';
        if (cardDetails) cardDetails.style.display = 'none';
        generatePixCode(); 
    } else if (selectedPayment === 'credit_card') {
        if (pixDetails) pixDetails.style.display = 'none';
        if (cardDetails) cardDetails.style.display = 'block';
    }

    if (typeof updateInstallments === "function") updateInstallments();
}

// --- GERADOR DE CÓDIGO PIX ALFANUMÉRICO ---
function generatePixCode() {
    const randomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const pixCode = `00020126580014br.gov.bcb.pix0136${randomHash}5204000053039865802BR5913MegaLoja6009RioGrandeDoSul62070503***6304ABCD`;
    
    const pixCodeEl = document.getElementById('pix-code-text');
    if (pixCodeEl) {
        pixCodeEl.textContent = pixCode;
    }
}

/**
 * Copia o código Pix para a área de transferência do usuário
 */
/**
 * Copia o código Pix para a área de transferência do utilizador e exibe o pop-up de sucesso correto
 */
function copyPixCode() {
    const pixText = document.getElementById('pix-code-text').textContent;
    
    navigator.clipboard.writeText(pixText).then(() => {
        // Abre o modal verde específico de sucesso que adicionámos no HTML
        const copyModal = document.getElementById('pix-copy-modal');
        if (copyModal) {
            copyModal.classList.add('active-modal');
        } else {
            alert("Código Pix copiado com sucesso!");
        }
    }).catch(err => {
        console.error('Erro ao copiar o código Pix:', err);
    });
}

/**
 * Formata o campo de validade do cartão para o padrão MM/AA
 * Aceita apenas números e formata automaticamente com a barra
 */
function formatExpiryDate(input) {
    // Remove tudo que não é número
    let value = input.value.replace(/\D/g, '');
    
    // Limita a 4 dígitos
    if (value.length > 4) {
        value = value.slice(0, 4);
    }
    
    // Validação do Mês (Máximo 12)
    if (value.length >= 2) {
        let month = parseInt(value.slice(0, 2), 10);
        
        if (month > 12) {
            // Se for maior que 12, força o mês a ser 12
            value = '12' + value.slice(2);
        } else if (month === 0) {
            // Opcional: Se digitarem '00', força a ser '01' pois não existe mês 0
            value = '01' + value.slice(2);
        }
    } else if (value.length === 1 && value !== '0' && value !== '1') {
        value = '0' + value;
    }
    
    // --- NOVA LÓGICA: DATA DE VALIDADE MÍNIMA (06/26) ---
    if (value.length === 4) {
        let month = parseInt(value.slice(0, 2), 10);
        let year = parseInt(value.slice(2, 4), 10);

        // Se o ano for menor que 26 (ex: 24, 25), força a ser 26
        if (year < 26) {
            year = 26;
        }
        
        // Se o ano for 26, o mês não pode ser menor que 06 (Junho)
        if (year === 26 && month < 6) {
            month = 6;
        }

        // Converte de volta para texto garantindo os 2 dígitos (ex: "6" vira "06")
        let strMonth = month.toString().padStart(2, '0');
        let strYear = year.toString();
        
        // Atualiza o valor formatado e corrigido
        value = strMonth + strYear;
    }
    // ----------------------------------------------------
    
    // Formata como MM/AA
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    input.value = value;
}

// --- SISTEMA DINÂMICO DE NOTIFICAÇÕES ---
function addOrderNotification(orderId, storeName) {
    const list = document.getElementById('notifications-list');
    const emptyState = document.getElementById('notifications-empty');

    if (!list) return;

    // Cria um ID único para esta notificação
    const notifId = 'notif-' + Date.now();
    
    // Cria o card da notificação
    const notifCard = document.createElement('div');
    notifCard.className = 'notification-card unread';
    notifCard.id = notifId;
    notifCard.style.background = '#1F2937';
    notifCard.style.border = '1px solid #374151';
    notifCard.style.borderRadius = '12px';
    notifCard.style.padding = '15px';
    notifCard.style.position = 'relative';
    notifCard.style.animation = 'fadeIn 0.5s ease'; // Efeito de surgimento suave

    // Estrutura visual da notificação (Ícone verde + Texto personalizado)
    notifCard.innerHTML = `
        <div style="display: flex; gap: 15px; align-items: flex-start;">
            <div style="background: rgba(16, 185, 129, 0.15); color: #10B981; padding: 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <h4 style="margin: 0; color: #F9FAFB; font-size: 15px; font-weight: 600;">Pedido Separado!</h4>
                    <span class="unread-dot" style="width: 10px; height: 10px; background: #EF4444; border-radius: 50%; display: inline-block;"></span>
                </div>
                <p style="margin: 0 0 12px 0; color: #9CA3AF; font-size: 13.5px; line-height: 1.5;">
                    O seu pedido <strong>${orderId}</strong> já foi separado e está aguardando você na sua respectiva filial. Não esqueça de levar o QR Code ou o número de pedido!
                </p>
                <div style="display: flex; gap: 10px;">
                    <button class="notif-action-btn primary" onclick="navigateTo('screen-orders'); toggleReadState('${notifId}')" style="background: #6366F1; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: 0.2s;">Ver Pedido</button>
                    <button class="notif-action-btn secondary" onclick="toggleReadState('${notifId}')" style="background: transparent; color: #9CA3AF; border: 1px solid #4B5563; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: 0.2s;">Marcar como lido</button>
                </div>
            </div>
        </div>
    `;

    // Insere a notificação no topo da lista (a mais recente sempre em cima)
    list.prepend(notifCard);

    // Ajusta a exibição das telas
    if (emptyState) emptyState.style.display = 'none';
    list.style.display = 'flex';

    // Atualiza a bolinha vermelha de contagem no menu!
    if (typeof updateNotificationBadge === "function") {
        updateNotificationBadge();
    }
}

// --- SISTEMA DINÂMICO DE PARCELAMENTO ---
function updateInstallments() {
    const slider = document.getElementById('cc-installments');
    const displayCard = document.getElementById('installment-display');
    const displaySummary = document.getElementById('checkout-installment-info');
    
    if (!slider) return;

    const installments = parseInt(slider.value);
    
    // Calcula o total do carrinho
    let orderTotalValue = 0;
    if (typeof cart !== 'undefined') {
        cart.forEach(item => {
            orderTotalValue += (item.priceValue || 0) * (item.quantity || 1);
        });
    }

    // Divide pelo número de parcelas
    const installmentValue = orderTotalValue / installments;
    const formattedValue = installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const text = `${installments}x de ${formattedValue}`;

    // Atualiza o texto na área de pagamento
    if (displayCard) displayCard.textContent = text;
    
    // Atualiza o texto na área de Resumo (Meu pedido)
    if (displaySummary) {
        displaySummary.textContent = text;
        const isCreditCard = document.querySelector('input[name="payment_method"]:checked')?.value === 'credit_card';
        // Só mostra no resumo se o cartão estiver selecionado e se for mais de 1 parcela
        displaySummary.style.display = isCreditCard && installments > 0 ? 'block' : 'none';
    }
}

// --- GERADOR DE QR CODE PARA PEDIDOS ---
function generateOrderQRCode(orderId, containerId, btnId) {
    const container = document.getElementById(containerId);
    const btn = document.getElementById(btnId);

    if (!container) return;

    // Converte o ID do pedido (ex: #BR-123456) para um formato seguro de URL
    const qrData = encodeURIComponent(orderId);
    
    // Usa uma API gratuita super rápida para gerar a imagem do QR Code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`;

    // Constrói a estrutura visual da imagem (com fundo branco para os leitores lerem bem)
    container.innerHTML = `
        <div style="background: #FFFFFF; padding: 10px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <img src="${qrUrl}" alt="QR Code do Pedido ${orderId}" style="display: block; width: 180px; height: 180px;">
        </div>
        <p style="color: #10B981; font-size: 13px; font-weight: 600; margin-top: 12px; display: flex; align-items: center; gap: 6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Código gerado com sucesso!
        </p>
        <p style="color: #9CA3AF; font-size: 12px; margin-top: 4px;">Apresente este código na tela do seu dispositivo na loja.</p>
    `;

    // Mostra o container (centralizado com Flexbox)
    container.style.display = 'flex';

    // Esconde o botão original para não gerar duas vezes
    if (btn) {
        btn.style.display = 'none';
    }
}

// ==================== GERENCIAMENTO DINÂMICO DE ESTOQUE (STAFF) ====================

// Cache de sessão para persistência visual das abas
// ==================== GERENCIAMENTO DINÂMICO DE ESTOQUE (STAFF) ====================

// Registra a memória de sessão de forma segura e imune a erros de re-declaração por 'let'
if (typeof window.employeeStockCache === 'undefined') {
    window.employeeStockCache = null;
}

/**
 * Mapeia os produtos reais e gera o painel baseando-se estritamente na regra de quantidade
 */
// ==================== GERENCIAMENTO DINÂMICO DE ESTOQUE (STAFF) ====================

// Registra a memória de sessão de forma segura e imune a erros de re-declaração por 'let'
if (typeof window.employeeStockCache === 'undefined') {
    window.employeeStockCache = null;
}

/**
 * Mapeia os produtos reais e gera o painel baseando-se estritamente na regra de quantidade
 */
function renderEmployeeStock() {
    const productListContainer = document.querySelector('.stock-products-list');
    if (!productListContainer) return;

    // === PASSO A: SE NÃO HOUVER CACHE (PRIMEIRO ACESSO DO LOGIN), CARREGA O CATÁLOGO ===
    if (window.employeeStockCache === null) {
        window.employeeStockCache = [];
        const clientProducts = document.querySelectorAll('.product-card');
        
        let idx = 0;
        clientProducts.forEach(card => {
            const nameEl = card.querySelector('.product-name');
            const priceEl = card.querySelector('.product-price');
            if (!nameEl) return;

            const name = nameEl.textContent.trim();
            const price = priceEl ? priceEl.textContent.trim() : 'R$ 0,00';
            const category = card.getAttribute('data-category') || 'Geral';

            // Evita duplicados na carga do catálogo do cliente
            const exists = window.employeeStockCache.some(p => p.name === name);
            if (!exists) {
                const rand = Math.random();
                let qty = 0;

                // Geração equilibrada inicial para teste visual
                if (rand < 0.12) {
                    qty = 0; 
                } else if (rand < 0.32) {
                    qty = Math.floor(Math.random() * 5) + 1; // 1 a 5 unidades
                } else {
                    qty = Math.floor(Math.random() * 85) + 6; // 6 ou mais unidades
                }

                // Automação de Regra de Status
                let statusText = 'Disponível';
                let badgeClass = 'badge-in-stock';

                if (qty === 0) {
                    statusText = 'Esgotado';
                    badgeClass = 'badge-out-stock';
                } else if (qty <= 5) {
                    statusText = 'Estoque Baixo';
                    badgeClass = 'badge-low-stock';
                }

                window.employeeStockCache.push({
                    sku: `SKU-${1000 + (idx * 13)}`,
                    name,
                    category,
                    price,
                    qty,
                    badgeClass,
                    statusText
                });
                idx++;
            }
        });
    }

    // === PASSO B: LIMPA O CONTAINER E RENDERIZA A LISTAGEM COM BASE NO CACHE SEGURO ===
    productListContainer.innerHTML = ''; // IMPORTANTE: Limpa antes de renderizar
    
    let totalItems = window.employeeStockCache.length;
    let baixoEstoqueCount = 0;
    let esgotadoCount = 0;

    window.employeeStockCache.forEach(prod => {
        if (prod.qty === 0) esgotadoCount++;
        else if (prod.qty <= 5) baixoEstoqueCount++;

        // A linha agora tem eventos de clique no Nome e no Preço para abrir a edição
        productListContainer.innerHTML += `
            <div class="stock-product-row" style="position: relative; padding-right: 45px;">
                <div class="prod-main-info" onclick="openEditProductModal('${prod.sku}')" style="cursor: pointer;" title="Clique para editar">
                    <span class="prod-sku">${prod.sku}</span>
                    <h3>${prod.name}</h3>
                    <span class="prod-category">${prod.category}</span>
                </div>
                <div class="prod-meta-info">
                    <div class="prod-price" onclick="openEditProductModal('${prod.sku}')" style="cursor: pointer;" title="Clique para editar">${prod.price}</div>
                    <div class="prod-stock-status">
                        <span class="stock-qty" ${prod.qty === 0 ? 'style="color: #EF4444;"' : ''}>${prod.qty} un.</span>
                        <span class="stock-status-badge ${prod.badgeClass}">${prod.statusText}</span>
                    </div>
                </div>
                
                <button class="stock-delete-btn" onclick="removeEmployeeStockItem('${prod.sku}')" title="Remover Produto" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); margin: 0; padding: 8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
    });

    // Atualiza os indicadores superiores
    const kpiValues = document.querySelectorAll('.stock-kpi-card .kpi-value');
    if (kpiValues.length >= 3) {
        kpiValues[0].textContent = totalItems;
        kpiValues[1].innerHTML = `${baixoEstoqueCount} <small style="font-size: 12px; font-weight: normal; color: #F59E0B;">itens</small>`;
        kpiValues[2].innerHTML = `${esgotadoCount} <small style="font-size: 12px; font-weight: normal; color: #EF4444;">itens</small>`;
    }
}

/**
 * Abre o modal de cadastro
 */
function openAddProductModal() {
    const modal = document.getElementById('stock-add-modal');
    if (modal) modal.style.display = 'flex';
}

/**
 * Fecha o modal de forma limpa e segura
 */
function closeAddProductModal() {
    const modal = document.getElementById('stock-add-modal');
    if (modal) {
        modal.style.display = 'none';
        const n = document.getElementById('stock-new-name');
        const p = document.getElementById('stock-new-price');
        const q = document.getElementById('stock-new-qty');
        if (n) n.value = '';
        if (p) p.value = '';
        if (q) q.value = '';
    }
}

/**
 * Processa a criação e calcula o status matematicamente sem falhas
 */
function handleCreateProduct(event) {
    if (event) event.preventDefault(); // Impede o recarregamento da página

    const nameEl = document.getElementById('stock-new-name');
    const priceEl = document.getElementById('stock-new-price');
    const qtyEl = document.getElementById('stock-new-qty');

    // Validação defensiva: se algum campo sumiu do HTML, avisa o desenvolvedor no console
    if (!nameEl || !priceEl || !qtyEl) {
        console.error("Erro Crítico: Campos do formulário não foram encontrados no HTML.");
        return;
    }

    const name = nameEl.value.trim();
    let price = priceEl.value.trim();
    let qty = parseInt(qtyEl.value);

    if (!name || !price) return;
    if (isNaN(qty) || qty < 0) qty = 0;
    if (!price.toUpperCase().includes('R$')) price = `R$ ${price}`;

    // === PROCESSAMENTO AUTOMÁTICO DO STATUS ===
    let statusText = 'Disponível';
    let badgeClass = 'badge-in-stock';

    if (qty === 0) {
        statusText = 'Esgotado';
        badgeClass = 'badge-out-stock';
    } else if (qty <= 5) {
        statusText = 'Estoque Baixo';
        badgeClass = 'badge-low-stock';
    }

    // Inicialização forçada se necessário
    if (window.employeeStockCache === null) {
        window.employeeStockCache = [];
    }

    const sku = `SKU-${2000 + (window.employeeStockCache.length + 1)}`;

    // Injeta o novo produto no topo da memória da sessão
    window.employeeStockCache.unshift({
        sku,
        name,
        category: 'Entrada Manual',
        price,
        qty,
        badgeClass,
        statusText
    });

    // Fecha a janela e atualiza o ecrã instantaneamente
    closeAddProductModal();
    renderEmployeeStock();
}

/**
 * Filtro de pesquisa operacional por SKU, Nome ou Categoria
 */
function handleEmployeeStockSearch() {
    const searchInput = document.querySelector('.stock-search-input');
    if (!searchInput) return;
    
    const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const searchTerm = normalize(searchInput.value);
    
    const rows = document.querySelectorAll('.stock-product-row');
    rows.forEach(row => {
        const name = normalize(row.querySelector('h3').textContent);
        const category = normalize(row.querySelector('.prod-category').textContent);
        const sku = normalize(row.querySelector('.prod-sku').textContent);
        
        if (name.includes(searchTerm) || category.includes(searchTerm) || sku.includes(searchTerm)) {
            row.style.display = 'flex';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Remove um item específico do estoque na sessão atual
 */
function removeEmployeeStockItem(sku) {
    if (!window.employeeStockCache) return;
    
    // Filtra o array, mantendo apenas os produtos que NÃO têm o SKU clicado
    window.employeeStockCache = window.employeeStockCache.filter(item => item.sku !== sku);
    
    // Atualiza a tela imediatamente (isso fará o produto sumir e os KPIs do topo serem recalculados)
    renderEmployeeStock();
}

// ==================== LÓGICA DE EDIÇÃO DE PRODUTO ====================

// Variável para lembrar qual produto estamos editando no momento
let currentEditSku = null;

/**
 * Abre o modal e preenche os campos com os dados atuais do produto
 */
function openEditProductModal(sku) {
    if (!window.employeeStockCache) return;
    
    // Procura o produto exato na memória
    const product = window.employeeStockCache.find(p => p.sku === sku);
    if (!product) return;

    // Guarda o SKU para sabermos quem atualizar depois
    currentEditSku = sku;
    
    // Preenche os campos do modal com os dados existentes
    document.getElementById('stock-edit-name').value = product.name;
    document.getElementById('stock-edit-price').value = product.price;

    const modal = document.getElementById('stock-edit-modal');
    if (modal) modal.style.display = 'flex';
}

/**
 * Fecha o modal de edição e limpa a memória temporária
 */
function closeEditProductModal() {
    const modal = document.getElementById('stock-edit-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('stock-edit-name').value = '';
        document.getElementById('stock-edit-price').value = '';
        currentEditSku = null; // Zera a referência
    }
}

/**
 * Guarda as alterações feitas no produto e atualiza a tela
 */
function handleEditProduct(event) {
    if (event) event.preventDefault();

    if (!currentEditSku || !window.employeeStockCache) return;

    const nameEl = document.getElementById('stock-edit-name');
    const priceEl = document.getElementById('stock-edit-price');

    if (!nameEl || !priceEl) return;

    const newName = nameEl.value.trim();
    let newPrice = priceEl.value.trim();

    if (!newName || !newPrice) return;
    
    // Garante que o R$ esteja lá, por precaução
    if (!newPrice.toUpperCase().includes('R$')) newPrice = `R$ ${newPrice}`;

    // Acha a posição do produto na lista global e atualiza os dados
    const productIndex = window.employeeStockCache.findIndex(p => p.sku === currentEditSku);
    if (productIndex !== -1) {
        window.employeeStockCache[productIndex].name = newName;
        window.employeeStockCache[productIndex].price = newPrice;
    }

    // Fecha a janela e atualiza o ecrã instantaneamente
    closeEditProductModal();
    renderEmployeeStock();
}
