import {useState} from 'react'

type Props={onEvent:(index:number)=>void}
type MetricKey='vv'|'comments'|'searches'|'shares'

const dates=['06.29','06.30','07.03','07.07','07.11','07.15','07.19','07.23','07.28']
const metrics:Record<MetricKey,{label:string,unit:string,max:number,values:number[],ticks:string[]}>= {
 vv:{label:'播放量',unit:'万',max:1000,values:[260,860,780,620,470,360,290,240,210,190,220,280,390,520,470,410,350],ticks:['1,000','750','500','250']},
 comments:{label:'评论量',unit:'万条',max:100,values:[22,68,76,64,51,43,37,32,29,27,31,39,52,61,57,49,42],ticks:['100','75','50','25']},
 searches:{label:'搜索量',unit:'万次',max:600,values:[180,486,438,340,268,220,184,156,138,126,148,196,286,412,384,318,270],ticks:['600','450','300','150']},
 shares:{label:'分享量',unit:'万次',max:80,values:[18,67,61,52,44,37,32,28,25,23,26,34,46,58,54,47,41],ticks:['80','60','40','20']}
}
const anomalies:[{index:number,label:string,detail:string,metric:MetricKey},{index:number,label:string,detail:string,metric:MetricKey},{index:number,label:string,detail:string,metric:MetricKey}]=[
 {index:0,label:'06-29 · 网传视频出现',detail:'相关视频开始在网络传播',metric:'vv'},
 {index:11,label:'07月中旬 · 线下声援出现',detail:'相关议题从线上讨论延伸到线下传播',metric:'vv'},
 {index:13,label:'07月下旬 · 境外报道扩散',detail:'境外报道和声援推动动物保护立法讨论',metric:'vv'}
]
const anomalyDetails=[
 {reason:'首批现场内容进入推荐与搬运链路，播放量快速抬升',evidence:'相关视频、搬运账号和本地资讯内容在同一时间窗口集中出现'},
 {reason:'线下声援素材被拍摄、转述并重新带回站内传播',evidence:'分享回流和议题解读内容共同形成第二阶段传播'},
 {reason:'境外报道与动物保护立法讨论带动议题跨圈扩散',evidence:'相关搜索、评论及二次创作在该时间窗口再次增长'}
]

function path(values:number[],max:number){
 const points=values.map((value,index)=>({x:index*100/(values.length-1),y:100-value/max*90}))
 return points.slice(0,-1).reduce((result,point,index)=>{const previous=points[Math.max(0,index-1)],next=points[index+1],after=points[Math.min(points.length-1,index+2)];const cp1x=point.x+(next.x-previous.x)/6,cp1y=point.y+(next.y-previous.y)/6,cp2x=next.x-(after.x-point.x)/6,cp2y=next.y-(after.y-point.y)/6;return `${result} C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${next.x} ${next.y}`},`M${points[0].x} ${points[0].y}`)
}

export default function PropagationOverview({onEvent}:Props){
 const [selectedMetrics,setSelectedMetrics]=useState<MetricKey[]>(['vv'])
 const [activeAnomaly,setActiveAnomaly]=useState<number|null>(null)
 const [hoveredTimeIndex,setHoveredTimeIndex]=useState<number|null>(null)
 const current=metrics[selectedMetrics[selectedMetrics.length-1]]
 const toggleMetric=(key:MetricKey)=>setSelectedMetrics(items=>items.includes(key)?items.length===1?items:items.filter(item=>item!==key):[...items,key])
 const activeItem=activeAnomaly===null?null:anomalies[activeAnomaly]
 const activeMetric=activeItem?metrics[activeItem.metric]:null
 const activeX=activeItem&&activeMetric?activeItem.index*100/(activeMetric.values.length-1):0
 const activeY=activeItem&&activeMetric?100-activeMetric.values[activeItem.index]/activeMetric.max*90:0
 const guideIndex=hoveredTimeIndex??activeItem?.index??null
 return <section className="propagationOverview">
  <div className="propagationChart" onMouseLeave={()=>setHoveredTimeIndex(null)}>
   <div className={`propagationAxis ${selectedMetrics[selectedMetrics.length-1]}`} aria-label={`${current.label}纵轴`}>{current.ticks.map(tick=><span key={tick}>{tick}</span>)}</div>
   <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="传播指标趋势">{[10,35,60,85].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y}/>)}{selectedMetrics.map(key=><path key={'area-'+key} className={`propagationArea ${key}`} d={`${path(metrics[key].values,metrics[key].max)} L100 100 L0 100 Z`}/>)}{selectedMetrics.map(key=><path key={key} className={`propagationLine ${key}`} d={path(metrics[key].values,metrics[key].max)}/>)}</svg>
   {guideIndex!==null&&<i className="anomalyHoverGuide" style={{left:`${guideIndex*100/(current.values.length-1)}%`}}/>}
   <div className="anomalyPoints">{anomalies.map((item,eventIndex)=>{if(!selectedMetrics.includes(item.metric))return null;const metricData=metrics[item.metric],value=metricData.values[item.index];return <button className={`${item.metric} point${eventIndex} ${activeAnomaly===eventIndex?'active':''}`} key={item.label} style={{left:`${item.index*100/(metricData.values.length-1)}%`,top:`${100-value/metricData.max*90}%`}} onMouseEnter={()=>setHoveredTimeIndex(item.index)} onFocus={()=>setHoveredTimeIndex(item.index)} onBlur={()=>setHoveredTimeIndex(null)} onClick={()=>{setActiveAnomaly(current=>current===eventIndex?null:eventIndex);onEvent(eventIndex)}} aria-label={`${item.label}，点击查看详情`}><i/><span><b>{item.label}</b><small>{item.detail}</small></span></button>})}</div>
   {activeItem&&<article className={`propagationDetailCard ${activeX<12?'edgeLeft':activeX>78?'edgeRight':'center'} ${activeY>52?'above':'below'}`} style={{left:`${activeX}%`,top:`${activeY}%`}} onClick={event=>event.stopPropagation()}><button aria-label="关闭详情" onClick={()=>setActiveAnomaly(null)}>×</button><span>异常详情 · {activeItem.label}</span><b>{activeItem.detail}</b><dl><div><dt>异常原因</dt><dd>{anomalyDetails[activeAnomaly!].reason}</dd></div><div><dt>判断依据</dt><dd>{anomalyDetails[activeAnomaly!].evidence}</dd></div></dl></article>}
  </div>
  <div className="propagationDates">{dates.map(date=><span key={date}>{date}</span>)}</div>
  <div className="metricLegend">{(Object.keys(metrics) as MetricKey[]).map(key=><button key={key} className={`${key} ${selectedMetrics.includes(key)?'selected':''}`} aria-pressed={selectedMetrics.includes(key)} onClick={()=>toggleMetric(key)}><i/>{metrics[key].label}</button>)}</div>
 </section>
}
