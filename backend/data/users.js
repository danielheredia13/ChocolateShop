import bcrypt from "bcryptjs"

const users = [
    {
        name: "Daniel Heredia",
        email: "danielheredia@ejemplo.com",
        password: bcrypt.hashSync("123456", 10) ,
        isAdmin: true
    },
     {
        name: "Popeye Martinez",
        email: "popeyemartinez@ejemplo.com",
        password: bcrypt.hashSync("123456", 10),
    },
     {
        name: "Paco Hecheverria",
        email: "pacohecheverria@ejemplo.com",
        password: bcrypt.hashSync("123456", 10),
    },
]

export default users