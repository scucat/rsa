<style lang="less" scoped>
@import "./common.less";
.margin-top-20px{
    margin-top: 30px;
}
</style>
<template>
<div class="margin-top-20px">
    <Row>
        <Col span="18" offset="3">    

            <p>待加密、解密的文本：</p>
            <div ref="select_frame">
            <Input v-model="input"   type="textarea" :autosize="{minRows: 7}" placeholder="输入或拖入文件..." />
            </div>
        </Col>
    </Row>
    <br>
    <Row>
        <Col span="3" offset="10">    
        <Button type="primary" @click="RSAEncrypt()">RSA加密</Button>

        </Col>
        <Col span="3">    
        <Button type="primary" @click="RSADecrypt()">RSA解密</Button>

        </Col>
    </Row>
    <br>
    <Row>
        <Col span="18" offset="3">    

            <p>RSA加密、解密结果：</p>
            <Input v-model="output"  type="textarea" :autosize="{minRows: 7}" placeholder="加解密结果..." />

        </Col>
    </Row>
</div>
</template>

<script>
var fs = require('fs');
    export default {
        data () {
            return {
                input: '',
                output: '',
                PUBLIC_KEY: '',
                PRIVATE_KEY: '',
            }
        },
        methods:{
            RSAEncrypt () {
                //公钥
                var PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8HMr2CBpoZPm3t9tCVlrKtTmI4jNJc7/HhxjIEiDjC8czP4PV+44LjXvLYcSV0fwi6nE4LH2c5PBPEnPfqp0g8TZeX+bYGvd70cXee9d8wHgBqi4k0J0X33c0ZnW7JruftPyvJo9OelYSofBXQTcwI+3uIl/YvrgQRv6A5mW01QIDAQAB';
                //使用公钥加密
                var encrypt = new JSEncrypt();
                //encrypt.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----'+PRIVATE_KEY+'-----END RSA PRIVATE KEY-----');
                encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----');
                var txt = this.input;
                var encrypt_txt = "";
                if(txt.length > 41){
                    var i = 0;
                    while(i<txt.length){
                        encrypt_txt = encrypt_txt + encrypt.encrypt(txt.substr(i,41)).substr(0,171)
                        i=i+41;
                    }
                    this.output = encrypt_txt+"=";
                }else{
                    this.output = encrypt.encrypt(txt);
                } 
            },
            RSADecrypt () {
                //私钥
                var PRIVATE_KEY = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALwcyvYIGmhk+be320JWWsq1OYjiM0lzv8eHGMgSIOMLxzM/g9X7jguNe8thxJXR/CLqcTgsfZzk8E8Sc9+qnSDxNl5f5tga93vRxd5713zAeAGqLiTQnRffdzRmdbsmu5+0/K8mj056VhKh8FdBNzAj7e4iX9i+uBBG/oDmZbTVAgMBAAECgYEAmgNU5NTDkj9B+Pnt6UU8doSjw3+3j+bV2K2yS3QUOvAUus/Ax7x6ktjWxzCXvDY9IfUil2RNv9vtKEAqYLCWjc+lf8PV/yH1b7NEgyeAPBXtAJRoOnmYL2bdPW92kP9KgxJruF6Dz/C5AmMOncsvq8ABD+9Darn4p8dwj2ZC4O0CQQDf/AHmZsQokEItfCy4mHS9UbxbfIhEUv1ApPh/+Sr7NkJkHWYCtBQo+8jKO6zurAZQgWBPD1XX2UE4R+VIiZazAkEA1wAqtMvGhccyRZr+6kpkpDIa8+9jOE+nGUzqTDvgCID6as8AzOONFVVK6m/UUqkhcJ8Qu1pF36BGojy5BX2KVwJBAJSFpbji0hXXupowqfLp3RcgmNbNWAp+QUJZYhJx5cdYbmO2fssyH+AhPT6knYJR/YnqkDM8hv6vKCkqu2YDHjMCQAOA8TE5EOclM+CGghj3VWSHnIDVKdzFD4gOBNNxNlltIKeU8AJmwunSFgJ0CBXAw9a+ANvMwM7AIeaK7sj0HskCQAvxfDCq7gaNx+pfu0FHG8Gix08A/A6foggBl1fVu+L9sr9ZuOQ3HbXnl28F9ewuB9xdjnLUDjp7W7U0pB+vKoQ=';
                //使用私钥解密
                var decrypt = new JSEncrypt();

                //decrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----');
                decrypt.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----'+PRIVATE_KEY+'-----END RSA PRIVATE KEY-----');
                var txt = this.input;
                var decrypt_txt ="";
                if(txt.length > 172){
                    var i = 0;
                    while(i<txt.length-1){
                        decrypt_txt = decrypt_txt + decrypt.decrypt(txt.substr(i,171)+"=")
                        i=i+171;
                    }
                    this.output = decrypt_txt;
                }else{
                    this.output = decrypt.decrypt(this.input);
                } 
            }
        },
        mounted () {
            this.$refs.select_frame.ondragleave = (e) => {
                e.preventDefault()  // 阻止离开时的浏览器默认行为
            }
            this.$refs.select_frame.ondrop = (e) => {
                e.preventDefault()    // 阻止拖放后的浏览器默认行为
                const drop_file = e.dataTransfer.files[0]  // 获取文件对象
                if (drop_file.length < 1) {
                    return  // 检测是否有文件拖拽到页面
                }
                var data = fs.readFileSync(drop_file.path);
                console.log(data);
                var newdata = new Buffer(data,'hex');//先把数据存在buf里面
                var newdata_tostr = newdata.toString("hex")
                
                //console.log(newdata_tostr);//使用toString函数就能转换成hex数据啦
                //this.input = data.toString();
                const tobuf = Buffer.from(newdata_tostr, 'hex');
                console.log(tobuf);

            }
            this.$refs.select_frame.ondragenter = (e) => {
                e.preventDefault()  // 阻止拖入时的浏览器默认行为
                this.$refs.select_frame.border = '2px dashed red'
            }
            this.$refs.select_frame.ondragover = (e) => {
                e.preventDefault()    // 阻止拖来拖去的浏览器默认行为
            }
        }
    }
</script>


