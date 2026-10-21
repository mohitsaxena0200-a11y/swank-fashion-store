const products = [
  {id:"swk-001",name:"The Everyday Shirt",category:"MEN · SMART CASUAL",price:1299,image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=85"},
  {id:"swk-002",name:"Soft Structure Set",category:"WOMEN · EVERYDAY",price:1899,image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85"},
  {id:"swk-003",name:"Weekend Layers",category:"UNISEX · LAYERS",price:1599,image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85"},
  {id:"swk-004",name:"The Minimal Dress",category:"WOMEN · OCCASION",price:2199,image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85"}
];
const rupees = amount => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(amount);
const grid = document.getElementById("product-grid");
const toast = document.getElementById("toast");
function notify(message){toast.textContent=message;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),3000)}
grid.innerHTML = products.map(p=>`<article class="product"><img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy"><div class="product-meta"><span class="product-name">${p.name}</span><span class="product-price">${rupees(p.price)}</span></div><div class="product-category">${p.category}</div><div class="product-actions"><button class="small-button" data-enquire="${p.id}">Ask on WhatsApp</button><button class="small-button primary" data-buy="${p.id}">Buy now ↗</button></div></article>`).join("");
// Replace with the store's real WhatsApp number, including country code without + or spaces.
const WHATSAPP_NUMBER = "917390952329";
document.getElementById("whatsapp-link").href = `https://wa.me/${WHATSAPP_NUMBER}`;
function enquiry(product){if(!/^\d{10,15}$/.test(WHATSAPP_NUMBER)){notify("Please add your real WhatsApp number in script.js first.");return}const msg=encodeURIComponent(`Hi SWANK, I'm interested in ${product.name} (${rupees(product.price)}). Please share size and availability.`);window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank","noopener")}
grid.addEventListener("click", async event=>{
 const enquireId=event.target.dataset.enquire, buyId=event.target.dataset.buy;
 if(enquireId){const p=products.find(x=>x.id===enquireId);if(p)enquiry(p);return}
 if(!buyId)return;
 const p=products.find(x=>x.id===buyId);if(!p)return;
 if(!/^\d{10,15}$/.test(WHATSAPP_NUMBER)){notify("Demo catalogue: add your WhatsApp number and configure Razorpay before launch.");return}
 const button=event.target;button.disabled=true;button.textContent="Loading…";
 try{
  const response=await fetch("/api/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({productId:p.id})});
  const data=await response.json();if(!response.ok)throw new Error(data.error||"Checkout setup is incomplete.");
  const options={key:data.keyId,amount:data.amount,currency:data.currency,name:"SWANK Fashion Store",description:p.name,order_id:data.orderId,prefill:{},theme:{color:"#25221f"},
   handler:async function(payment){
    const verify=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...payment,productId:p.id})});
    const result=await verify.json();if(!verify.ok||!result.verified){notify("Payment verification failed. Please contact support.");return}notify("Payment verified! Order reference: "+result.orderId);
   }};
  new Razorpay(options).open();
 }catch(error){notify(error.message||"Checkout is not configured yet.");}
 finally{button.disabled=false;button.textContent="Buy now ↗"}
});
document.getElementById("year").textContent=new Date().getFullYear();
