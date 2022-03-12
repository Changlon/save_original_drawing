const fs = require('fs') 
if(!fs.existsSync('target')) {  
    throw new Error("dist not exist , please run  yarn build !") 
}