"use-strict";
import fetch from "node-fetch";
import express from "express";
import pg from "pg";
const Client = pg.Client;
const app = express();
const api_url = "https://api.wazirx.com/api/v2/tickers";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import expressLayouts from "express-ejs-layouts";
var finalIndex=undefined;
var cryptoData=undefined;
// postgres client connect
const client = new Client({
  user: "postgres",
  host: "localhost",
  password: "rishabh",
  port: 5432,
  database: "quadbtestdata",
});

const getJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(response.statusText);
  const data = response.json();
  return data;
};


const getData = async () => {
  console.log("Fetching data from URL!");
  var data = await getJSON(api_url);
  console.log("Fetched Data from URL!");
  var index = [];
  var count = 1;
  for (var x in data) {
    index.push(x);
    count++;
    if (count > 10) {
      break;
    }
    finalIndex = index;
    cryptoData = data;
  }

   client.connect((err) => {
    if (err) {
      console.error("DB connection error", err.stack);
    } else {
      console.log("DB connected");
    }
  });

  let q0 = "DELETE FROM cryptodata";
  client.query(q0, (err, res) => {
    if (err) {
      // console.log(err.message);
    }
    // console.log(res.rows);
  });

  for (let i = 1; i < 11; i++) {
    let q2 = `INSERT INTO cryptodata VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    client.query(
      q2,
      [
        i,
        data[index[i - 1]]["name"],
        data[index[i - 1]]["last"],
        data[index[i - 1]]["buy"],
        data[index[i - 1]]["sell"],
        data[index[i - 1]]["volume"],
        data[index[i - 1]]["base_unit"],
      ],
      (err, res) => {
        if (err) {
          // console.log(err.message);
        }
      }
    );
  }

  let q3 = "SELECT * from cryptodata";
  client.query(q3, (err, res) => {
    if (err) {
      // console(err.message);
    }
    console.log(res.rows);
  });
  return 1;
}

async function driverFunction() {
  let isComplete = await getData();
  console.log("isComplete?: "+isComplete);
  console.log("1: "+cryptoData);
  console.log("2: "+finalIndex);
  console.log("3: "+cryptoData[finalIndex[1]]);
}

//server code
const port = 4444;
app.use(express.static("public"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/img", express.static(__dirname + "public/img"));
app.use(expressLayouts);
app.set("view engine", "hbs");
app.get("/", (req, res) => {
  res.render("layout",{
    obj1: cryptoData["btcinr"],
    obj2: cryptoData["xrpinr"],
    obj3: cryptoData["ethinr"],
    obj4: cryptoData["trxinr"],
    obj5: cryptoData["eosinr"],
    obj6: cryptoData["zilinr"],
    obj7: cryptoData["batinr"],
    obj8: cryptoData["zrxinr"],
    obj9: cryptoData["reqinr"],
    obj10:cryptoData["nulsinr"],
  });
});
app.listen(port, () => {
  console.log("Server started on http://localhost:4444");
});
setInterval(driverFunction,3000);