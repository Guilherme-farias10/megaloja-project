function navigateTo(screenId) {
    if (!screenId) return;

    const screens = document.querySelectorAll('.screen-section');
    screens.forEach(screen => {
        screen.classList.remove('active-screen');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active-screen');
    }
    
    if (screenId === 'screen-orders' && typeof renderOrders === 'function') {
        renderOrders();
    }
    
    if (screenId === 'screen-employee-stock' && typeof renderEmployeeStock === 'function') {
        renderEmployeeStock();
    }

    if (screenId === 'screen-billing-addresses' && typeof renderBillingAddresses === 'function') {
        renderBillingAddresses();
    }

    if (screenId === 'screen-security-change-password' && typeof resetChangePasswordFeedback === 'function') {
        resetChangePasswordFeedback();
    }

    if (screenId === 'screen-employee-orders' && typeof renderEmployeeOrders === 'function') {
        renderEmployeeOrders();
    }

    const appMenu = document.getElementById('app-menu');
    const employeeMenu = document.getElementById('employee-menu');
    const container = document.getElementById('app-container');
    
    const noMenuScreens = [
        'screen-login', 
        'screen-register', 
        'screen-register-success', 
        'screen-forgot-password', 
        'screen-forgot-password-success',
        'screen-employee-login'
    ];

    const employeeScreens = [
        'screen-employee-orders',
        'screen-employee-stock',
        'screen-employee-reports',
        'screen-employee-order-detail',
        'screen-employee-order-separation',
        'screen-employee-order-pickup',
        'screen-employee-order-status'
    ];

    if (noMenuScreens.includes(screenId)) {
        
        if (appMenu) appMenu.style.display = 'none';
        if (employeeMenu) employeeMenu.style.display = 'none';
        document.body.style.justifyContent = 'center';
        if (container) {
            container.style.marginLeft = '0';
            container.style.width = '100%';
        }
    } else if (employeeScreens.includes(screenId)) {
        
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

function handleMenuClick(element, targetScreenId) {
    
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    element.classList.add('active');

    navigateTo(targetScreenId);
}

function showModal(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-modal').classList.add('active-modal');
}

function closeModal() {
    document.getElementById('error-modal').classList.remove('active-modal');
}

function handleRegister(event) {
    event.preventDefault();

    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;
    
    if (password !== confirmPassword) {
        showModal("As senhas informadas não são idênticas. Por favor, verifique e digite novamente.");
        return; 
    }

    navigateTo('screen-register-success');
}

function resetChangePasswordFeedback() {
    const feedback = document.getElementById('cp-password-feedback');
    const fields = [
        document.getElementById('cp-new-password'),
        document.getElementById('cp-confirm-password')
    ];

    if (feedback) {
        feedback.textContent = '';
        feedback.classList.remove('error', 'success');
    }

    fields.forEach(field => {
        if (field) field.closest('.input-group')?.classList.remove('input-error', 'input-success');
    });
}

function handleChangePassword(event) {
    event.preventDefault();

    const newPasswordInput = document.getElementById('cp-new-password');
    const confirmPasswordInput = document.getElementById('cp-confirm-password');
    const feedback = document.getElementById('cp-password-feedback');
    const newPassword = newPasswordInput ? newPasswordInput.value.trim() : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';

    resetChangePasswordFeedback();

    if (newPassword.length < 6 || confirmPassword.length < 6) {
        if (feedback) {
            feedback.textContent = 'A nova senha precisa ter pelo menos 6 caracteres.';
            feedback.classList.add('error');
        }
        newPasswordInput?.closest('.input-group')?.classList.add('input-error');
        confirmPasswordInput?.closest('.input-group')?.classList.add('input-error');
        showModal('A nova senha precisa ter pelo menos 6 caracteres.');
        return;
    }

    if (newPassword !== confirmPassword) {
        if (feedback) {
            feedback.textContent = 'As senhas precisam ser idênticas nos dois campos.';
            feedback.classList.add('error');
        }
        newPasswordInput?.closest('.input-group')?.classList.add('input-error');
        confirmPasswordInput?.closest('.input-group')?.classList.add('input-error');
        confirmPasswordInput?.focus();
        showModal('As senhas precisam ser idênticas para alterar a senha de acesso.');
        return;
    }

    if (feedback) {
        feedback.textContent = 'Senha confirmada com sucesso.';
        feedback.classList.add('success');
    }

    newPasswordInput?.closest('.input-group')?.classList.add('input-success');
    confirmPasswordInput?.closest('.input-group')?.classList.add('input-success');
    event.target.reset();
    showSuccessModal('Sua senha de acesso foi atualizada com sucesso.', 'Senha alterada!');
}

window.billingAddresses = window.billingAddresses || [
    {
        label: 'Casa',
        street: 'Rua Principal',
        number: '123',
        complement: 'Apto 302',
        city: 'Porto Alegre',
        state: 'RS',
        zip: '90000-000'
    }
];

function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

function getBillingAddressFormValues() {
    return {
        label: document.getElementById('billing-address-label')?.value.trim() || '',
        street: document.getElementById('billing-street')?.value.trim() || '',
        number: document.getElementById('billing-number')?.value.trim() || '',
        complement: document.getElementById('billing-complement')?.value.trim() || '',
        city: document.getElementById('billing-city')?.value.trim() || '',
        state: (document.getElementById('billing-state')?.value.trim() || '').toUpperCase(),
        zip: document.getElementById('billing-zip')?.value.trim() || ''
    };
}

function setBillingFormMode(isEditing) {
    const submitBtn = document.getElementById('billing-submit-btn');
    const cancelBtn = document.getElementById('billing-cancel-btn');

    if (submitBtn) submitBtn.textContent = isEditing ? 'Salvar Alterações' : 'Salvar Endereço';
    if (cancelBtn) cancelBtn.style.display = isEditing ? 'inline-flex' : 'none';
}

function renderBillingAddresses() {
    const list = document.getElementById('billing-addresses-list');
    if (!list) return;

    list.innerHTML = '';
    setBillingFormMode(Boolean(document.getElementById('billing-edit-index')?.value));

    if (!window.billingAddresses.length) {
        list.innerHTML = `
            <div class="billing-empty-state">
                <strong>Nenhum endereço salvo</strong>
                <span>Adicione um endereço para faturamento usando o formulário abaixo.</span>
            </div>
        `;
        return;
    }

    window.billingAddresses.forEach((address, index) => {
        const card = document.createElement('article');
        card.className = 'billing-address-card';
        card.innerHTML = `
            <div class="billing-address-main">
                <div class="billing-address-topline">
                    <strong>${escapeHTML(address.label)}</strong>
                    <span>${escapeHTML(address.state)}</span>
                </div>
                <p>${escapeHTML(address.street)}, ${escapeHTML(address.number)}${address.complement ? ' - ' + escapeHTML(address.complement) : ''}</p>
                <p>${escapeHTML(address.city)} - ${escapeHTML(address.state)} | CEP ${escapeHTML(address.zip)}</p>
            </div>
            <div class="billing-address-actions">
                <button type="button" onclick="startEditBillingAddress(${index})">Editar</button>
                <button type="button" class="danger" onclick="openBillingDeleteModal(${index})">Remover</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function handleBillingAddressSubmit(event) {
    event.preventDefault();

    const form = event.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const address = getBillingAddressFormValues();
    const zipNumbers = address.zip.replace(/\D/g, '');

    if (address.state.length !== 2) {
        showModal('Informe a UF com 2 letras, como RS ou SP.');
        document.getElementById('billing-state')?.focus();
        return;
    }

    if (zipNumbers.length !== 8) {
        showModal('Informe um CEP válido com 8 números.');
        document.getElementById('billing-zip')?.focus();
        return;
    }

    address.zip = zipNumbers.replace(/(\d{5})(\d{3})/, '$1-$2');

    const editIndexInput = document.getElementById('billing-edit-index');
    const editIndex = editIndexInput ? editIndexInput.value : '';

    if (editIndex === '') {
        addBillingAddress(address);
        showSuccessModal('Endereço de faturamento adicionado com sucesso.', 'Endereço salvo!');
    } else {
        saveBillingAddressEdits(Number(editIndex), address);
        showSuccessModal('Endereço de faturamento atualizado com sucesso.', 'Endereço atualizado!');
    }

    form.reset();
    if (editIndexInput) editIndexInput.value = '';
    setBillingFormMode(false);
    renderBillingAddresses();
}

function addBillingAddress(address) {
    window.billingAddresses.push(address);
}

function startEditBillingAddress(index) {
    const address = window.billingAddresses[index];
    if (!address) return;

    document.getElementById('billing-edit-index').value = index;
    document.getElementById('billing-address-label').value = address.label;
    document.getElementById('billing-street').value = address.street;
    document.getElementById('billing-number').value = address.number;
    document.getElementById('billing-complement').value = address.complement;
    document.getElementById('billing-city').value = address.city;
    document.getElementById('billing-state').value = address.state;
    document.getElementById('billing-zip').value = address.zip;

    setBillingFormMode(true);
    document.getElementById('billing-address-label')?.focus();
}

function saveBillingAddressEdits(index, address) {
    if (Number.isInteger(index) && window.billingAddresses[index]) {
        window.billingAddresses[index] = address;
    }
}

let pendingBillingDeleteIndex = null;

function openBillingDeleteModal(index) {
    const address = window.billingAddresses[index];
    if (!address) return;

    pendingBillingDeleteIndex = index;

    const modal = document.getElementById('billing-delete-modal');
    const message = document.getElementById('billing-delete-message');

    if (message) {
        message.textContent = `O endereço "${address.label}" será removido da sua lista de faturamento.`;
    }

    if (modal) {
        modal.classList.add('active-modal');
    }
}

function closeBillingDeleteModal() {
    const modal = document.getElementById('billing-delete-modal');
    pendingBillingDeleteIndex = null;

    if (modal) {
        modal.classList.remove('active-modal');
    }
}

function confirmBillingAddressDelete() {
    if (pendingBillingDeleteIndex === null) return;

    deleteBillingAddress(pendingBillingDeleteIndex);
    closeBillingDeleteModal();
}

function deleteBillingAddress(index) {
    const address = window.billingAddresses[index];
    if (!address) return;

    window.billingAddresses.splice(index, 1);
    cancelBillingEdit();
    renderBillingAddresses();
    showSuccessModal('Endereço removido da lista.', 'Endereço removido!');
}

function cancelBillingEdit() {
    const form = document.getElementById('billing-address-form');
    const editIndexInput = document.getElementById('billing-edit-index');

    if (form) form.reset();
    if (editIndexInput) editIndexInput.value = '';
    setBillingFormMode(false);
}

function cancelEditBillingAddress() {
    cancelBillingEdit();
}

document.addEventListener('DOMContentLoaded', () => {
    const stateInput = document.getElementById('billing-state');
    const zipInput = document.getElementById('billing-zip');
    const newPasswordInput = document.getElementById('cp-new-password');
    const confirmPasswordInput = document.getElementById('cp-confirm-password');

    if (stateInput) {
        stateInput.addEventListener('input', () => {
            stateInput.value = stateInput.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
        });
    }

    if (zipInput) {
        zipInput.addEventListener('input', () => {
            const numbers = zipInput.value.replace(/\D/g, '').slice(0, 8);
            zipInput.value = numbers.length > 5 ? numbers.replace(/(\d{5})(\d{0,3})/, '$1-$2') : numbers;
        });
    }

    [newPasswordInput, confirmPasswordInput].forEach(input => {
        if (!input) return;

        input.addEventListener('input', () => {
            const feedback = document.getElementById('cp-password-feedback');
            resetChangePasswordFeedback();

            if (!feedback) return;
            if (!newPasswordInput.value || !confirmPasswordInput.value) return;

            if (newPasswordInput.value === confirmPasswordInput.value) {
                feedback.textContent = 'As senhas conferem.';
                feedback.classList.add('success');
                newPasswordInput.closest('.input-group')?.classList.add('input-success');
                confirmPasswordInput.closest('.input-group')?.classList.add('input-success');
            } else {
                feedback.textContent = 'As senhas ainda não conferem.';
                feedback.classList.add('error');
                confirmPasswordInput.closest('.input-group')?.classList.add('input-error');
            }
        });
    });
});

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

function handleLogin(event) {
    event.preventDefault();
    
    cart = []; 
    if (typeof renderCart === "function") renderCart(); 
    
    window.stockCache = {};
    
    navigateTo('screen-stores');
}

function handleEmployeeLogin(event) {
    event.preventDefault();
    
    window.employeeStockCache = null;
    
    navigateTo('screen-employee-orders');
}

function handleStoreSearch() {
    
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;
    const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const searchTerm = normalize(searchInput.value);
    const storeCards = document.querySelectorAll('.store-card');

    storeCards.forEach(card => {
        const storeName = normalize(card.querySelector('.store-name').textContent);
        const storeAddress = normalize(card.querySelector('.store-address').textContent);

        if (storeName.includes(searchTerm) || storeAddress.includes(searchTerm)) {
            card.style.display = ''; 
        } else {
            card.style.display = 'none'; 
        }
    });
}

function handleProductSearch() {
    const searchInput = document.querySelector('.product-search-input');
    if (!searchInput) return;

    const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const searchTerm = normalize(searchInput.value);

    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const nameEl = card.querySelector('.product-name') || card.querySelector('h3');
        const productName = nameEl ? normalize(nameEl.textContent) : '';

        if (productName.includes(searchTerm)) {
            card.style.display = ''; 
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('cc-name');
    
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            
            e.target.value = e.target.value.toUpperCase();
        });
    }
});

function updateNotificationBadge() {
    
    const unreadCount = document.querySelectorAll('.notification-card.unread').length;
    const badges = document.querySelectorAll('.notif-badge');
    
    badges.forEach(badge => {
        if (unreadCount > 0) {
            badge.style.display = 'flex'; 
            badge.textContent = unreadCount; 
        } else {
            badge.style.display = 'none'; 
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateNotificationBadge();
});

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
    updateNotificationBadge(); 
}

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
    updateNotificationBadge(); 
}

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

let currentSelectedStore = ""; 
let cart = []; 
let orders = []; 

function selectStore(storeName) {
    currentSelectedStore = storeName;
    
    const titleElement = document.getElementById('stock-screen-title');
    if (titleElement) {
        titleElement.textContent = `Estoque - Loja ${storeName}`;
    }
    
    const searchInput = document.querySelector('#screen-stock .search-box input');
    if (searchInput) searchInput.value = "";
    refreshProductStockBadges();
    applyProductFilters();
    navigateTo('screen-stock');
}

// ============================================================
// BANCO DE ESTOQUE COMPARTILHADO (cliente + funcionário)
// Quantidades fixas, únicas por produto (independente da loja)
// ============================================================
window.stockDatabase = window.stockDatabase || null;

function initializeStockDatabase() {
    if (window.stockDatabase) return; // Já foi inicializado

    window.stockDatabase = {
        'Monitor Gamer 24" LED FHD': 25,
        'Cafeteira Elétrica Inox': 12,
        'Smartphone 128GB Ultra': 8,
        'Fone Bluetooth Noise Cancelling': 3,
        'Teclado Mecânico RGB': 18,
        'Notebook Intel i5 16GB RAM': 6,
        'Liquidificador Turbo 1000W': 0,
        'Smart TV 4K 50" Crystal': 10,
        'Carregador Rápido GaN 65W': 4,
        'Console PlayStation 5 Slim': 2
    };
}

function getStockStatus(productName) {
    const key = findStockKey(productName);
    if (!key) return { text: 'Indisponível', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', state: 'out' };
    const qty = window.stockDatabase[key];
    if (qty === 0) return { text: 'Indisponível', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', state: 'out' };
    if (qty <= 5) return { text: 'Baixo Estoque', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', state: 'in' };
    return { text: 'Disponível', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', state: 'in' };
}

function refreshProductStockBadges() {
    initializeStockDatabase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const nameElement = card.querySelector('.product-name');
        if (!nameElement) return;
        const productName = nameElement.textContent.trim();

        const existingBadge = card.querySelector('.stock-badge');
        if (existingBadge) existingBadge.remove();

        const stockInfo = getStockStatus(productName);

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

        if (nameElement.parentElement) {
            nameElement.parentElement.appendChild(badge);
        }

        const addBtn = card.querySelector('.add-product-btn');
        if (addBtn) {
            if (stockInfo.state === 'out') {
                addBtn.style.opacity = '0.5';
                addBtn.style.cursor = 'not-allowed';
                addBtn.innerHTML = 'Esgotado';
                card.setAttribute('data-stock', 'out');
            } else {
                addBtn.style.opacity = '1';
                addBtn.style.cursor = 'pointer';
                addBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
                card.setAttribute('data-stock', 'in');
            }
        }
    });
}

function applyProductFilters() {
    const searchInput = document.querySelector('#screen-stock .search-box input');
    
    const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const searchTerm = searchInput ? normalize(searchInput.value) : "";

    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const nameElement = card.querySelector('.product-name');
        
        if (!nameElement) return; 
        const productName = normalize(nameElement.textContent);
        const allowedStoresAttr = card.getAttribute('data-stores') || "";
        const allowedStores = allowedStoresAttr.split(',').map(s => s.trim());
        const matchesStore = allowedStores.includes(currentSelectedStore);
        const matchesSearch = productName.includes(searchTerm);

        if (matchesStore && matchesSearch) {
            card.style.display = ''; 
        } else {
            card.style.display = 'none';
        }
    });
}

function normalizeProductName(name) {
    // Remove aspas, apóstrofos, duplicatas e normaliza para match
    return name.replace(/[''"”'´`\u2019\u2018]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function findStockKey(productName) {
    initializeStockDatabase();
    const normalized = normalizeProductName(productName);
    for (const key of Object.keys(window.stockDatabase)) {
        if (normalizeProductName(key) === normalized) {
            return key;
        }
    }
    return null;
}

function getAvailableStock(productName) {
    initializeStockDatabase();
    const key = findStockKey(productName);
    if (!key) return 0;
    return window.stockDatabase[key];
}

function addToOrder(productName) {
    let productPriceText = "R$ 0,00";
    let productNumericPrice = 0;
    let isOutOfStock = false;

    const normalizeText = (text) => text.toLowerCase().replace(/['"”'´`]/g, '').trim();
    const cards = document.querySelectorAll('.product-card');

    for (let card of cards) {
        const nameElement = card.querySelector('.product-name');
        if (nameElement && normalizeText(nameElement.textContent) === normalizeText(productName)) {
            if (card.getAttribute('data-stock') === 'out') {
                isOutOfStock = true;
                break;
            }

            const priceElement = card.querySelector('.product-price');
            if (priceElement) {
                productPriceText = priceElement.textContent.trim();
                let numString = productPriceText
                    .replace('R$', '')
                    .trim()
                    .replace(/\./g, '')
                    .replace(',', '.');
                productNumericPrice = parseFloat(numString);
            }
            break;
        }
    }

    if (isOutOfStock) {
        if (typeof showModal === "function") {
            showModal(`Puxa! O produto "${productName}" está Indisponível no momento nesta filial.`);
        } else {
            alert(`Puxa! O produto "${productName}" está Indisponível no momento nesta filial.`);
        }
        return;
    }

    // Verifica o estoque disponível no banco compartilhado
    initializeStockDatabase();
    const availableQty = getAvailableStock(productName);
    
    // Calcula quantos já estão no carrinho
    const inCartQty = (Array.isArray(cart) ? cart : [])
        .filter(it => it && it.name === productName && it.store === currentSelectedStore)
        .reduce((sum, it) => sum + (it.quantity || 1), 0);

    if (inCartQty >= availableQty) {
        if (typeof showModal === "function") {
            showModal(`Desculpe! Não há mais estoque disponível de "${productName}". Apenas ${availableQty} unidade(s) em estoque.`);
        } else {
            alert(`Desculpe! Não há mais estoque disponível de "${productName}".`);
        }
        return;
    }

    // FIX do bug: se já existir item (mesmo nome + mesma loja) no carrinho,
    // aumentar a quantidade em vez de criar uma nova linha repetida.
    const existingIndex = (Array.isArray(cart) ? cart : []).findIndex(
        (it) => it && it.name === productName && it.store === currentSelectedStore
    );

    if (existingIndex !== -1) {
        const existing = cart[existingIndex];
        existing.quantity = (existing.quantity || 1) + 1;
        // Mantém priceText/priceValue do item existente, mas normaliza se estiver faltando
        if (typeof existing.priceValue !== 'number' || Number.isNaN(existing.priceValue)) {
            existing.priceValue = productNumericPrice;
        }
        if (!existing.priceText) {
            existing.priceText = productPriceText;
        }

        showSuccessModal(`Quantidade de "${productName}" atualizada no seu pedido!`);
        renderCart();
        return;
    }

    cart.push({
        name: productName,
        store: currentSelectedStore,
        priceText: productPriceText,
        priceValue: productNumericPrice,
        quantity: 1
    });

    showSuccessModal(`"${productName}" foi adicionado ao seu pedido com sucesso!`);
    renderCart();
}

// Controladores do Pop-up de Sucesso Blindados
function showSuccessModal(message, title = 'Produto Adicionado!') {
    const modal = document.getElementById('success-modal');
    const msgEl = document.getElementById('success-message');
    const titleEl = document.getElementById('success-title');
    
    // Proteção: Se o HTML do modal existir, ele abre. Se não, exibe o alerta padrão para não travar.
    if (modal && msgEl) {
        if (titleEl) titleEl.textContent = title;
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

    // Garante que o array exista
    cart = Array.isArray(cart) ? cart : [];

    listContainer.innerHTML = '';

    // Garante consistência do estado antes de renderizar
    cart.forEach(item => {
        if (typeof item.quantity !== 'number' || item.quantity < 1) item.quantity = 1;
        if (typeof item.checked !== 'boolean') item.checked = false;

        // Se priceValue vier como string/NaN, normaliza
        const pv = item.priceValue;
        if (typeof pv !== 'number' || Number.isNaN(pv)) {
            const fallback = typeof item.priceText === 'string'
                ? item.priceText.replace('R$', '').trim().replace(/\./g, '').replace(',', '.')
                : 0;
            item.priceValue = parseFloat(fallback) || 0;
        }
    });

    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        if (totalContainer) totalContainer.style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        if (totalContainer) totalContainer.style.display = 'flex';

        let totalAmount = 0;

        // render lista
        listContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const subtotal = (item.priceValue || 0) * (item.quantity || 1);
            totalAmount += subtotal;

            // formatação consistente (evita erro caso formatMoney não exista)
            const formattedSubtotal = (typeof formatMoney === 'function')
                ? formatMoney(subtotal)
                : subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            listContainer.innerHTML += `
                <div style="background: #1F2937; padding: 15px; border-radius: 8px; border: 1px solid #374151; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                    <div style="display:flex; align-items:center; gap:12px; min-width: 0;">
                        <input type="checkbox"
                               class="cart-item-checkbox"
                               data-cart-index="${index}"
                               style="width: 20px; height: 20px; accent-color: #6366F1; cursor: pointer;"
                               ${item.checked ? 'checked' : ''}
                               onchange="toggleCartItemChecked(${index}, this.checked)" />
                        <div style="min-width: 0;">
                            <h3 style="color: #F9FAFB; margin: 0 0 5px 0; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h3>
                            <p style="color: #818CF8; margin: 0 0 6px 0; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                Retirada: Loja ${item.store}
                            </p>
                            <p style="color: #10B981; margin: 0; font-weight: bold; font-size: 15px;">
                                ${formattedSubtotal}
                            </p>
                            <p style="color: #9CA3AF; margin: 6px 0 0 0; font-size: 12.5px;">
                                ${item.quantity}x de ${item.priceText}
                            </p>
                        </div>
                    </div>

                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <button type="button"
                                    class="qty-btn"
                                    onclick="decreaseCartQuantity(${index})"
                                    style="width: 38px; height: 38px; border-radius: 10px; border: 1px solid #374151; background: #111827; color: #F3F4F6; font-size: 18px; cursor: pointer;">
                                −
                            </button>

                            <span style="min-width: 34px; text-align:center; color:#F9FAFB; font-weight:700;">${item.quantity}</span>

                            <button type="button"
                                    class="qty-btn"
                                    onclick="increaseCartQuantity(${index})"
                                    style="width: 38px; height: 38px; border-radius: 10px; border: 1px solid #374151; background: #111827; color: #F3F4F6; font-size: 18px; cursor: pointer;">
                                +
                            </button>
                        </div>

                        <button class="remove-item-btn" onclick="removeFromCart(${index})"
                                style="background: transparent; border: 1px solid #EF4444; color: #EF4444; height: 40px; padding: 0 14px; border-radius: 10px; cursor: pointer; font-weight: 600;">
                            Remover
                        </button>
                    </div>
                </div>
            `;
        });

        if (totalValueEl) {
            totalValueEl.textContent = totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    }

    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        if (cart.length > 0) {
            badge.style.display = 'flex';
            badge.textContent = cart.length;
        } else {
            badge.style.display = 'none';
        }
    });
}

function toggleCartItemChecked(cartIndex, isChecked) {
    if (typeof cartIndex !== 'number' || !cart[cartIndex]) return;
    cart[cartIndex].checked = Boolean(isChecked);
}

function increaseCartQuantity(cartIndex) {
    if (typeof cartIndex !== 'number' || !cart[cartIndex]) return;
    
    const item = cart[cartIndex];
    const availableQty = getAvailableStock(item.name);
    const newQty = (item.quantity || 1) + 1;
    
    if (newQty > availableQty) {
        if (typeof showModal === "function") {
            showModal(`Desculpe! Não há estoque suficiente de "${item.name}". Apenas ${availableQty} unidade(s) disponíveis.`);
        } else {
            alert(`Desculpe! Não há estoque suficiente de "${item.name}".`);
        }
        return;
    }
    
    item.quantity = newQty;
    renderCart();
}

function decreaseCartQuantity(cartIndex) {
    if (typeof cartIndex !== 'number' || !cart[cartIndex]) return;

    const currentQty = cart[cartIndex].quantity || 1;
    if (currentQty <= 1) {
        // “−” até 0: remove a linha
        cart.splice(cartIndex, 1);
    } else {
        cart[cartIndex].quantity = currentQty - 1;
    }
    renderCart();
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

    // Impedir seguir para a compra se o usuário não marcou nenhum item no carrinho.
    const anyChecked = cart.some(item => item && item.checked === true);
    if (!anyChecked) {
        if (typeof showModal === "function") {
            showModal("Você precisa selecionar pelo menos um item no carrinho para realizar o pedido.");
        } else {
            alert("Você precisa selecionar pelo menos um item no carrinho para realizar o pedido.");
        }
        return;
    }

    // Guardar somente os itens marcados para usar no checkout e no pedido final.
    const checkedCartItems = cart.filter(item => item && item.checked === true);

    // Reset UI de pagamento (radios e abas)
    const radioButtons = document.querySelectorAll('input[name="payment_method"]');
    radioButtons.forEach(radio => radio.checked = false);

    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('active-payment-box');
    });

    const pixDetails = document.getElementById('pix-details-container');
    const cardDetails = document.getElementById('card-details-container');
    if (pixDetails) pixDetails.style.display = 'none';
    if (cardDetails) cardDetails.style.display = 'none';

    // Persistir o conjunto “a comprar” durante esta sessão de checkout
    window._checkoutSelectedItems = JSON.parse(JSON.stringify(checkedCartItems));

    renderCheckoutSummary(checkedCartItems);
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
                            ${typeof item.quantity !== 'undefined' ? `<span style="color: #9CA3AF; font-size: 12px; font-weight: 500; margin-top: 2px;">Quantidade: ${item.quantity}</span>` : ''}
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
        return;
    }

    // Itens “a comprar” vêm do checkout (itens marcados).
    const checkoutItems = Array.isArray(window._checkoutSelectedItems)
        ? window._checkoutSelectedItems
        : [];

    if (!checkoutItems.length) {
        if (typeof showModal === "function") {
            showModal("Você precisa selecionar pelo menos um item no carrinho para realizar o pedido.");
        } else {
            alert("Você precisa selecionar pelo menos um item no carrinho para realizar o pedido.");
        }
        return;
    }

    if (selectedPayment === 'credit_card') {
        const ccNumber = document.getElementById('cc-number')?.value?.trim() || '';
        const ccName = document.getElementById('cc-name')?.value?.trim() || '';
        const ccExpiry = document.getElementById('cc-expiry')?.value?.trim() || '';
        const ccCvv = document.getElementById('cc-cvv')?.value?.trim() || '';

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

        // Verifica se o CVV tem pelo menos 3 dígitos
        if (ccCvv.length < 3) {
            if (typeof showModal === "function") {
                showModal("O código de segurança (CVV) do cartão deve ter pelo menos 3 dígitos.");
            } else {
                alert("O código de segurança (CVV) do cartão deve ter pelo menos 3 dígitos.");
            }
            return;
        }
    }

    // Calcula o total SOMENTE com os itens do checkout
    let orderTotal = 0;
    checkoutItems.forEach(item => {
        const pv = item?.priceValue || 0;
        const qty = item?.quantity || 1;
        orderTotal += pv * qty;
    });

    const ccInstallmentsEl = document.getElementById('cc-installments');
    const ccInstallments = ccInstallmentsEl ? ccInstallmentsEl.value : 1;

    // Ajusta e salva pedido SOMENTE com itens “checked”
    const itemsToSave = checkoutItems.map(item => ({
        name: item.name,
        store: item.store,
        quantity: item.quantity || 1,
        priceText: item.priceText,
        priceValue: item.priceValue,
        checked: item.checked === true
    }));

    const newOrder = {
        id: `#BR-${Math.floor(Math.random() * 900000) + 100000}`,
        date: new Date().toLocaleString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        items: JSON.parse(JSON.stringify(itemsToSave)),
        total: orderTotal,
        paymentMethod: selectedPayment || 'pix',
        installments: selectedPayment === 'credit_card' ? ccInstallments : 1,
        observation: observationText,
        status: 'Confirmado'
    };

    if (typeof orders !== 'undefined') {
        orders.push(newOrder);
    }

    const storeName = newOrder.items.length > 0 ? newOrder.items[0].store : "Matriz";
    const generatedOrderId = newOrder.id;

    setTimeout(() => {
        addOrderNotification(generatedOrderId, storeName);
    }, 8000);

    // Decrementa o estoque no banco compartilhado
    initializeStockDatabase();
    checkoutItems.forEach(item => {
        const dbKey = findStockKey(item.name);
        if (dbKey && window.stockDatabase[dbKey] !== undefined) {
            const qtySold = item.quantity || 1;
            window.stockDatabase[dbKey] = Math.max(0, window.stockDatabase[dbKey] - qtySold);
            // Atualiza também no cache do funcionário se existir
            if (window.employeeStockCache) {
                const empProd = window.employeeStockCache.find(p => p.name === name);
                if (empProd) {
                    empProd.qty = window.stockDatabase[name];
                    if (empProd.qty === 0) {
                        empProd.statusText = 'Esgotado';
                        empProd.badgeClass = 'badge-out-stock';
                    } else if (empProd.qty <= 5) {
                        empProd.statusText = 'Estoque Baixo';
                        empProd.badgeClass = 'badge-low-stock';
                    } else {
                        empProd.statusText = 'Disponível';
                        empProd.badgeClass = 'badge-in-stock';
                    }
                }
            }
        }
    });

    // Remove SOMENTE os itens comprados (marcados no checkout) do carrinho,
    // mantendo os não selecionados.
    const checkoutKeys = new Set(
        checkoutItems.map(ci => `${ci.store}__${ci.name}`)
    );

    cart = (Array.isArray(cart) ? cart : []).filter(item => {
        const key = `${item.store}__${item.name}`;
        // se está no conjunto do checkout E está marcado no carrinho => remove
        return !(checkoutKeys.has(key) && item.checked === true);
    });

    // Limpa o estado do checkout, pois o pedido já foi concluído
    window._checkoutSelectedItems = [];

    if (typeof renderCart === "function") renderCart();

    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(b => {
        if (cart && cart.length > 0) {
            b.style.display = 'flex';
            b.textContent = cart.length;
        } else {
            b.style.display = 'none';
        }
    });

    if (typeof renderOrders === "function") renderOrders();

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
    const btnEl = document.getElementById('order-success-btn');
    
    if (modal && msgEl) {
        msgEl.textContent = message;
        // Altera o texto do botão conforme o fluxo
        if (btnEl) {
            btnEl.textContent = window._employeeModalPending ? 'Ver pedidos' : 'Ver meus pedidos';
        }
        modal.classList.add('active-modal');
    }
}

function closeOrderSuccessModal() {
    const modal = document.getElementById('order-success-modal');
    if (modal) {
        modal.classList.remove('active-modal');
    }
    // Verifica se o modal foi aberto pelo fluxo do funcionário
    if (window._employeeModalPending) {
        window._employeeModalPending = false;
        renderEmployeeOrders();
        navigateTo('screen-employee-orders');
    } else {
        // Fluxo do cliente: vai para a tela de Meus Pedidos
        navigateTo('screen-orders');
    }
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
    let value = input.value.replace(/\D/g, '');

    if (value.length > 4) {
        value = value.slice(0, 4);
    }

    if (value.length >= 2) {
        let month = parseInt(value.slice(0, 2), 10);

        if (month > 12) {
            value = '12' + value.slice(2);
        } else if (month === 0) {
            value = '01' + value.slice(2);
        }
    } else if (value.length === 1 && value !== '0' && value !== '1') {
        value = '0' + value;
    }

    if (value.length === 4) {
        let month = parseInt(value.slice(0, 2), 10);
        let year = parseInt(value.slice(2, 4), 10);

        if (year < 26) {
            year = 26;
        }

        if (year === 26 && month < 6) {
            month = 6;
        }

        let strMonth = month.toString().padStart(2, '0');
        let strYear = year.toString();

        value = strMonth + strYear;
    }

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
    
    // Calcula o total SOMENTE dos itens selecionados (checkout) ou marcados no carrinho
    let orderTotalValue = 0;
    
    // Prioriza os itens salvos para o checkout (apenas os selecionados pelo usuário)
    const checkoutItems = Array.isArray(window._checkoutSelectedItems) && window._checkoutSelectedItems.length > 0
        ? window._checkoutSelectedItems
        : (Array.isArray(cart) ? cart.filter(item => item && item.checked === true) : []);
    
    // Se não houver itens selecionados, usa o carrinho inteiro como fallback
    const itemsToUse = checkoutItems.length > 0 ? checkoutItems : (Array.isArray(cart) ? cart : []);
    
    itemsToUse.forEach(item => {
        orderTotalValue += (item.priceValue || 0) * (item.quantity || 1);
    });

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

    container.style.display = 'flex';

    if (btn) {
        btn.style.display = 'none';
    }
}

if (typeof window.employeeStockCache === 'undefined') {
    window.employeeStockCache = null;
}




function syncEmployeeCacheWithDatabase() {
    initializeStockDatabase();

    // Se o cache do funcionário ainda não foi criado, cria a partir do banco
    if (window.employeeStockCache === null) {
        window.employeeStockCache = [];
    }

    const existingNames = new Set(window.employeeStockCache.map(p => p.name));

    // Adiciona produtos do stockDatabase que ainda não estão no cache
    const clientProducts = document.querySelectorAll('.product-card');
    let idx = 0;

    Object.keys(window.stockDatabase).forEach(name => {
        if (existingNames.has(name)) return;

        const qty = window.stockDatabase[name];
        
        let statusText = 'Disponível';
        let badgeClass = 'badge-in-stock';
        if (qty === 0) {
            statusText = 'Esgotado';
            badgeClass = 'badge-out-stock';
        } else if (qty <= 5) {
            statusText = 'Estoque Baixo';
            badgeClass = 'badge-low-stock';
        }

        const card = Array.from(clientProducts).find(c => {
            const el = c.querySelector('.product-name');
            return el && el.textContent.trim() === name;
        });

        const priceEl = card ? card.querySelector('.product-price') : null;
        const price = priceEl ? priceEl.textContent.trim() : 'R$ 0,00';
        const category = card ? (card.getAttribute('data-category') || 'Geral') : 'Geral';
        const sku = `SKU-${1000 + (idx * 13)}`;

        window.employeeStockCache.push({
            sku, name, category, price, qty, badgeClass, statusText
        });
        idx++;
    });
}

function renderEmployeeStock() {
    const productListContainer = document.querySelector('.stock-products-list');
    if (!productListContainer) return;

    // Sincroniza com o banco de dados compartilhado
    syncEmployeeCacheWithDatabase();

    productListContainer.innerHTML = ''; 
    
    let totalItems = window.employeeStockCache.length;
    let baixoEstoqueCount = 0;
    let esgotadoCount = 0;

    window.employeeStockCache.forEach(prod => {
        if (prod.qty === 0) esgotadoCount++;
        else if (prod.qty <= 5) baixoEstoqueCount++;
   
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

    
    const kpiValues = document.querySelectorAll('.stock-kpi-card .kpi-value');
    if (kpiValues.length >= 3) {
        kpiValues[0].textContent = totalItems;
        kpiValues[1].innerHTML = `${baixoEstoqueCount} <small style="font-size: 12px; font-weight: normal; color: #F59E0B;">itens</small>`;
        kpiValues[2].innerHTML = `${esgotadoCount} <small style="font-size: 12px; font-weight: normal; color: #EF4444;">itens</small>`;
    }
}

function openAddProductModal() {
    const modal = document.getElementById('stock-add-modal');
    if (modal) modal.style.display = 'flex';
}

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

function handleCreateProduct(event) {
    if (event) event.preventDefault(); 

    const nameEl = document.getElementById('stock-new-name');
    const priceEl = document.getElementById('stock-new-price');
    const qtyEl = document.getElementById('stock-new-qty');

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

    
    let statusText = 'Disponível';
    let badgeClass = 'badge-in-stock';

    if (qty === 0) {
        statusText = 'Esgotado';
        badgeClass = 'badge-out-stock';
    } else if (qty <= 5) {
        statusText = 'Estoque Baixo';
        badgeClass = 'badge-low-stock';
    }
    
    if (window.employeeStockCache === null) {
        window.employeeStockCache = [];
    }

    const sku = `SKU-${2000 + (window.employeeStockCache.length + 1)}`;
    
    window.employeeStockCache.unshift({
        sku,
        name,
        category: 'Entrada Manual',
        price,
        qty,
        badgeClass,
        statusText
    });
    
    closeAddProductModal();
    renderEmployeeStock();
}

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

function removeEmployeeStockItem(sku) {
    if (!window.employeeStockCache) return;
    const removedItem = window.employeeStockCache.find(item => item.sku === sku);
    if (removedItem && window.stockDatabase && window.stockDatabase[removedItem.name] !== undefined) {
        delete window.stockDatabase[removedItem.name];
    }
    window.employeeStockCache = window.employeeStockCache.filter(item => item.sku !== sku);
    renderEmployeeStock();
}

let currentEditSku = null;

function openEditProductModal(sku) {
    if (!window.employeeStockCache) return;
    const product = window.employeeStockCache.find(p => p.sku === sku);
    if (!product) return;
    currentEditSku = sku;
    document.getElementById('stock-edit-name').value = product.name;
    document.getElementById('stock-edit-price').value = product.price;
    document.getElementById('stock-edit-qty').value = product.qty;
    const modal = document.getElementById('stock-edit-modal');
    if (modal) modal.style.display = 'flex';
}

function closeEditProductModal() {
    const modal = document.getElementById('stock-edit-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('stock-edit-name').value = '';
        document.getElementById('stock-edit-price').value = '';
        const qtyEl = document.getElementById('stock-edit-qty');
        if (qtyEl) qtyEl.value = '';
        currentEditSku = null; 
    }
}

function handleEditProduct(event) {
    if (event) event.preventDefault();

    if (!currentEditSku || !window.employeeStockCache) return;

    const nameEl = document.getElementById('stock-edit-name');
    const priceEl = document.getElementById('stock-edit-price');
    const qtyEl = document.getElementById('stock-edit-qty');

    if (!nameEl || !priceEl) return;

    const newName = nameEl.value.trim();
    let newPrice = priceEl.value.trim();
    let newQty = qtyEl ? parseInt(qtyEl.value) : undefined;

    if (!newName || !newPrice) return;
    if (newQty !== undefined && (isNaN(newQty) || newQty < 0)) newQty = 0;
    
    if (!newPrice.toUpperCase().includes('R$')) newPrice = `R$ ${newPrice}`;

    const productIndex = window.employeeStockCache.findIndex(p => p.sku === currentEditSku);
    if (productIndex !== -1) {
        const prod = window.employeeStockCache[productIndex];
        prod.name = newName;
        prod.price = newPrice;
        if (newQty !== undefined) {
            prod.qty = newQty;
            // Atualiza o banco compartilhado
            initializeStockDatabase();
            window.stockDatabase[prod.name] = newQty;
            
            // Atualiza status
            if (newQty === 0) {
                prod.statusText = 'Esgotado';
                prod.badgeClass = 'badge-out-stock';
            } else if (newQty <= 5) {
                prod.statusText = 'Estoque Baixo';
                prod.badgeClass = 'badge-low-stock';
            } else {
                prod.statusText = 'Disponível';
                prod.badgeClass = 'badge-in-stock';
            }
        }
    }

    closeEditProductModal();
    renderEmployeeStock();
}

const employeeOrders = [
    { id: 'PED-9087', client: 'João Silva', date: 'Hoje, 14:30', status: 'Pendente', total: 1250.90, items: [
        { name: 'Monitor Gamer 24" LED FHD', qtd: 1, price: 899.90 },
        { name: 'Teclado Mecânico RGB', qtd: 1, price: 279.00 }
    ], paymentMethod: 'PIX', store: 'Centro' },
    { id: 'PED-9086', client: 'Maria Oliveira', date: 'Hoje, 14:15', status: 'Em Separação', total: 2849.00, items: [
        { name: 'Smartphone 128GB Ultra', qtd: 1, price: 2499.00 },
        { name: 'Carregador Rápido GaN 65W', qtd: 1, price: 129.00 }
    ], paymentMethod: 'Cartão de Crédito', installments: 3, store: 'Shopping Mall' },
    { id: 'PED-9085', client: 'Carlos Santos', date: 'Hoje, 13:50', status: 'Pronto para Retirada', total: 549.90, items: [
        { name: 'Fone Bluetooth Noise Cancelling', qtd: 1, price: 349.90 },
        { name: 'Cafeteira Elétrica Inox', qtd: 1, price: 189.00 }
    ], paymentMethod: 'PIX', store: 'Zona Norte' },
    { id: 'PED-9084', client: 'Ana Beatriz Ribeiro', date: 'Hoje, 13:10', status: 'Em Separação', total: 4498.00, items: [
        { name: 'Notebook Intel i5 16GB RAM', qtd: 1, price: 4199.00 },
        { name: 'Mouse Pad Gamer', qtd: 1, price: 0 }
    ], paymentMethod: 'Cartão de Crédito', installments: 6, store: 'Centro' },
    { id: 'PED-9083', client: 'Marcos Souza Filhos', date: 'Ontem, 18:45', status: 'Finalizado', total: 2378.00, items: [
        { name: 'Console PlayStation 5 Slim', qtd: 1, price: 3799.00 }
    ], paymentMethod: 'PIX', store: 'Distrito Boémio' },
    { id: 'PED-9082', client: 'Juliana Lima Ramos', date: 'Ontem, 17:20', status: 'Cancelado', total: 0, items: [
        { name: 'Smart TV 4K 50" Crystal', qtd: 1, price: 2199.00 }
    ], paymentMethod: 'PIX', store: 'Centro' }
];

let currentSelectedOrderId = null;
let currentSelectedOrderData = null;

function renderEmployeeOrders() {
    const list = document.getElementById('emp-orders-list');
    if (!list) return;

    list.innerHTML = '';

    employeeOrders.forEach(order => {
        const statusClass = getStatusBadgeClass(order.status);
        const card = document.createElement('div');
        card.className = 'emp-order-card';
        card.onclick = function() { openEmployeeOrderDetail(order.id); };
        card.innerHTML = `
            <div class="emp-order-info">
                <h3>#${order.id}</h3>
                <p>Cliente: ${order.client}</p>
                <span class="emp-order-time">${order.date}</span>
            </div>
            <div class="emp-order-status-area">
                <span class="emp-badge ${statusClass}">${order.status}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
        `;
        list.appendChild(card);
    });
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'Pendente': return 'emp-badge-pending';
        case 'Em Separação': return 'emp-badge-preparing';
        case 'Pronto para Retirada': return 'emp-badge-ready';
        case 'Finalizado': return 'emp-badge-delivered';
        case 'Cancelado': return 'emp-badge-cancelled';
        default: return 'emp-badge-pending';
    }
}

function openEmployeeOrderDetail(orderId) {
    const order = employeeOrders.find(o => o.id === orderId);
    if (!order) return;

    currentSelectedOrderId = orderId;
    currentSelectedOrderData = order;
    
    document.getElementById('detail-header-id').innerText = '#' + order.id;
    
    const statusBar = document.getElementById('detail-status-bar');
    const statusClass = getStatusBadgeClass(order.status);
    statusBar.innerHTML = `<span class="emp-badge ${statusClass}" style="font-size: 14px; padding: 8px 20px;">${order.status}</span>`;
    
    document.getElementById('detail-client-name').textContent = order.client;
    document.getElementById('detail-order-date').textContent = order.date;

    const itemsList = document.getElementById('detail-items-list');
    itemsList.innerHTML = '';
    
    let totalValue = 0;
    order.items.forEach(item => {
        const subtotal = (item.price || 0) * (item.qtd || 1);
        totalValue += subtotal;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'detail-item-row';
        itemEl.innerHTML = `
            <div class="detail-item-info">
                <span class="detail-item-name">${item.name}</span>
                <span class="detail-item-qty">Quantidade: ${item.qtd}</span>
            </div>
            <span class="detail-item-price">R$ ${(item.price || 0).toFixed(2).replace('.', ',')}</span>
        `;
        itemsList.appendChild(itemEl);
    });

    document.getElementById('detail-order-total').textContent = `R$ ${totalValue.toFixed(2).replace('.', ',')}`;

    const payMethod = order.paymentMethod || 'PIX';
    const installments = order.installments || 1;
    document.getElementById('detail-payment-method').textContent = payMethod === 'PIX' ? 'PIX' : `Cartão de Crédito (${installments}x)`;

    const actionsContainer = document.getElementById('detail-actions');
    actionsContainer.innerHTML = '';

    if (order.status === 'Em Separação') {
        actionsContainer.innerHTML += `
            <button onclick="goToEmployeeSeparation()" class="primary-btn detail-action-btn" style="background: #6366F1;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Separar Pedido
            </button>
        `;
    }

    if (order.status !== 'Finalizado' && order.status !== 'Cancelado') {
        actionsContainer.innerHTML += `
            <button onclick="goToEmployeeUpdateStatus()" class="secondary-btn detail-action-btn" style="background: #374151; color: #F3F4F6; border: 1px solid #4B5563;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Atualizar Status
            </button>
        `;
    }

    if (order.status === 'Pronto para Retirada') {
        actionsContainer.innerHTML += `
            <button onclick="goToEmployeePickup()" class="primary-btn detail-action-btn" style="background: #10B981;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Confirmar Retirada
            </button>
        `;
    }

    navigateTo('screen-employee-order-detail');
}

function goToEmployeeSeparation() {
    const order = employeeOrders.find(o => o.id === currentSelectedOrderId);
    if (!order) return;

    if (order.status !== 'Em Separação') {
        if (typeof showModal === "function") {
            showModal(`Não é possível separar o pedido #${order.id}. Status atual: "${order.status}". O pedido precisa estar em "Em Separação".`);
        } else {
            alert(`Não é possível separar o pedido #${order.id}. Status atual: "${order.status}". O pedido precisa estar em "Em Separação".`);
        }
        return;
    }

    document.getElementById('sep-header-id').innerText = '#' + order.id;
    navigateTo('screen-employee-order-separation');
    renderEmployeeSeparationItems(order);
}

function renderEmployeeSeparationItems(order) {
    const container = document.getElementById('separation-items-list');
    if (!container) return;

    container.innerHTML = order.items.map(item => `
        <label class="separation-item" id="sep-card-${item.name.replace(/\s/g, '-')}">
            <input type="checkbox" class="item-checkbox" onchange="toggleSeparationStyle(this, '${item.name.replace(/\s/g, '-')}')">
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-qtd">Qtd: ${item.qtd}</span>
            </div>
        </label>
    `).join('');
}

function finishEmployeeSeparation() {
    const order = employeeOrders.find(o => o.id === currentSelectedOrderId);
    if (!order) return;

    if (order.status !== 'Em Separação') {
        if (typeof showModal === "function") {
            showModal(`Não é possível concluir a separação do pedido #${order.id}. Status atual: "${order.status}".`);
        } else {
            alert(`Não é possível concluir a separação do pedido #${order.id}. Status atual: "${order.status}".`);
        }
        return;
    }

    const checkboxes = document.querySelectorAll('.item-checkbox');
    if (!checkboxes || checkboxes.length === 0) {
        if (typeof showModal === "function") {
            showModal('Nenhum item encontrado para conferência. Volte e marque os itens antes de concluir.');
        } else {
            alert('Nenhum item encontrado para conferência. Volte e marque os itens antes de concluir.');
        }
        return;
    }

    const allChecked = Array.from(checkboxes).every(cb => cb.checked === true);

    if (!allChecked) {
        if (typeof showModal === "function") {
            showModal('Não foi possível concluir: verifique se TODOS os itens estão marcados como conferidos.');
        } else {
            alert('Não foi possível concluir: verifique se TODOS os itens estão marcados como conferidos.');
        }
        return;
    }

    order.status = 'Pronto para Retirada';

    const modal = document.getElementById('order-success-modal');
    const msgEl = document.getElementById('order-success-message');
    if (modal && msgEl) {
        msgEl.textContent = `Pedido #${currentSelectedOrderId} separado com sucesso! Status alterado para "Pronto para Retirada".`;
        window._employeeModalPending = true;
        modal.classList.add('active-modal');
    } else {
        renderEmployeeOrders();
        navigateTo('screen-employee-orders');
    }
}

function finishSeparation() {
    finishEmployeeSeparation();
}

function goToEmployeeUpdateStatus() {
    const order = employeeOrders.find(o => o.id === currentSelectedOrderId);
    if (!order) return;

    document.getElementById('emp-status-header-id').innerText = '#' + order.id;
    document.getElementById('emp-status-observation').value = '';
    
    document.querySelectorAll('input[name="emp_order_status"]').forEach(r => r.checked = false);

    navigateTo('screen-employee-order-status');
}

function saveEmployeeOrderStatus() {
    const selectedStatus = document.querySelector('input[name="emp_order_status"]:checked');
    if (!selectedStatus) {
        if (typeof showModal === "function") {
            showModal("Por favor, selecione um status antes de salvar.");
        } else {
            alert("Por favor, selecione um status.");
        }
        return;
    }
    
    const order = employeeOrders.find(o => o.id === currentSelectedOrderId);
    if (!order) return;
    
    if (order.status === selectedStatus.value) {
        if (typeof showModal === "function") {
            showModal(`O pedido #${currentSelectedOrderId} já está com o status "${selectedStatus.value}". Selecione um status diferente para atualizar.`);
        } else {
            alert(`O pedido #${currentSelectedOrderId} já está com o status "${selectedStatus.value}".`);
        }
        return;
    }
    
    order.status = selectedStatus.value;
    
    const modal = document.getElementById('order-success-modal');
    const msgEl = document.getElementById('order-success-message');
    if (modal && msgEl) {
        msgEl.textContent = `Status do pedido #${currentSelectedOrderId} alterado para "${selectedStatus.value}" com sucesso!`;
        window._employeeModalPending = true;
        modal.classList.add('active-modal');
    } else {
        renderEmployeeOrders();
        navigateTo('screen-employee-orders');
    }
}


function saveOrderStatus() {
    saveEmployeeOrderStatus();
}

function goToEmployeePickup() {
    const order = employeeOrders.find(o => o.id === currentSelectedOrderId);
    if (!order) return;

    
    if (order.status !== 'Pronto para Retirada') {
        showModal('Este pedido ainda não está pronto para retirada.');
        return;
    }

    document.getElementById('pickup-header-id').innerText = '#' + order.id;
    document.getElementById('pickup-client-name').textContent = order.client;
    document.getElementById('pickup-order-id-text').textContent = '#' + order.id;

    const itemsList = document.getElementById('pickup-items-list');
    itemsList.innerHTML = '';
    
    order.items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'detail-item-row';
        itemEl.innerHTML = `
            <div class="detail-item-info">
                <span class="detail-item-name">${item.name}</span>
                <span class="detail-item-qty">Qtd: ${item.qtd}</span>
            </div>
            <span class="detail-item-price">R$ ${(item.price || 0).toFixed(2).replace('.', ',')}</span>
        `;
        itemsList.appendChild(itemEl);
    });

    navigateTo('screen-employee-order-pickup');
}

function confirmPickup() {
    const order = employeeOrders.find(o => o.id === currentSelectedOrderId);
    if (order) {
        order.status = 'Finalizado';
    }
    
    const modal = document.getElementById('order-success-modal');
    const msgEl = document.getElementById('order-success-message');
    if (modal && msgEl) {
        msgEl.textContent = `Retirada do pedido #${currentSelectedOrderId} confirmada com sucesso! Pedido finalizado.`;
        window._employeeModalPending = true;
        modal.classList.add('active-modal');
    } else {
        renderEmployeeOrders();
        navigateTo('screen-employee-orders');
    }
}
