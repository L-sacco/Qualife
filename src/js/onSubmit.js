import { fetchData } from "./fetchData.js";

export async function onSubmit() {
    let dataContainer = document.querySelector('#data-container')
    let meters = document.querySelector('.meters')
    let description = document.querySelector('.description')
    let list = document.querySelector('.list')
    let errorDiv = document.querySelector('.error')
    let input = document.querySelector("#search-input")
    let actual = '';
    let data = new Object,
        url = 'https://api.teleport.org/api/urban_areas',
        userInput = input.value.toLowerCase().replace(/ /g, '-'),
        categ = new Array

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