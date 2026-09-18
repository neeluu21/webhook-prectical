// Terminal typing sequence
const lines = [
  {p:"$", t:"whoami", type:"cmd"},
  {p:">", t:"Neel Solanki", type:"big"},
  {p:"$", t:"cat role.txt", type:"cmd"},
  {p:">", t:"Aspiring DevOps &amp; Cloud Engineer", type:"role"},
  {p:"$", t:"cat location.txt", type:"cmd"},
  {p:">", t:"Ahmedabad, India — BSc.IT '26", type:"muted"},
];

const target = document.getElementById('typeTarget');
let li = 0, ci = 0;

function typeNext(){
  if(li >= lines.length){
    const chip = document.createElement('div');
    chip.className = 'status-chip';
    chip.innerHTML = '<span class="led"></span> status: open to DevOps internships';
    target.appendChild(chip);
    return;
  }
  const line = lines[li];
  const row = document.createElement('div');
  row.className = 'term-line';
  const promptSpan = document.createElement('span');
  promptSpan.className = 'prompt';
  promptSpan.textContent = line.p;
  const outSpan = document.createElement('span');
  outSpan.className = 'term-out ' + (line.type === 'cmd' ? '' : line.type);
  row.appendChild(promptSpan);
  row.appendChild(outSpan);
  target.appendChild(row);

  const full = line.t;
  ci = 0;
  const speed = line.type === 'cmd' ? 38 : 22;

  function step(){
    if(ci <= full.length){
      outSpan.innerHTML = full.slice(0, ci) + '<span class="cursor"></span>';
      ci++;
      setTimeout(step, speed);
    } else {
      outSpan.innerHTML = full;
      li++;
      setTimeout(typeNext, line.type === 'cmd' ? 120 : 260);
    }
  }
  step();
}
typeNext();

// Scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Active nav highlight
const navLinks = document.querySelectorAll('.navlinks a');
const secIds = ['home','skills','experience','projects','resume','contact'];
const secEls = secIds.map(id=>document.getElementById(id)).filter(Boolean);
const navObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(a=>a.style.color = '');
      const match = document.querySelector('.navlinks a[href="#'+e.target.id+'"]');
      if(match) match.style.color = 'var(--cyan)';
    }
  });
},{rootMargin:'-40% 0px -50% 0px'});
secEls.forEach(el=>navObserver.observe(el));

