// 模拟数据
const products = [
    { id: 1, name: "智能手机 Pro Max", price: 5999, image: "https://via.placeholder.com/300x300/3498db/ffffff?text=手机", category: "手机数码", description: "高性能智能手机，配备最新处理器和超清摄像头。" },
    { id: 2, name: "轻薄笔记本电脑", price: 6999, image: "https://via.placeholder.com/300x300/e74c3c/ffffff?text=笔记本", category: "电脑办公", description: "超薄设计，强劲性能，适合商务和娱乐使用。" },
    { id: 3, name: "智能电视 65英寸", price: 3999, image: "https://via.placeholder.com/300x300/2ecc71/ffffff?text=电视", category: "家用电器", description: "4K超高清显示，智能语音控制，家庭娱乐中心。" },
    { id: 4, name: "无线蓝牙耳机", price: 599, image: "https://via.placeholder.com/300x300/9b59b6/ffffff?text=耳机", category: "手机数码", description: "高保真音质，降噪功能，持久续航。" },
    { id: 5, name: "运动跑步鞋", price: 399, image: "https://via.placeholder.com/300x300/f1c40f/ffffff?text=跑鞋", category: "服装鞋帽", description: "轻便舒适，透气设计，适合各种运动场景。" },
    { id: 6, name: "护肤精华套装", price: 899, image: "https://via.placeholder.com/300x300/1abc9c/ffffff?text=护肤品", category: "美妆护肤", description: "深层滋养，改善肤质，让肌肤焕发光彩。" }
];

// 全局状态
let currentUser = null;
let cart = [];
let currentSlide = 0;
let isLoginForm = true;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化轮播图
    initSlider();
    
    // 渲染热门商品
    renderFeaturedProducts();
    
    // 绑定导航事件
    bindNavEvents();
    
    // 绑定表单事件
    bindFormEvents();
    
    // 绑定其他交互事件
    bindOtherEvents();
    
    // 更新购物车计数
    updateCartCount();
});

// 初始化轮播图
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    // 自动轮播
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }, 5000);
    
    // 点击圆点切换
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            currentSlide = parseInt(this.getAttribute('data-slide'));
            updateSlider();
        });
    });
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

// 渲染热门商品
function renderFeaturedProducts() {
    const container = document.getElementById('featured-products');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">¥${product.price}</div>
                <button class="add-to-cart" data-id="${product.id}">加入购物车</button>
            </div>
        `;
        container.appendChild(productElement);
    });
    
    // 绑定加入购物车事件
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    // 绑定商品点击事件（查看详情）
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(this.querySelector('.add-to-cart').getAttribute('data-id'));
                showProductDetail(productId);
            }
        });
    });
}

// 显示商品详情
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const container = document.getElementById('product-detail');
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image" style="background-image: url('${product.image}')"></div>
            <div class="product-detail-info">
                <h1 class="product-detail-title">${product.name}</h1>
                <div class="product-detail-price">¥${product.price}</div>
                <div class="product-detail-description">${product.description}</div>
                <button class="add-to-cart-large" data-id="${product.id}">加入购物车</button>
                <button class="form-button" id="buy-now" data-id="${product.id}">立即购买</button>
            </div>
        </div>
    `;
    
    // 绑定加入购物车事件
    container.querySelector('.add-to-cart-large').addEventListener('click', function() {
        addToCart(productId);
        showPage('cart');
    });
    
    // 绑定立即购买事件
    container.querySelector('#buy-now').addEventListener('click', function() {
        addToCart(productId);
        showPage('checkout');
    });
    
    showPage('product-detail');
}

// 加入购物车
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    if (document.getElementById('cart').classList.contains('active')) {
        renderCart();
    }
    
    // 显示添加成功提示
    alert(`已成功将 ${product.name} 加入购物车`);
}

// 更新购物车计数
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// 渲染购物车
function renderCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p>购物车为空</p>';
        document.getElementById('cart-total-price').textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">¥${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="quantity-btn remove" data-id="${item.id}" style="margin-left: 20px;">删除</button>
                </div>
            </div>
            <div class="cart-item-total">¥${itemTotal.toFixed(2)}</div>
        `;
        container.appendChild(itemElement);
    });
    
    document.getElementById('cart-total-price').textContent = total.toFixed(2);
    
    // 绑定购物车操作事件
    bindCartEvents();
}

// 绑定购物车操作事件
function bindCartEvents() {
    // 减少数量
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    // 增加数量
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });
    
    // 删除商品
    document.querySelectorAll('.quantity-btn.remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    // 输入框数量变化
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const quantity = parseInt(this.value) || 1;
            setCartItemQuantity(productId, quantity);
        });
    });
}

// 更新购物车商品数量
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity < 1) item.quantity = 1;
    
    updateCartCount();
    renderCart();
}

// 设置购物车商品数量
function setCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity = quantity;
    if (item.quantity < 1) item.quantity = 1;
    
    updateCartCount();
    renderCart();
}

// 从购物车移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

// 绑定导航事件
function bindNavEvents() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            // 如果点击的是登录/注册链接但用户已登录，跳转到个人中心
            if (page === 'login' && currentUser) {
                showPage('profile');
                return;
            }
            
            showPage(page);
        });
    });
}

// 显示指定页面
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    document.getElementById(pageId).classList.add('active');
    
    // 更新导航激活状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // 根据页面执行特定操作
    switch(pageId) {
        case 'cart':
            renderCart();
            break;
        case 'checkout':
            renderCheckout();
            break;
        case 'payment':
            renderPayment();
            break;
        case 'profile':
            renderProfile();
            break;
    }
}

// 绑定表单事件
function bindFormEvents() {
    // 登录/注册表单切换
    document.getElementById('switch-link').addEventListener('click', function(e) {
        e.preventDefault();
        toggleLoginRegister();
    });
    
    // 登录表单提交
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // 注册表单提交
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });
    
    // 结算表单提交
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleCheckout();
    });
    
    // 支付按钮
    document.getElementById('pay-now').addEventListener('click', function() {
        handlePayment();
    });
}

// 切换登录/注册表单
function toggleLoginRegister() {
    isLoginForm = !isLoginForm;
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const formTitle = document.getElementById('form-title');
    const switchText = document.getElementById('switch-text');
    const switchLink = document.getElementById('switch-link');
    
    if (isLoginForm) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        formTitle.textContent = '登录';
        switchText.textContent = '还没有账号？';
        switchLink.textContent = '立即注册';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        formTitle.textContent = '注册';
        switchText.textContent = '已有账号？';
        switchLink.textContent = '立即登录';
    }
}

// 处理登录
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // 简单验证
    if (!validateEmail(email)) {
        showError('login-email-error', '请输入有效的邮箱地址');
        return;
    }
    
    if (password.length < 6) {
        showError('login-password-error', '密码不能少于6位');
        return;
    }
    
    // 模拟登录成功
    currentUser = {
        name: email.split('@')[0],
        email: email
    };
    
    // 更新用户界面
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('logout-btn').style.display = 'block';
    
    // 跳转到首页
    showPage('home');
    
    alert('登录成功！');
}

// 处理注册
function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    // 简单验证
    if (!name) {
        showError('register-name-error', '用户名不能为空');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('register-email-error', '请输入有效的邮箱地址');
        return;
    }
    
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        showError('register-password-error', '密码必须包含字母和数字，且长度不少于8位');
        return;
    }
    
    if (password !== confirm) {
        showError('register-confirm-error', '两次输入的密码不一致');
        return;
    }
    
    // 模拟注册成功
    currentUser = {
        name: name,
        email: email
    };
    
    // 更新用户界面
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('logout-btn').style.display = 'block';
    
    // 跳转到首页
    showPage('home');
    
    alert('注册成功！');
}

// 显示错误信息
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
    
    // 3秒后隐藏错误信息
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

// 验证邮箱格式
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 渲染结算页面
function renderCheckout() {
    const container = document.getElementById('checkout-items');
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p>购物车为空</p>';
        document.getElementById('checkout-total').textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="order-item-name">${item.name} × ${item.quantity}</div>
            <div class="order-item-price">¥${itemTotal.toFixed(2)}</div>
        `;
        container.appendChild(itemElement);
    });
    
    document.getElementById('checkout-total').textContent = total.toFixed(2);
}

// 处理结算
function handleCheckout() {
    if (cart.length === 0) {
        alert('购物车为空，无法结算');
        return;
    }
    
    // 简单验证收货信息
    const name = document.getElementById('checkout-name').value;
    const phone = document.getElementById('checkout-phone').value;
    const address = document.getElementById('checkout-address').value;
    
    if (!name || !phone || !address) {
        alert('请填写完整的收货信息');
        return;
    }
    
    // 跳转到支付页面
    showPage('payment');
}

// 渲染支付页面
function renderPayment() {
    const container = document.getElementById('payment-items');
    container.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="order-item-name">${item.name} × ${item.quantity}</div>
            <div class="order-item-price">¥${itemTotal.toFixed(2)}</div>
        `;
        container.appendChild(itemElement);
    });
    
    document.getElementById('payment-total').textContent = total.toFixed(2);
}

// 处理支付
function handlePayment() {
    if (cart.length === 0) {
        alert('没有需要支付的商品');
        return;
    }
    
    // 模拟支付成功
    alert('支付成功！感谢您的购买。');
    
    // 清空购物车
    cart = [];
    updateCartCount();
    
    // 跳转到首页
    showPage('home');
}

// 渲染个人中心
function renderProfile() {
    if (!currentUser) {
        document.getElementById('user-name').textContent = '游客';
        document.getElementById('user-email').textContent = '请先登录';
        document.getElementById('user-avatar').textContent = 'G';
        document.getElementById('logout-btn').style.display = 'none';
        document.getElementById('order-history').innerHTML = '<p>请登录后查看订单历史</p>';
        return;
    }
    
    // 显示订单历史（模拟数据）
    const orderHistory = document.getElementById('order-history');
    orderHistory.innerHTML = `
        <div class="order-item">
            <div class="order-item-name">订单 #20230001 (3件商品)</div>
            <div class="order-item-price">¥199.00</div>
        </div>
        <div class="order-item">
            <div class="order-item-name">订单 #20230002 (1件商品)</div>
            <div class="order-item-price">¥599.00</div>
        </div>
    `;
}

// 绑定其他交互事件
function bindOtherEvents() {
    // 退出登录
    document.getElementById('logout-btn').addEventListener('click', function() {
        currentUser = null;
        cart = [];
        updateCartCount();
        renderProfile();
        showPage('home');
        alert('已退出登录');
    });
    
    // 去结算按钮
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('购物车为空，无法结算');
            return;
        }
        
        if (!currentUser) {
            alert('请先登录');
            showPage('login');
            return;
        }
        
        showPage('checkout');
    });
    
    // 分类点击事件
    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('click', function() {
            alert(`跳转到${this.textContent}分类页面`);
            // 实际应用中这里会跳转到对应分类的商品列表
        });
    });
    
    // 搜索功能
    document.querySelector('.search-box button').addEventListener('click', function() {
        const keyword = document.querySelector('.search-box input').value;
        if (keyword) {
            alert(`搜索关键词: ${keyword}`);
            // 实际应用中这里会执行搜索并显示结果
        }
    });
    
    // 搜索框回车事件
    document.querySelector('.search-box input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.querySelector('.search-box button').click();
        }
    });
}
