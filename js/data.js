/**
 * ============================================================
 *  ACCWY.COM - 产品数据文件（完整修复版 + 新增品牌）
 * ============================================================
 */

// ========== 16个配件品类 ==========
const CATEGORIES = [
    { name: "Fender" },
    { name: "Brake Pads" },
    { name: "Brake Discs" },
    { name: "Headlights" },
    { name: "Bumpers" },
    { name: "Spark Plugs" },
    { name: "Engine Parts" },
    { name: "Oil Filter" },
    { name: "Cabin Filter" },
    { name: "Tires" },
    { name: "Wiper Blades" },
    { name: "Side Mirrors" },
    { name: "Shock Absorbers" },
    { name: "Control Arms" },
    { name: "Wheel Hub Bearings" },
    { name: "Radiators" }
];

// ========== 品牌及对应车型 ==========
const BRAND_MODELS = {
    "Mercedes-Benz": [
        { model: "C-Class", year: "2007-Now" },
        { model: "E-Class", year: "2009-Now" },
        { model: "S-Class", year: "2005-Now" },
        { model: "GLC", year: "2015-Now" },
        { model: "GLE", year: "2015-Now" },
        { model: "GLA", year: "2014-Now" },
        { model: "GLB", year: "2019-Now" }
    ],

    "BMW": [
        { model: "3 Series", year: "2005-Now" },
        { model: "5 Series", year: "2006-Now" },
        { model: "7 Series", year: "2009-Now" },
        { model: "X1", year: "2010-Now" },
        { model: "X3", year: "2011-Now" },
        { model: "X5", year: "2007-Now" },
        { model: "X7", year: "2019-Now" }
    ],

    "Audi": [
        { model: "A3", year: "2014-Now" },
        { model: "A4", year: "2008-Now" },
        { model: "A6", year: "2012-Now" },
        { model: "Q3", year: "2013-Now" },
        { model: "Q5", year: "2010-Now" },
        { model: "Q7", year: "2015-Now" }
    ],

    "BYD": [
        { model: "Qin Plus", year: "2021-Now" },
        { model: "Qin L / Seal 5 DM-i", year: "2021-Now" },
        { model: "Han", year: "2020-Now" },
        { model: "Tang / Atto 8", year: "2018-Now" },
        { model: "Song Plus / Seal U", year: "2020-Now" },
        { model: "Yuan Plus / Atto 3", year: "2022-Now" },
        { model: "Yuan Up / Atto 2", year: "2023-Now" },
        { model: "Seal", year: "2022-Now" },
        { model: "Dolphin", year: "2021-Now" },
        { model: "Seagull / Atto 1 / Dolphin Mini", year: "2023-Now" }
    ],

    "Toyota": [
        { model: "Corolla", year: "2007-Now" },
        { model: "Camry", year: "2006-Now" },
        { model: "RAV4", year: "2009-Now" },
        { model: "Prado", year: "2010-Now" },
        { model: "Highlander", year: "2009-Now" },
        { model: "Land Cruiser", year: "2008-Now" },
        { model: "Corolla Cross", year: "2021-Now" },
        { model: "Yaris", year: "2008-Now" }
    ],

    "Honda": [
        { model: "Civic", year: "2006-Now" },
        { model: "Accord", year: "2008-Now" },
        { model: "CR-V", year: "2007-Now" },
        { model: "HR-V / Vezel", year: "2014-Now" },
        { model: "Fit", year: "2008-Now" },
        { model: "Odyssey", year: "2009-Now" }
    ],

    "Lexus": [
        { model: "ES", year: "2006-Now" },
        { model: "RX", year: "2009-Now" },
        { model: "NX", year: "2014-Now" },
        { model: "LX", year: "2008-Now" },
        { model: "IS", year: "2006-2022" },
        { model: "UX", year: "2019-2024" },
        { model: "LM", year: "2020-Now" },
        { model: "GX", year: "2010-Now" }
    ],

    "MG": [
        { model: "MG5", year: "2012-2023" },
        { model: "MG6", year: "2010-2022" },
        { model: "MG4", year: "2022-Now" },
        { model: "MG7", year: "2023-Now" },
        { model: "MG ZS / Astor", year: "2017-Now" },
        { model: "MG HS", year: "2018-Now" },
        { model: "MG RX5", year: "2016-2023" }
    ],

    "Changan": [
        { model: "CS75 Plus", year: "2014-Now" },
        { model: "CS55 Plus", year: "2017-Now" },
        { model: "CS35 Plus", year: "2012-Now" },
        { model: "Eado", year: "2012-Now" },
        { model: "UNI-K", year: "2021-Now" },
        { model: "UNI-V", year: "2022-Now" },
        { model: "CS95", year: "2017-2023" },
        { model: "Raeton", year: "2013-2017" }
    ],

    "Tesla": [
        { model: "Model 3", year: "2019-Now" },
        { model: "Model Y", year: "2020-Now" },
        { model: "Model S", year: "2014-Now" },
        { model: "Model X", year: "2016-Now" }
    ],

    "Ford": [
        { model: "Focus", year: "2005-2022" },
        { model: "Mondeo", year: "2007-2021" },
        { model: "Escape / Kuga", year: "2013-2022" },
        { model: "Explorer", year: "2011-Now" },
        { model: "Edge", year: "2015-2023" },
        { model: "Mustang", year: "2015-Now" }
    ],

    "Nissan": [
        { model: "Sylphy", year: "2006-Now" },
        { model: "X-Trail", year: "2008-Now" },
        { model: "Qashqai", year: "2008-Now" },
        { model: "Teana", year: "2008-2022" },
        { model: "Pathfinder", year: "2024-Now" },
        { model: "Patrol", year: "2010-Now" },
        { model: "Kicks", year: "2017-2023" },
        { model: "Murano", year: "2011-2021" }
    ],

    "Chery": [
        { model: "Tiggo 7 / Jaecoo J7", year: "2016-Now" },
        { model: "Tiggo 8 / Jaecoo J8 / Tiggo 8 Pro", year: "2018-Now" },
        { model: "Tiggo 9 / Jaecoo J8 (Long)", year: "2023-Now" },
        { model: "Tiggo 5x / Tiggo 4", year: "2017-Now" },
        { model: "Tiggo 3x / Tiggo 2", year: "2016-2022" },
        { model: "Arrizo 5", year: "2016-Now" },
        { model: "Arrizo 8", year: "2022-Now" },
        { model: "Omoda 5 / C5", year: "2022-Now" }
    ],

    "Mazda": [
        { model: "Mazda3", year: "2006-Now" },
        { model: "Mazda6", year: "2008-2021" },
        { model: "CX-5", year: "2012-Now" },
        { model: "CX-30", year: "2020-Now" },
        { model: "CX-8", year: "2018-2023" },
        { model: "CX-50", year: "2023-Now" }
    ],

    "Volkswagen": [
        { model: "Polo", year: "2000-Now" },
        { model: "Golf", year: "2004-Now" },
        { model: "Jetta", year: "2000-2024" },
        { model: "Passat", year: "2000-Now" },
        { model: "Tiguan", year: "2010-Now" },
        { model: "Tayron", year: "2018-Now" },
        { model: "Teramont / Atlas", year: "2017-Now" },
        { model: "Touareg", year: "2004-Now" }
    ],

    "Geely": [
        { model: "Emgrand", year: "2009-Now" },
        { model: "Coolray / Binyue", year: "2018-Now" },
        { model: "Atlas / Boyue / Atlas Pro", year: "2016-Now" },
        { model: "Tugella / Xingyue / Monjaro", year: "2019-Now" },
        { model: "Okavango / Haoyue", year: "2020-Now" },
        { model: "Starray / Boyue L", year: "2022-Now" },
        { model: "Preface / Xingrui", year: "2020-Now" },
        { model: "Galaxy E5", year: "2024-Now" },
        { model: "Galaxy Starship 7", year: "2024-Now" }
    ],

    "Kia": [
        { model: "Sportage", year: "2010-Now" },
        { model: "Seltos / KX3", year: "2015-Now" },
        { model: "Sorento", year: "2009-2018" },
        { model: "K5 / Optima", year: "2011-2023" },
        { model: "K3 / Forte", year: "2012-2023" },
        { model: "K4", year: "2014-2020" },
        { model: "Stonic", year: "2018-Now" }
    ],

    "Hyundai": [
        { model: "Elantra / Avante", year: "2008-Now" },
        { model: "Tucson", year: "2010-Now" },
        { model: "Santa Fe", year: "2013-2023" }
    ],

    "Infiniti": [
        { model: "QX50", year: "2015-2022" },
        { model: "QX60", year: "2014-2024" },
        { model: "QX80", year: "2016-2016" },
        { model: "Q50", year: "2014-2022" },
        { model: "Q60", year: "2017-2022" }
    ],

    "Porsche": [
        { model: "Macan", year: "2014-Now" },
        { model: "Cayenne", year: "2011-Now" },
        { model: "911", year: "2012-Now" },
        { model: "Panamera", year: "2010-Now" },
        { model: "718 Boxster / Cayman", year: "2016-2024" },
        { model: "Taycan", year: "2020-Now" }
    ],

    "Land Rover": [
        { model: "Range Rover Evoque", year: "2011-Now" },
        { model: "Discovery Sport", year: "2015-2026" },
        { model: "Defender", year: "2020-Now" },
        { model: "Range Rover Sport", year: "2013-Now" },
        { model: "Range Rover", year: "2012-Now" }
    ],

    "Jaguar": [
        { model: "F-PACE", year: "2016-Now" },
        { model: "E-PACE", year: "2017-Now" },
        { model: "XF", year: "2015-2024" },
        { model: "XE", year: "2015-2024" }
    ],

    "Volvo": [
        { model: "XC60", year: "2017-Now" },
        { model: "XC90", year: "2015-Now" },
        { model: "XC40", year: "2017-Now" },
        { model: "S90", year: "2016-Now" },
        { model: "S60", year: "2019-Now" }
    ],

    "Cadillac": [
        { model: "CT5", year: "2019-Now" },
        { model: "CT4", year: "2019-Now" },
        { model: "XT5", year: "2016-Now" },
        { model: "XT4", year: "2018-Now" },
        { model: "XT6", year: "2019-Now" },
        { model: "Lyriq", year: "2022-Now" }
    ],

    "Chevrolet": [
        { model: "Cruze", year: "2009-2019" },
        { model: "Malibu", year: "2016-2024" },
        { model: "Equinox", year: "2017-Now" },
        { model: "Trax / Seeker", year: "2019-Now" }
    ]
};

// ========== 轮胎品牌（18个） ==========
const TIRE_BRANDS = [
    "Michelin", "Bridgestone", "Goodyear", "Continental",
    "Pirelli", "Dunlop", "Hankook", "Yokohama",
    "Kumho", "Maxxis", "Giti", "Nexen",
    "Toyo", "Cooper", "Linglong", "Sailun", "Triangle", "Chaoyang"
];

// ========== 轮胎大类 ==========
const TIRE_TYPES = [
    { name: "All-Season Tires", range: '14"–22" rim' },
    { name: "Winter Tires", range: '14"–20" rim' },
    { name: "Performance Tires", range: '17"–22" rim' },
    { name: "SUV & 4x4 Tires", range: '15"–22" rim' }
];

// ========== 品牌列表 ==========
const BRANDS = Object.keys(BRAND_MODELS);

// ========== 自动生成所有产品 ==========
const PRODUCTS = [];
let pid = 1;

// 生成车型配件产品
for (const [brand, models] of Object.entries(BRAND_MODELS)) {
    for (const item of models) {
        const model = item.model;
        const year = item.year;
        for (const cat of CATEGORIES) {
            if (cat.name === "Tires") continue;
            
            // ★ 不要发动机件的特殊情况
            if (cat.name === "Engine Parts") {
                // 1. 比亚迪纯电
                if (brand === "BYD") {
                    const bydEvModels = ["Tang", "Yuan Plus", "Yuan Up", "Dolphin", "Seal"];
                    if (bydEvModels.some(ev => model.includes(ev))) continue;
                }
                // 2. MG 纯电 (MG4)
                if (brand === "MG" && model.includes("MG4")) continue;
                
                // 3. 特斯拉全系 & 保时捷 Taycan
                const otherEvModels = ["Model 3", "Model Y", "Model X", "Model S", "Taycan"];
                if (otherEvModels.some(ev => model.includes(ev))) continue;
                
                // 4. 吉利特殊排除（帝豪、银河E5、星舰7）
                if (brand === "Geely" && (model.includes("Emgrand") || model.includes("Galaxy E5") || model.includes("Galaxy Starship 7"))) continue;
            }

            PRODUCTS.push({
                id: pid++,
                name: `${brand} ${model} ${cat.name}`,
                category: cat.name,
                brand: brand,
                model: model,
                year: year,
                image: "",
                extraImages: [],
                description: `${cat.name} for ${brand} ${model} (${year}). High quality aftermarket replacement part. For parts not shown here, please contact us on WhatsApp.`,
                featured: false,
                oe: ""
            });
        }
    }
}

// 生成轮胎产品
for (const tireBrand of TIRE_BRANDS) {
    for (const type of TIRE_TYPES) {
        PRODUCTS.push({
            id: pid++,
            name: `${tireBrand} ${type.name}`,
            category: "Tires",
            brand: tireBrand,
            model: type.name,
            year: "Universal",
            image: "",
            extraImages: [],
            description: `${tireBrand} ${type.name}. Common sizes: ${type.range}. Contact us on WhatsApp with your required size.`,
            featured: false,
            oe: ""
        });
    }
}

// ==========================================
// ★ 自动挂载 OE 码数据
// 如果你有一个名为 OE_DATA 的字典，自动匹配并写入
// ==========================================
if (typeof OE_DATA !== 'undefined') {
    PRODUCTS.forEach(p => {
        // 如果 OE_DATA 里有这个产品的 ID，就把 OE 码塞进去
        if (OE_DATA[p.id]) {
            p.oe = OE_DATA[p.id];
        }
    });
}