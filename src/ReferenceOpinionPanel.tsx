type Props = {
  title: string
  onEvent: (index: number) => void
}

const positive = 'M55 266 C95 266 115 248 145 224 C175 200 185 214 210 228 C235 242 255 245 285 213 C315 181 320 190 343 224 C366 258 380 264 430 266 C480 268 510 268 555 252 C600 236 610 244 650 248 C690 252 730 244 785 254 C840 264 840 266 875 268'
const neutral = 'M55 224 C95 224 120 208 150 180 C180 152 190 176 225 188 C260 200 275 190 305 177 C335 164 340 166 365 185 C390 204 405 205 445 194 C485 183 500 188 535 202 C570 216 595 205 640 192 C685 179 705 185 760 194 C815 203 830 202 875 212'
const negative = 'M55 170 C95 176 120 162 150 132 C180 102 180 80 210 62 C240 44 250 85 290 72 C330 59 330 58 365 87 C400 116 400 125 445 108 C490 91 485 78 525 92 C565 106 565 124 610 121 C655 118 655 113 700 117 C745 121 755 100 790 118 C825 136 835 114 875 125'
const positiveReverse = 'L875 268 C840 266 840 264 785 254 C730 244 690 252 650 248 C610 244 600 236 555 252 C510 268 480 268 430 266 C380 264 366 258 343 224 C320 190 315 181 285 213 C255 245 235 242 210 228 C185 214 175 200 145 224 C115 248 95 266 55 266 Z'
const neutralReverse = 'L875 212 C830 202 815 203 760 194 C705 185 685 179 640 192 C595 205 570 216 535 202 C500 188 485 183 445 194 C405 205 390 204 365 185 C340 166 335 164 305 177 C275 190 260 200 225 188 C190 176 180 152 150 180 C120 208 95 224 55 224 Z'

export default function FixedReferenceOpinionPanel({title,onEvent}:Props){
  const dates=[['06.01',105],['06.05',205],['06.09',305],['06.13',405],['06.17',505],['06.21',605],['06.25',705],['06.29',805]] as const
  const events=[
    {className:'eventOne',x:210,y:62,label:'新华社评论 | 传播加速',rectX:112},
    {className:'eventTwo',x:380,y:91,label:'抖音热榜第3 | 负向反超',rectX:286},
    {className:'eventThree',x:650,y:118,label:'揭阳公安通报 | 二次扩散',rectX:552}
  ]
  return <section className="referenceOpinionPanel">
    <h3>{title}</h3>
    <svg viewBox="0 0 900 340" preserveAspectRatio="none" aria-label={`${title}趋势图`}>
      <g className="referenceGrid">{[55,105,155,205,255].map((y,index)=><g key={y}><line x1="55" y1={y} x2="875" y2={y}/><text x="43" y={y+5}>{1000-index*200}</text></g>)}</g>
      <path className="referencePositiveArea" d={`${positive} L875 282 L55 282 Z`}/>
      <path className="referenceNeutralArea" d={`${neutral} ${positiveReverse}`}/>
      <path className="referenceNegativeArea" d={`${negative} ${neutralReverse}`}/>
      <path className="referencePositiveLine" d={positive}/>
      <path className="referenceNeutralLine" d={neutral}/>
      <path className="referenceNegativeLine" d={negative}/>
      <line className="referenceAxis" x1="55" y1="282" x2="875" y2="282"/>
      <g className="referenceDates">{dates.map(([date,x])=><g key={date}><line x1={x} y1="287" x2={x} y2="299"/><text x={x} y="320">{date}</text></g>)}</g>
      {events.map((item,index)=><g key={item.label} className={`referenceEvent ${item.className}`} onClick={event=>{event.stopPropagation();onEvent(index)}}>
        <line x1={item.x} y1={item.y} x2={item.x} y2={item.y-22}/>
        <ellipse cx={item.x} cy={item.y} rx="8" ry="5"/>
        <rect x={item.rectX} y={item.y-44} width="196" height="34" rx="8"/>
        <text x={item.x} y={item.y-22}>{item.label}</text>
      </g>)}
    </svg>
    <footer><span className="negative"><i/>负向</span><span className="neutral"><i/>正向</span><span className="positive"><i/>正向</span></footer>
  </section>
}
