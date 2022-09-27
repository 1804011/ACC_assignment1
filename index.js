const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { json } = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.get("/user/random", (req, res) => {
  fs.readFile("data.json", (err, data) => {
    if (err) {
      res.send("There is error");
    } else {
      let arr = JSON.parse(data);
      let sz = arr.length;
      const random = Math.floor(Math.random() * sz);
      console.log(random);
      res.send(arr[random]);
      //   res.end();
    }
  });
});
app.get("/user/all", (req, res) => {
  // console.log(__dirname);
  fs.readFile(__dirname + "/data.json", (err, data) => {
    if (err) {
      res.send("There is error");
    } else {
      let { limit } = req?.query;
      const arr = JSON.parse(data);

      const sz = arr.length;
      if (!limit) limit = sz;
      res.send(arr.slice(0, limit));
    }
  });
});
app.post("/user/save", (req, res) => {
  const { body } = req;
  fs.readFile("data.json", (err, data) => {
    if (err) {
    } else {
      const arr = JSON.parse(data);
      arr.push(body);
      const txt = JSON.stringify(arr);
      fs.writeFile("data.json", txt, (err) => {
        res.send("Data saved successfully");
      });
    }
  });
});
app.patch("/user/update/:id", (req, res) => {
  const { id } = req?.params;
  const { body } = req;
  fs.readFile("data.json", (err, data) => {
    if (!err) {
      const arr = JSON.parse(data);
      arr.map((user, idx) => {
        if (user?.id == id) {
          arr[idx] = body;
        }
      });
      const txt = JSON.stringify(arr);
      fs.writeFile("data.json", txt, (err) => {
        if (!err) {
          res.send("update a user successfully");
        }
      });
    }
  });
});
app.patch("/user/bulk", (req, res) => {
  fs.readFile("data.json", (err, data) => {
    if (!err) {
      const arr = JSON.parse(data);
      const users = req?.body?.ids;
      const userInfo = req?.body?.info;
      for (let k = 0; k < users?.length; k++) {
        for (let i = 0; i < arr.length; i++) {
          if (users[k] == arr[i]?.id) {
            arr[i] = userInfo[k];
          }
        }
      }
      const txt = JSON.stringify(arr);
      fs.writeFile("data.json", txt, (err) => {
        if (!err) {
          res.send("multiple users updated successfully");
        }
      });
    }
  });
});
app.delete("/user/delete/:id", (req, res) => {
  const { id } = req?.params;
  fs.readFile("data.json", (err, data) => {
    if (!err) {
      const arr = JSON.parse(data);
      const arr2 = arr.filter((user) => user?.id != id);
      const txt = JSON.stringify(arr2);
      fs.writeFile("data.json", txt, (err) => {
        if (!err) {
          res.send("user deleted successfully");
        }
      });
    }
  });
});
app.get("/", (req, res) => res.send("welcome to our site"));
app.listen(port, (err) => console.log("listening to port", port));
