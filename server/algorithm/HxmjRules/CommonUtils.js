module.exports.contains = function(arr,e){
	var i = arr.length;  
    while (i--) {  
        if (arr[i] == e) {  
            return true;  
        }  
    }  
    return false; 
};

module.exports.removeItem = function(arr,e){
    var i = arr.length;  
    while (i--) {  
        if (arr[i] === e) {  
            arr.splice(i,1);
            break;  
        }  
    }  
};

module.exports.containsObject = function(arr,f){
    var i = arr.length;  
    while (i--) {  
        if (f(arr[i],i)) {  
            return true;  
        }  
    }  
    return false; 
};
