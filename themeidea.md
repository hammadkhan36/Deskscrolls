<!-- <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DeskScrolls — Editorial Terracotta</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--ink:#1A1A1A;--ink-muted:#6B6B6B;--paper:#FAFAF7;--surface:#FFFFFF;--hairline:#E2DDD3;--terracotta:#D97742;--terracotta-dark:#B85C2E;--terracotta-tint:#F5E6D3;--brand-accent:#BF6F4A;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:var(--paper);color:var(--ink);}
.mono{font-family:'JetBrains Mono',monospace;}
img{max-width:100%;display:block;}
.util{display:flex;justify-content:space-between;align-items:center;height:32px;border-bottom:1px solid var(--hairline);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-muted);padding:0 24px;}
.masthead{display:flex;justify-content:space-between;align-items:center;height:64px;border-bottom:2px solid var(--ink);padding:0 24px;}
.logo{font-size:22px;font-weight:600;letter-spacing:-0.5px;}
.logo em{font-family:'Playfair Display',serif;font-style:italic;color:var(--brand-accent);font-weight:600;font-size:24px;}
.nav{display:flex;gap:32px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;align-items:center;}
.nav a{color:var(--ink);text-decoration:none;}
.nav a:hover{color:var(--terracotta);}
.btn-dark{background:var(--ink);color:var(--paper);padding:8px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border:none;cursor:pointer;}
.btn-dark:hover{background:var(--terracotta);}
.hero{padding:80px 24px;text-align:center;border-bottom:2px solid var(--ink);}
.eyebrow{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--brand-accent);margin-bottom:24px;}
.hero h1{font-family:'Playfair Display',serif;font-weight:700;font-size:56px;line-height:1.05;margin-bottom:20px;}
.hero p{color:var(--ink-muted);font-size:17px;max-width:560px;margin:0 auto 32px;line-height:1.6;}
.form-row{display:flex;max-width:420px;margin:0 auto;border:2px solid var(--ink);}
.form-row input{flex:1;border:none;background:var(--surface);padding:14px 16px;font-size:14px;outline:none;}
.form-row button{border:none;background:var(--ink);color:var(--paper);padding:14px 24px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;cursor:pointer;}
.form-row button:hover{background:var(--terracotta);}
.joined{margin-top:16px;font-size:12px;color:var(--ink-muted);}
.section{padding:56px 24px;max-width:1100px;margin:0 auto;}
.section-head{display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:20px;border-bottom:2px solid var(--ink);margin-bottom:32px;}
.section-head h2{font-family:'Playfair Display',serif;font-size:32px;font-weight:700;}
.section-head .sub{color:var(--ink-muted);font-size:14px;margin-top:6px;}
.viewall{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink);text-decoration:none;}
.viewall:hover{color:var(--terracotta);}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hairline);border:1px solid var(--hairline);}
.card{background:var(--surface);}
.card-img{position:relative;aspect-ratio:4/3;background:var(--terracotta-tint);border-bottom:1px solid var(--hairline);overflow:hidden;}
.issue-badge{position:absolute;top:0;left:0;background:var(--ink);color:var(--paper);font-size:11px;padding:4px 10px;font-family:'JetBrains Mono',monospace;letter-spacing:.05em;}
.card-body{padding:16px;}
.card-body h3{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;margin-bottom:6px;}
.card-body p{font-size:13px;color:var(--ink-muted);line-height:1.4;}
.band{background:var(--surface);border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);padding:64px 24px;text-align:center;}
.band h2{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;margin:12px 0 8px;}
.band p.lead{color:var(--ink-muted);font-size:15px;margin-bottom:28px;}
.footer{border-top:2px solid var(--ink);padding:48px 24px 24px;max-width:1100px;margin:0 auto;}
.foot-top{display:flex;justify-content:space-between;gap:40px;padding-bottom:32px;border-bottom:1px solid var(--hairline);flex-wrap:wrap;}
.foot-bottom{display:flex;justify-content:space-between;padding-top:24px;font-size:12px;color:var(--ink-muted);flex-wrap:wrap;gap:16px;}
.foot-links{display:flex;gap:20px;}
.foot-links a{color:var(--ink-muted);text-decoration:none;}
.foot-links a:hover{color:var(--terracotta);}
@media(max-width:768px){.nav{display:none;}.grid{grid-template-columns:1fr;}.hero h1{font-size:36px;}}
</style>
</head>
<body>
<div class="util"><span class="mono">Est. 2020 — Real Workspaces, Weekly</span><span class="mono">Archive No.047</span></div>
<div class="masthead">
  <div class="logo">Desk<em>Scrolls</em></div>
  <nav class="nav"><a href="#">Setups ⌄</a><a href="#">Interviews</a><a href="#">About</a><a href="#">Submit</a></nav>
  <button class="btn-dark">Subscribe</button>
</div>
<section class="hero">
  <p class="eyebrow mono">— Vol. 01, Issued Weekly —</p>
  <h1>The workspaces of<br>modern creators.</h1>
  <p>Real desk setups from designers, founders, and builders — one new tour delivered every Saturday morning.</p>
  <div class="form-row"><input placeholder="your@email.com"/><button>Subscribe</button></div>
  <p class="joined mono">Joined by 21,000+ readers</p>
</section>
<section class="section">
  <div class="section-head">
    <div><p class="eyebrow mono" style="margin-bottom:8px;">Section</p><h2>Minimal Setups</h2><p class="sub">Clean, distraction-free workspaces from the archive</p></div>
    <a class="viewall" href="#">View All →</a>
  </div>
  <div class="grid">
    <div class="card"><div class="card-img"><span class="issue-badge">No.047</span><img src="https://picsum.photos/seed/desk1/600/450"/></div><div class="card-body"><h3>Maria Chen</h3><p>A Tokyo-based product designer's quiet corner of light wood and plants.</p></div></div>
    <div class="card"><div class="card-img"><span class="issue-badge">No.046</span><img src="https://picsum.photos/seed/desk2/600/450"/></div><div class="card-body"><h3>Tobias Reed</h3><p>Founder of a small studio, working from a converted attic space.</p></div></div>
    <div class="card"><div class="card-img"><span class="issue-badge">No.045</span><img src="https://picsum.photos/seed/desk3/600/450"/></div><div class="card-body"><h3>Amara Singh</h3><p>Developer and writer balancing two monitors and a typewriter.</p></div></div>
  </div>
</section>
<div class="band">
  <p class="eyebrow mono">Next Issue: Saturday</p>
  <h2>Like these setups? There are hundreds more.</h2>
  <p class="lead">Join 18,800+ creators — one new workspace every Saturday.</p>
  <div class="form-row" style="margin:0 auto;"><input placeholder="your@email.com"/><button>Subscribe</button></div>
</div>
<footer class="footer">
  <div class="foot-top">
    <div style="max-width:280px;"><div class="logo" style="margin-bottom:12px;">Desk<em>Scrolls</em></div><p style="color:var(--ink-muted);font-size:14px;line-height:1.6;">An archive of real desk setups — interviews, tours, and credits, published every Saturday.</p></div>
    <div style="max-width:320px;"><p class="eyebrow mono" style="margin-bottom:8px;">Subscribe</p><p style="color:var(--ink-muted);font-size:14px;">One new desk setup, delivered every Saturday morning.</p></div>
  </div>
  <div class="foot-bottom"><div class="foot-links"><a href="#">Setups</a><a href="#">About</a><a href="#">Submit</a><a href="#">RSS</a></div><span class="mono">© 2026 DeskScrolls</span></div>
</footer>
</body>
</html> -->





ya theme bi achi ha 