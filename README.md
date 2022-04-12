# save_original_drawing
Upgraded version of quick-ins-store

# 一 ，部署

## 1. 安装yarn 

```npm install -g yarn ``` 

## 2. 安装项目依赖

项目工程文件下运行

``` yarn  ``` 


## 3. 生产环境运行

``` yarn dev  ``` 

出现 ```wechat servers listen on port 3000!``` 代表项目成功启动!


## 4. 打包项目

``` yarn build ```  



## 5. 部署环境运行

``` yarn start ```


## 6. 单元测试

``` yarn test ```



# 二，工程文件配置

## 1. 后端api服务配置

```src/api/api.config.js```



```
timeout:25000, //超时时间
   dev:{ //生产环境ip
    domain:"localhost",
    port:8090
   },
   pro:{ //上线环境ip
    domain:"172.20.10.9", 
    port: 8090
   }
   
```





