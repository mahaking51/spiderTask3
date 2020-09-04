//Seller dashboard 
$(document).ready(()=>{
    $.ajax({
        url:'/products/'+userName,
        type:'GET',
        dataType:'json',
        success:(data)=>{
          for(var i=0;i<data.length;i++){
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
              <h4 class="card-text">'+data[i].quantity+' items left</h4>\
              <h4 class="card-text">'+data[i].sold+' items sold</h4>\
              </div>\
						</div>\
            </div>'
            document.getElementById('dashboardSellSec').innerHTML+=card;
          }
          if(data.length==0){
            document.getElementById('dashboardSellSec').innerHTML='<h2 style="text-align:center; padding:15px;border-radius:0.25rem; color:grey; " id="noProd">Sell some products and make some money!!!</h2>'
          }
        }
    })
});
//Buyer dashboard 
$(document).ready(()=>{
  $.ajax({
      url:'/available',
      type:'GET',
      dataType:'json',
      success:(data)=>{
        for(var i=0;i<data.length;i++){
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
                <p class="card-text">Seller : '+data[i].seller+'</p>\
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
        len=data.length;
        for(let j=0;j<len;j++){
          document.getElementById('buy'+j).addEventListener('click',function(e){
            e.preventDefault();
            details=(document.getElementById('buy'+j).value.split(','));
            quantity=parseInt(document.getElementById('quantityBuy'+j).value);
            id=(details[0]);
            name=details[1];
            price=parseInt(details[2])
            console.log(details);
            if(quantity<document.getElementById('quantityBuy'+j).min || quantity>document.getElementById('quantityBuy'+j).max){
              alert('Recheck your number of quantity')
            }
            else{
              socket.emit('addCart',{id:id,user:userName,quantity:quantity,name:name,price:price});
              number=document.getElementById('quantityLeft'+j).innerHTML;
              number=number.split(' ');
              numberLeft=parseInt(number[0])-quantity;
              document.getElementById('quantityLeft'+j).innerHTML=numberLeft+' items Left';
              cartQuant=parseInt(document.getElementById('cartItems').innerHTML);
              document.getElementById('cartItems').innerHTML=cartQuant+1;
              document.getElementById('myCartItems').innerHTML+='<li class="list-group-item"><h4 style="display:inline">'+name+'</h4> - quantity : '+quantity+' <h5 style="display:inline" class="float-right">Rs.'+price*quantity+'</h5></li>'
            }
          })
        }
      }
  })
});
//buyer cart display
$(document).ready(()=>{
  document.getElementById('myCartItems').innerHTML='';
  $.ajax({
      url:'/cart/'+userName,
      type:'GET',
      dataType:'json',
      success:(data)=>{
        console.log(data);
        for(var k=0;k<data.length;k++){
          document.getElementById('myCartItems').innerHTML+='<li class="list-group-item"><h4 style="display:inline">'+data[k].name+'</h4> - quantity : '+data[k].quantity+' <h5 style="display:inline" class="float-right">Rs.'+data[k].price*data[k].quantity+'</h5></li>'
        }
      }
  })
});
