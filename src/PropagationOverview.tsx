import {useState,type ReactNode} from 'react'

type Props={onEvent:(index:number)=>void,lifecycle?:ReactNode}
type MetricKey='videos'|'vv'|'comments'|'likes'|'accounts'

const dates=[
 {label:'06.29',index:0},{label:'06.30',index:1},{label:'07.03',index:3},
 {label:'07.07',index:5},{label:'07.11',index:7},{label:'07.15',index:9},
 {label:'07.19',index:11},{label:'07.23',index:13},{label:'07.28',index:16}
]
const metrics:Record<MetricKey,{label:string,unit:string,max:number,values:number[],ticks:string[]}>= {
 videos:{label:'视频量',unit:'条',max:500,values:[86,268,312,286,241,196,164,142,128,117,136,173,226,294,271,238,204],ticks:['500','375','250','125']},
 vv:{label:'VV 量',unit:'万',max:1000,values:[260,860,780,620,470,360,290,240,210,190,220,280,390,520,470,410,350],ticks:['1,000','750','500','250']},
 comments:{label:'评论量',unit:'万条',max:100,values:[22,68,76,64,51,43,37,32,29,27,31,39,52,61,57,49,42],ticks:['100','75','50','25']},
 likes:{label:'点赞量',unit:'万次',max:300,values:[64,214,248,221,186,157,139,124,116,108,122,151,189,236,218,192,168],ticks:['300','225','150','75']},
 accounts:{label:'关联账号',unit:'个',max:1200,values:[238,764,936,841,708,614,528,472,438,411,456,542,684,826,779,701,623],ticks:['1,200','900','600','300']}
}
const anomalies:[{index:number,label:string,detail:string,metric:MetricKey},{index:number,label:string,detail:string,metric:MetricKey},{index:number,label:string,detail:string,metric:MetricKey}]=[
 {index:0,label:'06-29 · 网传视频出现',detail:'首批相关视频开始传播',metric:'vv'},
 {index:11,label:'07月中旬 · 线下声援出现',detail:'线下声援带动议题复燃',metric:'vv'},
 {index:13,label:'07月下旬 · 境外报道扩散',detail:'境外报道推动跨圈扩散',metric:'vv'}
]
const anomalyDetails=[
 {reason:'首批现场内容进入推荐与搬运链路，多项传播指标同步起量',evidence:[['VV','260万'],['视频量','86条'],['评论量','22万'],['关联账号','238个']]},
 {reason:'线下声援素材被拍摄、转述并重新带回站内传播',evidence:[['VV','环比 +27%'],['视频量','环比 +27%'],['评论量','环比 +26%'],['关联账号','环比 +19%']]},
 {reason:'境外报道与动物保护立法讨论带动议题跨圈扩散',evidence:[['VV','环比 +33%'],['视频量','环比 +30%'],['评论量','环比 +17%'],['关联账号','环比 +21%']]}
]

function path(values:number[],max:number){
 const points=values.map((value,index)=>({x:index*100/(values.length-1),y:100-value/max*90}))
 return points.slice(0,-1).reduce((result,point,index)=>{const previous=points[Math.max(0,index-1)],next=points[index+1],after=points[Math.min(points.length-1,index+2)];const cp1x=point.x+(next.x-previous.x)/6,cp1y=point.y+(next.y-previous.y)/6,cp2x=next.x-(after.x-point.x)/6,cp2y=next.y-(after.y-point.y)/6;return `${result} C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${next.x} ${next.y}`},`M${points[0].x} ${points[0].y}`)
}

export default function PropagationOverview({onEvent,lifecycle}:Props){
 const [selectedMetrics,setSelectedMetrics]=useState<MetricKey[]>(['vv'])
 const [activeAnomaly,setActiveAnomaly]=useState<number|null>(null)
 const [hoveredTimeIndex,setHoveredTimeIndex]=useState<number|null>(null)
 const current=metrics[selectedMetrics[selectedMetrics.length-1]]
 const toggleMetric=(key:MetricKey)=>setSelectedMetrics(items=>items.includes(key)?items.length===1?items:items.filter(item=>item!==key):[...items,key])
 const activeItem=activeAnomaly===null?null:anomalies[activeAnomaly]
 const activeMetric=activeItem?metrics[activeItem.metric]:null
 const activeX=activeItem&&activeMetric?activeItem.index*100/(activeMetric.values.length-1):0
 const guideIndex=hoveredTimeIndex??activeItem?.index??null
 return <section className="propagationOverview">
  <div className="propagationChart" onMouseLeave={()=>setHoveredTimeIndex(null)}>
   <div className={`propagationAxis ${selectedMetrics[selectedMetrics.length-1]}`} aria-label={`${current.label}纵轴`}>{current.ticks.map(tick=><span key={tick}>{tick}</span>)}</div>
   <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="传播指标趋势">{[10,35,60,85].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y}/>)}{selectedMetrics.map(key=><path key={'area-'+key} className={`propagationArea ${key}`} d={`${path(metrics[key].values,metrics[key].max)} L100 100 L0 100 Z`}/>)}{selectedMetrics.map(key=><path key={key} className={`propagationLine ${key}`} d={path(metrics[key].values,metrics[key].max)}/>)}</svg>
   {guideIndex!==null&&<i className="anomalyHoverGuide" style={{left:`${guideIndex*100/(current.values.length-1)}%`}}/>}
   <div className="anomalyPoints" aria-label="异常时间节点">{anomalies.map((item,eventIndex)=>{const x=item.index*100/(metrics[item.metric].values.length-1);return <button className={`timeAnomaly point${eventIndex} ${activeAnomaly===eventIndex?'active':''}`} key={item.label} style={{left:`${x}%`}} onMouseEnter={()=>setHoveredTimeIndex(item.index)} onFocus={()=>setHoveredTimeIndex(item.index)} onBlur={()=>setHoveredTimeIndex(null)} onClick={()=>{setActiveAnomaly(current=>current===eventIndex?null:eventIndex);onEvent(eventIndex)}} aria-label={`${item.label}，点击查看多指标变化证据`}><i/><span><b>{item.detail}</b></span></button>})}</div>
   {activeItem&&<article className={`propagationDetailCard timelineEvidence ${activeX<12?'edgeLeft':activeX>78?'edgeRight':'center'} above`} style={{left:`${activeX}%`,top:'100%'}} onClick={event=>event.stopPropagation()}><button aria-label="关闭详情" onClick={()=>setActiveAnomaly(null)}>×</button><span>异常时间节点 · {activeItem.label}</span><b>{activeItem.detail}</b><dl><div><dt>节点成因</dt><dd>{anomalyDetails[activeAnomaly!].reason}</dd></div></dl><div className="multiMetricEvidence"><strong>多指标变化证据</strong>{anomalyDetails[activeAnomaly!].evidence.map(([label,value])=><p key={label}><span>{label}</span><b>{value}</b></p>)}</div></article>}
  </div>
  <div className="propagationDates">{dates.map((date,dateIndex)=><span className={dateIndex===0?'first':dateIndex===dates.length-1?'last':''} style={{left:`${date.index*100/(metrics.vv.values.length-1)}%`}} key={date.label}>{date.label}</span>)}</div>
  {lifecycle}
  <div className="metricLegend">{(Object.keys(metrics) as MetricKey[]).map(key=><button key={key} className={`${key} ${selectedMetrics.includes(key)?'selected':''}`} aria-pressed={selectedMetrics.includes(key)} onClick={()=>toggleMetric(key)}><i/>{metrics[key].label}</button>)}</div>
 </section>
}
