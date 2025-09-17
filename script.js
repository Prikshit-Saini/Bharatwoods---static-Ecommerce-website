document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after page loads
    setTimeout(function() {
        document.querySelector('.loader').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loader').style.display = 'none';
        }, 500);
    }, 1500);

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Set active nav link based on scroll position
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Currency switcher
    const currencySelector = document.querySelector('.currency-selector span');
    const currencyDropdown = document.querySelectorAll('.currency-dropdown li');
  
    const conversionRates = {
        USD: 1,
        GBP: 0.79 // Example rate
    };
    
    currencyDropdown.forEach(item => {
        item.addEventListener('click', function() {
            const currency = this.getAttribute('data-currency');
            currencySelector.textContent = currency;
            
            updatePrices(currency);
        });
    });

    function updatePrices(currency) {
        const productPrices = document.querySelectorAll('.product-price');
        
        productPrices.forEach(priceEl => {
            const priceUSD = parseFloat(priceEl.getAttribute('data-usd'));
            let convertedPrice;
            
            if (currency === 'USD') {
                convertedPrice = `$${priceUSD.toFixed(2)}`;
            } else if (currency === 'GBP') {
                const priceGBP = priceUSD * conversionRates.GBP;
                convertedPrice = `£${priceGBP.toFixed(2)}`;
            }
            
            priceEl.textContent = convertedPrice;
        });
    }

    // Product filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter products
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Load more products (simulated)
    const loadMoreBtn = document.getElementById('load-more');
    const productsGrid = document.querySelector('.products-grid');
    let currentPage = 1;
    
    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        
        simulateProductLoad(currentPage);
        
        if (currentPage >= 3) { // Assuming we have 3 pages of products
            loadMoreBtn.style.display = 'none';
        }
    });
    
    function simulateProductLoad(page) {
        // Simulate API delay
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
        
        setTimeout(function() {
            const dummyProducts = generateDummyProducts(page);
            
            dummyProducts.forEach(product => {
                productsGrid.appendChild(createProductCard(product));
            });
            
            loadMoreBtn.textContent = 'Load More';
            loadMoreBtn.disabled = false;
        }, 1000);
    }
    
 
    const initialProducts = generateDummyProducts(1);
    initialProducts.forEach(product => {
        productsGrid.appendChild(createProductCard(product));
    });
});

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
            <p class="product-category">${product.categoryLabel}</p>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price" data-usd="${product.price}">$${product.price.toFixed(2)}</p>
            <div class="product-actions">
                <button class="add-to-cart">Add to Cart</button>
                <button class="wishlist-btn"><i class="far fa-heart"></i></button>
            </div>
        </div>
    `;
    
    return card;
}

function generateDummyProducts(page) {
    const categories = [
        { id: 'living', label: 'Living Room' },
        { id: 'bedroom', label: 'Bedroom' },
        { id: 'dining', label: 'Dining' },
        { id: 'office', label: 'Office' }
    ];
    
    const products = [];
    const itemsPerPage = 8;
    const startIndex = (page - 1) * itemsPerPage;
    
    // Realistic furniture images from Unsplash
    const livingImages = [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1583845112203-454c1b1a1c2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    ];
    
    const bedroomImages = [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1616627561834-5d7c647f3b4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    ];
    
    const diningImages = [
        'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1602872030490-4a484a7b3ba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    ];
    
    const officeImages = [
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    ];
    
    for (let i = 0; i < itemsPerPage; i++) {
        const category = categories[i % categories.length];
        const price = 150 + (Math.random() * 850); // Random price between $150-$1000
        
        let image;
        switch(category.id) {
            case 'living':
                image = livingImages[Math.floor(Math.random() * livingImages.length)];
                break;
            case 'bedroom':
                image = bedroomImages[Math.floor(Math.random() * bedroomImages.length)];
                break;
            case 'dining':
                image = diningImages[Math.floor(Math.random() * diningImages.length)];
                break;
            case 'office':
                image = officeImages[Math.floor(Math.random() * officeImages.length)];
                break;
        }
        
        products.push({
            name: `Premium ${category.label} Furniture ${page * itemsPerPage + i + 1}`,
            category: category.id,
            categoryLabel: category.label,
            price: price,
            image: image,
            badge: i % 4 === 0 ? 'Bestseller' : (i % 7 === 0 ? 'New' : '')
        });
    }
    
    return products;
}