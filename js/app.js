const $=id=>document.getElementById(id),rp=n=>'Rp'+n.toLocaleString('id-ID');
const OPS={Telkomsel:['0811','0812','0813','0821','0822','0823','0851','0852','0853'],Indosat:['0814','0815','0816','0855','0856','0857','0858'],XL:['0817','0818','0819','0859','0877','0878'],Axis:['0831','0832','0833','0838'],Tri:['0895','0896','0897','0898','0899'],Smartfren:['0881','0882','0883','0884','0885','0886','0887','0888','0889']};
const NOM=[5000,10000,20000,25000,50000,100000,200000,500000];
const PAY=[['QRIS',0,'Semua e-wallet'],['GoPay',0,'Tanpa biaya'],['DANA',0,'Tanpa biaya'],['Transfer BCA',0,'Virtual account'],['Alfamart',2500,'Biaya Rp2.500'],['Kartu Kredit',2000,'Biaya Rp2.000']];
const PKG=[['Hemat 3 GB',' 3 GB · 30 hari',22000],['Standar 8 GB','8 GB · 30 hari',45000],['Gamer 15 GB','15 GB + 5 GB game · 30 hari',69000],['Streaming 30 GB','30 GB + kuota malam · 30 hari',98000],['Mingguan 5 GB','5 GB · 7 hari',30000],['Unlimited Harian','Unlimited · 1 hari',12000]];
let st={nom:0,pay:0,disc:'',dp:null},H=[];
try{H=JSON.parse(localStorage.getItem('pk_h')||'[]')}catch(e){}
function save(){try{localStorage.setItem('pk_h',JSON.stringify(H))}catch(e){}}
function norm(v){v=v.replace(/\D/g,'');if(v.startsWith('62'))v='0'+v.slice(2);return v}
function detect(v){v=norm(v);if(v.length<4)return null;for(const o in OPS)if(OPS[o].includes(v.slice(0,4)))return o;return''}
function info(v){const o=detect(v),n=norm(v);if(o===null)return'';if(!o)return'<span style="color:#d33;font-size:13px">Operator tidak dikenali</span>';
const ok=n.length>=10&&n.length<=13;return'<span class="op">'+o+'</span> '+(ok?'<span class="ok">✓ nomor valid</span>':'<small style="color:var(--mu)">'+n.length+' digit</small>')}
function valid(v){const n=norm(v);return detect(v)&&n.length>=10&&n.length<=13}
function show(v){document.querySelectorAll('.view').forEach(e=>e.classList.toggle('on',e.id==v));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.v==v));if(v=='riwayat')hist();scrollTo(0,0)}
document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>show(b.dataset.v));
$('ops').innerHTML=Object.keys(OPS).map(o=>'<div class="card stat" style="margin:0"><b style="font-size:17px">'+o+'</b>Pulsa & Data</div>').join('');
$('nom').innerHTML=NOM.map(n=>'<button class="opt" data-n="'+n+'"><b>'+(n/1000)+'rb</b><small>'+rp(n+1000)+'</small></button>').join('');
$('pay').innerHTML=PAY.map((p,i)=>'<button class="opt" data-p="'+i+'"><b style="font-size:15px">'+p[0]+'</b><small>'+p[2]+'</small></button>').join('');
$('nom').onclick=e=>{const b=e.target.closest('.opt');if(b){st.nom=+b.dataset.n;upd()}};
$('pay').onclick=e=>{const b=e.target.closest('.opt');if(b){st.pay=+b.dataset.p;upd()}};
$('num').oninput=upd;
function disc(){const base=st.nom+1000;if(st.dp=='HEMAT5')return Math.min(Math.round(base*.05),5000);if(st.dp=='PULSA10'&&st.nom>=20000)return 1000;return 0}
function applyPromo(){const c=$('promo').value.trim().toUpperCase(),m=$('pmsg');if(c=='HEMAT5'||c=='PULSA10'){st.dp=c;m.innerHTML='<span class="ok">Kode '+c+' dipakai</span>'}else{st.dp=null;m.innerHTML='<span style="color:#d33">Kode tidak valid</span>'}upd()}
function upd(){$('opinfo').innerHTML=info($('num').value);
document.querySelectorAll('#nom .opt').forEach(b=>b.classList.toggle('sel',+b.dataset.n==st.nom));
document.querySelectorAll('#pay .opt').forEach(b=>b.classList.toggle('sel',+b.dataset.p==st.pay));
const fee=PAY[st.pay][1],d=disc(),tot=st.nom?st.nom+1000+fee-d:0;st.tot=tot;
$('sum').innerHTML=st.nom?'<div class="row"><span>Pulsa '+rp(st.nom)+'</span><span>'+rp(st.nom)+'</span></div><div class="row"><span>Biaya layanan</span><span>Rp1.000</span></div><div class="row"><span>Biaya '+PAY[st.pay][0]+'</span><span>'+rp(fee)+'</span></div><div class="row"><span>Diskon</span><span>-'+rp(d)+'</span></div><div class="row t"><span>Total</span><span>'+rp(tot)+'</span></div>':'<small style="color:var(--mu)">Pilih nominal untuk melihat total.</small>';
$('buy').disabled=!(st.nom&&valid($('num').value))}
function quick(){const v=$('qn').value;$('num').value=v;show('pulsa');upd()}
function modal(h){$('mb').innerHTML=h;$('md').classList.add('on')}function closeM(){$('md').classList.remove('on')}
$('md').onclick=e=>{if(e.target.id=='md')closeM()};
let cur=null;
function checkout(label,total,n,pay){cur={id:'INV'+Date.now().toString().slice(-8),item:label||'Pulsa '+rp(st.nom),total:total||st.tot,num:norm(n||$('num').value),pay:pay||PAY[st.pay][0],op:detect(n||$('num').value)};
let left=900;modal('<h3>Selesaikan pembayaran</h3><div class="row"><span>Invoice</span><b>'+cur.id+'</b></div><div class="row"><span>Produk</span><span>'+cur.item+'</span></div><div class="row"><span>Nomor</span><span>'+cur.num+' ('+cur.op+')</span></div><div class="row"><span>Metode</span><span>'+cur.pay+'</span></div><div class="row t"><span>Total</span><span>'+rp(cur.total)+'</span></div><p style="color:var(--mu);font-size:13px">Batas waktu: <b id="tm">15:00</b>. Ini simulasi, tidak ada pembayaran nyata.</p><button class="btn" onclick="paid()">Simulasikan Sudah Bayar</button><button class="btn alt" style="margin-top:8px;border:1px solid var(--bd)" onclick="closeM()">Batal</button>');
clearInterval(window.tt);window.tt=setInterval(()=>{left--;const t=$('tm');if(!t||left<0)return clearInterval(window.tt);t.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0')},1000)}
function paid(){clearInterval(window.tt);modal('<h3>Memproses…</h3><p>Mengirim ke '+cur.op+'</p>');setTimeout(()=>{cur.time=new Date().toLocaleString('id-ID');H.unshift(cur);save();modal('<div style="text-align:center"><div style="font-size:48px">✅</div><h3 class="ok">Transaksi berhasil!</h3><p>'+cur.item+' telah dikirim ke <b>'+cur.num+'</b>.</p><small style="color:var(--mu)">'+cur.id+'</small></div><button class="btn" style="margin-top:12px" onclick="closeM();show(\'riwayat\')">Lihat Riwayat</button>')},1400)}
function hist(){$('hist').innerHTML=H.length?'<table><tr><th>Waktu</th><th>Invoice</th><th>Produk</th><th>Nomor</th><th>Total</th><th>Status</th></tr>'+H.map(h=>'<tr><td>'+h.time+'</td><td>'+h.id+'</td><td>'+h.item+'</td><td>'+h.num+'</td><td>'+rp(h.total)+'</td><td class="ok">Sukses</td></tr>').join('')+'</table><button class="btn" style="width:auto;margin-top:12px" onclick="H=[];save();hist()">Hapus riwayat</button>':'<p style="color:var(--mu)">Belum ada transaksi.</p>'}
let dp=-1;
$('pkgs').innerHTML=PKG.map((p,i)=>'<button class="opt" data-i="'+i+'"><b>'+p[0]+'</b><small>'+p[1]+'</small><br><b style="color:var(--pr)">'+rp(p[2])+'</b></button>').join('');
$('pkgs').onclick=e=>{const b=e.target.closest('.opt');if(b){dp=+b.dataset.i;dupd()}};
$('dnum').oninput=dupd;
function dupd(){$('dinfo').innerHTML=info($('dnum').value);document.querySelectorAll('#pkgs .opt').forEach(b=>b.classList.toggle('sel',+b.dataset.i==dp));
$('dsel').textContent=dp>=0?PKG[dp][0]:'Pilih paket';$('dtot').textContent=dp>=0?rp(PKG[dp][2]+1000):'-';$('dbuy').disabled=!(dp>=0&&valid($('dnum').value))}
function buyData(){checkout(PKG[dp][0],PKG[dp][2]+1000,$('dnum').value,'QRIS')}
upd();dupd();
