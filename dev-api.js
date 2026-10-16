import http from "node:http";
import handler from "./api/chat.js";

http
  .createServer((req, res) => {
    if (req.url !== "/api/chat") {
      res.statusCode = 404;
      return res.end();
    }
    let corpo = "";
    req.on("data", (c) => (corpo += c));
    req.on("end", () => {
      try {
        req.body = JSON.parse(corpo || "{}");
      } catch {
        req.body = {};
      }
      res.status = (c) => {
        res.statusCode = c;
        return res;
      };
      res.json = (o) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(o));
      };
      handler(req, res);
    });
  })
  .listen(3001, () => console.log("API em http://localhost:3001"));