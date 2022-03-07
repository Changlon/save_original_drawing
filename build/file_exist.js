const fs = require('fs') 
if(!fs.existsSync('dist')) {  
    throw new Error("dist not exist , please run  yarn build !") 
}
