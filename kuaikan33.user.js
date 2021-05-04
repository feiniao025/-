// ==UserScript==
// @name         kuaikan33
// @author       Cube
// @version      1.0.1
// @updateURL    https://cdn.jsdelivr.net/gh/miseli/miseli.github.io/kuaikan33.user.js
// @description  Add a button to skip the start/end for Dplayer
// @match        *://*/*
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at       document-start
// @webRequest   {"selector":{"include":"*://*DPlayer*js", "exclude": "*://purge.jsdelivr.net/*"},"action":{"redirect":"https://cdn.jsdelivr.net/gh/miseli/miseli.github.io/DPlayer.min.js"}}
//// @webRequest   {"selector":{"include":"*://*DPlayer*js", "exclude": "*://purge.jsdelivr.net/*"},"action":{"redirect":"https://127.0.0.1:1011/dist/DPlayer.min.js"}}
// ==/UserScript==

const $$ = $.noConflict();
$$(function() {
    'use strict';
    const addscript = function(func_text){
        let s = unsafeWindow.document.createElement('script')
        s.text = func_text
        unsafeWindow.document.body.appendChild(s)
        console.log(s)
    }
    if(/kuaikan\d+.com/.test(location.host) || /kk6080.cn/.test(location.host)){
        console.log('快看66 视频播放 父页面')
        /* 处理头部悬浮 */
        let h = $$('<div id="kkwarp">').append($$("#header")).append($$(".bread-crumb-nav.bread-crumb-nav-play")).prependTo("body").height()

        let headStyle = `
            <style>
                #kkwarp{
                    position: fixed;
                    width: 100%;
                    z-index: 5;
                    padding-bottom: 20px;
                    top: -${h}px;
                    transition: top 0.7s ease-in-out, padding-bottom 1s, background 1s, opacity 1s;
                    opacity: 0;
                }
                #kkwarp:hover{
                    top:0px;
                    padding-bottom: 0px;
                    background: white;
                    opacity: 1;
                }
            </style>`
        $$("head").append(headStyle)

        /* 集数布局 */
        // $$('.play-list a').css({'width':'16%'})
        // $$('.play-list-box').css({'padding': '0px'})
        // $$('#detail-list .play-list').css({'width': '100%', 'display': 'flex', 'flex-wrap': 'wrap', 'padding': '8px'})
        // $$('.p10idt, #content').width('100%')
        // $$('.publicbox, .play-list-box, .content').width('100%')

        $$("#topper > div.layout.fn-clear").remove()
        $$("#play-focus > div.layout").css('width','95vw');
        $$("#zanpiancms_player").css('height', '95vh');
        let func_text = `
			console.log("父页面已监听message")
			window.addEventListener('message',e=>{
				console.warn(e.data)
				// if(e.origin != "https://api.longdidi.top")return;
				if(e.data.status==100){
					console.log('下一集')
                    $.post('//127.0.0.1:8080/cube/?a=参数', "action=nextpage").then(res=>{
                        console.log(res)
                    }).catch(e=>{
                        console.log('下一集服务未开启')
                        $("#play-focus td.prev-next > a:nth-child(2)")[0].click()
                    })
				}else if(e.data.status==200){
					console.log('可以播放了')
				}else if(e.data.status==300){
                    $.post('//127.0.0.1:8080/cube/?a=参数', "action=shutdown").then(res=>{
                        console.log(res)
                    }).catch(e=>{
                        console.log('关机服务未开启')
                    })
                }else if(e.data.status==400){
                    let data;
                    if(e.data.msg=='set'){
                    } else if(e.data.msg=='get'){
                        data = localStorage.getItem('dplayer-skip-remember-value')||'{}'
						data = JSON.parse(data)
						let postdata = {}
						postdata = {src: location.href, value:(data[location.href] || 0)}
                        //e.source.postMessage({status:400, msg:postdata}, event.origin)
                        e.source.postMessage({status:400, msg:location.href}, event.origin)
                    }
                }
			},false)
		`
        addscript(func_text)
    }
})