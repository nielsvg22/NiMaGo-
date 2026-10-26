import Database from 'better-sqlite3';import fs from 'node:fs';import path from 'node:path';
/** SQLite-database. Op Coolify moet DATA_DIR naar een persistent volume wijzen (bv. /data). */
const dir=process.env.DATA_DIR||path.join(process.cwd(),'.data');
let _db:Database.Database|null=null;
export function db():Database.Database{
  if(_db)return _db;
  fs.mkdirSync(dir,{recursive:true});
  const d=new Database(path.join(dir,'nimago.db'));
  d.pragma('journal_mode = WAL');d.pragma('foreign_keys = ON');
  d.exec(`
  CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL DEFAULT '');
  CREATE TABLE IF NOT EXISTS customers(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,contact TEXT NOT NULL DEFAULT '',email TEXT NOT NULL DEFAULT '',address TEXT NOT NULL DEFAULT '',postcode TEXT NOT NULL DEFAULT '',city TEXT NOT NULL DEFAULT '',country TEXT NOT NULL DEFAULT 'Nederland',kvk TEXT NOT NULL DEFAULT '',vat_id TEXT NOT NULL DEFAULT '',note TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS invoices(id INTEGER PRIMARY KEY AUTOINCREMENT,number TEXT UNIQUE,customer_id INTEGER NOT NULL REFERENCES customers(id),status TEXT NOT NULL DEFAULT 'concept',issue_date TEXT NOT NULL,due_date TEXT NOT NULL,reference TEXT NOT NULL DEFAULT '',notes TEXT NOT NULL DEFAULT '',vat_reverse INTEGER NOT NULL DEFAULT 0,paid_at TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS invoice_lines(id INTEGER PRIMARY KEY AUTOINCREMENT,invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,position INTEGER NOT NULL DEFAULT 0,description TEXT NOT NULL,quantity REAL NOT NULL DEFAULT 1,unit_cents INTEGER NOT NULL DEFAULT 0,vat_rate INTEGER NOT NULL DEFAULT 21);
  CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT NOT NULL,company TEXT NOT NULL DEFAULT '',service TEXT NOT NULL DEFAULT '',message TEXT NOT NULL,is_read INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT (datetime('now')));
  `);
  _db=d;return d;
}
export function getSetting(key:string,fallback=''):string{const r=db().prepare('SELECT value FROM settings WHERE key=?').get(key) as {value:string}|undefined;return r?r.value:fallback}
export function setSetting(key:string,value:string){db().prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,value)}
export const SETTING_KEYS=['company_name','legal_form','address','postcode','city','country','email','phone','website','kvk','vat_id','iban','bic','payment_days','invoice_prefix','footer_note'] as const;
export type SettingKey=typeof SETTING_KEYS[number];
export const SETTING_DEFAULTS:Record<SettingKey,string>={company_name:'NiMaGo',legal_form:'',address:'',postcode:'',city:'',country:'Nederland',email:'',phone:'',website:'',kvk:'',vat_id:'',iban:'',bic:'',payment_days:'14',invoice_prefix:'NM-',footer_note:'Wij verzoeken je het bedrag binnen de betaaltermijn over te maken onder vermelding van het factuurnummer.'};
export function allSettings():Record<SettingKey,string>{const out={...SETTING_DEFAULTS};const rows=db().prepare('SELECT key,value FROM settings').all() as {key:string;value:string}[];for(const r of rows)if((SETTING_KEYS as readonly string[]).includes(r.key))out[r.key as SettingKey]=r.value;return out}
