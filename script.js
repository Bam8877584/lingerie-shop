// Ініціалізація GSAP
gsap.registerPlugin(ScrollTrigger);

// Анімація плиток-категорій
document.querySelectorAll('.category').forEach(category => {
    gsap.set(category, { transformPerspective: 1000 });

    category.addEventListener('mouseenter', function() {
        gsap.to(this, { 
            scale: 1.1, 
            rotateX: 10, 
            rotateY: 10, 
            boxShadow: '0 20px 40px rgba(46, 204, 113, 0.5), 0 0 30px #d4a017', 
            duration: 0.6, 
            ease: 'power3.out' 
        });
    });

    category.addEventListener('mouseleave', function() {
        gsap.to(this, { 
            scale: 1, 
            rotateX: 0, 
            rotateY: 0, 
            boxShadow: '0 10px 30px rgba(46, 204, 113, 0.3), 0 0 20px rgba(212, 160, 23, 0.5)', 
            duration: 0.6, 
            ease: 'power3.out' 
        });
    });

    category.addEventListener('click', function() {
        const content = this.getAttribute('data-content');
        let message = '';

        switch (content) {
            case 'sales':
                message = 'Знижки до 50% на всі комплекти! Спішить оформити замовлення!';
                break;
            case 'new':
                message = 'Нові колекції білизни щойно надійшли! Дізнайтесь деталі!';
                break;
            case 'elegance':
                message = 'Елегантні комплекти для особливих випадків — розкіш і комфорт!';
                break;
        }

        alert(message); // Заміни на модальне вікно для шикарного вигляду
    });
});

// Анімація елементів галереї при прокрутці
gsap.utils.toArray('.item').forEach(item => {
    gsap.from(item, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Обробка фільтру ціни
document.getElementById('priceRange').addEventListener('input', function() {
    const value = this.value;
    document.getElementById('priceValue').textContent = `${value} грн`;

    gsap.to('.item', {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            document.querySelectorAll('.item').forEach(item => {
                const price = parseInt(item.querySelector('.price').textContent.replace(' грн', ''));
                if (price <= value) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            gsap.to('.item', { opacity: 1, duration: 0.5 });
        }
    });
});

// Обробка кнопок "Купити" з анімацією
document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', function() {
        const item = this.closest('.item');
        const itemName = item.querySelector('h3').textContent;
        const itemPrice = item.querySelector('.price').textContent;

        gsap.to(this, { 
            scale: 1.1, 
            boxShadow: '0 0 20px #2ecc71', 
            duration: 0.3, 
            onComplete: () => {
                alert(`Додано до кошика: ${itemName} за ${itemPrice}`);
                gsap.to(this, { scale: 1, boxShadow: '0 0 15px #2ecc71', duration: 0.3 });
            }
        });

        // Оновлюємо лічильник кошика
        const cartBtn = document.querySelector('.cart-btn');
        let count = parseInt(cartBtn.textContent.match(/\d+/)[0]) || 0;
        gsap.to(cartBtn, { 
            scale: 1.2, 
            duration: 0.3, 
            onComplete: () => {
                cartBtn.textContent = `( ${count + 1} )`;
                gsap.to(cartBtn, { scale: 1, duration: 0.3 });
            }
        });
    });
});

// Обробка форми для додавання нового комплекту білизни з анімацією
document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const imageFile = document.getElementById('imageUpload').files[0];
    const itemName = document.getElementById('itemName').value;
    const itemDescription = document.getElementById('itemDescription').value;
    const itemPrice = document.getElementById('itemPrice').value;

    // Створюємо URL для попереднього перегляду зображення (локально)
    const imageUrl = URL.createObjectURL(imageFile);

    // Створюємо новий елемент у галереї
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.innerHTML = `
        <img src="${imageUrl}" alt="${itemName}">
        <h3>${itemName}</h3>
        <p>${itemDescription}</p>
        <div class="price">${itemPrice} грн</div>
        <button class="buy-btn">Купити</button>
    `;

    // Анімація появи нового елемента
    gsap.from(newItem, { 
        opacity: 0, 
        y: 50, 
        duration: 1, 
        onComplete: () => {
            document.querySelector('.gallery').appendChild(newItem);
        }
    });

    // Очищаємо форму з анімацією
    gsap.to(this, { 
        opacity: 0, 
        duration: 0.5, 
        onComplete: () => {
            this.reset();
            gsap.to(this, { opacity: 1, duration: 0.5 });
        }
    });
});