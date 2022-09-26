const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/express/index.html'));
});

router.get('/:file',function(req,res){
  let file = req.params.file;
  res.sendFile(path.join(__dirname+'/express/'+file));
});

//add the router
app.use('/', router);
app.use(express.static('public'));

app.listen(process.env.PORT || 3000);

console.log('Running at Port 3000');