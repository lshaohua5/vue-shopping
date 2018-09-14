const filters = {
  limitTitleWord(title){
    if(title.length<=33){
      return title;
    }else{
      return title.slice(0,33)+`...`;
    }
  },
  //年月日
  fromDate(val) {
    let date = new Date(),
      Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      I = date.getMinutes(),
      S = date.getSeconds();
    if(M < 10) {
      M = `0${M}`;  //月
    }
    if(D < 10) {
      D = `0${D}`;  //日
    }
    if(H < 10) {
      H = `0${H}`;  //时
    }
    if(I < 10) {
      I = `0${I}`;  //分
    }
    if(S < 10) {
      S = `0${S}`;  //秒
    }
    let times = Y + '-' + M + '-' + D;
    return times;
  },
  //年月日 时分秒
  fromDateAll(day) {
    let date = new Date(day),
      Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      I = date.getMinutes(),
      S = date.getSeconds();
    if(M < 10) {
      M = `0${M}`;  //月
    }
    if(D < 10) {
      D = `0${D}`;  //日
    }
    if(H < 10) {
      H = `0${H}`;  //时
    }
    if(I < 10) {
      I = `0${I}`;  //分
    }
    if(S < 10) {
      S = `0${S}`;  //秒
    }
    let times = Y + '-' + M + '-' + D + ' ' + H + ':' + I + ':' + S;
    return times;
  },
  //四位一个空格，银行卡专用
  fourSpace(val){
    if(val){
      return val.replace(/\s/g, '').replace(/(.{4})/g, "$1 ")
    }
  },
  //金额三位一逗号，小数点保留两位
  /*money(val){
    val = val.toString().replace(/\$|\,/g,'');
    if(isNaN(val)) {
      val = "0";
    }
    let sign = (val == (val = Math.abs(val)));
    val = Math.floor(val*100+0.50000000001);
    let cents = val%100;
    val = Math.floor(val/100).toString();
    if(cents<10) {
      cents = "0" + cents
    }
    for (var i = 0; i < Math.floor((val.length-(1+i))/3); i++) {
      val = val.substring(0,val.length-(4*i+3))+',' + val.substring(val.length-(4*i+3));
    }
    return (((sign)?'':'-') + val + '.' + cents);
  },*/
  //手机号中间四位显示星号
  telFormat(val){
    if(val){
      return val.replace(/^(.{3})(?:\d+)(.{4})$/,"$1****$2")
    }
  },
  //身份证中间显示星号
  idCardFormat(val){
    if(val){
      return val.replace(/^(.{6})(?:\d+)(.{4})$/,"$1*******$2")
    }
  },
  //金额保留俩位小数


};

export default filters
