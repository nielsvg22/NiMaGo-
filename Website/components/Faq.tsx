export default function Faq({items}:{items:[string,string][]}){return <div className="faq-list">{items.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>}
