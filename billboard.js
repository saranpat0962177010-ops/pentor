(function(){
	// รหัสสำหรับจัดเก็บใน localStorage
	const KEY = 'billboard:image';
	function $(id){ return document.getElementById(id); }

	document.addEventListener('DOMContentLoaded', ()=>{
		const input = $('billboardInput');
		const img = $('billboardImg');
		const caption = $('billboardCaption');
		const frame = $('billboardFrame');

		if(!input || !img || !frame) return;

		// โหลดภาพที่บันทึกไว้ถ้ามี
		try{
			const saved = localStorage.getItem(KEY);
			if(saved){
				img.src = saved;
				if(caption) caption.style.opacity = 0;
			}
		}catch(e){ /* ข้ามข้อผิดพลาดการจัดเก็บ */ }

		// ฟังก์ชันทั่วไป: ตั้งค่า image และบันทึก
		function setImageDataURL(dataURL){
			img.src = dataURL;
			if(caption) caption.style.opacity = 0;
			try{ localStorage.setItem(KEY, dataURL); }catch(e){}
		}

		// เมื่อมีการเปลี่ยนแปลง input ไฟล์
		input.addEventListener('change', (ev)=>{
			const f = ev.target.files && ev.target.files[0];
			if(!f) return;
			const reader = new FileReader();
			reader.onload = ()=> setImageDataURL(reader.result);
			reader.readAsDataURL(f);
		});

		// รองรับการลากและวางบนกรอบ
		frame.addEventListener('dragover', (ev)=> {
			ev.preventDefault();
			frame.style.opacity = 0.96;
		});
		frame.addEventListener('dragleave', ()=> { frame.style.opacity = ''; });
		frame.addEventListener('drop', (ev)=> {
			ev.preventDefault();
			frame.style.opacity = '';
			const f = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
			if(!f) return;
			const reader = new FileReader();
			reader.onload = ()=> setImageDataURL(reader.result);
			reader.readAsDataURL(f);
		});

		// ฟังก์ชันสาธารณะสำหรับลบภาพบนป้าย
		window.clearBillboardImage = function(){
			try{ localStorage.removeItem(KEY); }catch(e){}
			img.removeAttribute('src');
			if(caption) caption.style.opacity = 1;
		};

		// ตัวเลือก: ดับเบิลคลิกเพื่อลบ
		frame.addEventListener('dblclick', ()=> {
			window.clearBillboardImage();
		});
	});
})();