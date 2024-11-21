// app.js
import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {  
res.send('Hello welcome to my EC2 hosted node application');
});

app.listen(port, () => {  
console.log(`Example app listening at http://localhost:${port}`);
});
