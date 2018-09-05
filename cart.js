const renderShoppingCart = () => {

    const body = document.querySelector('body')
    const cartContainer = document.createElement('div')
    const cartTitle = document.createElement("h4")
    const cartItems = document.createElement('div')
    const deleteCart = document.createElement('a')

    cartItems.setAttribute("id", "cartItems")
    cartItems.setAttribute('class', 'fas fa-shopping-cart')
    cartContainer.setAttribute('class', 'body__shopping-cart')
    cartContainer.setAttribute('id', 'shopping-cart')
    cartTitle.textContent = "Shopping Cart"
    deleteCart.setAttribute('id', 'clearCart')
    deleteCart.setAttribute('class', 'shopping-cart__delete-cart')
    deleteCart.textContent = "clear cart"

    deleteCart.addEventListener('click', function (event) {
        clearCart()
    })

    const cartData = getCartDetails()
    cartItems.textContent = cartData.itemCount

    cartContainer.appendChild(cartTitle)
    cartContainer.appendChild(deleteCart)
    cartContainer.appendChild(cartItems)
    body.appendChild(cartContainer)

}
// helper function
const searchForProduct = (name, arrOfObj) => {

    // console.log(name)
    // console.log(arrOfObj)

    return arrOfObj.find(function (item) {
        return item.itemName == name
    })

}

// helper function
const addCartProduct = (cartData, item) => {

    cartData.products.unshift(item)
    return cartData

}

// overwrites the object in the array
const updateCartProductItem = (cartData, item, index) => {

    cartData.products.splice(index, 1, item);
    // console.log(cartData.products)

    return cartData
}
// helper function returns an index
const getProductItemIndex = (cartData, productItem) => {

    //  this can be refactored
    let arrIndex = -1
    cartData.products.forEach(function (item, index) {
        if (item.itemName == productItem.itemName) {
            arrIndex = index
        }
    })
    return arrIndex
}
// helper function
const updateCartProducts = (cartData, item) => {

    const index = getProductItemIndex(cartData, item)

    if (index > -1) {
        cartData = updateCartProductItem(cartData, item, index)
        return cartData
    } else {

        return null
    }
}

// helper function to be refactored
const removeCartProduct = (cartData, item) => {
    const index = getProductItemIndex(cartData, item)
    cartData.products.splice(index, 1)

    if(cartData.itemCount === '0'){

        const clearCart = document.querySelector('.shopping-cart__delete-cart')
        clearCart.style.display = "none"
    }


    return cartData
}


// helper function
const incrementCartItemCount = (cartData) => {

    cartData.itemCount += 1
    return cartData
}

// helper function
const deincrementCartItemCount = (cartData) => {

    cartData.itemCount -= 1
    return cartData
}


// helper function
const updateLocalStorage = (cartData) => {

    try {
        if (typeof cartData === 'object') {
            localStorage.setItem('cartDetails', JSON.stringify(cartData))
        } else {
            throw Error('local storage requires Json data')
        }
    } catch (e) {
        console.log(e.message)
    }

}


// helper function
const setDefaultCart = () => {
    const defaultCart = {
        "date": "",
        "itemCount": 0,
        "products": [],
        "total": "",
        "name": "",
        "email": "",
        "notes": "",
        "phoneNumber": "",
        "billingAddress": "",
        "shipingAddress": ""
    }
    return JSON.stringify(defaultCart)

}
// helper function
const clearCart = () => {

    const clearCart = document.querySelector('.shopping-cart__delete-cart')
    clearCart.style.display = "none"

    const cartItems = document.querySelector('#cartItems')
    cartItems.textContent = 0

    localStorage.removeItem('cartDetails')
    defaultCart = setDefaultCart()
    localStorage.setItem('cartDetails', defaultCart)
}

const getCartDetails = () => {

    // if carDetails is null
    // if cart Details itemCount is 0
    let cartDetails = localStorage.getItem('cartDetails')
    if (cartDetails == null) {
        defaultCart = setDefaultCart()
        localStorage.setItem('cartDetails', defaultCart)
        return JSON.parse(defaultCart)
    } else {
        return JSON.parse(cartDetails)
    }
}

const updateCartDetails = (inputType, item) => {

    //  probably a better way to do this
    let cartData = getCartDetails()

    if(cartData.itemCount >= 0){

        const clearCart = document.querySelector('.shopping-cart__delete-cart')
        clearCart.style.display = "block"
    }

    if (inputType === "name") {
        cartData.name = item[1]
        updateLocalStorage(cartData)
        // console.log(item)
    }

    if (inputType === "phone") {
        cartData.phoneNumber = item[1]
        updateLocalStorage(cartData)
        // console.log(item)
    }

    if (inputType === "email") {
        cartData.email = item[1]
        updateLocalStorage(cartData)
        // console.log(item)
    }

    if (inputType === "notes") {
        cartData.notes = item[1]
        updateLocalStorage(cartData)
        // console.log(item)
    }
    //  this can be refactored
    //  porbably a better way to do this
    if (inputType === "product") {

        if (cartData.products.length == 0) {
            //  your cart is empty
            cartData = addCartProduct(cartData, item)
            incrementCartItemCount(cartData)
            updateLocalStorage(cartData)
            const cartItems = document.querySelector('#cartItems')
            cartItems.textContent = cartData.itemCount

            return
        }

        // ? product is in the cart
        const productFound = searchForProduct(item.itemName, cartData.products)
        if (productFound == undefined) {
            // adding item to cart
            cartData = addCartProduct(cartData, item)
            incrementCartItemCount(cartData)
            updateLocalStorage(cartData)
            const cartItems = document.querySelector('#cartItems')
            cartItems.textContent = cartData.itemCount
            return
        }

        if (productFound) {

            // ? remove , update, or do not change
            if (item.qty == 0) {
                // remove item from cart
                cartData = removeCartProduct(cartData, item)
                cartData = deincrementCartItemCount(cartData)
                updateLocalStorage(cartData)
                const cartItems = document.querySelector('#cartItems')
                cartItems.textContent = cartData.itemCount
                return
            }

            //  because the user did not finish the order process , but came back to it later
            if (item.qty == productFound.qty) {
                // do not change
                return
            }
            if (item.qty > productFound.qty || item.qty < productFound.qty) {
                // update cart w new product
                updateCartProducts(cartData, item)
                updateLocalStorage(cartData)
                const cartItems = document.querySelector('#cartItems')
                cartItems.textContent = cartData.itemCount
                return
            }
        }
    }
}