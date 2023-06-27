export default function itemReducer(item, action) {
    switch(action.type) {
        case 'increase' : {
            let newItem = {
                ...item, 
                [action.name]: {
                    ...item[action.name],
                    quantity: item[action.name]['quantity'] ? item[action.name]['quantity'] + 1: 1
                }, 
                ['total']: {
                    ...item['total'],
                    quantity: item['total']['quantity'] ? item['total']['quantity'] + 1: 1, 
                    price: (parseFloat(item['total']['price']) + parseFloat(action.price)).toFixed(2)
                }
            }

            if (action.name.startsWith('ls_')) {
                newItem = {
                    ...newItem,
                    ['noDiscount']: {
                        ...newItem['noDiscount'],
                        price: (parseFloat(newItem['noDiscount']['price']) + parseFloat(action.price)).toFixed(2)
                    }
                }
            }

            return newItem
        }
        case 'decrease' : {
            let newItem = {
                ...item, 
                [action.name]: {
                    ...item[action.name],
                    quantity: item[action.name]['quantity'] - 1
                }, 
                ['total']: {
                    ...item['total'],
                    quantity: item[action.name]['total'] - 1, 
                    price: (parseFloat(item['total']['price']) - parseFloat(action.price)).toFixed(2)
                }
            }

            if (action.name.startsWith('ls_')) {
                newItem = {
                    ...newItem,
                    ['noDiscount']: {
                        ...newItem['noDiscount'],
                        price: (parseFloat(newItem['noDiscount']['price']) - parseFloat(action.price)).toFixed(2)
                    }
                }
            }

            return newItem
        }
        case 'clear': {
            return {
                ...action.initialItem
            }
        }
    }
}
