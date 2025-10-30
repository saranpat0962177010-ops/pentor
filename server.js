const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const DATA_DIR = path.join(__dirname,'data');
const DATA_FILE = path.join(DATA_DIR,'submissions.json');

app.use(express.json());
app.use(express.static(__dirname));

if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

app.post('/submit', (req, res) => {
	const item = {
		name: String(req.body.name || '').slice(0,100),
		message: String(req.body.message || '').slice(0,500),
		style: String(req.body.style || ''),
		candle: !!req.body.candle,
		createdAt: new Date().toISOString()
	};
	try {
		const arr = JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
		arr.push(item);
		fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2),'utf8');
		res.json({ok:true});
	} catch(err){
		console.error(err);
		res.status(500).json({ok:false});
	}
});

app.get('/api/submissions', (req,res)=>{
	try {
		const arr = JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
		res.json(arr.reverse());
	} catch(err){
		res.status(500).json([]);
	}
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Server listening on http://localhost:${port}`));
