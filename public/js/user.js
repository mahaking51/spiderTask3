//Seller dashboard 
$(document).ready(()=>{
    $.ajax({
        url:'/products/'+userName,
        type:'GET',
        dataType:'json',
        success:(data)=>{
          console.log(data);
          money=0;
          document.getElementById('totalProd').innerHTML=data.length;
          for(var i=0;i<data.length;i++){
            money=money+data[i].sold*data[i].price
            card='<div class="card mb-3" style="max-height: 300px; ">\
						<div class="row no-gutters">\
						  <div class="col-md-2">\
							<img src="'+data[i].img+'" class="card-img" alt="Image not available" height="150" width="150" style="width:100%;max-width:540px;display:inline-block;">\
						  </div>\
						  <div class="col-md-6">\
							<div class="card-body">\
                <h3 class="card-title">'+data[i].name+'</h3>\
                <textarea class="form-control" id="prodDesc'+i+'" rows="3">'+data[i].desc+'</textarea>\
							</div>\
              </div>\
              <div class="col-md-2">\
              <h4 class="card-text" id="prodPrice'+i+'">Rs.'+data[i].price+'</h4>\
              <h4 class="card-text" id="prodQuant'+i+'">'+data[i].quantity+' items left</h4>\
              <h4 class="card-text">'+data[i].sold+' items sold</h4>\
              </div>\
              <div class="col-md-2">\
              <input class="form-control" type="number" placeholder="New Price" style="text-align:right; margin-bottom:2px;" id="updatePrice'+i+'">\
              <input class="form-control" type="number" placeholder="Update Quantity" style="text-align:right; margin-bottom:2px;" id="updateQuant'+i+'">\
              <button class="btn btn-warning float-right" id="update'+i+'" value="'+data[i]._id+'">Update</button>\
              </div>\
						</div>\
            </div>'
            document.getElementById('dashboardSellSec').innerHTML+=card;
          }
          document.getElementById('totalMoney').innerHTML='Rs.'+money;
          if(data.length==0){
            document.getElementById('dashboardSellSec').innerHTML='<h2 style="text-align:center; padding:15px;border-radius:0.25rem; color:grey; " id="noProd">Sell some products and make some money!!!</h2>'
          }
          for(let j=0;j<data.length;j++){
            document.getElementById('update'+j).addEventListener('click',function(){
              newPrice=document.getElementById('updatePrice'+j).value;
              newQuant=document.getElementById('updateQuant'+j).value;
              pid=document.getElementById('update'+j).value
              desc=document.getElementById('prodDesc'+j).value;
              if(newPrice>0 && newQuant>=1){
                document.getElementById('prodPrice'+j).innerHTML='Rs.'+newPrice;
                document.getElementById('prodQuant'+j).innerHTML=newQuant+' items left';
                socket.emit('updateValues',{pid:pid,price:newPrice,quant:newQuant,desc:desc});
                notification();
              }
              else{
                alert('Recheck your values...')
              }
            })
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
        len=data.length;
        a=[]
        for(let j=0;j<len;j++){
          document.getElementById('buy'+j).addEventListener('click',function(e){
            e.preventDefault();
            details=(document.getElementById('buy'+j).value.split(','));
            quantity=parseInt(document.getElementById('quantityBuy'+j).value);
            id=(details[0]);
            name=details[1];
            seller=document.getElementById('seller'+j).innerHTML.slice(9);
            price=parseInt(details[2])
            console.log(details);
            if(quantity<document.getElementById('quantityBuy'+j).min || quantity>document.getElementById('quantityBuy'+j).max){
              alert('Recheck your number of quantity')
            }
            else{
              socket.emit('addCart',{id:id,user:userName,quantity:quantity,name:name,price:price,seller,seller});
              number=document.getElementById('quantityLeft'+j).innerHTML;
              number=number.split(' ');
              numberLeft=parseInt(number[0])-quantity;
              document.getElementById('quantityLeft'+j).innerHTML=numberLeft+' items Left';
              cartQuant=parseInt(document.getElementById('cartItems').innerHTML);
              document.getElementById('cartItems').innerHTML=cartQuant+1;
              document.getElementById('myCartItems').innerHTML+='<li class="list-group-item" id="itemrem'+j+'"><h4 style="display:inline">'+name+'</h4> - quantity : '+quantity+'<button class="btn btn-light float-right rem" id="rem'+j+'" style="margin-left:1rem;border-radius:50%;" value="'+id+','+price*quantity+'"><i class="fas fa-times"></i></button> <h5 style="display:inline" class="float-right">Rs.'+price*quantity+'</h5></li>'
              condition=document.getElementById('totalCost');
              a.push(j);
              if(condition){
                costDet=document.getElementById('totalCost').innerHTML;
                  cost=parseInt(costDet.slice(8))
                  cost=cost+price*quantity
                  document.getElementById('totalCost').innerHTML='Total : '+cost
              }
            }
            cartLength=document.getElementsByClassName('rem').length;
            for(let l=0;l<a.length;l++){
              document.getElementById('rem'+a[l]).addEventListener('click',function(){
                console.log('clickedrem'+a[l]);
                cartDetails=(document.getElementById('rem'+a[l]).value).split(',');
                pid=cartDetails[0];
                itemCost=parseInt(cartDetails[1])
                socket.emit('removeItem',{pid:pid,user:userName});
                document.getElementById('itemrem'+a[l]).style.display='none';
                numberItems=parseInt(document.getElementById('cartItems').innerHTML);
                numberItems--;
                document.getElementById('cartItems').innerHTML=numberItems;
                cond=document.getElementById('totalCost');
                if(cond){
                  costDet=document.getElementById('totalCost').innerHTML;
                  cost=parseInt(costDet.slice(8))
                  cost=cost-itemCost
                  document.getElementById('totalCost').innerHTML='Total : '+cost
                }
                else{
                  // document.getElementById('myCart').innerHTML+='<h4 class="float-right" style="margin-top:1.2rem" id="totalCost">Total : '+itemCost+'</h4>'
                }
              })
            }
            loadedLength=document.getElementsByClassName('remLoad').length;
            console.log(loadedLength);
            for(let g=0;g<loadedLength;g++){
              document.getElementById('remove'+g).addEventListener('click',function(){
                console.log('clicked'+g);
                cartDetails=(document.getElementById('remove'+g).value).split(',');
            pid=cartDetails[0]
            cost=cost-parseInt(cartDetails[1]);
            socket.emit('removeItem',{pid:pid,user:userName});
            document.getElementById('item'+g).style.display='none';
            document.getElementById('totalCost').innerHTML='Total : '+cost;
            numberItems=parseInt(document.getElementById('cartItems').innerHTML);
            numberItems--;
            document.getElementById('cartItems').innerHTML=numberItems;
              })
            }
          })
        }
    
      }
  })
});
//buyer cart display
$('#messages').click(function(){
  document.getElementById('myCartItems').innerHTML='';
  $.ajax({
      url:'/cart/'+userName,
      type:'GET',
      dataType:'json',
      success:(data)=>{
        let cost=0;
        console.log(data);
        for(var k=0;k<data.length;k++){
          cost=cost+data[k].price*data[k].quantity;
          document.getElementById('myCartItems').innerHTML+='<li class="list-group-item" id="item'+k+'"><h4 style="display:inline">'+data[k].name+'</h4> - quantity : '+data[k].quantity+'<button class="btn btn-light float-right remLoad" id="remove'+k+'" style="margin-left:1rem;border-radius:50%;" value="'+data[k].pid+','+data[k].price*data[k].quantity+'"><i class="fas fa-times"></i></button>  <h5 style="display:inline" class="float-right">Rs.'+data[k].price*data[k].quantity+'</h5></li>'
        }
        cond=document.getElementById('totalCost');
        if(cond){
          document.getElementById('totalCost').innerHTML='Total : '+cost
        }
        else{
          document.getElementById('myCart').innerHTML+='<h4 class="float-right" style="margin-top:1.2rem" id="totalCost">Total : '+cost+'</h4>'
        }
        for(let i=0;i<data.length;i++){
          document.getElementById('remove'+i).addEventListener('click',function(){
            cartDetails=(document.getElementById('remove'+i).value).split(',');
            pid=cartDetails[0]
            cost=cost-parseInt(cartDetails[1]);
            socket.emit('removeItem',{pid:pid,user:userName});
            document.getElementById('item'+i).style.display='none';
            document.getElementById('totalCost').innerHTML='Total : '+cost;
            numberItems=parseInt(document.getElementById('cartItems').innerHTML);
            numberItems--;
            document.getElementById('cartItems').innerHTML=numberItems;
          })
        }
      }
  })
})
//checkout cart
// socket.emit('cartNumber',userName);
// socket.on('cartLength',function(data){
//   if(data==0){
//     document.getElementById('checkout').disabled=true;
//   }
// })
document.getElementById('checkout').addEventListener('click',function(){
  socket.emit('cartNumber',userName);
  socket.on('cartLength',function(data){
    if(data==0){
      alert('No items in cart');
    }
    else{
      socket.emit('purchase',userName);
    }
  })
  // console.log('checkout');
  // number=parseInt(document.getElementById('cartItems').innerHTML);;
  document.getElementById('cartItems').innerHTML=0;
  document.getElementById('success').style.display='block';
  document.getElementById('dashboardSec').style.display='none';
  document.getElementById('msgSec').style.display='none';
	document.getElementById('settingsSec').style.display='none';
	document.getElementById('aboutSec').style.display='none';
})