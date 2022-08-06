input.addEventListener('input', async (e) => {
    let list = document.querySelector('.list')
    let data = new Object,
        url = 'https://api.teleport.org/api/urban_areas'

    let raw = cities = new Array

    list.innerHTML = ''

    data = await fetchData(url)
    raw.push(Object.entries(data._links))
    raw[0][2][1].map(element => {
        cities.push(element.name)
    })
    cities.shift()
    cities.map(city => {
        if (input.value != "" && city.toLowerCase().startsWith(input.value.toLowerCase())) {
            let item = document.createElement('li')
            item.setAttribute('onclick', `selectedName('${city}')`)
            item.classList.add('list-item')
            let word = `<b>${city.substr(0, input.value.length)}</b>${city.substr(input.value.length)}`
            item.innerHTML = word
            list.appendChild(item)
        }
    })
    if (!list.hasChildNodes() && input.value != '') list.innerHTML = 'Not found'
})

function selectedName(city) {
    let list = document.querySelector('.list')
    input.value = city
    list.innerHTML = ''
}
