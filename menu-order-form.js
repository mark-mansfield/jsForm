const  createOption = (optionItem) => {
    const option = document.createElement('option')
    option.setAttribute('value', optionItem)
    option.innerHTML = optionItem
    return option
}


const createSelect = (element, item) => {
    let el = document.createElement("select")
    el.setAttribute('class', 'menu__input-select')
    el.setAttribute('name', item.dishname)
    el.setAttribute('value', '0')

    element.select_options.forEach(function (optionItem) {
        let option = createOption(optionItem)

        el.appendChild(option)
    })

    el.addEventListener('change', function (event) {
        updateCartDetails( 'product' ,{ "itemName": item.dishname, "qty" : event.target.value })
    })

    return el
}

const createTextArea = (element) => {
    const textAreaContainer = document.createElement('div')
    textAreaContainer.setAttribute('class', 'main__order-form-text-input')
    const label = document.createElement('label')
    label.textContent = "additional notes"
    let el = document.createElement("textarea")
    el.setAttribute('class', '')
    el.setAttribute('cols', '10')
    el.setAttribute('name', element.name)
    el.setAttribute('value', '')

    el.setAttribute('value', '')
    el.addEventListener('change', function (event) {

        updateCartDetails( event.target.name ,  [event.target.name,event.target.value])
    })


    textAreaContainer.appendChild(label)
    textAreaContainer.appendChild(el)
    return textAreaContainer
}

const createTextInput = (element) => {

    //  because we handle textareas also
    if (element.type == "textarea") {
        return createTextArea(element)
    }
    const textFieldContainer = document.createElement('div')
    textFieldContainer.setAttribute('class', 'main__order-form-text-input')
    const el = document.createElement("input")
    const label = document.createElement('label')
    label.textContent = element.name + ' *'

    el.setAttribute('class', '')
    el.setAttribute('type', element.type)
    el.setAttribute('name', element.name)
    if (element.required == "required") {
        el.setAttribute('required','')
    }

    el.setAttribute('value', '')
    el.addEventListener('change', function (event) {

        updateCartDetails( event.target.name ,  [event.target.name,event.target.value])
    })


    textFieldContainer.appendChild(label)
    textFieldContainer.appendChild(el)
    return textFieldContainer
}


const createFormInput = (item) => {

    //  because we are recieving different object structures
    let objectKeys = Object.keys(item)
    let element = ""

    if (objectKeys.includes("shortname")) {
        element = item.formElement
    }

    if (objectKeys.includes("type")) {
        element = item
        return createTextInput(element)
    }

    if (element.type == "select") {
        return createSelect(element, item)

    }

    // let inputType =  getkeyValue (item.type)
}

//  beacuse checking this by hand takes too long
const sanitizeProp = (string) => string.replace('_', ' ').toLowerCase()

const renderMenuItem = (item) => {


    const menuItem = document.createElement('div')
    const mainTitle = document.createElement('h1')
    const subHeading = document.createElement('h3')
    const itemTitle = document.createElement('div')
    const description = document.createElement('div')
    const input = createFormInput(item)

    menuItem.setAttribute('class', 'menuItem')
    mainTitle.textContent = item.formSection
    subHeading.setAttribute('class', 'subHeading')
    subHeading.innerHTML = item.subTitle
    itemTitle.setAttribute('class', 'item-title')
    itemTitle.innerHTML = sanitizeProp(item.dishname)
    description.setAttribute('class', 'item-description')
    description.innerHTML = item.dishtext

    menuItem.appendChild(mainTitle)
    menuItem.appendChild(subHeading)
    menuItem.appendChild(itemTitle)
    menuItem.appendChild(description)
    menuItem.appendChild(input)

    return menuItem



}

const renderDivider = () => {
    const divider = document.createElement('img')
    divider.setAttribute('src', 'http://loxstockandbarrel.com.au/passover-menu/images/dottedLine.png')
    divider.setAttribute('class', 'divider')
    return divider
}

const renderHiddenInputs = (name, value) => {
    let hiddenInput = document.createElement('input')
    hiddenInput.setAttribute('type', 'hidden')
    hiddenInput.setAttribute('name', name)
    hiddenInput.setAttribute('value', value)
    return hiddenInput
}

const getKeyName = (item) => item[0]

const getkeyValue = (item) => item[1]

const getFormElementsRoot = (item) => item[1][0]

const getDocRoot = (responseObject) => Object.entries(responseObject.menu)

// ? future feature not implemented yet
// filter items by formSection property -> value
const getCourseItems = (formSection, object) => {

    // beacuse the object has an index property we dont need
    item = object.pop()
    return object.filter((item) => {
        return item.formSection == formSection
    })

}

// ? future feature not implemented yet
// set some data for later use
const setCourses = (keyValue) => formSections = [...keyValue]

// ? future feature not implemented yet
// return the form sections on the menu
const getCourses = () => formSections


const resetForm = () => {

    const inputs = document.querySelectorAll('form');
    inputs.forEach( (element) =>  element.value = '')
}

// render a form insde a predefined container
const renderForm = (responseObject, container) => {

    const targetContainer = document.querySelector(container)
    const form = document.createElement('form')

    getDocRoot(responseObject).forEach(function (item, index) {

        //  lets get our top level properties and values
        let keyName = getKeyName(item)
        let keyValue = getkeyValue(item)

        //  because we dont want to render these property values jus
        if (keyName === "name" || keyName === "action" || keyName === "method") {

            // js variable goes into the action attribute of the order form
            keyName === 'action' ?
                form.setAttribute(keyName, eval(keyValue)) :
                form.setAttribute(keyName, keyValue)
        }

        if (keyName === "hidden-inputs") {
            let arr = keyValue.forEach( (arrItem) => form.appendChild(renderHiddenInputs(arrItem.name, arrItem.value)))
        }

        if (keyName === "formSections") {
            setCourses(keyValue)
        }

        if (keyName === "elements") {
            // add each item for sale
            keyValue.forEach((arrItem) => form.appendChild(renderMenuItem(arrItem,form)).appendChild(renderDivider()))
        }

        if (keyName === "textInputs") {

            keyValue.forEach((arrItem) => form.appendChild(createFormInput(arrItem)))
        }
    })

    const submit = document.createElement('button')
    submit.setAttribute('id', 'place-order')
    submit.setAttribute('type', 'button')
    submit.textContent = "place order"

    submit.addEventListener('click', (event) => {
        event.preventDefault()
        console.log()
        // form.submit()
    })
    form.appendChild(submit)
    targetContainer.appendChild(form)

}


// ? not implemeted yet : future filtering feature
let formSections = []
const submitUrl = location.href
loadData("./data/rosh-hashanah-menu.json")

