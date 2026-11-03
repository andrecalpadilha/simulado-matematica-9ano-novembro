const $=id=>document.getElementById(id);
let questions=[],answers=Array(32).fill(''),student={},idx=0,endAt=0,timer,submitting=false;
const letters=['A','B','C','D','E'];

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
 $('exam').classList.add('hidden');$('done').classList.remove('hidden');
 $('result').textContent='Você acertou '+hits+' de 32 questões. Sua nota: '+grade.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+' / 10,00.';
 $('receipt').textContent='Aluno: '+student.nome+' · '+student.turma+' · '+protocol;
 const details=$('details');details.replaceChildren();
 questions.forEach((q,i)=>{
  const correct=gabarito[i],marked=answers[i],box=document.createElement('div');box.className='review '+(marked===correct?'good':'bad');
  const title=document.createElement('strong');title.textContent='Questão '+q.n+' — '+(marked===correct?'Correta':'Incorreta');
  const p=document.createElement('p');p.textContent='Sua resposta: '+(marked||'Não respondida')+' · Gabarito: '+correct;
  const skill=document.createElement('small');skill.textContent=q.tipo;
  box.append(title,p,skill);details.append(box);
 });
 window.scrollTo({top:0,behavior:'smooth'});
}
