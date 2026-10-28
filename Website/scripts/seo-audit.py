# Read-only crawl: sitemap + openbare interne GET-links; geen formulieren of privé-routes.
import urllib.request,urllib.parse,urllib.error,json,re,hashlib,concurrent.futures,time,collections,os
from html.parser import HTMLParser
import sys
base=(sys.argv[1] if len(sys.argv)>1 else 'https://nimagodigital.nl').rstrip('/')
outdir=sys.argv[2] if len(sys.argv)>2 else '/tmp/nimago-seo-audit'
os.makedirs(outdir,exist_ok=True)
for name in ['sitemap.xml','robots.txt']:
 with urllib.request.urlopen(base+'/'+name,timeout=25) as response: PathData=response.read()
 open(os.path.join(outdir,name),'wb').write(PathData)
class Page(HTMLParser):
 def __init__(self):super().__init__();self.title='';self.h1=[];self.headings=[];self.meta={};self.links=[];self.images=[];self.ids=set();self.ld=[];self.lang='';self.capture=None;self.buf='';self.inld=False;self.ldbuf='';self.ignore=0;self.text=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='html':self.lang=a.get('lang','')
  if a.get('id'):self.ids.add(a['id'])
  if t=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if t=='link' and a.get('rel') in ['canonical','alternate']:self.links.append({'tag':'link',**a})
  if t=='a' and a.get('href'):self.links.append({'tag':'a',**a})
  if t=='img':self.images.append(a)
  if t in ['title','h1','h2','h3','h4','h5','h6']:self.capture=t;self.buf=''
  if t=='script' and a.get('type')=='application/ld+json':self.inld=True;self.ldbuf=''
  if t in ['script','style']:self.ignore+=1
 def handle_data(self,x):
  if self.capture:self.buf+=x
  if self.inld:self.ldbuf+=x
  if not self.ignore:self.text.append(x)
 def handle_endtag(self,t):
  if t==self.capture:
   text=' '.join(self.buf.split())
   if t=='title':self.title=text
   else:self.headings.append((t,text))
   if t=='h1':self.h1.append(text)
   self.capture=None
  if t=='script' and self.inld:
   try:self.ld.append(json.loads(self.ldbuf))
   except:self.ld.append({'error':'invalid json'})
   self.inld=False
  if t in ['script','style']:self.ignore=max(0,self.ignore-1)
def fetch(path):
 t=time.time()
 try:
  r=urllib.request.urlopen(urllib.request.Request(base+path,headers={'User-Agent':'NiMaGoAudit/1.0'}),timeout=25);raw=r.read();p=Page();p.feed(raw.decode('utf8','replace'));filename=(path.strip('/').replace('/','__')or'home')+'.html';open(os.path.join(outdir,filename),'wb').write(raw)
  return {'path':path,'status':r.status,'final':r.url,'title':p.title,'meta':p.meta,'h1':p.h1,'headings':p.headings,'links':p.links,'images':p.images,'ids':sorted(p.ids),'ld':p.ld,'lang':p.lang,'bytes':len(raw),'seconds':round(time.time()-t,3),'text_words':len(' '.join(p.text).split()),'text_hash':hashlib.sha256(' '.join(p.text).encode()).hexdigest(),'headers':dict(r.headers)}
 except urllib.error.HTTPError as e:return {'path':path,'status':e.code,'error':str(e)}
 except Exception as e:return {'path':path,'status':0,'error':str(e)}
sm=open(os.path.join(outdir,'sitemap.xml')).read();todo=set(urllib.parse.urlsplit(u).path for u in re.findall(r'<loc>(.*?)</loc>',sm));todo.add('/');seen={};asset=re.compile(r'\.(?:png|jpg|jpeg|webp|svg|pdf|ico|xml|txt|css|js|woff2?|zip|json)$',re.I)
while todo:
 batch=sorted(todo-set(seen));todo=set()
 if not batch:break
 with concurrent.futures.ThreadPoolExecutor(max_workers=4)as ex:
  for p in ex.map(fetch,batch):
   seen[p['path']]=p
   for a in p.get('links',[]):
    if a['tag']!='a':continue
    u=urllib.parse.urlsplit(urllib.parse.urljoin(base+p['path'],a.get('href','')))
    if u.netloc!=urllib.parse.urlsplit(base).netloc or u.scheme not in ['https','http'] or u.path.startswith(('/admin','/account','/api','/og','/_next','/logos','/images')) or asset.search(u.path):continue
    path=u.path.rstrip('/')or'/'
    if path not in seen:todo.add(path)
open(os.path.join(outdir,'crawl.json'),'w').write(json.dumps(list(seen.values()),ensure_ascii=False,indent=2))
print('Pages',len(seen),'status',dict(collections.Counter(p['status']for p in seen.values())))
for p in seen.values():
 if p['status']!=200 or len(p.get('h1',[]))!=1 or 'noindex'in p.get('meta',{}).get('robots',''):print(p['path'],p['status'],'h1',p.get('h1'),p.get('meta',{}).get('robots'))
