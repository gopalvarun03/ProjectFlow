import express from "express"
import bodyParser from "body-parser"
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname=dirname(fileURLToPath(import.meta.url)); //C:\Users\Varun Gopal\Desktop\ChatWebsite

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "user_info",
    password: "tv26jan@",
    port: 5432,
  });
  

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


let curruser="gopalvarun03";

app.get("/",(req,res)=>{
    res.redirect("/login");
})

app.get("/login",(req,res)=>{
    res.render("login_page.ejs");
})


async function checkIfValid(a) {
    try {
        const res = await db.query("SELECT * FROM login_data WHERE username=$1", [a['username']]);
        const valdata = res.rows;

        if (valdata.length > 0 && valdata[0]['password'] === a['password']) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error("Database query failed:", err);
        return false;
    }
}

function get_details() {
    return new Promise(async (resolve, reject) => {
      try {
        const res1 = await db.query("SELECT to_id FROM messages WHERE from_id = $1", [curruser]);
        const res2 = await db.query("SELECT from_id FROM messages WHERE to_id = $1", [curruser]);
        
        let l1 = [];
        let l2 = [];
        
        for (let i = 0; i < res1.rows.length; i++) {
          l1.push(res1.rows[i]['to_id']);
        }
        
        for (let i = 0; i < res2.rows.length; i++) {
          l2.push(res2.rows[i]['from_id']);
        }
        
        let setofusers = new Set([...l1, ...l2]); // Combine l1 and l2 and create a Set to remove duplicates
        let obj = {
          "users": Array.from(setofusers) // Convert Set to Array for easier use in rendering
        };
        
        console.log(obj.users);
        resolve(obj); // Resolve the promise with the result
      } catch (err) {
        console.log(err);
        reject(err); // Reject the promise with the error
      }
    });
  }
  
  


async function get_messages(enduser)
{
    try{
        var listof=[];
        const messages=await db.query("SELECT * from messages WHERE (from_id=$1 AND to_id=$2) OR (from_id=$3 AND to_id=$4)",[curruser,enduser,enduser,curruser]);
        for(let i=0;i<messages.rows.length;i++)
        {
            if(messages.rows[i]['from_id']==curruser)
            {
                listof.append({ "fr":0, "msg":messages.rows[i][msgcontent]});
            }
            else{
                listof.append({ "fr":1, "msg":messages.rows[i][msgcontent]});
            }
        }
        return {"list":listof};
    }
    catch(err)
    {
        console.log(err);
        return {"list":{}};
    }
}



app.post("/login", async (req, res) => {
    const userdata = req.body;
    const user_id = userdata["username"];
    const password = userdata["password"];
    
    try {
      const val = await checkIfValid(userdata); // Wait for checkIfValid to resolve
      
      if (val) {
        console.log("Successful login");
        curruser = userdata["username"];
        
        try {
          const frusers = await get_details(); // Await the promise returned by get_details
          res.render("chat_interface.ejs", { frusers }); // Render the response after the promise resolves
        } catch (error) {
          console.error(error);
          res.status(500).send("An error occurred while fetching details.");
        }
        
      } else {
        res.render("login_page.ejs", {
          msg: "Please enter the Correct Username/Password"
        });
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred during login.");
    }
    
    console.log(`Entered user name is ${user_id} and entered password is ${password}`);
  });
  

app.get("/signup",(req,res)=>{
    // console.log(curruser);
    res.render("signup_page.ejs");
})

app.post("/signup", (req, res) => {
    const data = req.body;
    db.query("SELECT COUNT(*) FROM login_data", (err, result) => {
        const userCount = parseInt(result.rows[0].count);
        const newUserId = userCount + 1;
        db.query("INSERT INTO login_data VALUES ($1, $2, $3)", 
                 [newUserId, data.username, data.password], (err) => {
            if (err) {
                console.error("Error inserting new user:", err);
                return res.status(500).json({ error: "Database error" });
            }
            console.log(`User added successfully with username ${data.username}`);
        });
    });
    res.render("login_page.ejs",{msg:"Now Please enter your login details"});
});



app.get("/forgot",(req,res)=>{
    res.render("forgot_password.ejs");
})



app.get("/userfriends", async (req, res) => {
    try {
        const details = await get_details();
        let set=new Set(["Stark","Tony"]);
        res.json({details});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user friends" });
    }
});



app.post("/viewchat",(req,res)=>{

    res.render("chat_interface.ejs");
});




app.get("/reset",(req,res)=>{
    res.render("reset_password.ejs");
})

app.post("/reset",(req,res)=>{
    res.render("reset_password.ejs");
})

app.listen(port,()=>{
    console.log(`Running on port ${port} successfully`);
})