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
let data = {}

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
    const info = document.querySelector('.info')
    const description = document.querySelector('.description')
    const errorDiv = document.querySelector('.error')

    let actual = '',
    /*  userInput = input.value.toLowerCase().replace(/ /g, '-').replace(/,/g, '') */
        rawUserInput = input.value;
        
    // Don't do anything if the user is searching the same city twice 
    if (actual == rawUserInput) {
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
            let cityHref = '',
                cityScores = '',
                cityData = ''

            actual = rawUserInput

            cityHref = Object.values(data._links['ua:item']).filter(e => e.name == rawUserInput)[0].href
            cityData = await fetchData(cityHref)
            cityScores = await fetchData(`${cityHref}scores`) 

            dataContainer.classList.remove("hidden")
            dataContainer.classList.add("visible")

            cityScores.categories.map(element => {
                meters.innerHTML +=
                    `<p>${element.name}: ${element.score_out_of_10.toPrecision(2)} / 10</p>
                    <div class="outer-meter">
                        <div class="inner-meter" style="width:${(element.score_out_of_10.toPrecision(2))*10}%;""></div>
                    </div>`
            });
            description.innerHTML = cityScores.summary

            info.innerHTML = `
            <p><strong>Full name</strong>: ${cityData.full_name}</p>
            <p><strong>Continent</strong>: ${cityData.continent}</p>
            `
            if (cityData.mayor && cityData.mayor != undefined) {
                info.innerHTML += `<p><strong>Mayor</strong>: ${cityData.mayor}</p>`
            }
            info.innerHTML += `
            <p style="text-align: center;"><strong>Coordinates</strong>:<br></p>
            <p><strong>North</strong>: ${cityData.bounding_box.latlon.north}</p>
            <p><strong>South</strong>: ${cityData.bounding_box.latlon.south}</p>
            <p><strong>East</strong>: ${cityData.bounding_box.latlon.east}</p>
            <p><strong>West</strong>: ${cityData.bounding_box.latlon.west}</p>
            `
        }
    } catch (e) {
        errorDiv.innerHTML = "Not found"
        console.log(e)
    }
}