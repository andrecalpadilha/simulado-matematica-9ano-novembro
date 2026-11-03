const $=id=>document.getElementById(id);
let questions=[],answers=Array(32).fill(''),student={},idx=0,endAt=0,timer,submitting=false;
const letters=['A','B','C','D','E'];
const RESOLUCOES = [
'M = 1500 · (1,06)² = 1500 · 1,1236 = 1.685,40.',
'5 sabores × 3 coberturas = 15 maneiras.',
'Somando: 4x = 12 ⇒ x = 3. De x − y = 1 ⇒ 3 − y = 1 ⇒ y = 2.',
'x = 0,555... → 10x = 5,555... → 9x = 5 ⇒ x = 5/9.',
'x² − 7x + 12 = 0 ⇒ (x − 3)(x − 4) = 0 ⇒ x = 3 ou x = 4.',
'60 = 2 · 30 = 2 · 2 · 15 = 2 · 2 · 3 · 5 = 2² · 3 · 5.',
'25% de 40 = 0,25 · 40 = 10 alunos.',
'C = 2πr = 2 · 3,14 · 7 = 43,96 cm.',
'V = 10 · 8 · 5 = 400 cm³.',
'A nota 7 aparece duas vezes (mais frequente). Moda = 7.',
'√48 = 4√3; √75 = 5√3; (4√3)·(5√3)/√3 = 20 · 3 / √3 = 60/√3 = 20√3.',
'15% de 2000 = 300 → 1700. 10% de 1700 = 170 → 1.530.',
'Ângulo inscrito = metade do central → 70°/2 = 35°.',
'V = π r² h = 3,14 · 4 · 6 = 75,36 m³.',
'Ângulos correspondentes são iguais → 110°.',
'36x² − 25 = (6x)² − 5² = (6x − 5)(6x + 5).',
'x² + 8x + 16 = (x + 4)².',
'x − 2 ≥ 0 ⇒ x ≥ 2. Domínio = {x ∈ ℝ | x ≥ 2}.',
'y = 5x − 2 é da forma ax + b (a ≠ 0).',
'h² + 6² = 10² ⇒ h² + 36 = 100 ⇒ h² = 64 ⇒ h = 8 m.',
'Total = 10 bolas. Vermelhas = 6. P = 6/10 = 3/5.',
'3/5 = 6/x ⇒ 3x = 30 ⇒ x = 10 cm.',
'y/x = 25/1 = 25; 50/2 = 25 etc. y = 25x.',
'(x + 4)² − x² = x² + 8x + 16 − x² = 8x + 16.',
'9² + b² = 15² ⇒ 81 + b² = 225 ⇒ b² = 144 ⇒ b = 12 cm.',
'M = 4000 · (1,05)² = 4000 · 1,1025 = 4.410.',
'(5x² − 2x + 3) + (3x² + 4x − 1) = 8x² + 2x + 2.',
'Partes = 2 + 5 = 7. Cada parte = 49/7 = 7. Maior = 5 · 7 = 35.',
'Razão 2:3. 2 partes = 8 cm → 1 parte = 4 cm. Maior = 3 · 4 = 12 cm.',
'1 m³ = 1.000 litros → 1,2 m³ = 1.200 litros.',
'3,84 × 10⁵ = 3,84 × 100.000 = 384.000 km.',
'Soma = 32 + 48 + 36 + 44 = 160. Média = 160/4 = 40.'
];
fetch('questoes.json').then(r=>{if(!r.ok)throw Error('Falha');return r.json()})
.then(q=>{questions=q;if(questions.length!==32)throw Error('Quantidade de questões inválida')})
.catch(()=>{$('start').innerHTML='<h2>Erro ao carregar questões</h2><p>Atualize a página ou confira se todos os arquivos foram publicados no GitHub Pages.</p>'});

$('form').addEventListener('submit',e=>{
 e.preventDefault();
 if(questions.length!==32){alert('As questões ainda não foram carregadas. Aguarde alguns segundos e tente novamente.');return}
 student={nome:$('nome').value.trim(),numero:$('numero').value,turma:$('turma').value};
 endAt=Date.now()+9000000;
 $('start').classList.add('hidden');$('exam').classList.remove('hidden');
 $('who').textContent=student.nome+' · '+student.turma;render();tick();timer=setInterval(tick,1000);
});

function render(){
 const q=questions[idx],count=answers.filter(Boolean).length;
 $('qn').textContent='Questão '+q.n;$('tipo').textContent=q.tipo;
 $('qtext').textContent=q.enunciado;$('progress').textContent=count+' de 32 respondidas';
 $('bar').style.width=(count/32*100)+'%';$('qtable').replaceChildren();
 if(q.tabela){let t=document.createElement('table');t.className='qt';q.tabela.forEach(row=>{let tr=t.insertRow();row.forEach(v=>tr.insertCell().textContent=v)});$('qtable').append(t)}
 $('hintbox').textContent=window.DICAS[idx]||'Releia o enunciado e identifique o conteúdo matemático envolvido.';
 $('hintbox').classList.add('hidden');$('hintbtn').textContent='💡 Ver dica';$('hintbtn').setAttribute('aria-expanded','false');
 $('choices').replaceChildren();
 q.alternativas.forEach((v,i)=>{let l=document.createElement('label');l.className='choice';let radio=document.createElement('input');radio.type='radio';radio.name='answer';radio.value=letters[i];radio.checked=answers[idx]===letters[i];radio.addEventListener('change',()=>{answers[idx]=letters[i];render()});l.append(radio,document.createTextNode(letters[i]+') '+v));$('choices').append(l)});
 $('numbers').replaceChildren();
 questions.forEach((v,i)=>{let b=document.createElement('button');b.type='button';b.textContent=i+1;b.className=(answers[i]?'answered ':'')+(idx===i?'active':'');b.onclick=()=>{idx=i;render()};$('numbers').append(b)});
 $('prev').disabled=idx===0;$('next').disabled=idx===31;
}
$('hintbtn').onclick=()=>{let show=$('hintbox').classList.contains('hidden');$('hintbox').classList.toggle('hidden',!show);$('hintbtn').textContent=show?'💡 Ocultar dica':'💡 Ver dica';$('hintbtn').setAttribute('aria-expanded',String(show))};
$('prev').onclick=()=>{idx--;render()};$('next').onclick=()=>{idx++;render()};$('finish').onclick=()=>submit(false);
function tick(){let left=Math.max(0,Math.ceil((endAt-Date.now())/1000));$('clock').textContent=[Math.floor(left/3600),Math.floor(left%3600/60),left%60].map(x=>String(x).padStart(2,'0')).join(':');if(left===0){clearInterval(timer);submit(true)}}
async function submit(expired){
 if(submitting)return;
 let missing=answers.filter(x=>!x).length;
 if(!expired&&!confirm(missing?'Existem '+missing+' questões sem resposta. Deseja finalizar mesmo assim?':'Deseja finalizar e enviar?'))return;
 submitting=true;$('finish').disabled=true;$('prev').disabled=true;$('next').disabled=true;$('numbers').style.pointerEvents='none';$('choices').style.pointerEvents='none';
 $('status').textContent='Finalizando simulado...';
 const payload={...student,respostas:answers,tempoSegundos:Math.min(9000,Math.max(0,9000-Math.ceil((endAt-Date.now())/1000))),finalizadoPorTempo:expired,simulado:'Matemática 9º Ano - 32 questões - Versão 2'};
 try{
  const r=await fetch(window.SIMULADO_ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow'});
  const data=await r.json();if(!r.ok||!data.ok)throw Error(data.error||'Não foi possível registrar');
  showResults(data.acertos,Number(data.nota),data.protocolo,data.gabarito);
  clearInterval(timer);
 }catch(e){
  submitting=false;$('status').textContent='Não foi possível registrar o envio. Confira a conexão e tente novamente. '+e.message;
  $('finish').disabled=false;$('prev').disabled=idx===0;$('next').disabled=idx===31;$('numbers').style.pointerEvents='';$('choices').style.pointerEvents='';
 }
}
function showResults(hits,grade,protocol,gabarito){
 $('exam').classList.add('hidden');
 $('done').classList.remove('hidden');

 $('result').textContent='Você acertou '+hits+' de 32 questões. Sua nota: '+grade.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+' / 10,00.';
 $('receipt').textContent='Aluno: '+student.nome+' · '+student.turma+' · '+protocol;

 const details=$('details');
 details.replaceChildren();

 questions.forEach((q,i)=>{
  const correct=gabarito[i];
  const marked=answers[i];

  const box=document.createElement('div');
  box.className='review '+(marked===correct?'good':'bad');

  const title=document.createElement('strong');
  title.textContent='Questão '+q.n+' — '+(marked===correct?'Correta':'Incorreta');

  const p=document.createElement('p');
  p.textContent='Sua resposta: '+(marked||'Não respondida')+' · Gabarito: '+correct;

  const skill=document.createElement('small');
  skill.textContent=q.tipo;

  const resolution=document.createElement('details');
  resolution.className='resolution';

  const summary=document.createElement('summary');
  summary.textContent='📘 Ver resolução';

  const explanation=document.createElement('p');
  explanation.textContent=RESOLUCOES[i] || 'Resolução não disponível.';

  resolution.append(summary,explanation);
  box.append(title,p,skill,resolution);
  details.append(box);
 });

 window.scrollTo({top:0,behavior:'smooth'});
}
