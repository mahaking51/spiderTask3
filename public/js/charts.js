date=[];
mon=[];
colors=[
    "#d54062",
    "#ffd571",
    "#776d8a",
    "#81b214",
    "#a2d5f2",
    "#edcfa9",
    "#52575d",
    "#595238",
    "#e8e4e1",
    "#efa8e4",
    "#edf7fa"
]
function lineGraph(){
    socket.emit('purchaseReport',userName);
    socket.on('returnPurchaseReport',function(data){
        day1=1000*60*60*24
        now =new Date();
        weekIter=new Date(now.getFullYear(),now.getMonth(),now.getDate())
        weekIter=weekIter.setDate(now.getDate()-5);
        weekIter= new Date(weekIter)
        for(var i=0;i<6;i++){
            date.push((weekIter.getDate()+'/'+(weekIter.getMonth()+1)));
            mon.push(0);
            // console.log(weekIter.toString());
            for(var j=0;j<data.length;j++){
                dataDate=new Date(data[j].date);
                if(((dataDate.getTime()-weekIter.getTime())/day1)<1 && ((dataDate.getTime()-weekIter.getTime())/day1)>=0){
                    // date.push(dataDate)
                    // mon.push(data[j].cost);
                    mon[mon.length-1]+=data[j].cost
                }
                // else{
                //     weekIter=new Date(data[j].date)
                //     date.push(dataDate);
                //     mon.push(data[j].cost)
                // }
            }
            weekIter=weekIter.setDate(weekIter.getDate()+1)
            weekIter= new Date(weekIter)
            // console.log(date);
            // console.log(mon);
        }
        
    })

}
lineGraph();

products=[]
costs=[]
backGround=[];
a=[]

function pieChart(){
socket.emit('sellProd',userName);
socket.on('returnProd',function(data){
    // console.log(data);
    cost=0
    for(var i=0;i<data.length;i++){
        products.push(data[i].name)
        costs.push(data[i].sold*data[i].price);
    }
    taken=[];
    while(1){
        if(a.length==products.length){
            break
        }
        else{
            if(!taken.includes(Math.floor(Math.random()*colors.length))){
                a.push(colors[Math.floor(Math.random()*colors.length)])
                taken.push(Math.floor(Math.random()*colors.length))
            }
        }
    }
})
   

}
pieChart();
// console.log(products);
// console.log(costs);
console.log(a);
buyerDate=[]
buyerCost=[]
function barGraph(){
    socket.emit('purchaseHistory',userName);
    socket.on('returnHistory',function(data){
        day1=1000*60*60*24
        now =new Date();
        weekIter=new Date(now.getFullYear(),now.getMonth(),now.getDate())
        weekIter=weekIter.setDate(now.getDate()-5);
        weekIter= new Date(weekIter)
        for(var i=0;i<6;i++){
            buyerDate.push((weekIter.getDate()+'/'+(weekIter.getMonth()+1)));
            buyerCost.push(0);
            console.log(weekIter.toString());
            for(var j=0;j<data.length;j++){
                dataDate=new Date(data[j].date);
                if(((dataDate.getTime()-weekIter.getTime())/day1)<1 && ((dataDate.getTime()-weekIter.getTime())/day1)>=0){
                    // date.push(dataDate)
                    // mon.push(data[j].cost);
                    buyerCost[buyerCost.length-1]+=data[j].cost
                }
                // else{
                //     weekIter=new Date(data[j].date)
                //     date.push(dataDate);
                //     mon.push(data[j].cost)
                // }
            }
            weekIter=weekIter.setDate(weekIter.getDate()+1)
            weekIter= new Date(weekIter)
        }
    })
}
barGraph();
console.log(buyerDate);
console.log(buyerCost);
$(document).ready(()=>{
$.ajax({
    url:'/users/'+userName,
    type:'GET',
    dataType:'json',
    success:(data)=>{
        if(data.type==='seller'){
            
            var ctx = document.getElementById('sellerLineChart').getContext('2d');
            var ctx1=document.getElementById('sellerPieChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',

                data: {
                    labels: date,
                    datasets: [{
                        label: 'Income',
                        borderColor: 'rgb(255, 99, 132)',
                        data: mon
                    }]
                },

                // Configuration options go here
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontSize: 25
                            }
                        }],
                        xAxes:[{
                            ticks: {
                                fontSize: 25
                            }
                        }]
                    },
                    
                }
            });
            var chart =new Chart(ctx1,{
                type:'pie',
                data:{
                    datasets: [{
                        data: costs,
                        backgroundColor:colors.slice(0,products.length-1)
                    }],
                
                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: products,
                    plugins: {
                        datalabels: {
                          color: "#ffffff",
                          formatter: function (value) {
                            return Math.round(value) + '%';
                          },
                          font: {
                            weight: 'bold',
                            size: 30,
                          }
                        }
                      },
                    options: {
                        legend: {
                            position:'left',
                            display: true,
                            labels: {
                            }
                        }
                    }   
                }
            })
            
        }
        else{
            var ctx2=document.getElementById('buyerBarChart').getContext('2d');

            var chart = new Chart(ctx2, {
                type: 'bar',

                data: {
                    labels: buyerDate,
                    datasets: [{
                        label: 'amount spent',
                        backgroundColor: "#e97171",
                        borderColor: '#810000',
                        data: buyerCost
                    }]
                },

                // Configuration options go here
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontSize: 25
                            }
                        }],
                        xAxes:[{
                            ticks: {
                                fontSize: 25
                            }
                        }]
                    },
                    
                }
            });
        }

    }
})
})
