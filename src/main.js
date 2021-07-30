const $siteList = $('.siteList')//放上面因为无法访问到下面的变量
const $lastLi = $siteList.find('li.last') //$siteList.find意思是在这个元素里面找到li里面的class为.last的元素
const x = localStorage.getItem('x')//这个x目前还是个字符串
const xObject = JSON.parse(x) //JSON.parse把字符串重新变成对象
const hashMap = xObject || [  //因为用户第一次使用都是空的，parse不解析空字符串的，所以如果xObject存在就使用,不存在就使用默认的数组
    { logo: 'A', url: 'https://www.acfun.cn' },
    { logo: 'B', url: ' https://www.bilibili.com' },
];
const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '')//删除/开头的内容
}
const render = () => {
    //我们在渲染hashMap时，需要把之前的li删掉，然后再渲染新的
    $siteList.find('li:not(.last)').remove()//把siteList里面的li都找到，唯独不找到最后的一个li,把找到的li删掉
    hashMap.forEach((node, index) => {//声明一个节点和下标，下标是为了方便查找和删除
        const $li = $(`<li>
    <div class="site">
        <div class="logo">${node.logo}</div>
        <div class="link">${simplifyUrl(node.url)}</div>
        <div class="close">
        <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-close"></use>
        </svg>
        </div>
    </div>
    </li>`).insertBefore($lastLi)//在最后一个li的前面插入
        //用onclick来代替了a标签的作用
        $li.on('click', () => {
            window.open(node.url)//当你点击li 打开一个新的窗口，地址为node.url
        })
        $li.on('click', '.close', (e) => {//当你点击了里面的close，得到一个事件e，
            e.stopPropagation()           //调用这个事件的 e.stopPropagation() 来阻止冒泡
            hashMap.splice(index, 1)//从index里面删除一个
            render()
        })
    })
}
render()//声明了render也需要调用
$('.addButton')
    .on('click', () => {
        let url = window.prompt('请问你要贴加的网址是啥?')
        if (url.indexOf('http') !== 0) {//indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
            url = 'https://' + url
        }

        console.log(url)
        //${url}意思是插入新的url地址
        hashMap.push({
            logo: simplifyUrl(url)[0], //toUpperCase()使字符变成大写
            url: url
        });
        render();
    })
window.onbeforeunload = () => {
    const string = JSON.stringify(hashMap)//JSON.stringify是把对象变成string
    localStorage.setItem('x', string) //在本地的存储值里设置一个x，它的值就是这个string
}
$(document).on('keypress', (e) => {//keypress键盘按下事件
    // const key=e.key
    //console.log(e)
    const { key } = e//key属于 console.log(e)里面的属性
    for (let i = 0; i < hashMap.length; i++) {//遍历hasMap
        if (hashMap[i].logo.toLowerCase() === key) {//如果hasMap的第i个它的logo小写(toLowerCase)===key
            window.open(hashMap[i].url)//那就打开这个i属性对应的网址
        }
    }
})