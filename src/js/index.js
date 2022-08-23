// TODOS:
// Arrows navigation in suggestions list

import '../css/style.scss'
import logo from '../img/logo.png'
import favicon from '../img/favicon.png'

const button = document.querySelector('#search-button')
const input = document.querySelector("#search-input")
const label = document.querySelector(".search__label") 
const logoImg = document.querySelector("#logo") 
const faviconElem = document.querySelector("link[rel~='icon']");
const list = document.querySelector('.list')
const url = 'https://api.teleport.org/api/urban_areas'

faviconElem.href = favicon
logoImg.src = logo

// google style placeholer
input.addEventListener('focus', () => {
    label.classList.add("label-up")
})
input.addEventListener('focusout', () => {
    if (input.value == '') label.classList.remove("label-up")
})

// if enter key pressed click the btn
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        button.click();
    }
});

// if btn clicked, submit the input
button.addEventListener('click', (e) => {
    e.preventDefault()
    onSubmit() 
})

// suggest cities db has
input.addEventListener('input', () => {
    getSuggestions()
})

async function fetchData(url) {

    const loading = document.querySelector('.loading')

    loading.classList.remove('hidden')
    loading.classList.add('visible')
    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            loading.classList.remove('visible')
            loading.classList.add('hidden')
            return data
        })
        .catch((error) => {
            loading.classList.remove('visible')
            loading.classList.add('hidden')
            return error
        })
}

async function getSuggestions() {
    
    let cities = []
    let data = {}

    list.innerHTML = ''

    data = await fetchData(url)
    cities = Object.values(data._links['ua:item']).map(e => e.name)
    cities.map(city => {
        if (input.value != "" && city.toLowerCase().startsWith(input.value.toLowerCase())) {
            const item = document.createElement('li')
            item.setAttribute('onclick', `selectedName('${city}')`)
            item.classList.add('list-item')
            const word = `<b>${city.substr(0, input.value.length)}</b>${city.substr(input.value.length)}`
            item.innerHTML = word
            list.appendChild(item)
        }
    })
    if (!list.hasChildNodes() && input.value != '') list.innerHTML = 'Not found'
}

async function onSubmit() {

    const dataContainer = document.querySelector('#data-container')
    const meters = document.querySelector('.meters')
    const description = document.querySelector('.description')
    const errorDiv = document.querySelector('.error')
    const categ = []
    let data = {}

    let actual = '',
        userInput = input.value.toLowerCase().replace(/ /g, '-')
        

    // Don't do anything if the user is searching the same city twice 
    if (actual == userInput) {
        return;
    }

    // Style reset
    dataContainer.classList.add("hidden")
    dataContainer.classList.remove("visible")
    errorDiv.innerHTML = ''
    list.innerHTML = ''
    meters.textContent = ''
    description.textContent = ''

    try {
        if (input.value != "") {
            actual = userInput;
            data = await fetchData(`${url}/slug:${userInput}/scores/`)

            if (data['status'] == 404 || data == undefined || data == null || data == {}) {
                throw 'Not found.'
            }
            
            categ.push(Object.entries(data.categories))

            dataContainer.classList.remove("hidden")
            dataContainer.classList.add("visible")

            categ[0].map(element => {
                meters.innerHTML +=
                    `<p>${element[1].name}: ${element[1].score_out_of_10.toPrecision(2)} / 10</p>
                    <div class="outer-meter">
                        <div class="inner-meter" style="width:${(element[1].score_out_of_10.toPrecision(2))*10}%;""></div>
                    </div>`
            });
            description.innerHTML = data.summary
        }
    } catch (e) {
        errorDiv.innerHTML = e
    }
}