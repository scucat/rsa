<style lang="less" scoped>
@import "./common.less";
.fileParent{
    position: relative;
    width: 100%;
    height: 100%;
}

.filedrag{ 
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 10px;
  border: dashed 1.5px rgb(80, 121, 235);
  border-radius: 15px;
  width: 90%;
  height: 40%;
  padding: 25px 0px;
}
.filedrag:hover{
    cursor: pointer;
    border: dashed 4px rgba(15, 66, 177, 0.7);
}
.filebutton{
    position: absolute; 
    top: 42%;
    left: 0px;
    right: 0px;
    width: 90%;
    height: 40%;
    margin: auto;
}
.fileinfo{
    position: absolute; 
    top: 50%;
    left: 0px;
    right: 0px;
    width: 90%;
    height: 40%;
    margin: auto;
}
</style>
<template>
<div >
    <Tabs >
        <TabPane label="文本加密">
            <div >
                <Row>
                    <Col span="22" offset="1">    
                        <div >
                        <Input v-model="text_en"   type="textarea" :autosize="{minRows: 9,maxRows:9}" placeholder="输入待加密文本..." />
                        </div>
                    </Col>
                </Row>
                <br>
                <Row>
                    <Col span="22" offset="1">    
                    <Button type="warning" long @click="textEncrypt()">RSA加密</Button>
                    </Col>
                </Row>
                <br>
                <Row>
                    <Col span="22" offset="1">    
                        <Input v-model="text_en_out"  type="textarea" :autosize="{minRows: 11,maxRows:11}" placeholder="RSA加密结果..." />
                    </Col>
                </Row>
            </div>
        </TabPane>

        <TabPane label="文本解密">
            <div >
                <Row>
                    <Col span="22" offset="1">    
                        <div >
                        <Input v-model="text_de"   type="textarea" :autosize="{minRows: 9,maxRows:9}" placeholder="输入待解密文本..." />
                        </div>
                    </Col>
                </Row>
                <br>
                <Row>
                    <Col span="22" offset="1">    
                    <Button type="warning" long @click="textDecrypt()">RSA解密</Button>
                    </Col>
                </Row>
                <br>
                <Row>
                    <Col span="22" offset="1">    
                        <Input v-model="text_de_out"  type="textarea" :autosize="{minRows: 11,maxRows:11}" placeholder="RSA解密结果..." />

                    </Col>
                </Row>
            </div>
        </TabPane>
        <TabPane label="文件加密">
            <div id="enFile" class="fileParent">
                <div class="filedrag" ref="select_frame_en" @click="fileEnClick()">
                    <Icon type="ios-cloud-upload" size="70" style="color: #3399ff"></Icon>
                    <h2>点击选择</h2>
                    <h2>或拖放文件到此处加密</h2>
                </div>
                <div class="filebutton">
                    <Button type="warning" long @click="fileEncrypt()">RSA加密</Button>
                </div>
                <div class="fileinfo">

                    <p>文件路径：{{file_en.path}}</p>
                    <p>文件类型：{{file_en.type}}</p>
                    <p>文件大小：{{file_en.sizestr}}</p>
                    <br>
                    <p>加密时长：{{file_en_out.time}}</p>
                    <p>输出文件路径：{{file_en_out.path}}</p>
                    <p>输出文件大小：{{file_en_out.size}}</p>
                    <Spin size="large" v-if="spinShow"></Spin>
                </div>

            </div>
        </TabPane>
        <TabPane label="文件解密">
            <div id="deFile" class="fileParent">
                <div class="filedrag" ref="select_frame_de"  @click="fileDeClick()">
                    <Icon type="ios-cloud-upload" size="70" style="color: #3399ff"></Icon>
                    <h2>点击选择</h2>
                    <h2>或拖放文件到此处解密</h2>
                </div>
                <div class="filebutton">
                    <Button type="warning" long @click="fileDecrypt()">RSA解密</Button>
                </div>
                <div class="fileinfo">

                    <p>文件路径：{{file_de.path}}</p>
                    <p>文件大小：{{file_de.sizestr}}</p>
                    
                    <br>
                    <p>解密时长：{{file_de_out.time}}</p>
                    <p>输出文件路径：{{file_de_out.path}}</p>
                    <p>输出文件大小：{{file_de_out.size}}</p>
                    <p>输出文件类型：{{file_de_out.type}}</p>
                </div>
            </div>
        </TabPane>
        <TabPane label="密钥设置">
            <div >
                <Row>
                    <Col span="22" offset="1">    
                    <Button type="primary" long @click="generate_key()">一键生成RSA密钥</Button>
                    </Col>
                </Row>
                <br>
                <Row>
                    <Col span="22" offset="1">    
                        <div >
                        <Input v-model="public_key_in"   type="textarea" :autosize="{minRows: 8,maxRows:8}" placeholder="PUBLIC_KEY..." />
                        </div>
                    </Col>
                </Row>
                <br>
                <Row>
                    <Col span="22" offset="1">    
                        <Input v-model="private_key_in"  type="textarea" :autosize="{minRows: 16,maxRows:16}" placeholder="PRIVATE_KEY..." />
                    </Col>
                </Row>
                <br>
                <Row>
                    <Col span="22" offset="1">    
                    <Button type="warning" long @click="setPRIVATE_KEY()">确认密钥</Button>
                    </Col>
                </Row>
                <br>
            </div>
        </TabPane>
    </Tabs>

</div>
</template>

<script>
//主要代码---------------------------------------------------------------------------------------------------------------------------------------------------------------


import { constants } from 'fs';
import { type } from 'os';
var fs = require('fs');
const NodeRSA = require('node-rsa');
const {dialog} = require('electron').remote;




    export default {
        data () {
            return {
                text_en: '',
                text_en_out: '',
                text_de: '',
                text_de_out: '',
                public_key_in: '',
                private_key_in: '',
                PUBLIC_KEY: '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8HMr2CBpoZPm3t9tCVlrKtTmI4jNJc7/HhxjIEiDjC8czP4PV+44LjXvLYcSV0fwi6nE4LH2c5PBPEnPfqp0g8TZeX+bYGvd70cXee9d8wHgBqi4k0J0X33c0ZnW7JruftPyvJo9OelYSofBXQTcwI+3uIl/YvrgQRv6A5mW01QIDAQAB-----END PUBLIC KEY-----',
                PRIVATE_KEY: '-----BEGIN RSA PRIVATE KEY-----MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALwcyvYIGmhk+be320JWWsq1OYjiM0lzv8eHGMgSIOMLxzM/g9X7jguNe8thxJXR/CLqcTgsfZzk8E8Sc9+qnSDxNl5f5tga93vRxd5713zAeAGqLiTQnRffdzRmdbsmu5+0/K8mj056VhKh8FdBNzAj7e4iX9i+uBBG/oDmZbTVAgMBAAECgYEAmgNU5NTDkj9B+Pnt6UU8doSjw3+3j+bV2K2yS3QUOvAUus/Ax7x6ktjWxzCXvDY9IfUil2RNv9vtKEAqYLCWjc+lf8PV/yH1b7NEgyeAPBXtAJRoOnmYL2bdPW92kP9KgxJruF6Dz/C5AmMOncsvq8ABD+9Darn4p8dwj2ZC4O0CQQDf/AHmZsQokEItfCy4mHS9UbxbfIhEUv1ApPh/+Sr7NkJkHWYCtBQo+8jKO6zurAZQgWBPD1XX2UE4R+VIiZazAkEA1wAqtMvGhccyRZr+6kpkpDIa8+9jOE+nGUzqTDvgCID6as8AzOONFVVK6m/UUqkhcJ8Qu1pF36BGojy5BX2KVwJBAJSFpbji0hXXupowqfLp3RcgmNbNWAp+QUJZYhJx5cdYbmO2fssyH+AhPT6knYJR/YnqkDM8hv6vKCkqu2YDHjMCQAOA8TE5EOclM+CGghj3VWSHnIDVKdzFD4gOBNNxNlltIKeU8AJmwunSFgJ0CBXAw9a+ANvMwM7AIeaK7sj0HskCQAvxfDCq7gaNx+pfu0FHG8Gix08A/A6foggBl1fVu+L9sr9ZuOQ3HbXnl28F9ewuB9xdjnLUDjp7W7U0pB+vKoQ=-----END RSA PRIVATE KEY-----',
                file_en: {size:'',sizestr:'',path:'',type:'',infd:'',outfd:''},
                file_en_out: {size:'',path:'',time:''},
                file_en_progress: 0,
                file_de: {size:'',sizestr:'',path:'',enfd:'',outfd:''},
                file_de_out: {size:'',path:'',type:'',time:''},
                file_de_progress: 0,
                spinShow: false,
            }
        },
        methods:{
            generate_key (){//产生密钥
            var encrypt = new JSEncrypt();
            this.public_key_in = encrypt.getPublicKey()
            this.private_key_in = encrypt.getPrivateKey()
            },
            setPRIVATE_KEY(){//确认密钥
                this.PUBLIC_KEY = this.public_key_in;
                this.PRIVATE_KEY = this.private_key_in;
                alert("密钥设置成功！")

            },
            textEncrypt () {//加密文本
                //公钥
                var PUBLIC_KEY = this.PUBLIC_KEY;
                //使用公钥加密
                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(PUBLIC_KEY);

                var txt = this.text_en;
                var encrypt_txt = "";
                if(txt.length > 41){//以41字节为长度对文本分块加密
                    var i = 0;
                    while(i<txt.length){
                        encrypt_txt = encrypt_txt + encrypt.encrypt(txt.substr(i,41)).substr(0,171)
                        i=i+41;
                    }
                    this.text_en_out = encrypt_txt+"=";
                }else{
                    this.text_en_out = encrypt.encrypt(txt);
                } 
            },
            textDecrypt () {
                //私钥
                var PRIVATE_KEY = this.PRIVATE_KEY;
                //使用私钥解密
                var decrypt = new JSEncrypt();
                decrypt.setPrivateKey(PRIVATE_KEY);

                var txt = this.text_de;
                
                var decrypt_txt ="";
                if(txt.length > 172){//以172字节为长度对文本分块解密
                    var i = 0;
                    while(i<txt.length-1){
                        decrypt_txt = decrypt_txt + decrypt.decrypt(txt.substr(i,171)+"=")
                        i=i+171;
                    }
                    this.text_de_out = decrypt_txt;
                }else{
                    this.text_de_out = decrypt.decrypt(txt);
                } 
            },
            fileEnClick () {//获取待加密的文件及信息
                this.file_en_progress = 0;
                this.file_en = {size:'',sizestr:'',path:'',type:'',enfd:'',outfd:''};
                this.file_en_out = {size:'',path:''};
                var files = dialog.showOpenDialog({ properties: ['openFile']});
                if(!files){
                    return
                }
                var states = fs.statSync(files[0])
                this.file_en.sizestr = states.size + " b"
                if(states.size > 1024){
                    this.file_en.sizestr = (states.size/1024).toFixed(2) + " Kb"
                }                        
                if(states.size > 1048576){
                    this.file_en.sizestr = ((states.size/1024)/1024).toFixed(2) + " Mb"
                } 
                this.file_en.size = states.size//文件大小
                this.file_en.path = files[0];//文件路径
                this.file_en.type = files[0].slice(files[0].lastIndexOf(".")+1).toLowerCase(); //文件类型
                this.file_en.enfd = fs.openSync(files[0],'r+')//输入文件句柄
                this.file_en.outfd = fs.openSync(files[0]+".rsa",'w+')//输出文件句柄
            },

            fileDeClick () {//与获取加密文件类似
                this.file_de_progress = 0;
                this.file_de = {size:'',sizestr:'',path:'',enfd:'',outfd:''};
                this.file_de_out = {size:'',path:'',type:'',time:''};
                var files = dialog.showOpenDialog({ properties: ['openFile']});
                if(!files){
                    return
                }
                if(files[0].slice(files[0].lastIndexOf(".")+1)!="rsa"){
                    alert("不是有效的RSA加密文件！")
                    return;
                }
                var states = fs.statSync(files[0])
                this.file_de.sizestr = states.size + " b"
                if(states.size > 1024){
                    this.file_de.sizestr = (states.size/1024).toFixed(2) + " Kb"
                }                        
                if(states.size > 1048576){
                    this.file_de.sizestr = ((states.size/1024)/1024).toFixed(2) + " Mb"
                } 
                this.file_de.size = states.size
                this.file_de.path = files[0];

                this.file_de.enfd = fs.openSync(files[0],'r+')
                this.file_de_out.path = files[0].slice(0,files[0].lastIndexOf("."))
                this.file_de.outfd = fs.openSync(this.file_de_out.path,'w+')
            },

            fileEncrypt () {
                var files = []
                files.push(this.file_en.path)
                console.log(files)
                if(files[0] == ""){
                    alert("请选择或拖入文件！")
                    return
                }
                var buf = new Buffer.alloc(41);
                var enbuf = new Buffer.alloc(172);
                console.log("准备打开已存在的文件！");
                var fd = this.file_en.enfd;//fs.openSync(files[0],'r+')
                console.log(type(fd));

                    console.log("文件打开成功！");
                    console.log("准备读取文件：");

                    //公钥
                    var PUBLIC_KEY = this.PUBLIC_KEY;
                    //使用公钥加密
                    var encrypt = new JSEncrypt();
                    encrypt.setPublicKey(PUBLIC_KEY);
                    var encrypted = ''

                    var count = 0
                    var last = 0
                    var progress = 0
                    this.file_en_out.path = files[0]+".rsa"
                    var enout = this.file_en.outfd;//fs.openSync(this.file_en_out.path,'w+')
                    var date1 = new Date()
                    while(count < this.file_en.size){//循环读取
                        fs.readSync(fd, buf, 0, 41)//以41字节为长度读取文件
                        count = count + 41
                        progress = Math.floor((count/this.file_en.size)*100)
                        if(progress != last){
                            last = progress
                            if(last>100){
                                last = 100
                            }
                            this.file_en_progress = last
                            console.log(this.file_en_progress)//计算加密进度
                        }
                        encrypted = encrypt.encrypt(buf.toString('hex'));
                        enbuf.write(encrypted)
                        fs.writeSync(enout, enbuf, 0, 172)//将加密内容写入文件
                    }
                    var statesout = fs.statSync(this.file_en_out.path)
                    this.file_en_out.size = statesout.size + " b"
                    if(statesout.size > 1024){
                        this.file_en_out.size = (statesout.size/1024).toFixed(2) + " Kb"
                    }
                    if(statesout.size > 1048576){
                        this.file_en_out.size = ((statesout.size/1024)/1024).toFixed(2) + " Mb"//加密后文件大小
                    }
                    var date2 = new Date()
                    this.file_en_out.time = (date2-date1)/1000 + " 秒"//文件加密总时间

            },
            fileDecrypt () {//与文件加密过程类似
                var files = []
                files.push(this.file_de.path)
                console.log(files)
                if(files[0] == ""){
                    alert("请选择或拖入文件！")
                    return
                }
                        var buf = new Buffer.alloc(172);
                        var debuf = new Buffer.alloc(41);
                        console.log("准备打开已存在的文件！");
                        var fd = this.file_de.enfd;
                            console.log("文件打开成功！");
                            console.log("准备读取文件：");
                            //私钥
                            var PRIVATE_KEY = this.PRIVATE_KEY;
                            //使用私钥解密
                            var decrypt = new JSEncrypt();
                            decrypt.setPrivateKey(PRIVATE_KEY);
                            var decrypted = ''

                            var count = 0
                            var last = 0
                            var progress = 0
                            this.file_de_out.path = files[0].slice(0,files[0].lastIndexOf("."))
                            var deout = this.file_de.outfd;

                            var date1 = new Date()
                            while(count < this.file_de.size){
                                fs.readSync(fd, buf, 0, 172)
                                count = count + 172
                                progress = Math.floor((count/this.file_de.size)*100)
                                if(progress != last){
                                    last = progress
                                    if(last>100){
                                        last = 100
                                    }
                                    this.file_de_progress = last
                                    console.log(this.file_de_progress)
                                }
                                decrypted = decrypt.decrypt(buf.toString());
                                debuf.write(decrypted,'hex')
                                fs.writeSync(deout, debuf, 0, 41)
                            }
                            var statesout = fs.statSync(this.file_de_out.path)
                            this.file_de_out.size = statesout.size + " b"
                            if(statesout.size > 1024){
                                this.file_de_out.size = (statesout.size/1024).toFixed(2) + " Kb"
                            }
                            if(statesout.size > 1048576){
                                this.file_de_out.size = ((statesout.size/1024)/1024).toFixed(2) + " Mb"
                            }
                            this.file_de_out.type = this.file_de_out.path.slice(this.file_de_out.path.lastIndexOf(".")+1)
                            var date2 = new Date()
                            this.file_de_out.time = (date2-date1)/1000 + " 秒"

            },
        },
        mounted () {//处理拖入文件的相关行为，拖入文件也是获取文件和文件信息
            //encrypt drop file
            this.$refs.select_frame_en.ondragleave = (e) => {
                e.preventDefault()  // 阻止离开时的浏览器默认行为
            }
            this.$refs.select_frame_en.ondrop = (e) => {
                e.preventDefault()    // 阻止拖放后的浏览器默认行为
                const drop_file = e.dataTransfer.files[0]  // 获取文件对象
                if (drop_file.length < 1) {
                    return  // 检测是否有文件拖拽到页面
                }

                var files = []
                files.push(drop_file.path)

                this.file_en_progress = 0;
                this.file_en = {size:'',sizestr:'',path:'',type:'',enfd:'',outfd:''};
                this.file_en_out = {size:'',path:''};

                var states = fs.statSync(files[0])
                this.file_en.sizestr = states.size + " b"
                if(states.size > 1024){
                    this.file_en.sizestr = (states.size/1024).toFixed(2) + " Kb"
                }                        
                if(states.size > 1048576){
                    this.file_en.sizestr = ((states.size/1024)/1024).toFixed(2) + " Mb"
                } 
                this.file_en.size = states.size
                this.file_en.path = files[0];
                this.file_en.type = files[0].slice(files[0].lastIndexOf(".")+1).toLowerCase(); 
                this.file_en.enfd = fs.openSync(files[0],'r+')
                this.file_en.outfd = fs.openSync(files[0]+".rsa",'w+')

            }
            this.$refs.select_frame_en.ondragenter = (e) => {
                e.preventDefault()  // 阻止拖入时的浏览器默认行为
            }
            this.$refs.select_frame_en.ondragover = (e) => {
                e.preventDefault()    // 阻止拖来拖去的浏览器默认行为
            }

            //decrypte drop file
            this.$refs.select_frame_de.ondragleave = (e) => {
                e.preventDefault()  // 阻止离开时的浏览器默认行为
            }
            this.$refs.select_frame_de.ondrop = (e) => {
                e.preventDefault()    // 阻止拖放后的浏览器默认行为
                const drop_file = e.dataTransfer.files[0]  // 获取文件对象
                if (drop_file.length < 1) {
                    return  // 检测是否有文件拖拽到页面
                }
                
                var files = []
                files.push(drop_file.path)

                this.file_de_progress = 0;
                this.file_de = {size:'',sizestr:'',path:'',enfd:'',outfd:''};
                this.file_de_out = {size:'',path:'',type:'',time:''};

                if(files[0].slice(files[0].lastIndexOf(".")+1)!="rsa"){
                    alert("不是有效的RSA加密文件！")
                    return;
                }
                var states = fs.statSync(files[0])
                this.file_de.sizestr = states.size + " b"
                if(states.size > 1024){
                    this.file_de.sizestr = (states.size/1024).toFixed(2) + " Kb"
                }                        
                if(states.size > 1048576){
                    this.file_de.sizestr = ((states.size/1024)/1024).toFixed(2) + " Mb"
                } 
                this.file_de.size = states.size
                this.file_de.path = files[0];

                this.file_de.enfd = fs.openSync(files[0],'r+')
                this.file_de_out.path = files[0].slice(0,files[0].lastIndexOf("."))
                this.file_de.outfd = fs.openSync(this.file_de_out.path,'w+')

            }
            this.$refs.select_frame_de.ondragenter = (e) => {
                e.preventDefault()  // 阻止拖入时的浏览器默认行为
            }
            this.$refs.select_frame_de.ondragover = (e) => {
                e.preventDefault()    // 阻止拖来拖去的浏览器默认行为
            }
            this.public_key_in = this.PUBLIC_KEY;
            this.private_key_in = this.PRIVATE_KEY;
        }
    }
</script>


