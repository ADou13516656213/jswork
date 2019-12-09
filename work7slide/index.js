function sort(method){
    clearTimeout(c);
    let origin = document.getElementById('origin').value
    let logs
    console.log(method)
    if(method=='bubble'){
        logs = bubbleSort(origin)
    }else if(method=='insert'){
        logs = insertSort(origin)
    }
    showDiv = document.getElementById('Anim')
    logValues = logs.values()
    console.log(logValues.next())
    var c = setTimeout("showLog(logValues,showDiv)",50)
} 