const express=require("express");
const cors=require("cors");
const app=express();
const PORT=process.env.PORT||3000;

app.use(cors());
app.use(express.json());

app.get("/",(_req,res)=>res.json({service:"ELINA API",mode:"test",status:"ok"}));
app.get("/api/health",(_req,res)=>res.json({ok:true,service:"elina-api",mode:"test"}));

app.post("/api/test-order",(req,res)=>{
  const items=Array.isArray(req.body?.items)?req.body.items:[];
  if(!items.length)return res.status(400).json({ok:false,message:"Warenkorb ist leer"});
  const orderId="EL-TEST-"+Date.now().toString().slice(-8);
  res.json({ok:true,orderId,mode:"test",message:"Testbestellung angenommen. Keine Zahlung und kein Lieferantenauftrag wurde ausgelöst."});
});

app.listen(PORT,()=>console.log("ELINA API läuft auf Port "+PORT+" (Testmodus)"));