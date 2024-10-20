

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
//const authenticateToken= require('./middleware');
const uri = 'mongodb+srv://arimardan2003:Rparihar01@cluster0.mfz5asa.mongodb.net/mydatabase?retryWrites=true&w=majority';
const jwtSecret = "Hiimyselfarimardansinghpariharji5676"; // Replace with your secret key
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
});

userSchema.methods.generateToken = function() {
  return jwt.sign({ _id: this._id }, jwtSecret);
};


const authenticateToken = (req, res, next) => {
  console.log("Authenticating token...");
  const token = req.cookies.jwt;
  if (!token) {
      console.log("No token provided");
      return res.status(401).send('Access denied. No token provided.');
  }
  console.log("Token found:", token);
  try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
  } catch (error) {
      console.error("Token verification error:", error);
      res.status(400).send('Invalid token.');
  }
};



const User = mongoose.model('User', userSchema);

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).send("User already registered.");
    }

    user = new User({ name, email, password, phone });
    const token = user.generateToken();
    console.log(token);
    res.cookie("jwt", token,{
      maxAge: 36000, 
      httpOnly: true
    });

    await user.save();

    res.redirect('index2.html');
  } catch (error) {
    res.status(500).send("An error occurred: " + error.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).send("Invalid email or password.");
    }

    const token = user.generateToken();
    console.log(token);
    res.cookie("jwt", token,{
      maxAge: 36000, 
      httpOnly: true
    });
    res.redirect('/index2');
  } catch (error) {
    res.status(500).send("An error occurred: " + error.message);
  }
});



app.get("/", (req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('signup.html');
});

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/courses',authenticateToken,(req, res) => {
    res.render('courses')
})
app.get('/idea',authenticateToken, (req, res) => {
    res.render('idea')
})
app.get('/resources',authenticateToken, (req, res) => {
    res.render('resources')
})
app.get('/index2',authenticateToken, (req, res) => {
  res.render('index2')
})
app.listen(3000, () => console.log("Listening on PORT 3000"));