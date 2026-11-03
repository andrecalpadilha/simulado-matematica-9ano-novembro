const $=id=>document.getElementById(id);
let questions=[],answers=Array(32).fill(''),student={},idx=0,endAt=0,timer,submitting=false;
const letters=['A','B','C','D','E'];
const RESOLUCOES = [
  // Questão 1
  'Usamos a fórmula dos juros compostos: M = C · (1 + i)^t. Substituindo: M = 2500 · (1,04)^3 = 2500 · 1,124864 = R$ 2.812,16.',

  // Questão 2
  'Pelo princípio fundamental da contagem, multiplicamos as possibilidades de cada escolha: 4 modelos de blusa × 3 modelos de calça × 2 tipos de sapato = 24 looks diferentes.',

  // Questão 3
  'Montamos o sistema: 5c + 3d = 28 e 2c + 4d = 28, em que c representa o preço da caneta e d o preço do caderno. Da segunda equação, c = 14 − 2d. Substituindo na primeira: 5(14 − 2d) + 3d = 28 → 70 − 10d + 3d = 28 → −7d = −42 → d = 6. Assim, c = 14 − 12 = 2. A caneta custa R$ 2,00 e o caderno R$ 6,00.',

  // Questão 4
  'Seja x = 0,666... Multiplicando por 10: 10x = 6,666... Subtraindo a primeira igualdade da segunda: 9x = 6. Portanto, x = 6/9 = 2/3.',

  // Questão 5
  'Se a largura é x, o comprimento é 2x + 4. Como a área é 48 m²: x(2x + 4) = 48 → 2x² + 4x − 48 = 0. Dividindo por 2: x² + 2x − 24 = 0 → (x + 6)(x − 4) = 0. Como a medida deve ser positiva, x = 4. O comprimento é 2 · 4 + 4 = 12 m.',

  // Questão 6
  'Decompondo 84 em fatores primos: 84 = 2 · 42 = 2 · 2 · 21 = 2² · 3 · 7.',

  // Questão 7
  'Calculamos 35% de 200: 0,35 · 200 = 70 jovens.',

  // Questão 8
  'O comprimento da circunferência é C = 2πr. Substituindo π = 22/7 e r = 35: C = 2 · (22/7) · 35 = 220 m.',

  // Questão 9
  'Calculamos o volume: V = 40 · 30 · 25 = 30.000 cm³. Como 1 litro corresponde a 1.000 cm³, temos 30.000 ÷ 1.000 = 30 litros.',

  // Questão 10
  'Organizando as idades em ordem crescente: 14, 14, 14, 15, 15, 16, 17. A moda é 14, pois aparece três vezes. A mediana é 15, pois ocupa a posição central (4ª posição) dos sete valores.',

  // Questão 11
  'Simplificamos os radicais: √50 = 5√2 e √32 = 4√2. Então: (5√2 · 4√2) ÷ √2 = 20 · 2 ÷ √2 = 40/√2. Racionalizando: 40√2/2 = 20√2.',

  // Questão 12
  'Primeiro, calculamos o desconto de 20%: 1.800 · 0,80 = R$ 1.440,00. Depois, aplicamos 15% de desconto sobre esse novo valor: 1.440 · 0,85 = R$ 1.224,00.',

  // Questão 13
  'O ângulo inscrito mede a metade do ângulo central que determina o mesmo arco. Assim: 96° ÷ 2 = 48°.',

  // Questão 14
  'O volume do cilindro é V = πr²h. Substituindo: V = 3,14 · (1,5)² · 4 = 3,14 · 2,25 · 4 = 28,26 m³.',

  // Questão 15
  'Quando duas retas paralelas são cortadas por uma transversal, os ângulos correspondentes possuem a mesma medida. Portanto, o ângulo correspondente também mede 125°.',

  // Questão 16
  'Reconhecemos uma diferença de dois quadrados: 81x² − 49 = (9x)² − 7². Aplicando a identidade a² − b² = (a − b)(a + b), obtemos (9x − 7)(9x + 7).',

  // Questão 17
  'A expressão x² + 10x + 25 é um trinômio quadrado perfeito. Como 25 = 5² e 10x = 2 · x · 5, podemos escrever: x² + 10x + 25 = (x + 5)².',

  // Questão 18
  'Para que a raiz quadrada tenha resultado real, o radicando deve ser maior ou igual a zero: h − 5t ≥ 0. Assim, −5t ≥ −h. Dividindo por −5 e invertendo o sinal: t ≤ h/5. Como t representa tempo, também consideramos t ≥ 0. Portanto, o domínio é 0 ≤ t ≤ h/5.',

  // Questão 19
  'O valor da corrida é formado por uma parte fixa de R$ 6,00 (bandeirada) e uma parte variável de R$ 2,80 por quilômetro. Logo, a função é V = 2,80d + 6.',

  // Questão 20
  'Aplicamos o Teorema de Pitágoras. A escada é a hipotenusa: h² + 8² = 17² → h² + 64 = 289 → h² = 225. Portanto, h = √225 = 15 m.',

  // Questão 21
  'Os números ímpares de 1 a 7 são 1, 3, 5 e 7. São 4 resultados favoráveis entre 7 possibilidades. Assim, P = 4/7.',

  // Questão 22
  'Pelo Teorema de Tales, os segmentos correspondentes são proporcionais: 6/9 = 12/x. Multiplicando em cruz: 6x = 108. Portanto, x = 18 cm.',

  // Questão 23
  'Observando a tabela, quando a quantidade aumenta de 5 peças, o custo aumenta R$ 50,00. Logo, cada peça acrescenta R$ 10,00 ao custo. A expressão é y = 10x + b. Usando o primeiro par (5, 80): 80 = 10 · 5 + b → b = 30. Portanto, y = 10x + 30.',

  // Questão 24
  'Desenvolvemos o quadrado da soma: (x + 6)² = x² + 12x + 36. Subtraindo x²: x² + 12x + 36 − x² = 12x + 36.',

  // Questão 25
  'Aplicamos o Teorema de Pitágoras: 15² + x² = 25² → 225 + x² = 625 → x² = 400. Portanto, x = √400 = 20 cm.',

  // Questão 26
  'Usamos a fórmula dos juros compostos: M = C · (1 + i)^t. Substituindo: M = 5000 · (1,03)² = 5000 · 1,0609 = R$ 5.304,50.',

  // Questão 27
  'Distribuímos o sinal negativo nos termos do segundo parêntese: 4x² − 5x + 7 − 2x² − 3x + 4. Agora agrupamos os termos semelhantes: (4x² − 2x²) + (−5x − 3x) + (7 + 4) = 2x² − 8x + 11.',

  // Questão 28
  'Somamos as partes da razão: 2 + 3 + 5 = 10 partes. Cada parte vale 1.200 ÷ 10 = R$ 120,00. O irmão que recebe a maior parte fica com 5 partes: 5 · 120 = R$ 600,00.',

  // Questão 29
  'A razão entre os lados do menor e do maior é 3/5. Como os triângulos são semelhantes, seus perímetros seguem a mesma razão: 36/ P = 3/5. Multiplicando em cruz: 3P = 180. Portanto, P = 60 cm.',

  // Questão 30
  'Sabemos que 1 m³ corresponde a 1.000 litros. Assim: 45 · 1.000 = 45.000 litros.',

  // Questão 31
  'A potência 10¹¹ indica que devemos deslocar a vírgula 11 casas para a direita: 1,5 × 100.000.000.000 = 150.000.000.000 metros.',

  // Questão 32
  'Somamos os livros emprestados nas quatro semanas: 48 + 62 + 55 + 71 = 236. Para calcular a média, dividimos pelo número de semanas: 236 ÷ 4 = 59 livros.'
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
