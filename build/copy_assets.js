const path = require("path")
const fs = require("fs")
const srcDir =  path.join(__dirname,"../src/wechat/assets") 
const desDir = path.join(__dirname,"../target/assets")

copyDir(srcDir,desDir)


function copyDir(srcDir, desDir) {  

    if(!fs.existsSync(desDir)) {
        fs.mkdirSync(desDir)
    }


    fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
        for (const file of files) {
           
            //判断是否为文件夹
            if (file.isDirectory()) {
                const dirS = path.resolve(srcDir, file.name);
                const dirD = path.resolve(desDir, file.name);

                //判断是否存在dirD文件夹
                if (!fs.existsSync(dirD)) {
                    fs.mkdir(dirD, (err) => {
                        if (err) console.log(err);
                    });
                }
                copyDir(dirS, dirD);
            } else {
                const srcFile = path.resolve(srcDir, file.name);
                const desFile = path.resolve(desDir, file.name);
                fs.copyFileSync(srcFile, desFile);
                console.log(file.name + ' 拷贝成功');
            }
        }
    })
}







