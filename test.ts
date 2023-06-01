import http from 'http'

http.get("http://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=en&tl=es&q=I Love Milk", (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    const translatedText = JSON.parse(data)[0][0][0] as string;
    console.log(translatedText);
  });
}).on('error', (error) => {
  console.error("Error fetching translation:", error);
});

// TODO Integrate google translate API into backend endpoint, IE: vocabapp/api/v1/translate
// TODO add billigual tts ai