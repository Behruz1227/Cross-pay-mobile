const apiLink = 'https://apk.qrpay.uz/'


export const staisticUrl = `${apiLink}statistics/seller`
export const loginUrl = `${apiLink}user/login` //
export const sendCodeUrl = `${apiLink}user/send-code` //
export const createPayment = `${apiLink}order/create`  //
export const cancel_payment = `${apiLink}order/cancel?orderId=`  //
export const confirm_payment = `${apiLink}order/confirm?orderId=`  //
// export const cancel_payment_real_terminal = `${apiLink}order/create/real-terminal`  //

export const SellerGet = `${apiLink}terminal/list`

export const SellerEdit = `${apiLink}terminal/update/`
export const post_terminal = `${apiLink}terminal/add-terminal-user`
export const payment_get_seller = `${apiLink}order/list/for/seller` //
export const payment_get_terminal = `${apiLink}order/list/for/terminal` //

export const UserTerminalGet = `${apiLink}user/terminal` //
export const UserTerminalListGet = `${apiLink}terminal/select-terminal-list`
export const UserTerminaldelete = `${apiLink}terminal/delete-terminal-user`

export const isRead_notification = `${apiLink}notification/is-read`
export const delete_notification = `${apiLink}notification/delete`
export const seller_notification = `${apiLink}notification/for-seller`
export const terminal_notification = `${apiLink}notification/for-terminal`
export const seller_notification_count = `${apiLink}notification/count/for-seller`
export const terminal_notification_count = `${apiLink}notification/count/for-terminal`


export const get_mee = `${apiLink}user/me`
export const update_profile = `${apiLink}user/update`

// WORDS CONTROLLER
export const words_get = `${apiLink}words?status=`
export const words_put = `${apiLink}words/edit`
export const words_post = `${apiLink}words/save?webOrMobile=`
export const words_post_language = `${apiLink}words/save/language`
export const words_get_language = `${apiLink}words/language?webOrMobile=`
export const words_get_data = `${apiLink}words/web-or-mobile?status=`

