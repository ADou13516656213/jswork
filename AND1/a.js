const fs = require('fs')
const https = require('https')
const cheerio = require('cheerio')
const child_process = require('child_process')
const querystring = require('querystring') 
const readline = require('readline')
const iconv = require('iconv-lite')
const rl = readline.createInterface({
    input:process.stdin
})
//识别验证码，并输入
let buf = []
rl.on('line',(line)=>{
    if(line.trim()=='') rl.close()
    buf.push(line)
})
rl.on('close',()=>{
    vcode = buf[0].trim()
    console.log('验证码是：',vcode)
    login()
})
let{
    user,
    password
} = JSON.parse(require('fs').readFileSync('zf.json','utf-8'))

let baseurl = 'https://jwc.gdmec.edu.cn'
let vcodeurl = 'https://jwc.gdmec.edu.cn/CheckCode.aspx'
let someurl = 'https://jwc.gdmec.edu.cn/xsxkqk.aspx?xh=07190650&xm=%D6%A3%D4%F3%BA%E8&gnmkdm=N121615'
let __VIEWSTATE
let vcode,cookie
//访问主页
https.get(baseurl,(res)=>{
    let chunks = []
    res.on('data',(chunk)=>{
        chunks.push(chunk)
    })
res.on('end',()=>{
    let $ = cheerio.load(chunks.toString())
    __VIEWSTATE = $('input[name="__VIEWSTATE"]')[0].attribs.value
    console.log(__VIEWSTATE)
    })
})

//获取验证码和cookie
https.get(vcodeurl,(res)=>{
    //获取cookie
    cookie = res.headers['set-cookie']
    //设置二进制传输编码
    res.setEncoding('binary')
    let imgData = ''
    res.on('data',(chunk)=>{
        imgData += chunk
    })
    res.on('end',()=>{
        fs.writeFile('vcode.png',imgData,'binary',(err)=>{
            if(err){
                console.log(err)
                return
            }
            if(process.platform=='win32')
            child_process.exec('vcode.png')
            else
            child_process.exec('open vcode.png')
        })
    })
})

function login(){
    //准备postData
    let postData = querystring.encode({
        __VIEWSTATE,
        TextBox1:user,
        TextBox2:password,
        TextBox3:vcode,
        Button1:'',
        RadioButtonList1:''
    })
    postData += '%D1%A7%C9%FA'
    console.log(postData)
    //准备request options
    let opt = {
        host:'jwc.gdmec.edu.cn',
        port:443,
        path:'/default2.aspx',
        method:'post',
        headers:{
            'content-type':'application/x-www-form-urlencoded',
            'contetn-length':Buffer.byteLength(postData),
            'Cookie':cookie
        }
    }
    //发起request
    let req = https.request(opt,(res)=>{
        let chunks=[]
        res.on('data',(chunk)=>{
            chunks.push(chunk)
        })
        res.on('end',()=>{
            console.log(chunks.toString())
            geturl()
        })
    })
    //向服务器上传postData
req.write(postData)
req.end()
}
function geturl(){
    let refer = `https://jwc.gdmec.edu.cn/js_main.aspx?xh=${user}`
    let opt={
        headers:{
            'Referer':refer,
            'Cookie':cookie,
        }
    }
    https.get(someurl,opt,(res)=>{
        let chunks = []
        res.on('data',(chunk)=>{
            chunks.push(chunk)
        })
        res.on('end',()=>{
            let buffer = Buffer.concat(chunks)
            let str = iconv.decode(buffer,'gbk')
            let $ = cheerio.load(str)
            $('#DBGrid>tbody>tr>td:nth-child(4)').map(function(el){
                console.log($(this).text())
            })
        })
    })
}