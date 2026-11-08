import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express(); const PORT=process.env.PORT||4000;
const dataDir=path.join(__dirname,'data'); fs.mkdirSync(dataDir,{recursive:true});
app.use(cors()); app.use(express.json({limit:'8mb'}));
function read(name,fallback=[]){const p=path.join(dataDir,name);try{return JSON.parse(fs.readFileSync(p,'utf8'))}catch{return fallback}}
function write(name,value){fs.writeFileSync(path.join(dataDir,name),JSON.stringify(value,null,2))}
app.get('/api/health',(req,res)=>res.json({ok:true,app:'AZHY Fashion Studio'}));
app.get('/api/designs',(req,res)=>res.json(read('designs.json')));
app.post('/api/designs',(req,res)=>{const list=read('designs.json');const item={...req.body,id:Date.now(),createdAt:new Date().toISOString()};list.unshift(item);write('designs.json',list);res.status(201).json(item)});
app.delete('/api/designs/:id',(req,res)=>{const list=read('designs.json').filter(x=>String(x.id)!==req.params.id);write('designs.json',list);res.json({ok:true})});
app.get('/api/orders',(req,res)=>res.json(read('orders.json')));
app.post('/api/orders',(req,res)=>{const list=read('orders.json');const item={...req.body,id:Date.now(),status:'demo-pending',createdAt:new Date().toISOString()};list.unshift(item);write('orders.json',list);res.status(201).json(item)});
app.listen(PORT,'0.0.0.0',()=>console.log(`AZHY API running on http://localhost:${PORT}`));