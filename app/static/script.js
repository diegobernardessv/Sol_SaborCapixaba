// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos principais
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const searchBox = document.getElementById('search-box');
    const cartContainer = document.getElementById('cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    let allMenuItems = []; // Cache para todos os itens do menu
    let cartItems = []; // Array para os itens do carrinho

    // --- Theme Switcher Logic ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            themeToggle.checked = false;
        }
    };

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- Cart Logic ---
    const renderCart = () => {
        cartItemsContainer.innerHTML = ''; // Limpa o carrinho
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Seu carrinho está vazio.</p>';
            cartContainer.classList.remove('cart-visible');
            return;
        }

        cartContainer.classList.add('cart-visible');
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalPrice += item.price;
            const cartItemHtml = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button class="remove-from-cart-btn" data-id="${item.id}">&times;</button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHtml;
        });

        totalPriceEl.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    };

    const addToCart = (itemId) => {
        const itemToAdd = allMenuItems.find(item => item.id === Number(itemId));
        if (itemToAdd) {
            cartItems.push(itemToAdd);
            renderCart();
        }
    };

    const removeFromCart = (itemId) => {
        const itemIndex = cartItems.findIndex(item => item.id === Number(itemId));
        if (itemIndex > -1) {
            cartItems.splice(itemIndex, 1);
            renderCart();
        }
    };

    // --- Menu Rendering Logic ---
    const renderMenu = (items) => {
        menuItemsContainer.innerHTML = ''; // Limpa o container antes de renderizar
        if (items.length === 0) {
            menuItemsContainer.innerHTML = '<p class="feedback">Nenhum item encontrado.</p>';
            return;
        }

        const itemsHtml = items.map(item => {
            const promotionClass = item.promotion ? 'promotion' : '';
            const imageUrl = item.image_url ? item.image_url : 'static/images/coffee-break.png'; // Imagem padrão
            
            return `
                <div class="item ${promotionClass}" data-category="${item.category}">
                    <img src="${imageUrl}" alt="${item.name}" class="item-image">
                    <div class="item-info">
                        <p class="item-name">${item.name}</p>
                        <p class="item-description">${item.description}</p>
                    </div>
                    <div class="item-actions">
                        <p class="price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        <button class="add-to-cart-btn" data-id="${item.id}">Adicionar</button>
                    </div>
                </div>
            `;
        }).join('');
        
        menuItemsContainer.innerHTML = itemsHtml;
    };

    // Função para buscar os dados do menu e iniciar a aplicação
    const fetchMenuData = async () => {
        try {
            const response = await fetch('/api/produtos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allMenuItems = data.items; // Armazena os itens no cache
            renderMenu(allMenuItems); // Renderiza todos os itens inicialmente
        } catch (error) {
            console.error("Falha ao buscar os dados do menu:", error);
            menuItemsContainer.innerHTML = '<p class="feedback error">Não foi possível carregar o cardápio. Tente novamente mais tarde.</p>';
        }
    };

    // Adiciona evento de clique para cada botão de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Atualiza o estado visual dos botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            searchBox.value = ''; // Limpa a busca ao trocar de filtro

            // Filtra os itens com base na categoria
            const filteredItems = filter === 'all'
                ? allMenuItems
                : allMenuItems.filter(item => item.category === filter);
            
            renderMenu(filteredItems);
        });
    });

    searchBox.addEventListener('input', () => {
        const searchTerm = searchBox.value.toLowerCase().trim();
        
        // Desativa o filtro de categoria ao buscar
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');

        const searchedItems = allMenuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
        renderMenu(searchedItems);
    });

    menuItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const itemId = e.target.dataset.id;
            addToCart(itemId);
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const itemId = e.target.dataset.id;
            removeFromCart(itemId);
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length > 0) {
            alert(`Pedido finalizado com sucesso! Total: ${totalPriceEl.textContent}`);
            cartItems = [];
            renderCart();
        } else {
            alert('Seu carrinho está vazio!');
        }
    });

    // Inicia a aplicação
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    fetchMenuData();
}); 