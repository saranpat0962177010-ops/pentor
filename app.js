document.addEventListener('DOMContentLoaded',()=> {
	const form = document.getElementById('krathongForm');
	const river = document.getElementById('river');
	const viewBtn = document.getElementById('viewList');

	form.addEventListener('submit', async (e)=>{
		e.preventDefault();
		const data = Object.fromEntries(new FormData(form).entries());
		data.candle = form.candle.checked ? true : false;
		// สร้างองค์ประกอบกระทงเพื่อแสดงผล
		const k = document.createElement('div');
		k.className = `krathong ${data.style}`;
		k.innerHTML = `
			<div class="label">${escapeHtml(data.name)}</div>
			<div class="body"></div>
			${data.candle ? '<div class="candle"></div>' : ''}
		`;
		// วางตำแหน่งสุ่มตามความกว้าง
		const startX = 10 + Math.random()*30;
		k.style.left = startX + '%';
		river.appendChild(k);
		// เริ่มแอนิเมชันเล็กน้อย (ลอยไปทางขวา)
		requestAnimationFrame(()=> {
			k.classList.add('float-away');
		});
		// ส่งข้อมูลไปเซิร์ฟเวอร์ (บันทึก)
		try {
			await fetch('/submit', {
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body:JSON.stringify(data)
			});
		} catch(err){
			console.warn('ไม่สามารถบันทึกได้',err);
		}
		// เอาออกเมื่อจบ
		setTimeout(()=> k.remove(), 11000);
		form.reset();
	});

	viewBtn.addEventListener('click', async ()=>{
		let modal = document.querySelector('.list-modal');
		if(!modal){
			modal = document.createElement('div');
			modal.className = 'list-modal';
			river.appendChild(modal);
		}
		// โหลดรายการจาก API
		try {
			const res = await fetch('/api/submissions');
			const list = await res.json();
			modal.innerHTML = '<h3>กระทงที่ลอยแล้ว</h3>' + (list.length ? list.map(item=>`<div style="padding:6px;border-bottom:1px solid #eee"><strong>${escapeHtml(item.name)}</strong><div style="font-size:12px">${escapeHtml(item.message||'')}</div></div>`).join('') : '<div>ยังไม่มีรายการ</div>');
			modal.classList.add('show');
			modal.addEventListener('click', ()=> modal.classList.remove('show'), {once:true});
		} catch(err){
			console.warn(err);
		}
	});

	// ป้องกัน XSS พื้นฐานสำหรับข้อความแสดง
	function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
});