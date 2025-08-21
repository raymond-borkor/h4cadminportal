import { ReactNode } from 'react'
export function Field({label, hint, children}:{label:string, hint?:string, children:ReactNode}){ return (<label className="flex flex-col gap-1"><span className="label">{label}</span>{children}{hint ? <span className="text-xs text-slate-500">{hint}</span> : null}</label>) }
export function Toolbar({children}:{children:ReactNode}){ return <div className="flex flex-wrap gap-2 items-center mb-4">{children}</div> }
export function Card({title,children,footer}:{title?:string,children:ReactNode,footer?:ReactNode}){ return (<div className="card">{title ? <div className="mb-4 text-lg font-semibold">{title}</div> : null}<div>{children}</div>{footer ? <div className="mt-4 pt-4 border-t">{footer}</div> : null}</div>) }
