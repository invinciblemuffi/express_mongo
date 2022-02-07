const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" }); //http header

  let url = req.url;
  if (url === "/") {
    res.write("Hello NodeJS \n\n");
    res.write("Barebone Server");
    res.end();
  }
});

server.listen(5400, () => console.log("Listening on 5400 port"));
