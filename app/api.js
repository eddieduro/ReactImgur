const rootUrl = 'https://api.imgur.com/3/gallery/t/'
const apiKey = 'dce5aed677bc33f'

module.exports =  {
  get(url) {
    return fetch(rootUrl + url, {
      headers: {
        'Authorization': 'Client-ID' + apiKey
      }
    })
    .then((response) => {
      return response.json()
    })
  }
}
