// TODOS:
// Arrows navigation in suggestions list

import '../css/style.scss'
import logo from '../img/logo.png'
import favicon from '../img/favicon.png'
import { getSuggestions } from "./getSuggestions.js"
import { onSubmit } from "./onSubmit.js"

const button = document.querySelector('#search-button')
const input = document.querySelector("#search-input")
const label = document.querySelector(".search__label") 
const logoImg = document.querySelector("#logo") 
const faviconElem = document.querySelector("link[rel~='icon']");

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
input.addEventListener('input', (e) => {
    getSuggestions()
})


