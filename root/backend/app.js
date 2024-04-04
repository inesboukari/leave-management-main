const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const colors = require('colors')
const cors = require('cors')/*un middleware pour Express qui permet de gérer les requêtes HTTP entre différentes origines (domaines)*/
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
//const port = process.env.PORT || 4000;


const multer = require('multer')/* l'utiliser pour gérer les fichiers téléchargés dans votre application.*/
const helmet = require('helmet')/* un ensemble de middleware pour sécuriser les applications Express en définissant divers en-têtes http*/

const compression = require('compression')/* un middleware pour compresser les réponses HTTP envoyées par votre serveur Express. */
const cronJob = require('../backend/cronjob')/*module qui permet d'exécuter des tâches planifiées à des intervalles spécifiés. */
require('dotenv').config()

const app = express();
/*session=collection stocké dans bd*/


const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const { collection } = require('./models/user')

app.use(cors())
app.options('*', cors())
app.use(helmet())
app.use(compression())
app.use(multer().single('upload'))

/*Session Middleware:*/

app.use(express.urlencoded({extended: true})) /*Ce middleware est utilisé pour analyser les corps de requête encodés en URL*/
app.use(express.json()) /*Ce middleware est utilisé pour analyser les corps de requête JSON.*/

app.use('/admin',adminRoutes)
app.use('/user',userRoutes)
app.use(authRoutes)

/*connection au bd*/
    
async function main(){


await mongoose.connect('mongodb://localhost:27017/tarajina');
console.log('Database connected');
app.listen(3001, () =>{
    console.log("server is runing on port 3001")
})

}
/*app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })*/
main().catch((err)=>console.log(err));
