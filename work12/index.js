function setCalendar(year){
    var x = new Date(year,0).getDate();
    var html = '<div class="selyear">';
    for(var m  = 1;m <= 12;++m){
        html += '<table>';
        html += '<tr class = "title"><th colspan="7">' + year + '年' + m + '月</th></tr>';
        html += '<tr><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>';

        var max = new Date(year,m,0).getDate();
        html += '<tr>';
        for(var d = 1;d <= max; ++d){
            if(x && d == 1){
                html += '<td colspan="' + x +'"></td>';
            }
            html += '<td>' + d + '</td>';
            if (x ==6 && d != max){
                html += '</tr><tr>';
            }else if (d == max) {
                html += '</tr>';
            }
            x = (x + 1 > 6) ? 0: x + 1;
        }
        html += '</table>';
    }
        html += '</div>'
        return html;
}
let nextyear = new Date().getFullYear() + 1;
document.getElementById("nextyear").innerHTML = setCalendar(nextyear)
let nowyear = new Date().getFullYear();
document.getElementById("curyear").innerHTML = setCalendar(nowyear)
let lastyear = new Date().getFullYear() - 1;
document.getElementById("preyear").innerHTML = setCalendar(lastyear)