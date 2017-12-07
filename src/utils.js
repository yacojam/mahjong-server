export function getSearchString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var result = window.location.search.substr(1).match(reg);
  if (result != null) {
    return result[2];
  } else {
    return null;
  }
}

export function setCookie(key, value, expireDays) {
  var now = new Date();
  now.setDate(now.getDate() + expireDays);
  document.cookie = key + "=" + value + ";expires=" + now;
}

export function removeCookie(key) {
  setCookie(key, "", -1);
}

export function getCookie(key) {
  var cookieArr = document.cookie.split("; ");
  for (var i = 0; i < cookieArr.length; i++) {
    var arr = cookieArr[i].split("=");
    if (arr[0] === key) {
      return arr[1];
    }
  }
  return null;
}
