// TODOS:
// Arrows navigation in suggestions list

import { getSuggestions } from "./getSuggestions.js"
import { onSubmit } from "./onSubmit.js"

const button = document.querySelector('#search-button')
const input = document.querySelector("#search-input")
const label = document.querySelector(".search__label") 

input.addEventListener('focus', () => {
    label.classList.add("label-up")
})
input.addEventListener('focusout', () => {
    if (input.value == '') label.classList.remove("label-up")
})

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        button.click();
    }
});

button.addEventListener('click', (e) => {
    e.preventDefault()
    onSubmit() 
})

input.addEventListener('input', (e) => {
    getSuggestions()
})