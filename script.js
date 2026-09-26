"use strict";

// 日干は60日（十干と十二支の組み合わせ）で一巡します。
// UTCのグレゴリオ暦日をユリウス日番号 (JDN) に変換し、基準日との差を60で割った余りで求めます。
// 基準日: 2026-09-19 は丙申。60干支の番号（甲子=0）は32です。
// JDN 2461303 のこの基準から日数差を取るため、端末のタイムゾーンや夏時間の影響を受けません。
const REFERENCE_JDN = 2461303;
const REFERENCE_CYCLE_INDEX = 32;

const stems = [
  { char:"甲", reading:"こうぼく", yinYang:"陽", element:"木", image:"空へ伸びる大樹", file:"kouboku.jpg", personality:"まっすぐで向上心があり、自分の信念を大切にする人", talent:"目標に向かって成長し、人を支え導く力", strengths:"誠実、責任感、行動力、成長意欲", caution:"正しさにこだわりすぎると、柔軟に方向を変えることが難しくなることがある", hint:"大きな目標を小さな段階に分け、周囲の意見も取り入れながら育てていく", colors:["#6f946c","#e8f1df"] },
  { char:"乙", reading:"おつぼく", yinYang:"陰", element:"木", image:"草花やつる植物", file:"otsuboku.jpg", personality:"やわらかく協調性があり、環境に合わせながら成長できる人", talent:"人とのご縁をつなぎ、調和を生み出す力", strengths:"柔軟性、親しみやすさ、美的感覚、粘り強さ", caution:"周囲を優先しすぎて、自分の気持ちを後回しにすることがある", hint:"人とのつながりを大切にしながら、自分の希望も言葉にする", colors:["#719d75","#e8f3e6"] },
  { char:"丙", reading:"へいか", yinYang:"陽", element:"火", image:"明るく輝く太陽", file:"heika.jpg", personality:"明るく開放的で、周囲を元気にする人", talent:"自分の光で人を照らし、物事を広く伝える力", strengths:"情熱、明るさ、表現力、行動力", caution:"気持ちが先に進み、細かな確認を忘れることがある", hint:"持ち前の明るさに丁寧な準備を加えると、魅力がさらに伝わる", colors:["#bd6d5c","#fae9e3"] },
  { char:"丁", reading:"ていか", yinYang:"陰", element:"火", image:"ろうそくや灯火", file:"teika.jpg", personality:"繊細で温かく、人の心にそっと寄り添える人", talent:"知性や感性を活かし、人の心に希望の灯をともす力", strengths:"思いやり、洞察力、集中力、感受性", caution:"小さなことを深く考え、心を疲れさせてしまうことがある", hint:"静かに集中できる時間と、安心して話せる場所を大切にする", colors:["#c47777","#f9e8e8"] },
  { char:"戊", reading:"ぼど", yinYang:"陽", element:"土", image:"大きな山や大地", file:"bodo.jpg", personality:"落ち着きがあり、どっしりと人を受け止める人", talent:"人や物事の土台をつくり、安心感を与える力", strengths:"信頼感、包容力、安定感、責任感", caution:"一度決めたことを変えるまでに時間がかかることがある", hint:"守るものと変えてよいものを分け、小さな変化を受け入れる", colors:["#9b8051","#f5eddc"] },
  { char:"己", reading:"きど", yinYang:"陰", element:"土", image:"作物を育てる田畑", file:"kido.jpg", personality:"面倒見がよく、細やかに人を育てる人", talent:"経験や知識を蓄え、相手に合わせて育む力", strengths:"実務力、忍耐力、気配り、育成力", caution:"心配ごとを抱え込み、世話をしすぎてしまうことがある", hint:"人を支えるだけでなく、自分自身をいたわる時間も確保する", colors:["#a68b55","#f6efdc"] },
  { char:"庚", reading:"こうきん", yinYang:"陽", element:"金", image:"鉄や刀、磨かれる原石", file:"koukin.jpg", personality:"決断力と正義感があり、行動によって道を切り開く人", talent:"困難を乗り越え、不要なものを整理して改革する力", strengths:"決断力、実行力、勇気、潔さ", caution:"結論を急ぐと、言葉が強く伝わることがある", hint:"決断する前に相手の事情を一度受け止めると、強さが信頼につながる", colors:["#758487","#edf0ee"] },
  { char:"辛", reading:"しんきん", yinYang:"陰", element:"金", image:"美しく磨かれた宝石", file:"shinkin.jpg", personality:"繊細で美意識が高く、自分の品格を大切にする人", talent:"物事の価値を見極め、磨き上げて魅力を引き出す力", strengths:"美的感覚、観察力、気品、専門性", caution:"理想が高く、自分や周囲に厳しくなることがある", hint:"完成度だけでなく、そこまで積み重ねた過程も認める", colors:["#8a8694","#f1eff4"] },
  { char:"壬", reading:"じんすい", yinYang:"陽", element:"水", image:"海や大河", file:"jinsui.jpg", personality:"自由な発想と広い視野を持ち、変化を楽しめる人", talent:"多くの情報や人をつなぎ、大きな流れをつくる力", strengths:"柔軟性、知恵、行動範囲の広さ、包容力", caution:"興味が広がりすぎると、目的を見失うことがある", hint:"自由な発想を活かしながら、今取り組むことを一つ決める", colors:["#467a96","#e2f0f4"] },
  { char:"癸", reading:"きすい", yinYang:"陰", element:"水", image:"雨や露、地下水", file:"kisui.jpg", personality:"静かな知性と感受性を持ち、細やかな変化に気づける人", talent:"知識や思いやりを少しずつ届け、人や物事を潤す力", strengths:"洞察力、学習力、優しさ、適応力", caution:"周囲の感情を受け取りすぎて、迷いや不安が増えることがある", hint:"情報を集める時間と、考えを整理して決める時間を分ける", colors:["#527c9e","#e6f0f6"] }
];

const form = document.querySelector("#birth-form");
const input = document.querySelector("#birthdate");
const error = document.querySelector("#error-message");
const result = document.querySelector("#result");
const today = new Date();
const maxDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
input.max = maxDate;

function jdnFromIsoDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}
function getStem(iso) {
  const index = ((REFERENCE_CYCLE_INDEX + jdnFromIsoDate(iso) - REFERENCE_JDN) % 60 + 60) % 60;
  return stems[index % 10];
}
function validDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y,m,d] = iso.split("-").map(Number);
  const test = new Date(Date.UTC(y,m-1,d));
  return test.getUTCFullYear() === y && test.getUTCMonth() === m-1 && test.getUTCDate() === d;
}
function showResult(stem) {
  const root = document.querySelector("#result-card");
  root.style.setProperty("--element-color", stem.colors[0]); root.style.setProperty("--element-deep", stem.colors[0]); root.style.setProperty("--element-pale", stem.colors[1]);
  document.querySelector("#stem-character").textContent = stem.char;
  document.querySelector("#stem-reading").textContent = stem.reading;
  document.querySelector("#element-badge").textContent = `${stem.yinYang}の${stem.element}`;
  document.querySelector("#nature-image").textContent = `自然のイメージ：${stem.image}`;
  [["#personality","personality"],["#talent","talent"],["#strengths","strengths"],["#caution","caution"],["#hint","hint"]].forEach(([id,key]) => document.querySelector(id).textContent = stem[key]);
  const image = document.querySelector("#stem-image"); const fallback = document.querySelector("#image-fallback");
  fallback.textContent = stem.char; fallback.classList.add("show"); image.alt = `${stem.char}（${stem.reading}）：${stem.image}`; image.src = `images/${stem.file}`;
  image.onload = () => fallback.classList.remove("show"); image.onerror = () => fallback.classList.add("show");
  result.hidden = false; result.scrollIntoView({ behavior:"smooth", block:"start" });
}
form.addEventListener("submit", (event) => {
  event.preventDefault(); error.textContent = "";
  const value = input.value;
  if (!value) error.textContent = "生年月日を入力してください。";
  else if (!validDate(value)) error.textContent = "正しい日付を入力してください。";
  else if (value < "1900-01-01") error.textContent = "1900年1月1日以降の日付を入力してください。";
  else if (value > maxDate) error.textContent = "未来の日付は入力できません。";
  else showResult(getStem(value));
});
document.querySelector("#reset-button").addEventListener("click", () => { result.hidden = true; input.focus(); });
document.querySelector("#copy-button").addEventListener("click", async () => {
  const s = getStem(input.value); const text = `わたしの十干タイプ：${s.char}（${s.reading}）／${s.yinYang}の${s.element}\n自然のイメージ：${s.image}\n基本的な性質：${s.personality}\n生まれ持った素質：${s.talent}\n長所：${s.strengths}\n気をつけたい傾向：${s.caution}\n自分らしさを活かすヒント：${s.hint}`;
  try { await navigator.clipboard.writeText(text); document.querySelector("#copy-message").textContent = "結果をコピーしました。"; }
  catch { document.querySelector("#copy-message").textContent = "コピーできませんでした。内容を選択してコピーしてください。"; }
});

// 確認例: 2026-09-18=乙未、2026-09-19=丙申、2026-09-20=丁酉。
console.assert(getStem("2026-09-19").char === "丙", "2026-09-19 should be 丙");
