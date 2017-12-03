export function getSearchString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var result = window.location.search.substr(1).match(reg);
  if(result != null){
    return result[2];
  }else{
    return null;
  }
}