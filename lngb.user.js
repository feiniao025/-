// ==UserScript==
// @name         辽宁干部在线
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Cube
// @match        https://zyjs.lngbzx.gov.cn/*
// @require      https://zyjs.lngbzx.gov.cn/js/jquery/jquery-1.12.3.min.js
// @updateURL    https://cdn.jsdelivr.net/gh/miseli/cCDN/lngb.user.js
// @grant        none
// ==/UserScript==


console.log('version v0.2')
let $$ = $.noConflict()
$$(function() {
  if (/https:\/\/zyjs.lngbzx.gov.cn\/study\/yearplan\/gostudy/.test(location.href)) {
    alert('不支持"作者略"的课程,详情咨询开发者')

    function ajaxshuke(cid, len = 10000, bixuan = true) {
      $$.ajax({
        url: "/study/resource/saveTssView",
        data: JSON.stringify({ cid, source: bixuan ? 10 : 11, position: 0, percent: 0 }),
        type: "post",
        dataType: "json",
        timeout: 20000,
        contentType: 'application/json;charset=utf-8',
        error: function(message) {
          alert("网络繁忙，请稍后刷新页面重试！")
        },
        success: (data) => {
          if (data) {
            if (data.status == 0) {
              $$.ajax({
                url: "/study/resource/saveTssView",
                data: JSON.stringify({ cid, historyId: data.id, position: len, len }),
                // json: JSON.stringify({cid, historyId: data.id, percent: "100"}), /*作者略*/
                type: "post",
                dataType: "json",
                timeout: 20000,
                contentType: 'application/json;charset=utf-8',
                error: function(message) {
                  alert("网络繁忙，请稍后刷新页面重试！")
                },
                success: (data) => {
                  if (data) {
                    if (data.status == 0) {
                      $$(this).parent().prev().children('span.fr').text('完成1000.0%')
                      // alert('成功')
                    } else if (data.status == 1) {
                      alert("进度记录失败，请刷新页面重试！")
                    } else if (data.status == 2) {
                      alert("不能同时学习多门课程")
                    } else {
                      alert("未知错误,请联系开发者 错误代码: 0x2")
                    }
                  }
                }
              })
            } else if (data.status == 1) {
              alert("获得初始进度失败，请刷新页面重试！");
            } else {
              alert("未知错误,请联系开发者 错误代码: 0x1")
            }
          }
        }
      })
    }
    let shuakehandler = function(e) {
      let { cid, scid } = $$(this).data()
      $$.get(`https://zyjs.lngbzx.gov.cn/study/resource/info/${cid}/${scid}`, res => {
        let len = $$(res).find('#readvideoform').serializeArray().filter(item => {
          let { name, value } = item;
          return name.toLocaleLowerCase().indexOf('length') !== -1;
        })[0].value
        console.log(len)
        if (/gostudy\/1/.test(location.href))
          ajaxshuke.call(this, cid, len)
        else if (/gostudy\/2/.test(location.href))
          ajaxshuke.call(this, cid, len, false)
      })
    }

    $$('#theform dd.teach.cl > .fr').each((_, item) => {
      let data = $$(item).attr('onclick').match(/(\d+),'(\w+)'/).slice(1, 3)
      let shuake = $$(item).clone().text('刷课').removeAttr('onclick').removeAttr('id').data({ cid: data[0], scid: data[1] }).click(shuakehandler)
      shuake.attr('style', 'margin-top: 2px;')
      $$(item).after(shuake)
    })
    let dx = $$('<a href="#" class="active"><i class="icon iconfont"></i>隐藏已修课程</a>')
    dx.click(e => {
      let textEl = $$(dx).children('i')[0].nextSibling.textContent
      if (textEl === '隐藏已修课程') {
        $$(dx).children('i')[0].nextSibling.textContent = '显示已修课程'
      } else {
        $$(dx).children('i')[0].nextSibling.textContent = '隐藏已修课程'
      }

      $$('#theform dd.time.cl > span.fr').each((_, el) => {
        if (el.innerText.indexOf('100') !== -1) {
          $$(el).parents('dl').toggle()
        }
      })
    }).appendTo(".w_btn3")
  }
})
