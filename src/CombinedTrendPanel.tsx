type Props={onEvent:(index:number)=>void}

const dates=['06.01','06.05','06.09','06.13','06.17','06.21','06.25','06.29']
const heat=[28,25,34,58,92,78,84,63,71,86,66,58,62,57,64,49,46]
const creator={negative:[22,23,24,28,31,30,27,25,23,21,20,18,17,16,15,14,13],neutral:[42,41,40,38,36,35,36,37,38,39,39,40,40,41,41,41,42]}
const consumer={negative:[18,20,23,29,38,46,54,61,58,52,48,43,39,35,31,27,24],neutral:[45,44,42,39,34,30,27,24,25,27,29,31,33,35,36,38,39]}

function line(values:number[],height:number){return values.map((value,index)=>`${index?'L':'M'}${index*100/(values.length-1)} ${height-value/100*height}`).join(' ')}
function band(top:number[],bottom:number[],height:number){const forward=top.map((value,index)=>`${index?'L':'M'}${index*100/(top.length-1)} ${value/100*height}`).join(' ');const reverse=bottom.map((value,index)=>`L${(bottom.length-1-index)*100/(bottom.length-1)} ${bottom[bottom.length-1-index]/100*height}`).join(' ');return `${forward} ${reverse} Z`}

function SentimentCompare({label,tone,creatorValues,consumerValues}:{label:string,tone:string,creatorValues:number[],consumerValues:number[]}){
 const max=Math.max(...creatorValues,...consumerValues)+8
 const creatorLine=creatorValues.map(value=>value/max*100),consumerLine=consumerValues.map(value=>value/max*100)
 return <div className={`sentimentCompare ${tone}`}><header><b>{label}</b><span>峰值差 {Math.max(...consumerValues)-Math.max(...creatorValues)}pp</span></header><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path className="differenceArea" d={band(creatorLine.map(value=>100-value),consumerLine.map(value=>100-value),100)}/><path className="creatorLine" d={line(creatorLine,100)}/><path className="consumerLine" d={line(consumerLine,100)}/></svg></div>
}

export default function CombinedTrendPanel({onEvent}:Props){
 const creatorPositive=creator.negative.map((value,index)=>100-value-creator.neutral[index])
 const consumerPositive=consumer.negative.map((value,index)=>100-value-consumer.neutral[index])
 return <section className="combinedTrendPanel">
  <header><div><b>每日新增播放 VV</b><span>按内容实际播放量统计，用于观察事件传播规模</span></div><div className="combinedLegend"><span className="negative"><i/>负向</span><span className="neutral"><i/>中立</span><span className="positive"><i/>正向</span></div></header>
  <div className="heatChart"><div className="heatAxis"><span>1,000万</span><span>750万</span><span>500万</span><span>250万</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="heatFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8068d9" stopOpacity=".25"/><stop offset="1" stopColor="#8068d9" stopOpacity=".03"/></linearGradient></defs>{[10,35,60,85].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y}/>)}<path className="heatArea" d={`${line(heat,100)} L100 100 L0 100 Z`}/><path className="heatLine" d={line(heat,100)}/></svg>
   <button className="eventTag first" onClick={()=>onEvent(0)}>新华社评论 · 传播加速</button><button className="eventTag second" onClick={()=>onEvent(1)}>热榜第 3 · 负向反超</button><button className="eventTag third" onClick={()=>onEvent(2)}>公安通报 · 二次扩散</button>
  </div>
  <div className="expressionCompare"><div className="compareTitle"><b>表达趋势对照</b><span><i className="creatorKey"/>创作者实线　<i className="consumerKey"/>消费者虚线</span></div><div className="sentimentComparisons"><SentimentCompare label="负向" tone="negative" creatorValues={creator.negative} consumerValues={consumer.negative}/><SentimentCompare label="中立" tone="neutral" creatorValues={creator.neutral} consumerValues={consumer.neutral}/><SentimentCompare label="正向" tone="positive" creatorValues={creatorPositive} consumerValues={consumerPositive}/></div><div className="divergenceTag">负向表达背离最显著 · +30pp</div></div>
  <div className="sharedDates">{dates.map(date=><span key={date}>{date}</span>)}</div>
 </section>
}
