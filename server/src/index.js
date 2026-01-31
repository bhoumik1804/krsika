import 'dotenv/config'
import connectDB from './config/db.js'
import app from './server.js'

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`server is running at port: ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log('MONGO db connection failed !!', err)
    })
