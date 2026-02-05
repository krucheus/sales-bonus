/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    const { discount, sale_price, quantity } = purchase;
    const discountCalc = 1 - (discount / 100);
    return sale_price * quantity * discountCalc;
};

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    const { profit } = seller;
    // @TODO: Расчет бонуса от позиции в рейтинге
};

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {

// Проверка входных данных

    if (!data ||
        !Array.isArray(data.sellers) || data.sellers.length === 0 ||
        !Array.isArray(data.products) || data.products.length === 0 ||
        !Array.isArray(data.purchase_records) || data.purchase_records.length === 0) {
        throw new Error('Некорректные входные данные');
    }

    if (typeof options !== 'object') {
        throw new Error('Опции должны быть объектом')
    }

    const { calculateRevenue, calculateBonus } = options; // Проверка наличия опции

    if (!calculateRevenue || !calculateBonus) {
        throw new Error('Чего-то не хватает')
    }

    const sellerStats = data.sellers.map(seller => ({ // Промежуточные данные
        id: seller.id,
        name: seller.first_name + ' ' + seller.last_name,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        top_products: 0,
        bonus: 0
    }));

    const sellerIndex = {};

    sellerStats.forEach((seller) => { // Индексация продавцов
        sellerIndex[seller.id] = seller;
    });
    
    const productIndex = {};

    data.products.forEach((product) => { // Индексация товаров
        productIndex[product.sku] = product
    });

    data.purchase_records.forEach(record => { // Расчет продаж и доход
        const seller = sellerIndex[record.seller_id];
        seller.sales_count += 1;
        seller.revenue += record.total_amount;

        record.items.forEach(item => {
            const product = productIndex[item.sku];
            const cost = product.purchase_price * item.quantity;
            const revenue = calculateSimpleRevenue(item, product);
            seller.revenue += revenue;
            const profit = revenue - cost;
            seller.profit += profit;
        });


    });

    sellerStats.sort((a, b) => b.profit - a.profit);




    console.log(sellerStats)


    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
