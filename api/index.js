const express = require('express')
const app = express()
const port = 3000

const { Client } = require('pg')
const client = new Client()

const connect_db = async()=> await client.connect()

app.get('/', (req, res) => res.send('Hello Trees!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
