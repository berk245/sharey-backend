const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})


const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

