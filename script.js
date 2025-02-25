// Обробка кліку по плиткам-категоріям
document.querySelectorAll('.category').forEach(category => {
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

        alert(message); // Можна замінити на модальне вікно
    });
});

// Обробка фільтру ціни
document.getElementById('priceRange').addEventListener('input', function() {
    const value = this.value;
    document.getElementById('priceValue').textContent = `${value} грн`;

    // Фільтрація елементів за ціною (поки базова, можна розширити)
    document.querySelectorAll('.item').forEach(item => {
        const price = parseInt(item.querySelector('.price').textContent.replace(' грн', ''));
        if (price <= value) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Обробка кнопок "Купити" (поки просто додаємо в кошик локально)
document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', function() {
        const item = this.closest('.item');
        const itemName = item.querySelector('h3').textContent;
        const itemPrice = item.querySelector('.price').textContent;
        alert(`Додано до кошика: ${itemName} за ${itemPrice}`);
        // Оновлюємо лічильник кошика (поки просто додаємо 1)
        const cartBtn = document.querySelector('.cart-btn');
        let count = parseInt(cartBtn.textContent.match(/\d+/)[0]) || 0;
        cartBtn.textContent = `( ${count + 1} )`;
    });
});

// Обробка форми для додавання нового комплекту білизни
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

    // Додаємо новий елемент у галерею
    document.querySelector('.gallery').appendChild(newItem);

    // Очищаємо форму
    this.reset();
});