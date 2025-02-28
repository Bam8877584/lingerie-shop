// Ініціалізація GSAP
gsap.registerPlugin(ScrollTrigger);

// Анімація плиток-категорій із 3D-ефектам
document.querySelectorAll('.category').forEach(category => {
    gsap.set(category, { transformPerspective: 1000 });

    category.addEventListener('mouseenter', function() {
        gsap.to(this, { 
            scale: 1.1, 
            rotateX: 10, 
            rotateY: 10, 
            boxShadow: '0 12px 30px rgba(39, 174, 96, 0.4), 0 0 25px #d4a017', 
            duration: 0.4, 
            ease: 'power3.out' 
        });
    });

    category.addEventListener('mouseleave', function() {
        gsap.to(this, { 
            scale: 1, 
            rotateX: 0, 
            rotateY: 0, 
            boxShadow: '0 8px 20px rgba(39, 174, 96, 0.2), 0 0 15px #d4a017', 
            duration: 0.4, 
            ease: 'power3.out' 
        });
    });

    category.addEventListener('click', function() {
        const content = this.getAttribute('data-content');
        document.querySelectorAll('.products').forEach(product => product.style.display = 'none');
        document.getElementById(content).style.display = 'block';

        gsap.to(`#${content}`, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
                document.getElementById(content).style.display = 'block';
                gsap.to(`#${content}`, { opacity: 1, duration: 0.5, ease: 'power3.out' });
            }
        });

        // Показати плитки з цінами для категорій "Елегантність" і "Повсякдення"
        if (content === 'elegance' || content === 'everyday') {
            const priceTiles = document.querySelector(`#${content} .price-tiles`);
            gsap.from(priceTiles, { 
                opacity: 0, 
                y: 50, 
                duration: 0.8, 
                ease: 'power3.out',
                onComplete: () => priceTiles.style.display = 'flex'
            });
        }
    });
});

// Анімація плиток цін
document.querySelectorAll('.price-tile').forEach(tile => {
    gsap.set(tile, { transformPerspective: 1000 });

    tile.addEventListener('mouseenter', function() {
        gsap.to(this, { 
            scale: 1.1, 
            rotateX: 10, 
            rotateY: 10, 
            boxShadow: '0 15px 40px rgba(39, 174, 96, 0.5), 0 0 30px #d4a017', 
            duration: 0.5, 
            ease: 'power3.out' 
        });
    });

    tile.addEventListener('mouseleave', function() {
        gsap.to(this, { 
            scale: 1, 
            rotateX: 0, 
            rotateY: 0, 
            boxShadow: '0 10px 30px rgba(39, 174, 96, 0.3), 0 0 20px #d4a017', 
            duration: 0.5, 
            ease: 'power3.out' 
        });
    });

    tile.addEventListener('click', function() {
        const price = parseInt(this.getAttribute('data-price'));
        const itemName = this.textContent.split(' — ')[0];
        let discount = 0;
        const user = JSON.parse(localStorage.getItem('user')) || {};
        if (user.email) {
            const cartTotal = cart.reduce((sum, item) => sum + item.price, 0) + price;
            if (cartTotal >= 25000) discount = 20;
            else if (cartTotal >= 10000) discount = 15;
            else if (cartTotal >= 5000) discount = 10;
        }

        const finalPrice = price * (1 - discount / 100);
        cart.push({ name: itemName, price: finalPrice });
        localStorage.setItem('cart', JSON.stringify(cart));

        gsap.to(this, { 
            scale: 1.1, 
            boxShadow: '0 0 20px #87CEEB', /* Небесно-блакитна неонова підсвітка */
            duration: 0.4, 
            ease: 'power3.out',
            onComplete: () => {
                showPaymentModal(itemName, finalPrice, discount);
                gsap.to(this, { scale: 1, boxShadow: '0 10px 30px rgba(39, 174, 96, 0.3), 0 0 20px #d4a017', duration: 0.4, ease: 'power3.out' });
            }
        });

        // Оновлюємо лічильник кошика
        const cartBtn = document.querySelector('.cart-btn');
        let count = parseInt(cartBtn.textContent.match(/\d+/)[0]) || 0;
        gsap.to(cartBtn, { 
            scale: 1.2, 
            duration: 0.4, 
            ease: 'power3.out',
            onComplete: () => {
                cartBtn.textContent = `( ${count + 1} )`;
                gsap.to(cartBtn, { scale: 1, duration: 0.4, ease: 'power3.out' });
            }
        });
    });
});

// Анімація елементів галереї при прокрутці
gsap.utils.toArray('.item').forEach(item => {
    gsap.from(item, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
            ease: 'power3.out'
        }
    });
});

// Обробка фільтрів
document.getElementById('brandFilter').addEventListener('change', filterItems);
document.getElementById('priceRange').addEventListener('input', filterItems);

function filterItems() {
    const brand = document.getElementById('brandFilter').value.toLowerCase();
    const price = parseInt(document.getElementById('priceRange').value);

    gsap.to('.item', {
        duration: 0.6,
        opacity: 0,
        onComplete: () => {
            document.querySelectorAll('.item').forEach(item => {
                const itemBrand = item.querySelector('h3').textContent.toLowerCase();
                const itemPrice = parseInt(item.querySelector('.price-display').getAttribute('data-price'));

                if ((brand === 'acousma' || itemBrand.includes(brand)) && itemPrice <= price) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            gsap.to('.item', { opacity: 1, duration: 0.6, ease: 'power3.out' });
        }
    });
}

// Функція для показу модального вікна оплати
function showPaymentModal(itemName, itemPrice, discount) {
    const modal = document.querySelector('#paymentModal');
    document.getElementById('paymentItem').textContent = itemName;
    document.getElementById('paymentPrice').textContent = `${itemPrice} грн (знижка ${discount}%)`;

    modal.style.display = 'block';
    gsap.from(modal, { opacity: 0, scale: 0.8, duration: 0.5, ease: 'power3.out' });

    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            gsap.to(modal, { 
                opacity: 0, 
                scale: 0.8, 
                duration: 0.5, 
                ease: 'power3.out', 
                onComplete: () => modal.style.display = 'none' 
            });
        });
    });
}

// Обробка кнопок кошика
document.querySelector('.cart-btn').addEventListener('click', () => {
    showPaymentModal(cart.reduce((names, item) => names + `${item.name}, `, '').slice(0, -2), cart.reduce((sum, item) => sum + item.price, 0), 0);
});

// Обробка зворотного дзвінка
document.querySelector('.callback-btn').addEventListener('click', () => {
    gsap.to('.callback-btn', { 
        scale: 1.1, 
        boxShadow: '0 0 15px #87CEEB', /* Небесно-блакитна неонова підсвітка */
        duration: 0.3, 
        ease: 'power3.out',
        onComplete: () => {
            alert('Запит на зворотний дзвінок відправлено! Ми зв’яжемося з вами.');
            gsap.to('.callback-btn', { scale: 1, boxShadow: '0 0 10px #87CEEB', duration: 0.3, ease: 'power3.out' });
        }
    });
});

// Обробка оплати
document.querySelector('.pay-card').addEventListener('click', () => {
    alert('Оплата карткою в процесі розробки (симуляція)');
});

document.querySelector('.pay-apple').addEventListener('click', () => {
    alert('Оплата Apple Pay в процесі розробки (симуляція)');
});

// Обробка доставки
document.querySelector('.submit-delivery').addEventListener('click', () => {
    const address = document.getElementById('deliveryAddress').value;
    if (address) {
        alert(`Доставка "Нової пошти" оформлена на адресу: ${address}`);
    } else {
        alert('Введіть адресу доставки!');
    }
});

// Обробка реєстрації
document.querySelector('.register-btn').addEventListener('click', () => {
    showModal('#registerModal', 'Реєстрація');
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    localStorage.setItem('user', JSON.stringify({ email, password }));
    alert(`Ви успішно зареєструвалися з email: ${email}!`);
    document.querySelector('#registerModal').style.display = 'none';
});

// Обробка входу
document.querySelector('.login-btn').addEventListener('click', () => {
    showModal('#loginModal', 'Вхід');
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email === email && user.password === password) {
        alert(`Ви увійшли як ${email}!`);
        document.querySelector('#loginModal').style.display = 'none';
    } else {
        alert('Неправильний email чи пароль!');
    }
});

// Допоміжна функція для показу будь-якого модального вікна
function showModal(modalId, message) {
    const modal = document.querySelector(modalId);
    if (modalId === '#paymentModal') {
        modal.querySelector('h2').textContent = message || 'Оплата';
    } else if (modalId === '#registerModal' || modalId === '#loginModal') {
        modal.querySelector('h2').textContent = message || modal.querySelector('h2').textContent;
    }

    modal.style.display = 'block';
    gsap.from(modal, { opacity: 0, scale: 0.8, duration: 0.5, ease: 'power3.out' });

    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            gsap.to(modal, { 
                opacity: 0, 
                scale: 0.8, 
                duration: 0.5, 
                ease: 'power3.out', 
                onComplete: () => modal.style.display = 'none' 
            });
        });
    });
}