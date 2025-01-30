function calPrice(cartItems) {
    const count = new Set(cartItems.map(item => Number(item.productID))).size;
    const total = cartItems.reduce((sum, item) => sum + Number(item.total_price) * item.qty, 0);
    const qty = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const avg = total / qty;

    let priceDiscount = 0;
    if (count === 2) {
        priceDiscount = (count * avg) * 0.1;
    } else if (count === 3) {
        priceDiscount = (count * avg) * 0.2;
    } else if (count === 4) {
        priceDiscount = (count * avg) * 0.3;
    } else if (count === 5) {
        priceDiscount = (count * avg) * 0.4;
    } else if (count === 6) {
        priceDiscount = (count * avg) * 0.5;
    } else if (count === 7) {
        priceDiscount = (count * avg) * 0.6;
    }

    return parseInt(total - priceDiscount);
}

module.exports = { calPrice };