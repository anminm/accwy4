/**
 * ============================================================
 *  ACCWY.COM - 公共JavaScript逻辑（多OE码自动合并版）
 * ============================================================
 */

// ========== 工具函数 ==========
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function getProductById(id) {
    return PRODUCTS.find(p => p.id === parseInt(id));
}

// ========== ★ 终极精准图片匹配（解决串图 + 解决无法显示） ==========
function getImagePathsForProduct(product) {
    if (!window.IMAGE_LIST || !Array.isArray(window.IMAGE_LIST)) {
        console.warn('⚠️ IMAGE_LIST 未加载或为空！请检查 image-list.js 是否正确引入。');
        return [];
    }
    
    // 1. 整理品牌名 (例如 "BMW" -> "bmw")
    const brandClean = product.brand.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // 2. 整理品类名 (例如 "Engine Parts" -> "engineparts")
    const catClean = product.category.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // 3. 整理车型名 (例如 "3 Series" -> "3series", "X5" -> "x5")
    const modelStr = (product.model || '').toLowerCase();
    // 遇到斜杠或逗号可能是一车多名，拆开分别处理
    const modelAliases = modelStr.split(/[\/,]/).map(m => m.trim());
    const modelAliasesClean = modelAliases.map(m => m.replace(/[^a-z0-9]/g, ''));

    const matchedFiles = window.IMAGE_LIST.filter(fileName => {
        // 把文件名也变成纯字母数字，例如 "bmw-3-Series-engine-parts (1).jpg" -> "bmw3seriesengineparts1jpg"
        const fnClean = fileName.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // 条件 A：必须包含品牌
        if (!fnClean.includes(brandClean)) return false;
        
        // 条件 B：处理轮胎特殊逻辑
        if (product.category === 'Tires') {
            if (!fnClean.includes('tires')) return false;
            const tWords = ['suv', '4x4', 'winter', 'performance', 'allseason'];
            return tWords.some(w => modelStr.includes(w) && fnClean.includes(w)) || fnClean.includes(modelStr.replace(/[^a-z0-9]/g, ''));
        }
        
        // 条件 C：处理通用配件（火花塞、滤芯等，不分车型）
        if (['Spark Plugs', 'Oil Filter', 'Cabin Filter'].includes(product.category)) {
            return fnClean.includes(catClean);
        }
        
        // 条件 D：必须包含配件品类
        if (!fnClean.includes(catClean)) return false;
        
        // 条件 E：必须包含车型（精准匹配。比如 "3series" 就绝对不会匹配到 "5series"）
        return modelAliasesClean.some(alias => {
            if (!alias) return true; // 如果车型名是空的，就只看品牌和品类
            return fnClean.includes(alias);
        });
    });

    matchedFiles.sort();
    
    // 调试打印，你可以按 F12 在控制台看到到底匹配到了哪些图
    // console.log(`车型: ${product.brand} ${product.model} ${product.category}, 匹配到图片:`, matchedFiles);

    return matchedFiles.map(name => 'images/' + name);
}

// ========== 大图点击放大 ==========
window.openLightbox = function(src) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
    overlay.onclick = function() { document.body.removeChild(overlay); };
    const img = document.createElement('img');
    img.src = src;
    img.oncontextmenu = function() { return false; };
    img.style.cssText = 'max-width:95%;max-height:95%;object-fit:contain;border-radius:4px;';
    overlay.appendChild(img);
    document.body.appendChild(overlay);
};

// ========== 多图切换 ==========
window.switchDetailImage = function(idx) {
    const thumbs = document.querySelectorAll('.detail-thumb');
    const mainImg = document.querySelector('#detailMainImg');
    if (!thumbs.length || !mainImg) return;
    thumbs.forEach((t, i) => {
        t.style.borderColor = i === idx ? '#b8956a' : '#3a3a3a';
    });
    const targetSrc = thumbs[idx].getAttribute('data-src');
    if (targetSrc) mainImg.src = targetSrc; 
};

// ========== 导航汉堡菜单 & 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    // ★ 自动合并多个 OE 数据
    if (typeof OE_RAW_DATA !== 'undefined' && Array.isArray(OE_RAW_DATA)) {
        const oeMap = {};
        OE_RAW_DATA.forEach(item => {
            if (!oeMap[item.id]) oeMap[item.id] = [];
            if (!oeMap[item.id].includes(item.oe)) oeMap[item.id].push(item.oe);
        });

        PRODUCTS.forEach(p => {
            if (oeMap[p.id]) p.oe = oeMap[p.id].join(' / ');
        });
    }

    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    currentPage = currentPage.replace('.html', ''); 
    if (currentPage === 'index.html' || currentPage === '') currentPage = 'index';

    if (currentPage === 'index') initHomePage();
    else if (currentPage === 'products') initProductsPage();
    else if (currentPage === 'product-detail') initProductDetailPage();
});

// ========== 首页初始化 ==========
function initHomePage() {
    const featuredBrands = ["Toyota", "BMW", "BYD", "Honda", "Mercedes-Benz", "Volkswagen", "Ford", "Audi", "Porsche"];
    const featuredProducts = [];
    for (const brand of featuredBrands) {
        let product;
        if (brand === "Porsche") {
            product = PRODUCTS.find(p => p.brand === brand && p.model.includes("718") && p.category === "Engine Parts") 
                   || PRODUCTS.find(p => p.brand === brand && p.category === "Engine Parts");
        } else {
            product = PRODUCTS.find(p => p.brand === brand && p.category === "Engine Parts") || PRODUCTS.find(p => p.brand === brand);
        }
        if (product) featuredProducts.push(product);
    }

    const featuredContainer = document.getElementById('featuredProducts');
    if (featuredContainer) {
        featuredContainer.innerHTML = featuredProducts.map(product => {
            const paths = getImagePathsForProduct(product);
            let imgHtml = '<div style="color:#666;font-size:14px;">Image coming soon</div>';
            if (paths.length > 0) {
                imgHtml = `<img src="${paths[0]}" alt="${product.name}" style="width:100%;height:100%;object-fit:contain;">`;
            }
            return `
                <div class="product-card" style="cursor:pointer;" onclick="window.location.href='product-detail.html?id=${product.id}'">
                    <div class="product-img" style="background:#1a1a1a;display:flex;align-items:center;justify-content:center;position:relative;" onclick="window.location.href='product-detail.html?id=${product.id}'">
                        ${imgHtml}
                    </div>
                    <div class="product-info" onclick="event.stopPropagation()">
                        <p class="product-category">${product.category}</p>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-brand">${product.brand} | ${product.model} | ${product.year}</p>
                        <div class="product-card-footer">
                            <a href="product-detail.html?id=${product.id}" class="product-link" style="text-decoration:none;">View Details →</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    const categoryGrid = document.getElementById('categoryGrid');
    if (categoryGrid) {
        categoryGrid.innerHTML = CATEGORIES.map(cat => `
            <div class="category-card" onclick="window.location.href='products.html?category=${encodeURIComponent(cat.name)}'">
                <div class="category-name">${cat.name}</div>
            </div>
        `).join('');
    }

       const brandWall = document.getElementById('brandWall');
    if (brandWall) {
        brandWall.innerHTML = BRANDS.map(brand => `
            <div class="brand-item" style="cursor:pointer;" onclick="window.location.href='products.html?brand=${encodeURIComponent(brand)}'">
                ${brand}
            </div>
        `).join('');
    }

    const statNum = document.querySelector('.stat-num[data-count]');
    if (statNum) {
        const target = parseInt(statNum.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.floor(target / (2000 / 30)));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            statNum.textContent = current + '+';
        }, 30);
    }

    const homeSearchInput = document.getElementById('homeSearchInput');
    const homeSearchBtn = document.getElementById('homeSearchBtn');
    function executeHomeSearch() {
        if (!homeSearchInput) return;
        const term = homeSearchInput.value.trim();
        if (term) window.location.href = `products.html?search=${encodeURIComponent(term)}`;
        else window.location.href = `products.html`;
    }
    if (homeSearchBtn) homeSearchBtn.addEventListener('click', executeHomeSearch);
    if (homeSearchInput) {
        homeSearchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') executeHomeSearch();
        });
    }
}

// ========== 产品列表页初始化 ==========
function initProductsPage() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const resetFilter = document.getElementById('resetFilter');
    const productGrid = document.getElementById('productGrid');
    const resultCount = document.getElementById('resultCount');
    const noResults = document.getElementById('noResults');
    const pagination = document.getElementById('pagination');

    if (!productGrid) return;

    if (categoryFilter) {
        const categories = [...new Set(PRODUCTS.map(p => p.category))];
        categoryFilter.innerHTML = '<option value="">All Categories</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }
    if (brandFilter) {
        const brands = [...new Set(PRODUCTS.map(p => p.brand))].sort();
        brandFilter.innerHTML = '<option value="">All Brands</option>' + brands.map(b => `<option value="${b}">${b}</option>`).join('');
    }

    const urlSearch = getUrlParam('search') || '';
    const urlCategory = getUrlParam('category') || '';
    const urlBrand = getUrlParam('brand') || '';
    const urlPage = parseInt(getUrlParam('page')) || 1; 

    if (searchInput && urlSearch) searchInput.value = urlSearch;
    if (categoryFilter && urlCategory) categoryFilter.value = urlCategory;
    if (brandFilter && urlBrand) brandFilter.value = urlBrand;

    const itemsPerPage = 12;
    let currentPage = urlPage; 
    let filteredProducts = [...PRODUCTS];

    function updateUrl(isPush = false) {
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        const category = categoryFilter ? categoryFilter.value : '';
        const brand = brandFilter ? brandFilter.value : '';
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (category) params.set('category', category);
        if (brand) params.set('brand', brand);
        if (currentPage > 1) params.set('page', currentPage); 
        const newUrl = params.toString() ? '?' + params.toString() : window.location.pathname;
        if (isPush) history.pushState(null, '', newUrl); 
        else history.replaceState(null, '', newUrl); 
    }

    function applyFilters(resetPage = true, isPush = false) {
        const rawSearch = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const keywords = rawSearch.split(/[\s_\/-]+/).filter(k => k.length > 0);
        const category = categoryFilter ? categoryFilter.value : '';
        const brand = brandFilter ? brandFilter.value : '';

        filteredProducts = PRODUCTS.filter(product => {
            const productText = (product.name + ' ' + product.brand + ' ' + product.model + ' ' + product.category)
                .toLowerCase().replace(/[-\s_\/]/g, '');
            const matchSearch = keywords.length === 0 || keywords.every(kw => productText.includes(kw));
            const matchCategory = !category || product.category === category;
            const matchBrand = !brand || product.brand === brand;
            return matchSearch && matchCategory && matchBrand;
        });

        if (resetPage) currentPage = 1; 
        updateUrl(isPush);
        renderProducts();
    }

    function renderProducts() {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageProducts = filteredProducts.slice(start, end);
        if (resultCount) resultCount.textContent = `Showing ${pageProducts.length} of ${filteredProducts.length} products`;

        if (pageProducts.length === 0) {
            productGrid.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
        } else {
            if (noResults) noResults.style.display = 'none';
            productGrid.innerHTML = pageProducts.map(product => {
                const paths = getImagePathsForProduct(product);
                let imgHtml = '<div style="color:#666;font-size:14px;">Image coming soon</div>';
                if (paths.length > 0) {
                    imgHtml = `<img src="${paths[0]}" alt="${product.name}" style="width:100%;height:100%;object-fit:contain;">`;
                }
                return `
                    <div class="product-card" style="cursor:pointer;" onclick="window.location.href='product-detail.html?id=${product.id}'">
                        <div class="product-img" style="background:#1a1a1a;display:flex;align-items:center;justify-content:center;position:relative;" onclick="window.location.href='product-detail.html?id=${product.id}'">
                            ${imgHtml}
                        </div>
                        <div class="product-info" onclick="event.stopPropagation()">
                            <p class="product-category">${product.category}</p>
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-brand">${product.brand} | ${product.model} | ${product.year}</p>
                            <div class="product-card-footer">
                                <a href="product-detail.html?id=${product.id}" class="product-link" style="text-decoration:none;">View Details →</a>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (!pagination) return;
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }
        let html = '';
        html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">←</button>`;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
                html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
            } else if (Math.abs(i - currentPage) === 3) {
                html += `<button class="page-btn" disabled>...</button>`;
            }
        }
        html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">→</button>`;
        html += `
            <div style="display:flex; align-items:center; gap:8px; margin-left:15px;">
                <span style="color:#b0b0b0; font-size:14px;">Go to</span>
                <input type="number" id="jumpPageInput" min="1" max="${totalPages}" value="${currentPage}" 
                       style="width:60px; padding:8px; background:#2a2a2a; border:1px solid #3a3a3a; color:#e8e8e8; border-radius:4px; text-align:center; outline:none;"
                       onkeydown="if(event.key==='Enter'){ window.jumpToPage(${totalPages}); }">
                <button class="page-btn" onclick="window.jumpToPage(${totalPages})" style="padding:8px 12px;">Go</button>
            </div>
        `;
        pagination.innerHTML = html;
    }

    window.changePage = function(page) {
        currentPage = page;
        updateUrl(true); 
        renderProducts();
    };

    window.jumpToPage = function(maxPage) {
        const input = document.getElementById('jumpPageInput');
        if (!input) return;
        let target = parseInt(input.value);
        if (isNaN(target)) target = 1;
        if (target < 1) target = 1;
        if (target > maxPage) target = maxPage;
        input.value = target;
        window.changePage(target);
    };

    if (searchBtn) searchBtn.addEventListener('click', () => applyFilters(true, true));
    if (searchInput) searchInput.addEventListener('keyup', function(e) { if (e.key === 'Enter') applyFilters(true, true); });
    if (categoryFilter) categoryFilter.addEventListener('change', () => applyFilters(true, true));
    if (brandFilter) brandFilter.addEventListener('change', () => applyFilters(true, true));
    if (resetFilter) resetFilter.addEventListener('click', function() {
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (brandFilter) brandFilter.value = '';
        applyFilters(true, true);
    });

    window.addEventListener('popstate', function() {
        const searchParam = getUrlParam('search') || '';
        const categoryParam = getUrlParam('category') || '';
        const brandParam = getUrlParam('brand') || '';
        const pageParam = parseInt(getUrlParam('page')) || 1;
        if (searchInput) searchInput.value = searchParam;
        if (categoryFilter) categoryFilter.value = categoryParam;
        if (brandFilter) brandFilter.value = brandParam;
        currentPage = pageParam;
        applyFilters(false, false);
    });

    if (urlSearch || urlCategory || urlBrand || urlPage > 1) applyFilters(false, false);
    else renderProducts();
}

// ========== 产品详情页初始化 ==========
function initProductDetailPage() {
    const container = document.getElementById('productDetailContainer');
    if (!container) return;
    const productId = getUrlParam('id');
    if (!productId) { container.innerHTML = '<p style="text-align:center;padding:60px 0;">Product not found.</p>'; return; }
    const product = getProductById(productId);
    if (!product) { container.innerHTML = '<p style="text-align:center;padding:60px 0;">Product not found.</p>'; return; }

    document.title = `${product.name} - ACCWY.COM`;
    const validImages = getImagePathsForProduct(product);
    
    container.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-detail-img" style="align-self:start;">
                <div style="width:100%;">
                    <div id="detailMainImage" style="aspect-ratio:16/10;border-radius:8px;overflow:hidden;margin-bottom:12px;background:#1a1a1a;display:flex;align-items:center;justify-content:center;position:relative;"></div>
                    <div id="detailThumbsContainer" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;"></div>
                </div>
            </div>
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                <div class="detail-meta">
                    <span class="detail-tag accent">${product.category}</span>
                    <span class="detail-tag">${product.brand}</span>
                    <span class="detail-tag">${product.year}</span>
                </div>
                <p class="detail-desc">${product.description || 'Product details coming soon. Contact us for more information.'}</p>
                <div class="detail-specs">
                    <h3>Specifications</h3>
                    <div class="spec-row"><span class="spec-key">Brand</span><span class="spec-value">${product.brand}</span></div>
                    <div class="spec-row"><span class="spec-key">Model</span><span class="spec-value">${product.model}</span></div>
                    <div class="spec-row"><span class="spec-key">Year</span><span class="spec-value">${product.year}</span></div>
                    <div class="spec-row"><span class="spec-key">Category</span><span class="spec-value">${product.category}</span></div>
                    
                    <!-- 多个 OE 码展示区 -->
                    ${product.oe ? `<div class="spec-row" style="background:#333; padding:8px; border-radius:4px; margin:8px 0; border-left: 4px solid #b8956a;"><span class="spec-key" style="color:#b8956a; font-weight:bold;">OE Number</span><span class="spec-value">${product.oe}</span></div>` : ''}

                    <div class="spec-row"><span class="spec-key">MOQ</span><span class="spec-value">1 pc</span></div>
                    <div class="spec-row"><span class="spec-key">Warranty</span><span class="spec-value">12 months</span></div>
                    <div class="spec-row"><span class="spec-key">Delivery Time</span><span class="spec-value">7-15 days</span></div>
                </div>
                <!-- 删除了 Send Inquiry，只保留 WhatsApp -->
                <div class="detail-actions">
                    <a href="https://wa.me/8618580651026?text=${encodeURIComponent('Hello, I\'m interested in: ' + product.name)}" class="btn btn-primary" target="_blank" rel="noopener">WhatsApp Us</a>
                </div>
            </div>
        </div>
    `;

    const mainImageDiv = document.getElementById('detailMainImage');
    const thumbsContainer = document.getElementById('detailThumbsContainer');

    if (validImages.length > 0) {
        mainImageDiv.innerHTML = `<img id="detailMainImg" src="${validImages[0]}" alt="${product.name}" style="width:100%;height:100%;object-fit:contain;cursor:zoom-in;user-select:none;" draggable="false" oncontextmenu="return false;" onclick="openLightbox(this.src)">`;
        validImages.forEach((src, idx) => {
            const thumb = document.createElement('div');
            thumb.className = `detail-thumb ${idx === 0 ? 'active' : ''}`;
            thumb.setAttribute('data-src', src);
            thumb.onclick = () => window.switchDetailImage(idx);
            thumb.style.cssText = `width:48px;height:48px;border:2px solid ${idx === 0 ? '#b8956a' : '#3a3a3a'};border-radius:4px;overflow:hidden;cursor:pointer;flex:none;background:#1a1a1a;`;
            thumb.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:contain;" draggable="false">`;
            thumbsContainer.appendChild(thumb);
        });
    } else {
        mainImageDiv.innerHTML = '<div style="color:#666;font-size:14px;">Image coming soon</div>';
    }

    // ========== 相关产品（随机 6 个） ==========
    const relatedContainer = document.getElementById('relatedProducts');
    if (relatedContainer) {
        // 1. 先筛选出同类或同品牌的
        let pool = PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand));
        
        // 2. 打乱数组（随机排序）
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        
        // 3. 截取前 6 个
        const related = pool.slice(0, 6);
        
        relatedContainer.innerHTML = related.map(p => {
            const paths = getImagePathsForProduct(p);
            let imgHtml = '<div style="color:#666;font-size:14px;">Image coming soon</div>';
            if (paths.length > 0) {
                imgHtml = `<img src="${paths[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;">`;
            }
            return `
                <div class="product-card" style="cursor:pointer;" onclick="window.location.href='product-detail.html?id=${p.id}'">
                    <div class="product-img" style="background:#1a1a1a;display:flex;align-items:center;justify-content:center;position:relative;" onclick="window.location.href='product-detail.html?id=${p.id}'">
                        ${imgHtml}
                    </div>
                    <div class="product-info" onclick="event.stopPropagation()">
                        <p class="product-category">${p.category}</p>
                        <h3 class="product-name">${p.name}</h3>
                        <p class="product-brand">${p.brand} | ${p.model} | ${p.year}</p>
                        <div class="product-card-footer">
                            <a href="product-detail.html?id=${p.id}" class="product-link" style="text-decoration:none;">View Details →</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ========== 首页表单直连 WhatsApp ==========
document.addEventListener('DOMContentLoaded', function() {
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止表单默认的刷新页面行为
            
            // 获取用户填写的值
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const message = document.getElementById('formMessage').value.trim();
            
            // 拼接成发给你的话术
            const waText = `*New Inquiry*\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
            
            // 跳转到 WhatsApp
            window.open(`https://wa.me/8618580651026?text=${encodeURIComponent(waText)}`, '_blank');
            
            // 清空表单并提示
            inquiryForm.reset();
            alert('Opening WhatsApp to send your message...');
        });
    }
});