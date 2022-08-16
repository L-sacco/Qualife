export async function fetchData(url) {
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