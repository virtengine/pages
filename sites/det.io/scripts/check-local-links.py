from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json
root=Path('dist'); errors=[];refs=0;frags=[]
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.ids=set()
 def handle_starttag(self,t,a):
  d=dict(a)
  if 'id' in d:self.ids.add(d['id'])
  for k in ('href','src','poster'):
   if k in d:self.refs.append((t,k,d[k]))
cache={}
for f in root.rglob('*.html'):
 h=Parser();h.feed(f.read_text(encoding='utf-8'));cache[f]=h
for f,h in cache.items():
 for t,k,u in h.refs:
  v=urlsplit(u)
  if v.scheme or v.netloc:continue
  if not v.path:target=f
  else:
   q=root/unquote(v.path.lstrip('/')) if v.path.startswith('/') else f.parent/unquote(v.path)
   target=next((x for x in [q,q.with_suffix('.html'),q/'index.html'] if x.is_file()),None)
  refs+=1
  if target is None:errors.append([str(f),u])
  elif v.fragment and target in cache and unquote(v.fragment) not in cache[target].ids:frags.append([str(f),u])
r={'pages':len(cache),'local_references_checked':refs,'missing_files':errors,'missing_fragments':frags}
Path('validation-links.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))

raise SystemExit(1 if errors or frags else 0)
