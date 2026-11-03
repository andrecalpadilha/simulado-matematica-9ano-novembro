const ABA = 'Respostas - Simulado 2';
const GABARITO = 'BDBBBACBCBABABCCABCBBCBABCADBCBB';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = JSON.parse(e.postData.contents);
    if (!p.nome || !['9º A','9º B'].includes(p.turma) ||
        !/^\\d{1,2}$/.test(String(p.numero)) ||
        !Array.isArray(p.respostas) || p.respostas.length !== 32 ||
        !p.respostas.every(x => x === '' || /^[A-E]$/.test(x))) {
      throw Error('Dados inválidos');
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(ABA) || ss.insertSheet(ABA);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data/hora','Protocolo','Nome','Número','Turma','Tempo (s)','Tempo esgotado',
        ...Array.from({length:32}, (_,i) => 'Q'+(i+1)), 'Acertos','Nota (0 a 10)']);
    }
    const hits = p.respostas.reduce((a,v,i) => a + (v === GABARITO[i] ? 1 : 0), 0);
    const nota = Number((hits * 10 / 32).toFixed(2));
    const protocolo = Utilities.getUuid();
    sheet.appendRow([new Date(), protocolo, safe(p.nome), Number(p.numero), p.turma,
      Number(p.tempoSegundos)||0, Boolean(p.finalizadoPorTempo), ...p.respostas, hits, nota]);
    return reply({ok:true, protocolo, acertos:hits, total:32, nota, gabarito:GABARITO});
  } catch (err) {
    return reply({ok:false, error:String(err.message)});
  } finally {
    lock.releaseLock();
  }
}
function safe(v) {
  const s = String(v).slice(0,120).trim();
  return /^[=+@\\-\\t\\r]/.test(s) ? "'"+s : s;
}
function reply(x) {
  return ContentService.createTextOutput(JSON.stringify(x))
    .setMimeType(ContentService.MimeType.JSON);
}
