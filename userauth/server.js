if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}


// Import libraries via npm
const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")


initializePassport(
    passport,
    email => users.find(user => user.email === email)
)

const users = []

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

// Configuring register POST method
app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const hashedRepeatPassword = await bcrypt.hash(req.body.repeat-password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            repeatPassword: hashedRepeatPassword
        })
        res.redirect("/login")
    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
})



// Start of Routes
app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.get('/login', (req, res) => {
    res.render("login.ejs")
})

app.get('/register', (req, res) => {
    res.render("register.ejs")
})
// End of Routes
console.log(users);
app.listen(3000)