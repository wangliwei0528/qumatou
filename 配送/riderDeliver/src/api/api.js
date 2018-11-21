const apiMall = 'https://yunying.qumatou.com.cn/',
    fixCode = apiMall + 'api/home_company/send_sms',
    login = apiMall + 'api/home_company/get_sms',
    takeOrder = apiMall + 'api/home_company/order_list',
    getOrder = apiMall + 'api/home_company/edit_Order';
module.exports = {
    fixCode:fixCode,
    login:login,
    takeOrder:takeOrder,
    getOrder:getOrder
}