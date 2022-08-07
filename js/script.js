let _label = document.querySelector(".search__label")

input.addEventListener('focus', () => {
    _label.classList.add("label-up")
})
input.addEventListener('focusout', () => {
    if (input.value == '') _label.classList.remove("label-up")
})
