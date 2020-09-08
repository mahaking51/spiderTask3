var socket = io();
var API_KEY = '18163249-030c794f94b190a9cfe26d956';
let a=[]
document.getElementById('addProduct').addEventListener('click',async function(e){
e.preventDefault();
name=document.getElementById('inputName').value;
quantity=document.getElementById('inputQuant').value;
price=document.getElementById('inputPrice').value;
desc=document.getElementById('inputDesc').value;
var URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(name)+"&per_page=3";

$.getJSON(URL, function(data){
if (parseInt(data.totalHits) > 0){
    console.log(data.hits[0].previewURL);
    socket.emit('addProduct',{name:name,quantity:quantity,price:price,desc:desc,seller:userName,img:data.hits[0].previewURL});
}

else{
    console.log('No hits');
}
});
setTimeout(function(){
    window.location.reload();
},1100);
})

$('#searchInput').keyup(()=>{
    document.getElementById('searchHints').innerHTML='';
    document.getElementById('searchHints').style.display='block';
    $.ajax({
        url:'/available',
        type:'GET',
        dataType:'json',
        success:(data)=>{
            let search
            input=document.getElementById('searchInput').value
            for(var i=0;i<data.length;i++){
                // prodName=data[i].name
                // console.log(data[i].name);
                
                if(data[i].name.includes(input)){
                    console.log('match');
                    document.getElementById('searchHints').innerHTML+='<li class="list-group-item result">'+data[i].name+'</li>'
                }
            }
            len=document.getElementsByClassName('result').length;
            for(let j=0;j<len;j++){
                document.getElementsByClassName('result')[j].addEventListener('click',function(){
                    search=document.getElementsByClassName('result')[j].innerHTML;
                    document.getElementById('dashboardSec').style.display='block';
                    document.getElementById('aboutSec').style.display='none';
                    document.getElementById('msgSec').style.display='none';
                    document.getElementById('settingsSec').style.display='none';
                    document.getElementById('profileDisplay').style.display='none';
                    document.getElementById('dashboardBuySec').innerHTML='<h2 id="searchText"></h2>';
                    document.getElementById('searchText').innerHTML='Search Results for '+search;
                    a=[]
                    for(var i=0;i<data.length;i++){
                        if(data[i].name.includes(search)){
                        a.push(i);
                        if(data[i].quantity==0){
                          card='<div class="card mb-3" style="max-height: 300px; ">\
                        <div class="row no-gutters">\
                          <div class="col-md-2">\
                          <img src="'+data[i].img+'" class="card-img" alt="Image not available" height="150" width="150" style="width:100%;max-width:540px;display:inline-block;">\
                          </div>\
                          <div class="col-md-6">\
                          <div class="card-body">\
                            <h3 class="card-title">'+data[i].name+'</h3>\
                            <p class="card-text">'+data[i].desc+'</p>\
                            <p class="card-text">Seller : '+data[i].seller+'</p>\
                          </div>\
                          </div>\
                          <div class="col-md-4">\
                          <h4 class="card-text">Rs.'+data[i].price+'</h4>\
                          <h4 class="card-text" id="quantityLeft'+i+'">'+data[i].quantity+' items left</h4>\
                          <form action="">\
                          <input class="form-control" type="number" id="quantityBuy'+i+'"  min="1" max="'+data[i].quantity+'" value="1"></input>\
                          <button class="btn btn-outline-dark buyBtn" id="buy'+i+'" value="'+data[i]._id+'" type="submit" style="margin-top:1rem;" disabled>Sold Out</button>\
                          </form>\
                          </div>\
                        </div>\
                        </div>'
                        document.getElementById('dashboardBuySec').innerHTML+=card;
                        }
                        else{
                          card='<div class="card mb-3" style="max-height: 300px; ">\
                          <div class="row no-gutters">\
                            <div class="col-md-2">\
                            <img src="'+data[i].img+'" class="card-img" alt="Image not available" height="150" width="150" style="width:100%;max-width:540px;display:inline-block;">\
                            </div>\
                            <div class="col-md-6">\
                            <div class="card-body">\
                              <h3 class="card-title">'+data[i].name+'</h3>\
                              <p class="card-text">'+data[i].desc+'</p>\
                              <p class="card-text" id="seller'+i+'">Seller : '+data[i].seller+'</p>\
                            </div>\
                            </div>\
                            <div class="col-md-4">\
                            <h4 class="card-text">Rs.'+data[i].price+'</h4>\
                            <h4 class="card-text" id="quantityLeft'+i+'">'+data[i].quantity+' items left</h4>\
                            <form action="">\
                            <input class="form-control" type="number" id="quantityBuy'+i+'"  min="1" max="'+data[i].quantity+'" value="1"></input>\
                            <button class="btn btn-outline-dark buyBtn" id="buy'+i+'" value="'+data[i]._id+','+data[i].name+','+data[i].price+'" type="submit" style="margin-top:1rem;">Add to Cart</button>\
                            </form>\
                            </div>\
                          </div>\
                          </div>'
                          document.getElementById('dashboardBuySec').innerHTML+=card;
                        }
                        }
                      }
                      len=a.length;
                      for(let j=0;j<len;j++){
                        document.getElementById('buy'+a[j]).addEventListener('click',function(e){
                          e.preventDefault();
                          details=(document.getElementById('buy'+a[j]).value.split(','));
                          quantity=parseInt(document.getElementById('quantityBuy'+j).value);
                          id=(details[0]);
                          name=details[1];
                          seller=document.getElementById('seller'+a[j]).innerHTML.slice(9);
                          price=parseInt(details[2])
                          console.log(details);
                          if(quantity<document.getElementById('quantityBuy'+a[j]).min || quantity>document.getElementById('quantityBuy'+a[j]).max){
                            alert('Recheck your number of quantity')
                          }
                          else{
                            socket.emit('addCart',{id:id,user:userName,quantity:quantity,name:name,price:price,seller,seller});
                            number=document.getElementById('quantityLeft'+a[j]).innerHTML;
                            number=number.split(' ');
                            numberLeft=parseInt(number[0])-quantity;
                            document.getElementById('quantityLeft'+a[j]).innerHTML=numberLeft+' items Left';
                            cartQuant=parseInt(document.getElementById('cartItems').innerHTML);
                            document.getElementById('cartItems').innerHTML=cartQuant+1;
                          }
                        })
                      }
                })
            }
            document.getElementById('searchBut').addEventListener('click',function(){
                search=document.getElementById('searchInput').value;
                document.getElementById('searchHints').style.display='none';
                document.getElementById('dashboardSec').style.display='block';
                    document.getElementById('aboutSec').style.display='none';
                    document.getElementById('msgSec').style.display='none';
                    document.getElementById('settingsSec').style.display='none';
                    document.getElementById('profileDisplay').style.display='none';
                    document.getElementById('dashboardBuySec').innerHTML='<a href="" style=" margin-bottom:12px;font-size:1.2rem;text-decoration:none;"> < Back </a><h2 id="searchText"></h2>';
                    document.getElementById('searchText').innerHTML='Search Results for '+search;
                a=[]
                for(var i=0;i<data.length;i++){
                    if(data[i].name.includes(search)){
                    a.push(i);
                    if(data[i].quantity==0){
                      card='<div class="card mb-3" style="max-height: 300px; ">\
                    <div class="row no-gutters">\
                      <div class="col-md-2">\
                      <img src="'+data[i].img+'" class="card-img" alt="Image not available" height="150" width="150" style="width:100%;max-width:540px;display:inline-block;">\
                      </div>\
                      <div class="col-md-6">\
                      <div class="card-body">\
                        <h3 class="card-title">'+data[i].name+'</h3>\
                        <p class="card-text">'+data[i].desc+'</p>\
                        <p class="card-text">Seller : '+data[i].seller+'</p>\
                      </div>\
                      </div>\
                      <div class="col-md-4">\
                      <h4 class="card-text">Rs.'+data[i].price+'</h4>\
                      <h4 class="card-text" id="quantityLeft'+i+'">'+data[i].quantity+' items left</h4>\
                      <form action="">\
                      <input class="form-control" type="number" id="quantityBuy'+i+'"  min="1" max="'+data[i].quantity+'" value="1"></input>\
                      <button class="btn btn-outline-dark buyBtn" id="buy'+i+'" value="'+data[i]._id+'" type="submit" style="margin-top:1rem;" disabled>Sold Out</button>\
                      </form>\
                      </div>\
                    </div>\
                    </div>'
                    document.getElementById('dashboardBuySec').innerHTML+=card;
                    }
                    else{
                      card='<div class="card mb-3" style="max-height: 300px; ">\
                      <div class="row no-gutters">\
                        <div class="col-md-2">\
                        <img src="'+data[i].img+'" class="card-img" alt="Image not available" height="150" width="150" style="width:100%;max-width:540px;display:inline-block;">\
                        </div>\
                        <div class="col-md-6">\
                        <div class="card-body">\
                          <h3 class="card-title">'+data[i].name+'</h3>\
                          <p class="card-text">'+data[i].desc+'</p>\
                          <p class="card-text" id="seller'+i+'">Seller : '+data[i].seller+'</p>\
                        </div>\
                        </div>\
                        <div class="col-md-4">\
                        <h4 class="card-text">Rs.'+data[i].price+'</h4>\
                        <h4 class="card-text" id="quantityLeft'+i+'">'+data[i].quantity+' items left</h4>\
                        <form action="">\
                        <input class="form-control" type="number" id="quantityBuy'+i+'"  min="1" max="'+data[i].quantity+'" value="1"></input>\
                        <button class="btn btn-outline-dark buyBtn" id="buy'+i+'" value="'+data[i]._id+','+data[i].name+','+data[i].price+'" type="submit" style="margin-top:1rem;">Add to Cart</button>\
                        </form>\
                        </div>\
                      </div>\
                      </div>'
                      document.getElementById('dashboardBuySec').innerHTML+=card;
                    }
                    }
                  }
                  len=a.length;
                  if(len==0){
                      document.getElementById('searchText').innerHTML='No Results Found';
                  }
                  for(let j=0;j<len;j++){
                    document.getElementById('buy'+a[j]).addEventListener('click',function(e){
                      e.preventDefault();
                      details=(document.getElementById('buy'+a[j]).value.split(','));
                      quantity=parseInt(document.getElementById('quantityBuy'+a[j]).value);
                      id=(details[0]);
                      name=details[1];
                      seller=document.getElementById('seller'+a[j]).innerHTML.slice(9);
                      price=parseInt(details[2])
                      console.log(details);
                      if(quantity<document.getElementById('quantityBuy'+a[j]).min || quantity>document.getElementById('quantityBuy'+a[j]).max){
                        alert('Recheck your number of quantity')
                      }
                      else{
                        socket.emit('addCart',{id:id,user:userName,quantity:quantity,name:name,price:price,seller,seller});
                        number=document.getElementById('quantityLeft'+j).innerHTML;
                        number=number.split(' ');
                        numberLeft=parseInt(number[0])-quantity;
                        document.getElementById('quantityLeft'+a[j]).innerHTML=numberLeft+' items Left';
                        cartQuant=parseInt(document.getElementById('cartItems').innerHTML);
                        document.getElementById('cartItems').innerHTML=cartQuant+1;
                        
                      }
                      
                    })
                  }
            })
            
        }
    })
})
window.addEventListener('click',function(){
    document.getElementById('searchHints').style.display='none';

})
