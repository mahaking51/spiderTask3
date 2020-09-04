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
},1200);
})

