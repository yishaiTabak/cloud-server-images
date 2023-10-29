const express = require('express')
const cors = require('cors')

require('./db/mongoose')
const app = express()
const PORT = process.env.PORT
const imagesRouter = require('./routers/imagesRouter')


app.use(cors())
app.use(express.json())

app.use(imagesRouter)

app.use("/", (req,res) =>{
    res.send("ok")
})

app.listen(PORT, ()=>{
    console.log("server connected, port: ",PORT);
})