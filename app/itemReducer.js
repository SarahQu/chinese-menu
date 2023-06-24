export default function itemReducer(item, action) {
    switch(action.type) {
        case 'increase' : {
            return {
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
        }
        case 'decrease' : {
            return {
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
        }
        case 'clear': {
            return {
                ...action.initialItem
            }
        }
    }
}
