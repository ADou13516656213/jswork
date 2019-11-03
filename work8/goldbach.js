function isgoldbach(a){
    var sum = 0
    for(var i = 1;i<=a;i++){
        if(a%i==0){
            sum++;
        }
    }
    if(sum == 2){
        return true;
    }else{
        return false;
    }
}
function goldbach(odd){
    odd = document.getElementById('odd').value
    odd = parseInt(odd)
    let star = '';
    for(var i = 2;i < odd;i++){
        var c = odd - i;
        if(isgoldbach(i) && isgoldbach(c) && i<= c){
            star +=("偶数" + odd + "可以拆分成质数" + i + "和" + c + '<br>')
        }
    }
    document.getElementById('goldbach').innerHTML = star;
}
