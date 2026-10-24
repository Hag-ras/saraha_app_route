import { decryption, encryption } from './common/security/encryption.security.js'

import {bootStrapDB} from './DB/connection.db.js'
import { globalErrorHandling } from './middleware/index.js'
import { authenticationController, messageController, userController} from './modules/index.js'
import express from 'express'
import cors from 'cors'
const app = express()




bootStrapDB(app)
app.use(cors(), express.json())



app.use("/auth",authenticationController)
app.use('/message',messageController)
app.use('/user',userController)

app.get('/', (req, res) => res.send('Hello World!'))


app.use((req,res,next)=>{
    return res.status(404).json({message: "Not Found!"})
})

app.use(globalErrorHandling)

const cipher = await encryption("Hello")
const text  = await decryption(cipher)


// public | private  asymmetric
// common key  symmetric