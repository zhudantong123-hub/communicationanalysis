import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ChevronDown, ChevronRight, Clock3, Eye, FileText, Flag, GitBranch, Headphones, HelpCircle, MessageCircle, MonitorUp, Network, Pause, Play, RotateCcw, ScanLine, Search, ShieldAlert, Sparkles, TriangleAlert, Users, X, Zap, ZoomIn, ZoomOut } from 'lucide-react'
import './styles.css'
import './tuning.css'

const videos=[
 {id:'v0',author:'揭阳现场',handle:'@jieyang-live',title:'揭阳一段疑似虐狗视频引发关注，涉事情况待核实',time:'02-05 15:45',play:'328.6万',interaction:'12.8万',tone:'现场视频',grade:'首发',c:'violet'},
 {id:'v1',author:'民生视角',handle:'@minsheng-view',title:'涉事者是否构成虐待动物？事件责任如何认定',time:'02-05 16:12',play:'156.3万',interaction:'6.2万',tone:'事件解读',grade:'相似扩散',c:'orange'},
 {id:'v2',author:'动物保护观察',handle:'@animal-care',title:'从揭阳虐狗事件看动物保护立法与处置边界',time:'02-05 18:27',play:'97.1万',interaction:'4.7万',tone:'争议解读',grade:'相似扩散',c:'blue'},
 {id:'v3',author:'城市观察站',handle:'@city-watch',title:'多平台搬运揭阳虐狗视频，部分细节仍待核验',time:'02-06 09:13',play:'68.4万',interaction:'2.1万',tone:'信息搬运',grade:'二次扩散',c:'green'},
 {id:'v4',author:'舆情观察室',handle:'@opinion-watch',title:'“自己爬不上去，也下不来”：热梗背后的权力想象',time:'02-06 10:40',play:'51.6万',interaction:'1.9万',tone:'观点聚合',grade:'二次扩散',c:'pink'}
]
const accounts=[
 {id:'a0',name:'时事显微镜',handle:'@current-lens',risk:'需关注',fans:'42.6万',auth:'时事作者',c:'violet'},
 {id:'a1',name:'民生视角',handle:'@minsheng-view',risk:'中风险',fans:'19.8万',auth:'优质作者',c:'orange'},
 {id:'a2',name:'法度说事',handle:'@law-talk',risk:'低风险',fans:'80.2万',auth:'法律作者',c:'blue'},
 {id:'a3',name:'城市热线',handle:'@city-hotline',risk:'低风险',fans:'12.1万',auth:'本地资讯',c:'green'},
 {id:'a4',name:'热点播报台',handle:'@hot-news',risk:'需关注',fans:'8.3万',auth:'普通用户',c:'pink'},
 {id:'a5',name:'夜航笔记',handle:'@night-note',risk:'需关注',fans:'5.6万',auth:'普通用户',c:'cyan'}
]
function AIChatWorkspace({onOpenReport,onGenerate,reportTitle,collapsed,reference,onClearReference}:{onOpenReport:()=>void,onGenerate:(event:string)=>void,reportTitle:string,collapsed:boolean,reference:any,onClearReference:()=>void}){
 const [input,setInput]=useState(''),[messages,setMessages]=useState<any[]>([{role:'assistant',text:'你好，我是舆情分析助手。输入一个事件、关键词或链接，我会生成传播态势、视频链路、账号关系和风险研判报告。'}])
 const submit=(text=input)=>{const value=text.trim();if(!value&&!reference)return;const prompt=value||`分析引用视频：${reference.title}`;setMessages(current=>[...current,{role:'user',text:prompt,attachment:reference},{role:'assistant',text:'已识别事件主体和传播语境，完成多源内容聚合、观点聚类与账号关系分析。事件报告已生成在右侧产物区。',report:true}]);setInput('');onClearReference();onGenerate(prompt)}
 if(collapsed)return <aside className="aiChatPanel chatCollapsed" aria-hidden="true"/>
 return <aside className="aiChatPanel">
  <div className="chatMessages">{messages.map((message,index)=><div key={index} className={'chatMessage '+message.role}><i>{message.role==='assistant'?<Sparkles size={12}/>:'你'}</i><div>{message.attachment&&<div className={'chatVideoReference ref'+message.attachment.coverIndex}><span/><div><small>引用视频</small><b>{message.attachment.title}</b><em>{message.attachment.author}</em></div></div>}<p>{message.text}</p>{message.report&&<button onClick={onOpenReport}>查看完整事件报告 <ChevronRight size={12}/></button>}</div></div>)}</div>
  <div className="chatSuggestions"><span>快捷分析</span><button className="currentReportShortcut" onClick={onOpenReport}><FileText size={12}/>打开“{reportTitle}”报告</button>{['查找传播源头与关键账号','识别高风险观点和异常扩散'].map(item=><button key={item} onClick={()=>submit(item)}>{item}</button>)}</div>
  <form className="chatComposer" onSubmit={event=>{event.preventDefault();submit()}}>{reference&&<div className={'chatPendingReference ref'+reference.coverIndex}><span/><div><small>已引用视频</small><b>{reference.title}</b></div><button type="button" onClick={onClearReference} aria-label="移除引用"><X size={12}/></button></div>}<textarea value={input} onChange={event=>setInput(event.target.value)} placeholder={reference?'针对该视频继续提问…':'输入事件、关键词或粘贴内容链接…'} rows={3}/><footer><span>AI 生成内容仅供研判参考</span><button type="submit" disabled={!input.trim()&&!reference}>↑</button></footer></form>
 </aside>
}
function App(){
 const [tab,setTab]=useState('传播数据统计'),[selected,setSelected]=useState({type:'video',item:videos[0]}),[open,setOpen]=useState<string[]>(['feed']),[highlight,setHighlight]=useState(false)
 const [detailOpen,setDetailOpen]=useState(false)
 const [reportEvent,setReportEvent]=useState('揭阳虐狗事件')
 const [artifactOpen,setArtifactOpen]=useState(true)
 const [chatCollapsed,setChatCollapsed]=useState(false)
 const [chatReference,setChatReference]=useState<any>(null)
 const [activeOpinion,setActiveOpinion]=useState<string|null>(null)
 const select=(type,item)=>{setSelected({type,item});setDetailOpen(true)}
 const focusOpinion=(opinion:string|null)=>{
  setActiveOpinion(opinion);setTab('传播数据统计')
 }
 const sideItems:any[]=[[FileText,'舆情'],[Flag,'指令'],[Zap,'应急'],[ScanLine,'巡检'],[TriangleAlert,'举报'],[Search,'搜索']]
 return <div className="app">
  <div className="platformTopbar">
    <div className="auiBrand">
      <img src="https://tosv.byted.org/obj/safe-fe/v2/logo.svg" alt=""/>
      <b>内容治理平台</b>
      <i/>
      <button className="auiChannel" type="button">视频 <ChevronDown size={13}/></button>
    </div>
    <div className="platformPrimaryNav">
      {['治理运营工作台','问题发现','标准管理','机审识别','人工审核','处置中心','健康分'].map(item=>
        <button type="button" className={`${item==='问题发现'?'active ':''}${item==='健康分'?'disabled':''}`} key={item}>{item}</button>
      )}
    </div>
    <div className="platformTopActions">
      <button type="button" className="topActionButton" aria-label="帮助中心"><Headphones size={18}/></button>
      <span className="operatorAvatar" aria-label="当前账号：运营">运营</span>
    </div>
  </div>
  <div className="appBody"><div className="sideShell auiSideNav"><div className="sideRail">{sideItems.map(([Icon,label])=><button type="button" key={label} className={label==='应急'?'active':''} aria-current={label==='应急'?'page':undefined}><Icon/><span>{label}</span></button>)}</div></div><AIChatWorkspace reference={chatReference} onClearReference={()=>setChatReference(null)} collapsed={chatCollapsed} reportTitle={reportEvent} onOpenReport={()=>{setArtifactOpen(true);setTab('传播数据统计');setDetailOpen(false)}} onGenerate={event=>{setReportEvent(event);setArtifactOpen(true);setTab('传播数据统计');setDetailOpen(false)}}/>
  <div className={'layout '+(detailOpen?'':'full')}><section className="left">
   <div className="artifactTabs"><button className={'chatPanelToggle '+(chatCollapsed?'collapsed':'')} onClick={()=>setChatCollapsed(value=>!value)} aria-label={chatCollapsed?'展开对话区域':'收起对话区域'}><ChevronRight size={16}/></button><button className={artifactOpen?'active':''} onClick={()=>setArtifactOpen(true)}><FileText size={14}/><span>{reportEvent}</span>{artifactOpen&&<X size={13} onClick={event=>{event.stopPropagation();setArtifactOpen(false)}}/>}</button><button className="newArtifactTab" onClick={()=>setArtifactOpen(true)} aria-label="打开当前事件报告">+</button></div>
   {artifactOpen?<>
   <div className="hero"><h1><span className="eventGrade" aria-label="指令等级 S，舆情等级 A"><i>S</i><em>|</em><b>A</b></span>“{reportEvent}”舆情传播分析</h1><p>{reportEvent==='揭阳虐狗事件'?'2026 年 2 月 5 日，广东揭阳一段疑似虐狗视频在多个平台传播，引发对涉事人员责任、动物保护立法、视频真实性及网络暴力边界的集中讨论。相关部门已介入核查，部分网传细节仍待权威确认。':`AI 已围绕“${reportEvent}”完成内容聚合、传播趋势识别、观点聚类和账号关系分析。当前报告展示模拟的全链路研判结果，可继续通过左侧对话追加分析要求。`}</p></div>
   <InsightCommandCenter select={select} activeOpinion={activeOpinion} onOpinionSelect={focusOpinion}/>
   <nav>{([['传播数据统计',Sparkles],['视频传播链',GitBranch],['账号关联链',Network],['相关指令',Flag]] as [string, any][]).map(([n,Icon])=><button className={tab===n?'active':''} onClick={()=>setTab(n)}><Icon size={16}/>{n}</button>)}</nav>
   <div className="content">{tab==='传播数据统计'?<Stats open={open} setOpen={setOpen} select={select} activeOpinion={activeOpinion} onOpinionChange={setActiveOpinion} addToChat={(video:any,index:number)=>{setChatReference({...video,coverIndex:index%4});setChatCollapsed(false)}}/>:tab==='视频传播链'?<VideoChain select={select}/>:tab==='账号关联链'?<AccountChain select={select} highlight={highlight} setHighlight={setHighlight}/>:<RelatedCommands eventName={reportEvent}/>}</div>
   </>:<div className="artifactEmpty"><div><FileText size={28}/><h2>暂无打开的分析报告</h2><p>从左侧快捷分析打开当前事件，或输入新事件生成报告。</p><button onClick={()=>setArtifactOpen(true)}>打开当前事件报告</button></div></div>}
  </section>{detailOpen&&<Detail state={selected} close={()=>setDetailOpen(false)}/>}</div></div>
 </div>
}
function RelatedCommands({eventName}:{eventName:string}){
 const [level,setLevel]=useState('全部')
 const commands=[
  {source:'北京网信办',level:'C',title:`单条加私处置任务（涉“${eventName}”媒体信息不予处置）`,summary:'【系统标题】单条加私　【任务内容】对相关隐喻解读视频进行定向观察，暂不扩大处置范围。',requirement:'视频自见',video:41,account:39,live:0,attachments:2,tone:'violet'},
  {source:'平台治理中心',level:'B',title:`针对“${eventName}”高热传播内容开展专项巡检`,summary:'【任务内容】聚焦高播放视频、异常搜索增长与高频互动账号，补充巡检证据并回传研判结果。',requirement:'专项巡检',video:18,account:12,live:2,attachments:0,tone:'blue'},
  {source:'公安部',level:'C',title:'要求对影射对象猜测及引战评论开展清评并对违规账号禁言 30 天',summary:'【任务内容】核查传播链中煽动对立、恶意影射和人身攻击内容，对明确违规内容执行清评。',requirement:'评论自见',video:6,account:24,live:0,attachments:1,tone:'dark'},
  {source:'属地网信办',level:'B',title:'关注事件跨平台搬运扩散，压降异常推荐并阻断恶意关联',summary:'【任务内容】跟踪首发、相似扩散及二创节点，对集中爆发的异常流量进行复核和处置。',requirement:'流量干预',video:27,account:16,live:1,attachments:1,tone:'green'}
 ]
 const visible=level==='全部'?commands:commands.filter(item=>item.level===level)
 return <section className="relatedCommands"><div className="commandFilterBar"><label><Search size={15}/><input placeholder="搜索指令名称"/></label><div>{['全部','S级','A级','B级','C级'].map(item=><button key={item} className={level===item.replace('级','')||level===item?'active':''} onClick={()=>setLevel(item==='全部'?'全部':item.replace('级',''))}>{item}</button>)}</div><button className="commandSelect">指令类型 <ChevronDown size={13}/></button><button className="commandSelect">风险域 <ChevronDown size={13}/></button><button className="commandSelect">日期 <ChevronDown size={13}/></button></div><div className="commandList">{visible.map((item,index)=><article className="commandCard" key={item.title}><div className="commandCopy"><span>来源：<b>{item.source}</b></span><h3><i>{item.level}</i>{item.title}<em><u/>已下发</em></h3><p>{item.summary}</p><footer>指令要求：<b>{item.requirement}</b><small>下发时间 02-{6+index} {10+index}:20</small></footer></div><div className="commandMetrics">{[['视频',item.video,'最高播放'],['账号',item.account,'最高粉丝'],['直播间',item.live,'最高 PCU']].map(metric=><div key={metric[0]}><span>{metric[0]}</span><b>{metric[1]}</b><small>{metric[2]} -</small></div>)}</div><div className={'commandAttachments '+item.tone}>{item.attachments?Array.from({length:item.attachments}).map((_,i)=><button key={i} aria-label={'查看附件 '+(i+1)}><Play size={16} fill="currentColor"/><span>0:{8+i*4}</span></button>):<span>暂无附件</span>}</div></article>)}</div></section>
}
function Metrics(){return <div className="metrics">{[['关联视频','2,846','+18.6%'],['累计播放','6,328.4万','+12.3%'],['互动总量','384.7万','+8.2%'],['涉事账号','1,062','+63'],['风险内容','128','4.5%']].map((x,i)=><div key={x[0]}><span>{x[0]} {i===4&&<TriangleAlert size={12}/>}</span><b>{x[1]}</b><em className={i===4?'warn':''}>{x[2]}</em></div>)}</div>}
function SourceBadge({type}:{type:'data'|'ai'}){return <small className={'sourceBadge '+type}>{type==='data'?'数据统计':'AI 研判'}</small>}
const videoOpinionOptions=[['未成年人处罚力度过轻','31%','negative'],['未成年身份不应成为免责盾牌','24%','negative'],['应追究家长监护与教育责任','17%','neutral'],['亟需补齐反虐待动物立法空白','16%','positive'],['处置后讨论逐步回归理性','7%','positive'],['反对人肉未成年人及无关人员','5%','neutral']] as const
function InsightCommandCenter({select,activeOpinion,onOpinionSelect}:{select:(type:string,item:any)=>void,activeOpinion:string|null,onOpinionSelect:(opinion:string|null)=>void}){
 const [activePeak,setActivePeak]=useState<string|null>(null)
 const [opinionScope,setOpinionScope]=useState<'视频'|'评论'>('视频')
 const peaks=[{time:'02-05 16:00',title:'S级指令下发',desc:'专项巡检与事实核查启动',growth:'+186%',type:'command',typeName:'指令'},{time:'02-06 10:00',title:'境外大V发布',desc:'相关视频被境外账号转发评论',growth:'+74%',type:'opinion',typeName:'舆情'},{time:'02-08 20:00',title:'动物保护争议扩散',desc:'AI 识别争议互动率高于基线 1.8 倍',growth:'+42%',type:'ai',typeName:'AI分析'}]
 const peakNodes=[{x:155,y:114,peak:peaks[0]},{x:305,y:52,peak:peaks[1]},{x:455,y:91,peak:peaks[2]}]
 const topOpinions={视频:videoOpinionOptions,评论:[['送专门学校与行为恶劣程度不匹配','29%','negative'],['虐待流浪动物存在法律规制空白','23%','negative'],['家长和学校应承担教育矫治责任','18%','neutral'],['完善动物保护立法是长期解法','15%','positive'],['理性讨论有助于推动制度完善','9%','positive'],['讨论应避免演变为网络暴力','6%','neutral']]} as const
 const visibleOpinions=topOpinions[opinionScope].slice(0,5)
 const selectedOpinion=visibleOpinions.find(item=>item[0]===activeOpinion)
 const selectedTone=selectedOpinion?.[2]
 const metricRatio=selectedOpinion?Number.parseFloat(selectedOpinion[1])/100:1
 const trendMetrics=[['视频量',Math.round(2846*metricRatio).toLocaleString(),selectedOpinion?selectedOpinion[1]:'全量'],['VV 量',(6328.4*metricRatio).toFixed(1)+'万',selectedOpinion?'观点贡献':'累计播放'],['评论量',(72.1*metricRatio).toFixed(1)+'万',selectedOpinion?'观点相关':'互动评论'],['点赞量',(248.6*metricRatio).toFixed(1)+'万',selectedOpinion?'观点相关':'累计点赞'],['关联账号',Math.round(1062*metricRatio).toLocaleString(),selectedOpinion?'观点相关':'涉事账号']]
 return <section className="commandCenter"><div className="trendGrid"><div className="trendPanel"><div className="panelTitle"><b>传播趋势与观点走向</b><span>视频量（条） / VV（万） / 观点声量</span></div><div className="trendLegend"><span className="video"><i/>视频量</span><span className="vv"><i/>VV</span>{selectedOpinion&&<span className={'opinion '+selectedTone}><i/>{selectedOpinion[0]}</span>}<span className="signal command"><i/>指令</span><span className="signal public"><i/>舆情</span><span className="signal ai"><i/>AI 分析</span></div><div className="trendChart"><svg viewBox="0 0 620 210" preserveAspectRatio="none"><path className="area vvArea" d="M0 185 L55 174 L105 165 L155 114 L205 149 L255 128 L305 52 L355 109 L405 126 L455 91 L505 136 L560 148 L620 167 L620 210 L0 210Z"/><path className="line videoLine" d="M0 174 L55 165 L105 156 L155 134 L205 144 L255 113 L305 86 L355 104 L405 116 L455 101 L505 123 L560 135 L620 152"/><path className="line vvLine" d="M0 185 L55 174 L105 165 L155 114 L205 149 L255 128 L305 52 L355 109 L405 126 L455 91 L505 136 L560 148 L620 167"/>{selectedTone==='negative'&&<path className="line opinionLine negative" d="M0 197 L55 191 L105 180 L155 142 L205 153 L255 128 L305 86 L355 105 L405 123 L455 136 L505 154 L560 168 L620 179"/>}{selectedTone==='positive'&&<path className="line opinionLine positive" d="M0 201 L55 197 L105 191 L155 182 L205 174 L255 156 L305 135 L355 125 L405 105 L455 94 L505 109 L560 132 L620 152"/>}{selectedTone==='neutral'&&<path className="line opinionLine neutral" d="M0 202 L55 199 L105 195 L155 188 L205 179 L255 172 L305 161 L355 149 L405 139 L455 129 L505 125 L560 118 L620 113"/>}<line x1="155" y1="28" x2="155" y2="198"/><line x1="305" y1="28" x2="305" y2="198"/><line x1="455" y1="28" x2="455" y2="198"/></svg>{peakNodes.map(({x,y,peak})=><button key={peak.time} className={'peakMarker signalMarker '+peak.type+(activePeak===peak.time?' active':'')} style={{left:(x/620*100)+'%',top:(y/210*185)+'px'}} aria-label={peak.title} onMouseEnter={()=>setActivePeak(peak.time)} onMouseLeave={()=>setActivePeak(null)} onFocus={()=>setActivePeak(peak.time)} onBlur={()=>setActivePeak(null)} onClick={()=>{setActivePeak(activePeak===peak.time?null:peak.time);select('path',{name:peak.title})}}><span><i/>{peak.typeName} · {peak.title}</span></button>)}<div className="trendLabels"><span>02-05</span><span>02-06</span><span>02-08</span><span>02-12</span></div></div></div><aside className="coreOpinionPanel"><div className="coreOpinionPanelHead"><div><b>核心观点 <SourceBadge type="ai"/></b><span>Top {visibleOpinions.length}</span></div><div className="coreOpinionScope">{(['视频','评论'] as const).map(item=><button key={item} className={opinionScope===item?'selected':''} onClick={()=>{setOpinionScope(item);onOpinionSelect(null)}}>{item}观点</button>)}</div></div><div className="coreOpinionRows">{visibleOpinions.map((item,index)=><button key={item[0]} className={activeOpinion===item[0]?'selected':''} onClick={()=>onOpinionSelect(activeOpinion===item[0]?null:item[0])}><i>{index+1}</i><span>{item[0]}</span><em className={item[2]}>{item[2]==='negative'?'负向':item[2]==='positive'?'正向':'中立'}</em><b>{item[1]}</b></button>)}</div></aside></div><div className="trendMetricCards">{trendMetrics.map(item=><article key={item[0]}><span>{item[0]}</span><b>{item[1]}</b><em>{item[2]}</em></article>)}</div></section>
}
const trafficTree=[
 {id:'feed',name:'Feed',value:3814.2,share:'60.3%',children:[
  {id:'m1',name:'内容流量',value:3212.0,children:[['内容消费',2168.5],['优质内容',16.8],['UGC',263.6],['社交',38.5],['搜索',147.9],['直播内容',403.9],['投稿',127.4],['其他',45.4]]},
  {id:'m2',name:'交易流量',value:248.3,children:[['电商',126.3],['生服',92.7],['直播打赏',2.3],['原生短剧',4.9],['游戏',8.5],['小游戏',2.2],['线索',0.2],['待治理',11.2]]},
  {id:'m3',name:'广告流量',value:353.9,children:[['广告',346.9],['星图',2.1],['导流',4.9]]}
 ]},
 {id:'search',name:'搜索',value:1205.8,share:'19.1%',children:[
  {id:'q1',name:'揭阳虐狗事件',value:486.2,children:[['综合结果页',228.4],['视频结果页',171.6],['话题聚合页',86.2]]},
  {id:'q2',name:'揭阳虐狗事件经过',value:391.4,children:[['搜索联想',183.5],['用户主动搜索',142.7],['热榜词回流',65.2]]},
  {id:'q3',name:'揭阳虐狗涉事者',value:328.2,children:[['视频结果页',151.8],['用户页结果',104.6],['评论区回搜',71.8]]}
 ]},
 {id:'message',name:'消息页',value:430,share:'6.8%',children:[
  {id:'dm1',name:'私聊 · @时事显微镜',value:186.4,children:[['私信视频卡',92.7],['会话内链接',58.1],['账号名片',35.6]]},
  {id:'dm2',name:'群聊 · G-8F21',value:148.7,children:[['群内转发',81.5],['引用回复',42.4],['群文件回看',24.8]]},
  {id:'dm3',name:'群聊 · G-3C09',value:94.9,children:[['群内转发',53.2],['消息搜索',26.1],['历史记录回看',15.6]]}
 ]},
 {id:'profile',name:'个人主页',value:310,share:'4.9%',children:[{id:'p1',name:'作品列表',value:168.2,children:[['置顶作品',82.5],['近期作品',55.4],['合集入口',30.3]]},{id:'p2',name:'主页回访',value:91.6,children:[['关注回访',47.8],['评论头像进入',28.1],['收藏回访',15.7]]},{id:'p3',name:'橱窗入口',value:50.2,children:[['商品讲解',24.6],['直播预约',16.4],['其他',9.2]]}]},
 {id:'otherProfile',name:'他人主页',value:210,share:'3.3%',children:[{id:'op1',name:'关联作者主页',value:102.7,children:[['相似作者',54.1],['互动作者',31.8],['同话题作者',16.8]]},{id:'op2',name:'评论用户主页',value:67.5,children:[['高赞评论者',36.2],['互关用户',19.7],['普通评论者',11.6]]},{id:'op3',name:'账号关系页',value:39.8,children:[['粉丝列表',20.4],['关注列表',12.1],['共同关注',7.3]]}]},
 {id:'local',name:'同城',value:198.4,share:'3.1%',children:[{id:'l1',name:'北京',value:76.2,children:[['城市热点',38.8],['附近内容',23.7],['区域热榜',13.7]]},{id:'l2',name:'上海',value:68.4,children:[['城市频道',31.6],['商圈地点',22.3],['附近内容',14.5]]},{id:'l3',name:'成都等城市',value:53.8,children:[['区域热榜',28.4],['城市热点',15.7],['附近内容',9.7]]}]},
 {id:'following',name:'关注页',value:160,share:'2.5%',children:[{id:'f1',name:'关注流',value:91.5,children:[['最新发布',47.6],['高互动内容',28.7],['回看内容',15.2]]},{id:'f2',name:'特别关注',value:43.2,children:[['更新提醒',23.4],['主页直达',12.8],['私信提醒',7.0]]},{id:'f3',name:'朋友在看',value:25.3,children:[['好友点赞',13.9],['好友转发',7.6],['好友评论',3.8]]}]}
]
const channelAnalysis:any={
 feed:{title:'Feed 排序队列分析',dimension:'队列类型 / 队列名称',rows:[['精排','热点事件高价值队列','1,486.2万','39.0%','互动率 7.8%'],['精排','社会议题深度消费队列','990.3万','26.0%','举报率 0.42%'],['粗排','高热候选池 Q-17','801.0万','21.0%','完播率 61.4%'],['粗排','探索流量池 E-04','536.7万','14.0%','负反馈 1.2%']],interactions:[['点赞','248.6万','6.5%'],['收藏','58.4万','1.5%'],['评论','72.1万','1.9%'],['举报','16.8万','0.44%']]},
 search:{title:'搜索词表现分析',dimension:'搜索词 / 搜索次数',rows:[['核心词','揭阳虐狗事件','486.2万','40.3%','结果点击率 68.4%'],['长尾词','揭阳虐狗事件经过','391.4万','32.5%','结果点击率 63.1%'],['人物词','揭阳虐狗涉事者','328.2万','27.2%','举报率 0.83%'],['联想词','虐狗行为如何处置','184.7万','—','增速 +74%']],interactions:[['点赞','54.8万','4.5%'],['收藏','31.6万','2.6%'],['评论','38.9万','3.2%'],['举报','10.1万','0.84%']]},
 message:{title:'消息会话回流分析',dimension:'会话类型 / 对话人或群聊 ID',rows:[['群聊','G-8F21','148.7万','34.6%','转发 81.5万'],['私聊','@时事显微镜','126.4万','29.4%','打开率 72.1%'],['群聊','G-3C09','94.9万','22.1%','引用回复 42.4万'],['私聊','@民生视角','60.0万','14.0%','二次分享 18.7万']],interactions:[['点赞','18.7万','4.3%'],['收藏','7.9万','1.8%'],['评论','13.2万','3.1%'],['举报','2.8万','0.65%']]},
 profile:{title:'个人主页入口分析',dimension:'主页模块 / 内容入口',rows:[['作品列表','置顶作品','82.5万','26.6%','点击率 42.8%'],['作品列表','近期作品','55.4万','17.9%','点击率 35.4%'],['主页回访','评论头像进入','48.1万','15.5%','停留 48 秒'],['橱窗入口','商品讲解','24.6万','7.9%','跳出率 31.2%']],interactions:[['点赞','15.1万','4.9%'],['收藏','6.2万','2.0%'],['评论','8.8万','2.8%'],['举报','1.3万','0.42%']]},
 otherProfile:{title:'他人主页导流分析',dimension:'关系类型 / 主页来源',rows:[['关联作者','相似作者主页','54.1万','25.8%','互访率 18.4%'],['互动作者','高频互动主页','31.8万','15.1%','评论导流'],['同话题作者','话题共现主页','26.8万','12.8%','内容相似 86%'],['评论用户','高赞评论者主页','36.2万','17.2%','回流率 11.7%']],interactions:[['点赞','9.4万','4.5%'],['收藏','3.1万','1.5%'],['评论','7.6万','3.6%'],['举报','0.9万','0.43%']]},
 local:{title:'同城城市分布分析',dimension:'城市 / 同城场景',rows:[['北京','城市热点频道','58.6万','29.5%','互动率 6.9%'],['上海','附近内容流','44.2万','22.3%','收藏率 2.1%'],['成都','区域热榜','37.8万','19.1%','增速 +28%'],['杭州','城市频道','24.6万','12.4%','举报率 0.39%']],interactions:[['点赞','11.2万','5.6%'],['收藏','4.0万','2.0%'],['评论','5.9万','3.0%'],['举报','0.8万','0.40%']]},
 following:{title:'关注关系触达分析',dimension:'触达类型 / 关注场景',rows:[['关注流','最新发布','47.6万','29.8%','首屏曝光 61%'],['关注流','高互动内容','28.7万','17.9%','互动率 9.2%'],['特别关注','更新提醒','23.4万','14.6%','打开率 54%'],['朋友在看','好友点赞回流','13.9万','8.7%','信任转化高']],interactions:[['点赞','13.8万','8.6%'],['收藏','3.6万','2.3%'],['评论','5.1万','3.2%'],['举报','0.4万','0.25%']]}
}
function InteractiveSankey({select,onVideoFilter,activeVideoFilter,activeOpinion}:{select:(type:string,item:any)=>void,onVideoFilter:(keyword:string|null)=>void,activeVideoFilter:string|null,activeOpinion:string|null}){
 const [sourceId,setSourceId]=useState('feed')
 const canvasRef=useRef<HTMLDivElement>(null)
 const [canvasWidth,setCanvasWidth]=useState(1000)
 const [linkGeometry,setLinkGeometry]=useState<any>(null)
 const source:any=trafficTree.find(item=>item.id===sourceId) || trafficTree[0]
 const analysisBase=channelAnalysis[source.id]
 const [feedLayerId,setFeedLayerId]=useState('m1')
 const chooseSource=(item)=>{setSourceId(item.id);setFeedLayerId('m1');onVideoFilter(null)}
 useEffect(()=>{
  if(!activeOpinion)return
  setSourceId('feed');setFeedLayerId('m1');onVideoFilter(null)
 },[activeOpinion])
 useEffect(()=>{
  const canvas=canvasRef.current
  if(!canvas)return
  const update=()=>{
   const rect=canvas.getBoundingClientRect()
   const heightScale=500/(canvas.clientHeight||500)
   const point=(element:Element|null,edge:'left'|'right')=>{
    if(!element)return null
    const itemRect=element.getBoundingClientRect()
    return {x:(edge==='right'?itemRect.right:itemRect.left)-rect.left,y:(itemRect.top+itemRect.height/2-rect.top)*heightScale}
   }
   const selected=canvas.querySelector('.levelOne button[aria-pressed="true"]')
   const secondButtons=Array.from(canvas.querySelectorAll('.levelTwo button'))
   const second=secondButtons.map(item=>point(item,'left'))
   const secondRight=secondButtons.map(item=>point(item,'right'))
   const third=Array.from(canvas.querySelectorAll('.levelThree button')).map(item=>point(item,'left'))
   setCanvasWidth(canvas.clientWidth||1000)
   setLinkGeometry({source:point(selected,'right'),second,secondRight,third})
  }
  update()
  const observer=new ResizeObserver(update)
  observer.observe(canvas)
  return ()=>observer.disconnect()
 },[sourceId])
 const sourceY=60.5+trafficTree.findIndex(item=>item.id===source.id)*36
 const secondY=[114.5,157.5,200.5],actionY=[76,137,198,259]
 const columnWidth=Math.max(108,Math.min(260,canvasWidth*.24))
 const firstLeft=canvasWidth*.03
 const firstRight=firstLeft+columnWidth
 const secondLeft=canvasWidth*.38
 const secondRight=secondLeft+columnWidth
 const thirdLeft=canvasWidth*.73
 const dimensionLabel=source.id==='feed'?'内容 / 广告 / 交易流量':source.id==='search'?'搜索词':source.id==='message'?'群聊 / 私聊':source.id==='local'?'同城城市':'入口场景'
 const feedLayer=source.id==='feed'?(source.children.find(item=>item.name===activeVideoFilter)||source.children.find(item=>item.id===feedLayerId)):null
 const thirdItems=feedLayer?.children||[]
 const feedThirdItems=source.id==='feed'?source.children.flatMap((parent,parentIndex)=>parent.children.map((item,index)=>({parent,parentIndex,item,index}))):[]
 const thirdNodeY=(index:number)=>62+index*20
 const measuredSource=linkGeometry?.source
 const measuredSecond=(index:number)=>linkGeometry?.second?.[index]
 const measuredThird=(index:number)=>linkGeometry?.third?.[index]
 const detailAnalysisRows=source.children.flatMap(parent=>parent.children.map((item,index)=>[parent.name,`${parent.name} · ${item[0]}`,item[1]+'万',(item[1]/source.value*100).toFixed(1)+'%',index===0?'主要细分路径':'关联细分路径']))
 const analysis=source.id==='feed'?{...analysisBase,interactions:thirdItems.map(item=>[item[0],item[1]+'万',(item[1]/source.value*100).toFixed(1)+'%'])}:{...analysisBase,rows:[...analysisBase.rows,...detailAnalysisRows].slice(0,10)}
 return <div className="hierSankey channelSankey"><div className="sankeyHead"><div><b>渠道传播路径</b><span>流量渠道 → 下钻分析层；流量单位：万</span></div><div className="pathCrumb"><span>{source.name}</span><ChevronRight/><b>{dimensionLabel}</b></div></div><div ref={canvasRef} className={'flowCanvas twoLevel '+(source.id==='feed'?'feedThreeLevel allFeedTargets':'')}><svg viewBox={`0 0 ${canvasWidth} 500`} preserveAspectRatio="none">{source.children.map((item,i)=>{const start=measuredSource||{x:firstRight,y:sourceY},end=measuredSecond(i)||{x:secondLeft,y:secondY[i]};return <g key={'s-'+item.id}><path className="active" d={`M${start.x} ${start.y} C${start.x+(end.x-start.x)*.42} ${start.y} ${start.x+(end.x-start.x)*.58} ${end.y} ${end.x} ${end.y}`} style={{strokeWidth:Math.max(7,item.value/source.value*42)}}/><text className="flowLinkLabel" x={(start.x+end.x)/2} y={(start.y+end.y)/2-5}>{(item.value/source.value*100).toFixed(1)}%</text></g>})}{feedThirdItems.map(({parent,parentIndex,item},allIndex)=>{const start=linkGeometry?.secondRight?.[parentIndex]||{x:secondRight,y:secondY[parentIndex]},end=measuredThird(allIndex)||{x:thirdLeft,y:thirdNodeY(allIndex)};return <path key={parent.id+'-'+item[0]} className={'tertiary '+parent.id} d={`M${start.x} ${start.y} C${start.x+(end.x-start.x)*.42} ${start.y} ${start.x+(end.x-start.x)*.58} ${end.y} ${end.x} ${end.y}`} style={{strokeWidth:Math.max(2,item[1]/source.value*18)}}/>})}</svg><div className="flowColumn levelOne"><h4>一级 · 流量渠道（单选）</h4>{trafficTree.map(item=><button key={item.id} className={source.id===item.id?'selected':''} aria-pressed={source.id===item.id} onClick={()=>chooseSource(item)}><span>{item.name}<small>{item.share}</small></span><b>{item.value.toLocaleString()}万</b></button>)}</div><div className="flowColumn levelTwo"><h4>二级 · {dimensionLabel}</h4>{source.children.map(item=><button key={item.id}><span>{item.name}<small>{(item.value/source.value*100).toFixed(1)}%</small></span><b>{item.value.toLocaleString()}万</b></button>)}</div>{source.id==='feed'&&<div className="flowColumn levelThree actionColumn"><h4>三级 · 业务归属</h4><div className="feedGroupTotals">{source.children.map(item=><span key={item.id} className={item.id}><i/>{item.name.replace('流量','')}<b>{(item.value/source.value*100).toFixed(1)}%</b></span>)}</div>{feedThirdItems.map(({parent,item})=><button key={parent.id+'-'+item[0]} onClick={()=>onVideoFilter(item[0])}><span><i className={'feedGroupDot '+parent.id}/>{item[0]}<small>{(item[1]/parent.value*100).toFixed(2)}%</small></span><b>{item[1].toLocaleString()}万</b></button>)}</div>}</div>{source.id==='feed'&&<MultiObjectiveContribution/>}<div className="channelAnalysis"><div className="analysisTitle"><div><b>{analysis.title}</b><span>{analysis.dimension}</span></div><div><em>{source.name} 流量 {source.value.toLocaleString()}万</em><span>数据范围：近 7 天</span></div></div><div className="analysisTable"><div className="analysisRow head"><span>类型</span><b>分析项</b><em>{source.id==='search'?'搜索次数':'流量'}</em><i>渠道占比</i><u>关键指标</u></div>{analysis.rows.map((row,index)=><button className={'analysisRow '+(activeVideoFilter===row[1]?'selected':'')} aria-pressed={activeVideoFilter===row[1]} key={row[1]} onClick={()=>onVideoFilter(row[1])}><span>{row[0]}</span><b><small>{index+1}</small>{row[1]}</b><em>{row[2]}</em><i>{row[3]}</i><u>{row[4]}</u><ChevronRight/></button>)}</div><div className="analysisInsight"><b>自动洞察</b><span>点击任一分析层或分析项，即可联动筛选下方代表视频。</span></div></div><div className="sankeyFoot"><span>当前选中渠道</span><b>{source.name}</b><em>全站流量占比 {source.share}</em><i>点击分析层或分析项可筛选下方代表视频</i></div></div>
}
function PublisherDistribution(){
 const [kind,setKind]=useState('全部')
 const items=[['C 号 · 普通用户','1,924','67.6%','1,168.4万','首发与评论转发为主'],['B 号 · 机构/媒体','536','18.8%','1,024.7万','资讯解读与进展发布'],['认证创作者','386','13.6%','653.1万','法律、动物保护等专业解读']]
 const visible=kind==='全部'?items:items.filter(item=>item[0].startsWith(kind))
 return <section className="publisherDistribution"><div><h3>发布账号构成</h3><p>按发布主体查看事件内容的首发、搬运与二次创作情况</p></div><div className="publisherTabs">{['全部','C 号','B 号','认证创作者'].map(item=><button key={item} className={kind===item?'selected':''} onClick={()=>setKind(item)}>{item}</button>)}</div><div className="publisherList">{visible.map(item=><article key={item[0]}><i className={item[0].startsWith('C')?'c':'b'}>{item[0][0]}</i><div><b>{item[0]}</b><span>{item[4]}</span></div><strong>{item[1]} 个账号<small>发布量占比 {item[2]}</small></strong><em>{item[3]}<small>累计播放</small></em></article>)}</div></section>
}
function MultiObjectiveContribution(){
 const [group,setGroup]=useState('主队列')
 const groups:any={主队列:{share:'85.85%',rows:[['基础消费·时长','19.01万','17.62%'],['基础消费·关注','18.37万','17.03%'],['基础消费·社交','12.88万','11.94%'],['基础消费·投稿','12.57万','11.66%'],['基础消费·评论','10.20万','9.45%'],['深度消费·完播','8.94万','8.28%'],['互动消费·点赞','7.86万','7.28%'],['回访消费·主页','5.31万','4.92%'],['关系消费·关注流','3.72万','3.45%'],['探索消费·扩展','2.47万','2.29%']]},UGC队列:{share:'13.01%',rows:[['内容创作·投稿','4.23万','4.12%'],['互动创作·评论','3.46万','3.37%'],['作者主页回访','2.88万','2.81%'],['同城内容消费','2.79万','2.71%']]},冷启动队列:{share:'1.14%',rows:[['新内容探索','1.28万','0.62%'],['新人作者扶持','0.64万','0.31%'],['兴趣扩展','0.43万','0.21%']]}}
 const current=groups[group]
 return <section className="multiObjective"><div><h3>Feed 多目标贡献</h3><p>推荐页流量按队列类型拆分，以列表展示各目标对 VV 的贡献。</p></div><div className="objectiveTabs">{Object.keys(groups).map(item=><button key={item} className={group===item?'selected':''} onClick={()=>setGroup(item)}>{item} <span>{groups[item].share}</span></button>)}</div><div className="objectiveList objectiveListOnly"><header><span>排名</span><b>多目标分析项</b><em>贡献 VV</em><strong>贡献占比</strong></header>{current.rows.map((row,index)=><div key={row[0]}><i>{index+1}</i><span>{row[0]}</span><em>{row[1]}</em><strong>{row[2]}</strong></div>)}</div></section>
}
function OpinionDistribution({activeOpinion,onSelect}:{activeOpinion:string|null,onSelect:(name:string)=>void}){
 const [scope,setScope]=useState<'视频'|'评论'>('视频')
 const datasets:any={视频:[['未成年人处罚力度过轻','31%','1,366','仅送专门学校教育与行为恶劣程度不匹配','negative'],['未成年身份不应成为免责盾牌','24%','1,058','公众要求明确行为责任与矫治效果','negative'],['应追究家长监护与教育责任','17%','749','家长和学校应共同承担教育矫治责任','neutral'],['亟需补齐反虐待动物立法空白','16%','705','虐待无主流浪动物缺少直接法律规制','positive'],['处置后讨论正逐步回归理性','7%','308','焦点转向未成年人教育与制度完善','positive'],['反对人肉未成年人及无关人员','5%','220','事件讨论不应演变为网络暴力','neutral']],评论:[['送专门学校与行为恶劣程度不匹配','29%','18.4万','处置结果成为通报后的首要争议','negative'],['虐待流浪动物存在法律规制空白','23%','14.5万','公众呼吁明确虐待动物行为的法律责任','negative'],['家长和学校应承担教育矫治责任','18%','11.3万','关注矫治效果和监护责任落实','neutral'],['完善动物保护立法是长期解法','15%','9.4万','将情绪讨论转向制度建设','positive'],['理性讨论有助于推动制度完善','9%','5.7万','支持基于事实的公共讨论','positive'],['讨论应避免演变为网络暴力','6%','3.8万','反对曝光无关人员和未经核实的信息','neutral']]}
 const opinions=datasets[scope]
 return <section className="opinionDistribution coreOpinions"><div className="opinionHead"><div><h2>核心观点 <SourceBadge type="ai"/></h2><p>观点色彩：负向 / 正向 / 中立；点击后渠道默认回到 Feed，并筛选下方代表视频</p></div><div className="opinionScope">{(['视频','评论'] as const).map(item=><button key={item} className={scope===item?'selected':''} onClick={()=>setScope(item)}>{item}观点</button>)}</div></div><div className="opinionLegend"><span className="negative">负向</span><span className="positive">正向</span><span className="neutral">中立</span></div><div className="coreOpinionGrid">{opinions.map(item=><button key={item[0]} className={`${item[4]} ${activeOpinion===item[0]?'selected':''}`} onClick={()=>onSelect(item[0])}><span>{item[0]}</span><b>{item[1]}</b><small>{item[2]} 条{scope==='视频'?'视频':'评论'}</small><p>{item[3]}</p><em>筛选代表视频 <ChevronRight size={12}/></em></button>)}</div></section>
}
function Stats({open,setOpen,select,addToChat,activeOpinion,onOpinionChange}){
 const [activeKeyword,setActiveKeyword]=useState('揭阳虐狗事件')
 const [period,setPeriod]=useState('近 7 天')
 const [videoFilter,setVideoFilter]=useState<string|null>(null)
 const [accountType,setAccountType]=useState('全部')
 const paths=[
  {id:'feed',name:'Feed 推荐',plays:'3,814.2万',ratio:'60.3%',scenes:'推荐页 · 同城页 · 关注页',insight:'首发视频发布后 3 小时达到峰值，推荐页贡献了该路径 69.2% 的有效播放。',breakdown:[['推荐页','2,638.7万','69.2%'],['同城页','710.5万','18.6%'],['关注页','465.0万','12.2%']],contents:['揭阳疑似虐狗视频的完整经过','涉事者行为是否构成违法'],views:'虐待认定 38% · 责任追问 27% · 立法争议 21%'},
  {id:'search',name:'站内搜索',plays:'1,205.8万',ratio:'19.1%',scenes:'热榜 · 关键词搜索',insight:'搜索流量在发布后 6—18 小时持续走高，“揭阳虐狗涉事者”成为主要长尾问题。',breakdown:[['事件热榜','516.4万','42.8%'],['相关搜索词','438.2万','36.3%'],['话题页搜索','251.2万','20.9%']],contents:['揭阳虐狗事件经过与时间线','涉事人员身份及部门回应','动物保护法律适用边界'],views:'责任认定 44% · 事实核验 35% · 立法讨论 21%'},
  {id:'profile',name:'个人主页',plays:'796.5万',ratio:'12.6%',scenes:'关注页回访 · 作者主页',insight:'高互动视频带动回访，时事类作者主页的二次浏览率高于整体均值 1.6 倍。',breakdown:[['作者主页','443.8万','55.7%'],['关注页回访','239.6万','30.1%'],['相关推荐页','113.1万','14.2%']],contents:['时事显微镜：原视频与文案全文','民生视角：隐喻扩散关键节点'],views:'讽刺表达 46% · 语义解读 39% · 对象猜测 15%'},
  {id:'share',name:'分享回流',plays:'511.9万',ratio:'8.0%',scenes:'私信 · 站外回流',insight:'私信分享是主要回流入口，晚间 20:00—23:00 的视频转发最明显。',breakdown:[['私信分享','284.6万','55.6%'],['站外链接回流','148.2万','29.0%'],['群聊转发','79.1万','15.4%']],contents:['揭阳虐狗事件传播时间线','从事件争议到动物保护讨论'],views:'信息转述 42% · 愤怒谴责 38% · 理性求证 20%'}
 ]
 const searchResults={
  '揭阳虐狗事件':['原始视频及事件时间线','当地相关部门回应汇总','涉事情况仍有哪些待核信息'],
  '揭阳虐狗事件经过':['视频发布、搬运与发酵节点','涉事人员回应及后续处置','网传说法与已确认事实对照'],
  '揭阳虐狗涉事者':['涉事人员身份信息待权威确认','是否构成违法及责任如何认定','警惕人肉搜索与无关人员误伤']
 }
 const togglePath=(id:string)=>setOpen((current:string[])=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
 const displayVideos=[...videos,{...videos[1],id:'v10',author:'动物保护观察',title:'是否应追究法律责任：评论区高频观点梳理',play:'43.7万',interaction:'1.8万',tone:'观点聚合'},{...videos[2],id:'v11',author:'事实核验站',title:'揭阳虐狗事件网传细节与已确认事实',play:'36.9万',interaction:'1.3万',tone:'事实核验'},{...videos[3],id:'v12',author:'城市记录者',title:'从揭阳事件看动物保护与网络暴力边界',play:'29.4万',interaction:'9,862',tone:'社会观察'}]
 const videoFilterGroups=[
  {names:['M1 内容流量','M2 广告流量','M3 交易流量','热点事件高价值队列','社会议题深度消费队列','高热候选池 Q-17','探索流量池 E-04'],ids:['v0','v1','v2','v10','v11']},
  {names:['揭阳虐狗事件','揭阳虐狗事件经过','揭阳虐狗涉事者','虐狗行为如何处置'],ids:['v0','v1','v2','v3','v4','v10','v11','v12']},
  {names:['对话人 @时事显微镜','群聊 G-8F21','群聊 G-3C09','G-8F21','@时事显微镜','G-3C09','@民生视角'],ids:['v0','v1','v3','v10']},
  {names:['作品列表','主页回访','橱窗入口','置顶作品','近期作品','评论头像进入','商品讲解'],ids:['v0','v2','v4','v12']},
  {names:['关联作者主页','评论用户主页','账号关系页','相似作者主页','高频互动主页','同话题作者主页','高赞评论者主页'],ids:['v1','v3','v4','v10']},
  {names:['北京','上海','成都等城市','城市热点频道','附近内容流','区域热榜','城市频道'],ids:['v3','v4','v12']},
  {names:['关注流','特别关注','朋友在看','最新发布','高互动内容','更新提醒','好友点赞回流'],ids:['v0','v1','v2','v4']}
 ]
 const selectedVideoIds=videoFilterGroups.find(group=>group.names.includes(videoFilter||''))?.ids||displayVideos.map(video=>video.id)
 const opinionVideoIds:any={'未成年人处罚力度过轻':['v0','v1','v10'],'未成年身份不应成为免责盾牌':['v0','v1','v3'],'应追究家长监护与教育责任':['v1','v10','v12'],'亟需补齐反虐待动物立法空白':['v2','v10','v12'],'处置后讨论正逐步回归理性':['v2','v11','v12'],'反对人肉未成年人及无关人员':['v3','v11','v12'],'送专门学校与行为恶劣程度不匹配':['v0','v1','v10'],'虐待流浪动物存在法律规制空白':['v2','v10','v12'],'家长和学校应承担教育矫治责任':['v1','v10','v12'],'完善动物保护立法是长期解法':['v2','v11','v12'],'理性讨论有助于推动制度完善':['v2','v11','v12'],'讨论应避免演变为网络暴力':['v3','v11','v12']}
 const effectiveVideoIds=activeOpinion?(opinionVideoIds[activeOpinion]||selectedVideoIds):selectedVideoIds
 const opinionFilteredVideos=(videoFilter||activeOpinion)?displayVideos.filter(video=>effectiveVideoIds.includes(video.id)):displayVideos
 const filteredVideos=accountType==='全部'?opinionFilteredVideos:opinionFilteredVideos.filter(video=>accountType==='B号'?['民生视角','动物保护观察','事实核验站'].includes(video.author):!['民生视角','动物保护观察','事实核验站'].includes(video.author))
 return <><InteractiveSankey select={select} activeVideoFilter={videoFilter} onVideoFilter={setVideoFilter} activeOpinion={activeOpinion}/>
 <div className="dataToolbar"><div>{['近 24 小时','近 7 天','全部周期'].map(item=><button key={item} className={period===item?'selected':''} onClick={()=>setPeriod(item)}>{item}</button>)}</div></div><div className="sankey"><div className="sLabels"><span>内容发布</span><span>主要入口</span><span>细分场景</span><span>用户行为</span></div><div className="chart"><svg viewBox="0 0 1000 230" preserveAspectRatio="none"><path className="p1" d="M82 24 C210 24 230 24 314 24 L314 100 C220 96 188 86 82 76Z"/><path className="p2" d="M82 82 C210 94 236 110 314 110 L314 153 C210 149 184 137 82 120Z"/><path className="p3" d="M82 128 C210 145 240 161 314 165 L314 196 C210 191 190 180 82 164Z"/><path className="p4" d="M82 173 C210 191 240 202 314 204 L314 224 C200 218 180 210 82 205Z"/><path className="p1" d="M365 24 C480 24 500 24 600 24 L600 82 C490 76 450 85 365 100Z"/><path className="p1 low" d="M365 51 C480 67 500 104 600 105 L600 135 C490 130 442 118 365 100Z"/><path className="p2" d="M365 110 C490 113 520 124 600 125 L600 159 C490 159 440 154 365 153Z"/><path className="p3" d="M365 165 C490 168 520 178 600 180 L600 205 C490 204 440 201 365 196Z"/><path className="p1" d="M650 24 C750 24 790 26 913 26 L913 75 C780 74 730 70 650 82Z"/><path className="p2" d="M650 105 C750 108 790 112 913 112 L913 149 C780 145 725 139 650 135Z"/><path className="p3" d="M650 125 C750 134 790 165 913 165 L913 194 C780 188 725 170 650 159Z"/></svg><span className="node origin">关联视频<b>2,846</b></span><button className="node feed" onClick={()=>select('path',{name:'Feed 推荐'})}>Feed 推荐<b>60.3%</b></button><span className="node search">站内搜索<b>19.1%</b></span><span className="node profile">个人主页<b>12.6%</b></span><span className="node share">分享回流<b>8.0%</b></span><span className="node rec">推荐页<b>41.7%</b></span><span className="node local">同城页<b>18.6%</b></span><span className="node hot">热榜<b>13.9%</b></span><span className="node key">关键词<b>8.2%</b></span><span className="node views">有效播放<b>6,328.4万</b></span><span className="node acts">互动行为<b>384.7万</b></span><span className="node trans">转发传播<b>58.2万</b></span></div></div>
 <div className="paths">{paths.map((p,i)=><div key={p.id} className={open.includes(p.id)?'open':''}><button className="pathTrigger" aria-expanded={open.includes(p.id)} onClick={()=>togglePath(p.id)}><i className={'pathIcon pi'+i}><Play size={13}/></i><b>{p.name}</b><span>{p.plays}</span><em>{p.ratio}</em><u><i style={{width:p.ratio}}/></u><ChevronDown size={16}/></button>{open.includes(p.id)&&<article className="pathExpanded"><div className="pathSummary"><p>细分流量场景 <b>{p.scenes}</b></p><p>路径洞察 <b>{p.insight}</b></p></div><div className="pathDetailGrid"><section><h4>流量场景明细</h4>{p.breakdown.map(row=><div className="breakdown" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><em>{row[2]}</em></div>)}</section><section><h4>观点聚合</h4><p className="viewMix">{p.views}</p>{p.id==='search'&&<><h4 className="keywordTitle">相关搜索词</h4><div className="keywords">{Object.keys(searchResults).map(word=><button key={word} className={activeKeyword===word?'selected':''} onClick={()=>setActiveKeyword(word)}>{word}</button>)}</div></>}<div className="related"><h4>{p.id==='search'?'“'+activeKeyword+'”关联内容':'关联站内内容'}</h4>{(p.id==='search'?searchResults[activeKeyword]:p.contents).map((content,index)=><button key={content} onClick={()=>select('path',{name:content})}><span>{index+1}</span>{content}<ChevronRight size={13}/></button>)}</div></section></div><button className="insightButton" onClick={()=>select('path',{name:p.name})}>查看路径洞察<ChevronRight size={14}/></button></article>}</div>)}</div>
 <div id="filtered-video-results" className={(videoFilter||activeOpinion||accountType!=='全部')?'isFiltered':''}><Section title="热点观点与代表视频" desc={activeOpinion?`已按观点“${activeOpinion}”筛选，当前展示 ${filteredVideos.length} 条代表视频`:videoFilter?`已按分析项“${videoFilter}”筛选，共 ${filteredVideos.length} 条代表视频`:accountType!=='全部'?`已筛选 ${accountType}，当前展示 ${filteredVideos.length} 条代表视频`:'基于统计数据汇总代表视频，AI 辅助完成文案、OCR 和 ASR 语义聚合'} action={(videoFilter||activeOpinion)?<button className="videoFilterChip" onClick={()=>{setVideoFilter(null);onOpinionChange(null)}}><ScanLine size={12}/>{activeOpinion||videoFilter}<X size={12}/></button>:null} source="data"/><div className="videoOpinionFilters"><span>观点筛选</span>{videoOpinionOptions.map(item=><button key={item[0]} className={`${item[2]} ${activeOpinion===item[0]?'selected':''}`} onClick={()=>onOpinionChange(activeOpinion===item[0]?null:item[0])}>{item[0]} <b>{item[1]}</b></button>)}</div><div className="videoAccountFilters"><span>账号类型</span>{['全部','B号','C号'].map(item=><button key={item} className={accountType===item?'selected':''} onClick={()=>setAccountType(item)}>{item}</button>)}</div><div className="cards videoListGrid">{filteredVideos.map((v,i)=><VideoCard v={v} i={i} select={select} addToChat={addToChat}/>)}</div></div></>
}
function Section({title,desc,action,source}:{title:string,desc:string,action:any,source?:'data'|'ai'}){return <div className="section"><div><h2>{title}{source&&<SourceBadge type={source}/>}</h2><p>{desc}</p></div>{action}</div>}
function ChainTimeline({value,onChange,total,label}:{value:number,onChange:(value:number)=>void,total:number,label:string}){
 const points=['02-05 15:45','02-05 18:00','02-06 10:00','02-07 12:00','02-08 20:00','02-10 09:00','02-12 18:00']
 const [playing,setPlaying]=useState(false)
 useEffect(()=>{if(!playing)return;if(value>=points.length-1){setPlaying(false);return}const timer=window.setTimeout(()=>onChange(value+1),900);return()=>window.clearTimeout(timer)},[playing,value,onChange])
 const togglePlay=()=>{if(playing){setPlaying(false);return}if(value>=points.length-1)onChange(0);setPlaying(true)}
 return <div className="chainTimeline"><div className="timelineMeta"><span><Clock3 size={13}/>{label}</span><b>{points[value]}</b><em>已出现 {total} 个实体</em><button className={playing?'timelinePlay playing':'timelinePlay'} onClick={togglePlay} aria-label={playing?'暂停时间轴':'播放时间轴'}>{playing?<Pause size={13} fill="currentColor"/>:<Play size={13} fill="currentColor"/>}<span>{playing?'暂停':'播放'}</span></button></div><div className="timelineTrack"><input type="range" min="0" max="6" step="1" value={value} onChange={event=>{setPlaying(false);onChange(Number(event.target.value))}}/><div className="timelineTicks">{points.map((point,index)=><button key={point} className={index<=value?'reached':''} onClick={()=>{setPlaying(false);onChange(index)}}><i/><span>{point.slice(0,5)}</span></button>)}</div></div><small>拖拽时间轴查看传播链在不同时间点的状态</small></div>
}
function useCanvasPan(){
 const [pan,setPan]=useState({x:0,y:0}),dragging=useRef(false),origin=useRef({x:0,y:0,px:0,py:0})
 const handlers={onMouseDown:(event:any)=>{if(event.target.closest('button,input'))return;dragging.current=true;origin.current={x:event.clientX,y:event.clientY,px:pan.x,py:pan.y};event.currentTarget.classList.add('isGrabbing')},onMouseMove:(event:any)=>{if(!dragging.current)return;setPan({x:origin.current.px+event.clientX-origin.current.x,y:origin.current.py+event.clientY-origin.current.y})},onMouseUp:(event:any)=>{dragging.current=false;event.currentTarget.classList.remove('isGrabbing')},onMouseLeave:(event:any)=>{dragging.current=false;event.currentTarget.classList.remove('isGrabbing')}}
 return {pan,setPan,handlers}
}
function VideoDynamicLinks({pos,arrival,timeIndex,cluster}:{pos:number[][],arrival:number[],timeIndex:number,cluster:any}){
 const clusterIndices:number[]=cluster?.indices||[]
 const expandedEdges=clusterIndices.flatMap((index,order)=>{
  if(order===0)return []
  if(order<5)return [[clusterIndices[order-1],index]]
  return [[clusterIndices[Math.min(order-4,4)],index]]
 })
 const overviewEdges:any[]=[
  [0,1,'backbone'],[1,2,'branch'],[1,3,'branch'],[2,4,'branch'],
  [0,5,'clusterBridge'],[5,6,'branch'],[6,7,'branch'],[5,8,'branch'],[8,9,'branch'],[6,10,'branch'],[8,11,'branch'],
  [0,12,'clusterBridge'],[12,13,'branch'],[13,14,'branch'],[12,15,'branch'],[15,16,'branch'],
  [0,17,'clusterBridge'],[17,18,'branch'],[18,19,'branch'],[17,20,'branch'],[20,21,'branch'],[18,22,'branch'],[20,23,'branch']
 ]
 const edges:any[]=cluster?expandedEdges.map(edge=>[...edge,'branch']):overviewEdges
 const allowed=(index:number)=>arrival[index]<=timeIndex&&(!cluster||cluster.indices.includes(index))
 const point=(index:number)=>({x:pos[index][0]+(index===0?48:39),y:pos[index][1]+(index===0?44:35)})
 return <svg className="links dynamicVideoLinks" viewBox="0 0 1200 720">{edges.filter(([from,to])=>allowed(from)&&allowed(to)).map(([from,to,type])=>{const fromPoint=point(from),toPoint=point(to),mx=(fromPoint.x+toPoint.x)/2;return <path key={from+'-'+to} className={type} d={`M${fromPoint.x} ${fromPoint.y} C${mx} ${fromPoint.y} ${mx} ${toPoint.y} ${toPoint.x} ${toPoint.y}`}/>})}</svg>
}
function VideoCard({v,i,select,addToChat}){return <button className="vcard" onClick={()=>select('video',v)}><div className={'thumb th'+i}><span>{v.tone}</span><i><Play size={15} fill="currentColor"/></i><b>00:{36+i*11}</b><span role="button" tabIndex={0} className="addVideoToChat" onClick={event=>{event.stopPropagation();addToChat(v,i)}} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.stopPropagation();addToChat(v,i)}}}><Sparkles size={11}/>添加到 Chat</span></div><h3>{v.title}</h3><p>{v.author} · {v.time}</p><footer><span><Eye size={12}/>{v.play}</span><span><MessageCircle size={12}/>{v.interaction}</span><em>{v.grade}</em></footer></button>}
function VideoChain({select}){
 const [zoom,setZoom]=useState(.78),[relations,setRelations]=useState(['文本相似','OCR 相似','ASR 相似'])
 const [selectedEntities,setSelectedEntities]=useState<string[]>([])
 const [timeIndex,setTimeIndex]=useState(6)
 const [expandedCluster,setExpandedCluster]=useState<string|null>(null)
 const boardRef=useRef<HTMLDivElement>(null)
 const {pan,setPan,handlers:panHandlers}=useCanvasPan()
 const relationOptions=['文本相似','OCR 相似','ASR 相似','同作者投稿','互粉作者','相同话题']
 const clusterThemes=[
  ['热点档案室','“身居高位却名不副实”：热议观点梳理'],['职场观察局','能力与职位不匹配为何引发共鸣'],['公共议题社','评论区围绕任用标准展开讨论'],['理性讨论组','从个体能力看职位责任与评价'],['城市显微镜','高位与能力争议的传播语境'],
  ['隐喻研究所','“乌龟上杆”俗语的来源与变体'],['语言观察站','动物隐喻如何成为网络表达'],['文化档案馆','民间俗语进入短视频后的演变'],['语义分析室','未点名表达为何更容易扩散'],['热梗研究社','同类隐喻在评论区持续发酵'],['网络文化志','从画面符号到公共议题的转译'],['表达研究所','隐喻内容的多义性与误读风险'],
  ['同城观察员','从首发到对号入座的扩散时间线'],['事实核验站','评论区猜测对象缺乏事实依据'],['舆情瞭望塔','影射对象猜测形成多个分支'],['热点追踪号','高赞评论推动猜测进一步扩散'],['信息核查局','网传关联说法的证据核验'],
  ['权力观察室','谁把它推上去：推举关系讨论'],['深度议题社','职位、能力与权力来源的关系'],['观察者笔记','利益网络猜想在二创中扩散'],['社会切片','评论观点聚焦责任与任用机制'],['公共表达课','从一句俗语看推举者角色'],['理性发声','隐喻批评与不实指控的边界'],['议题研究社','权力来源讨论的主要观点分布']
 ]
 const chainVideos=clusterThemes.map(([author,title],index)=>({...videos[index%videos.length],id:'chain-'+index,author,title,play:(328.6-index*9.7).toFixed(1)+'万'}))
 const videoClusters=[
  {id:'position',name:'名不副实者身居高位',summary:'围绕能力与职位不匹配展开讽刺和质疑',indices:[1,2,3,4],plays:'531.1万',risk:'高争议',x:715,y:35,w:450,h:285,c:'violet'},
  {id:'metaphor',name:'“乌龟上杆”隐喻解读',summary:'解释俗语来源、寓意及网络语境变化',indices:[5,6,7,8,9,10,11],plays:'335.5万',risk:'语义解读',x:35,y:35,w:450,h:295,c:'blue'},
  {id:'target',name:'影射对象猜测',summary:'评论区对号入座并猜测具体影射对象',indices:[12,13,14,15,16],plays:'227.8万',risk:'风险聚集',x:715,y:390,w:450,h:290,c:'orange'},
  {id:'power',name:'权力来源与推举关系',summary:'讨论谁将其推上高位及背后的利益网络',indices:[17,18,19,20,21,22,23],plays:'173.5万',risk:'观点发散',x:35,y:390,w:470,h:290,c:'cyan'}
 ]
 const videoArrival=[0,2,1,4,3,1,5,2,6,4,3,6,2,5,3,6,4,1,4,2,6,3,5,6]
 const activeCluster=videoClusters.find(cluster=>cluster.id===expandedCluster)
 const clusterOverviewPos=[
  [552,306],[760,105],[900,72],[1025,145],[850,215],
  [75,108],[190,70],[325,112],[105,205],[225,180],[365,220],[300,252],
  [755,455],[890,415],[1025,475],[820,565],[980,570],
  [75,455],[190,410],[330,455],[110,565],[245,545],[375,585],[405,495]
 ]
 const pos=chainVideos.map((_,index)=>{
  if(!activeCluster)return clusterOverviewPos[index]
  const order=activeCluster.indices.indexOf(index)
  if(order<0)return [0,0]
  const row=Math.floor(order/5),column=order%5,rowCount=Math.min(5,activeCluster.indices.length-row*5)
  return [75+(5-rowCount)*100+column*205,125+row*245]
 })
 const changeZoom=(step:number)=>setZoom(value=>Math.max(.58,Math.min(1.08,Number((value+step).toFixed(2)))))
 const toggleRelation=(item:string)=>setRelations(current=>current.includes(item)?current.filter(x=>x!==item):[...current,item])
 const toggleEntity=(id:string)=>setSelectedEntities(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
 const analyze=()=>{const items=chainVideos.filter(item=>selectedEntities.includes(item.id));select('analysis',{entityType:'video',items,name:'视频传播链路分析'})}
 const visibleVideoCount=videoArrival.filter(arrival=>arrival<=timeIndex).length
 const openCluster=(id:string)=>{
  const viewportWidth=boardRef.current?.clientWidth||920
  const fittedZoom=Math.max(.58,Math.min(.74,(viewportWidth-36)/1100))
  setExpandedCluster(id);setSelectedEntities([]);setZoom(Number(fittedZoom.toFixed(2)))
  setPan({x:Math.max(18,(viewportWidth-1100*fittedZoom)/2),y:4})
 }
 return <><Section title="视频传播链路" desc="以首发视频为中心，展示视频与视频之间的相似、引用和二次传播关系" action={<div className="tools"><button><Search size={14}/>查找视频</button><button onClick={()=>changeZoom(-.1)} aria-label="缩小画布"><ZoomOut size={15}/></button><button onClick={()=>changeZoom(.1)} aria-label="放大画布"><ZoomIn size={15}/></button></div>}/><div className="chips">关系筛选：{relationOptions.map(item=><button key={item} className={relations.includes(item)?'on':''} onClick={()=>toggleRelation(item)}>{item}</button>)}</div>{selectedEntities.length>=2&&<div className="entityAnalysisBar"><span>已选择 <b>{selectedEntities.length}</b> 个视频</span><button onClick={analyze}><Network size={14}/>传播链路分析</button><button className="clearSelection" onClick={()=>setSelectedEntities([])}>清空</button></div>}<div className="canvas boardCanvas videoRelationshipBoard pannableCanvas" ref={boardRef} {...panHandlers}><div className="zoomHud"><span>缩放 {Math.round(zoom*100)}%</span><button onClick={()=>{setZoom(.78);setPan({x:0,y:0})}}>重置视图</button></div><div className="boardScene" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}}><div className="stages"><span>首发视频</span><i/><span>直接衍生视频</span><i/><span>二次传播视频</span></div>{!activeCluster&&<div className="videoOpinionSurfaces">{videoClusters.map(cluster=><div key={cluster.id} className={'opinionClusterSurface '+cluster.c} style={{left:cluster.x,top:cluster.y,width:cluster.w,height:cluster.h}}><span>{cluster.name}</span><small>{cluster.indices.length} 个视频 · {cluster.plays}</small><em>{cluster.risk}</em></div>)}</div>}<VideoDynamicLinks pos={pos} arrival={videoArrival} timeIndex={timeIndex} cluster={null}/>{chainVideos.map((v,i)=><button key={v.id} className={'videoNode relationVideoNode'+(i===0?' originVideo':'')+(selectedEntities.includes(v.id)?' entitySelected':'')+(videoArrival[i]>timeIndex?' entityFuture':'')} style={{left:pos[i][0],top:pos[i][1]}} onClick={()=>select('video',v)}><i className={'miniThumb m'+(i%4)}><Play size={12} fill="currentColor"/></i><span><b>{v.author}</b><em>{v.title.slice(0,16)}…</em><small>{v.play} 播放</small></span><i className="entityCheck" role="checkbox" aria-checked={selectedEntities.includes(v.id)} onClick={event=>{event.stopPropagation();toggleEntity(v.id)}}>{selectedEntities.includes(v.id)?'✓':''}</i>{i===0?<u>首发中心</u>:<u>{i%3===0?'同话题':i%3===1?'OCR 相似 '+(90-i)+'%':'文本相似 '+(95-i)+'%'}</u>}</button>)}</div><div className="miniMap"/><p className="canvasTip">首发视频位于画布中心 · 每个视频严格归入对应观点簇 · 连线从中心向四周放射</p></div><ChainTimeline value={timeIndex} onChange={setTimeIndex} total={visibleVideoCount} label="视频扩散时间"/><div className="legend">观点簇：紫 · 职位争议　蓝 · 隐喻解读　橙 · 对象猜测　青 · 权力来源　　━ 强关联　┅ 弱关联</div></>}
function AccountChain({select,highlight,setHighlight}){
 const [focusTier,setFocusTier]=useState('全部'),[showEvidence,setShowEvidence]=useState(true)
 const [selectedEntities,setSelectedEntities]=useState<string[]>([])
 const [timeIndex,setTimeIndex]=useState(6)
 const {pan:accountPan,handlers:accountPanHandlers}=useCanvasPan()
 useEffect(()=>{const board=document.querySelector<HTMLElement>('.intelBoard');if(!board)return;board.classList.add('pannableCanvas');board.style.setProperty('--pan-x',accountPan.x+'px');board.style.setProperty('--pan-y',accountPan.y+'px');const down=(event:MouseEvent)=>accountPanHandlers.onMouseDown(event),move=(event:MouseEvent)=>accountPanHandlers.onMouseMove(event),up=(event:MouseEvent)=>accountPanHandlers.onMouseUp(event),leave=(event:MouseEvent)=>accountPanHandlers.onMouseLeave(event);board.addEventListener('mousedown',down);board.addEventListener('mousemove',move);board.addEventListener('mouseup',up);board.addEventListener('mouseleave',leave);return()=>{board.removeEventListener('mousedown',down);board.removeEventListener('mousemove',move);board.removeEventListener('mouseup',up);board.removeEventListener('mouseleave',leave)}},[accountPan.x,accountPan.y])
 useEffect(()=>{const board=document.querySelector<HTMLElement>('.intelBoard');if(!board)return;const buttons=Array.from(board.querySelectorAll<HTMLButtonElement>('.account'));const svg=board.querySelector<SVGSVGElement>('.accountLinks');if(!svg)return;const clear=()=>{buttons.forEach(button=>button.classList.remove('relationOrigin','relationHit'));svg.querySelector('.hoverLinks')?.remove()};const showRelations=(origin:HTMLButtonElement)=>{clear();origin.classList.add('relationOrigin');const targets=buttons.filter(button=>button!==origin&&!button.classList.contains('dimmed')).sort(()=>Math.random()-.5).slice(0,2+Math.floor(Math.random()*3));targets.forEach(button=>button.classList.add('relationHit'));const group=document.createElementNS('http://www.w3.org/2000/svg','g');group.setAttribute('class','hoverLinks');const boardRect=board.getBoundingClientRect();const scale=Math.min(boardRect.width/800,boardRect.height/500);const offsetX=(boardRect.width-800*scale)/2;const offsetY=(boardRect.height-500*scale)/2;const point=(button:HTMLButtonElement)=>{const rect=button.getBoundingClientRect();return{x:(rect.left+rect.width/2-boardRect.left-offsetX)/scale,y:(rect.top+rect.height/2-boardRect.top-offsetY)/scale}};const from=point(origin);targets.forEach(target=>{const to=point(target);const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',String(from.x));line.setAttribute('y1',String(from.y));line.setAttribute('x2',String(to.x));line.setAttribute('y2',String(to.y));group.appendChild(line)});svg.appendChild(group)};const handlers=buttons.map(button=>({button,handler:()=>showRelations(button)}));handlers.forEach(({button,handler})=>button.addEventListener('mouseenter',handler));board.addEventListener('mouseleave',clear);return()=>{handlers.forEach(({button,handler})=>button.removeEventListener('mouseenter',handler));board.removeEventListener('mouseleave',clear);clear()}},[focusTier,showEvidence])
 const direct=[...accounts.slice(1),{id:'a6',name:'隐喻观察室',handle:'@metaphor-watch',risk:'需关注',fans:'16.4万',auth:'文化作者',c:'cyan',edge:'话题共现'},{id:'a7',name:'民生求证',handle:'@verify-life',risk:'需关注',fans:'11.2万',auth:'优质作者',c:'orange',edge:'高频互动'}]
 const secondary=[{id:'b0',name:'城市记录者',handle:'@city-log',risk:'低风险',fans:'6.8万',auth:'普通用户',c:'blue',edge:'互粉关系'},{id:'b1',name:'俗语档案馆',handle:'@idiom-file',risk:'低风险',fans:'9.4万',auth:'文化作者',c:'green',edge:'内容共现'},{id:'b2',name:'公共表达课',handle:'@public-talk',risk:'低风险',fans:'14.6万',auth:'知识作者',c:'violet',edge:'话题共现'},{id:'b3',name:'热点追踪号',handle:'@hot-track',risk:'需关注',fans:'7.1万',auth:'普通用户',c:'pink',edge:'频繁互动'},{id:'b4',name:'本地见闻',handle:'@local-view',risk:'低风险',fans:'5.6万',auth:'本地资讯',c:'cyan',edge:'互粉关系'},{id:'b5',name:'冷知识放映厅',handle:'@cold-facts',risk:'低风险',fans:'18.2万',auth:'知识作者',c:'green',edge:'内容共现'},{id:'b6',name:'晚间速报',handle:'@night-news',risk:'需关注',fans:'8.9万',auth:'普通用户',c:'orange',edge:'话题共现'},{id:'b7',name:'舆情观察团',handle:'@opinion-group',risk:'需关注',fans:'12.7万',auth:'时事作者',c:'blue',edge:'高频互动'},{id:'b8',name:'事实核验',handle:'@fact-check',risk:'低风险',fans:'10.3万',auth:'优质作者',c:'violet',edge:'互粉关系'},{id:'b9',name:'同城消息',handle:'@city-news',risk:'需关注',fans:'6.1万',auth:'本地资讯',c:'pink',edge:'内容共现'}]
 const network=[{...accounts[0],tier:'origin',edge:'首发作者'},...direct.map(a=>({...a,tier:'direct',edge:'互动关联'})),...secondary.map(a=>({...a,tier:'secondary',edge:'内容共现'}))]
 const pos=[[400,255],[358,69],[437,76],[402,133],[542,116],[620,128],[580,187],[568,286],[642,300],[608,360],[378,378],[460,388],[424,448],[184,292],[264,307],[221,367],[166,137],[241,181]]
 const clusters=[{name:'核心解读群',x:400,y:104,w:176,h:128,tone:'violet',indices:[1,2,3]},{name:'专业观点群',x:574,y:160,w:226,h:174,tone:'blue',indices:[4,5,6]},{name:'本地传播群',x:610,y:338,w:248,h:206,tone:'cyan',indices:[7,8,9]},{name:'夜间扩散群',x:414,y:420,w:202,h:136,tone:'violet',indices:[10,11,12]},{name:'同城互动群',x:215,y:333,w:236,h:188,tone:'orange',indices:[13,14,15]},{name:'事实核验群',x:184,y:166,w:142,h:118,tone:'green',indices:[16,17]}]
 const accountArrival=[0,2,1,4,2,5,3,1,6,4,2,5,3,6,4,1,5,3]
 const toggleEntity=(id:string)=>setSelectedEntities(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
 const analyze=()=>{const items=network.filter(item=>selectedEntities.includes(item.id));select('analysis',{entityType:'account',items,name:'账号传播链路分析'})}
 const visibleAccountCount=accountArrival.filter(arrival=>arrival<=timeIndex).length
 return <><Section title="账号关联网络" desc="首发账号居中，圈层大小按群体规模与关系强度分布，相邻传播群允许重叠" action={<div className="switcher">账号关系高亮 <button className={highlight?'switch on':'switch'} onClick={()=>setHighlight(!highlight)}><i/></button><HelpCircle size={14}/></div>}/><div className="caseFilters"><span>调查视图</span>{['全部','直接关联','二度关联'].map(item=><button key={item} className={focusTier===item?'selected':''} onClick={()=>setFocusTier(item)}>{item}</button>)}<button className={showEvidence?'selected':''} onClick={()=>setShowEvidence(!showEvidence)}>{showEvidence?'隐藏证据标签':'显示证据标签'}</button></div>{selectedEntities.length>=2&&<div className="entityAnalysisBar"><span>已选择 <b>{selectedEntities.length}</b> 个账号</span><button onClick={analyze}><Network size={14}/>传播链路分析</button><button className="clearSelection" onClick={()=>setSelectedEntities([])}>清空</button></div>}<div className="accountCanvas intelBoard"><div className="boardHud"><span>案件板 · 圈层研判</span><b>{clusters.filter(cluster=>cluster.indices.some(i=>accountArrival[i]<=timeIndex)).length} 个圈层 · 当前可见 {visibleAccountCount} 个账号</b></div><div className="rings"><i/><i/><i/></div>{clusters.map((cluster,index)=><div key={cluster.name} className={'accountCluster cluster'+index+' '+cluster.tone+(cluster.indices.some(i=>accountArrival[i]<=timeIndex)?'':' entityFuture')} style={{left:'calc(50% + '+(cluster.x-400)+'px)',top:'calc(50% + '+(cluster.y-255)+'px)',width:cluster.w,height:cluster.h}}><span>{cluster.name}</span></div>)}<span className="layer l1">首发账号</span><span className="layer l2">直接关联 · 18</span><span className="layer l3">二度关联 · 64</span><svg className="accountLinks" viewBox="0 0 800 500"><circle cx="400" cy="255" r="138"/><circle className="muted" cx="400" cy="255" r="208"/></svg>{network.map((a,i)=><button key={a.id} className={'account '+a.tier+(accountArrival[i]>timeIndex?' entityFuture dimmed':'')+(selectedEntities.includes(a.id)?' entitySelected':'')+(highlight&&a.tier!=='origin'?' hi':'')+(focusTier!=='全部'&&a.tier!==(focusTier==='直接关联'?'direct':focusTier==='二度关联'?'secondary':'origin')?' dimmed':'')} style={{left:'calc(50% + '+(pos[i][0]-400)+'px)',top:'calc(50% + '+(pos[i][1]-255)+'px)'}} onClick={()=>select('account',a)}><i className={'avatar '+a.c}>{a.name[0]}</i><i className="entityCheck" role="checkbox" aria-checked={selectedEntities.includes(a.id)} onClick={event=>{event.stopPropagation();toggleEntity(a.id)}}>{selectedEntities.includes(a.id)?'✓':''}</i><b>{a.name}</b><span>{a.tier==='origin'?'首发作者':a.tier==='direct'?'直接关联':'二度关联'}</span>{showEvidence&&a.tier!=='origin'&&<em>{a.edge}</em>}</button>)}<div className="boardHint">拖动下方时间轴查看账号圈层形成过程 · 悬停头像查看关系</div></div><ChainTimeline value={timeIndex} onChange={setTimeIndex} total={visibleAccountCount} label="账号扩散时间"/>{highlight&&<div className="highlight"><ShieldAlert size={16}/><b>已高亮 17 个关联账号</b><span>直接关联 7 · 二度关联 10 · 高频互动 4</span><button>查看证据链 <ChevronRight size={14}/></button></div>}<div className="evidenceGrid">{[['关联账号','82','直接关系 18'],['异常设备聚类','3','涉及账号 7'],['高频互动群组','5','近 7 日内'],['关系置信度','87.4%','综合评分']].map(x=><div key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><em>{x[2]}</em></div>)}</div></>}
function RelationAnalysis({data}){
 const isVideo=data.entityType==='video',items=data.items||[]
 const names=items.map(item=>isVideo?item.author:item.name)
 const userX=names[0]||'用户 X',userY=names[1]||'用户 Y'
 const videoEvents=[
  {time:'02-05 15:45:12',user:userX,handle:items[0]?.handle||'@creator-x',action:'投稿',content:'发布视频 A',detail:items[0]?.title||'首发视频',source:'内容发布'},
  {time:'02-05 16:02:37',user:userY,handle:items[1]?.handle||'@creator-y',action:'观看',content:'在 Feed 刷到视频 A',detail:'精排队列 Q-17 · 完播 96% · 停留 42 秒',source:'Feed 推荐'},
  {time:'02-05 16:08:24',user:userY,handle:items[1]?.handle||'@creator-y',action:'分享',content:'将视频 A 分享至群聊 G-8F21',detail:'群内 23 人已读 · 6 人点击 · 2 次继续转发',source:'消息页'},
  {time:'02-05 17:06:51',user:userY,handle:items[1]?.handle||'@creator-y',action:'创作',content:'投稿衍生视频 B',detail:items[1]?.title||'衍生视频 · OCR/ASR 相似度 91.6%',source:'创作发布'},
  {time:'02-05 17:19:08',user:'观点观察者',handle:'@viewpoint-z',action:'评论',content:'评论视频 B 并引用视频 A 的核心表述',detail:'评论获赞 3,842 · 触发 186 条回复与 47 次主页回访',source:'评论区'},
  {time:'02-05 17:42:33',user:'同城消息',handle:'@city-news',action:'再传播',content:'转发视频 B 并加入事件话题',detail:'进入同城推荐池 · 带来 12.6 万次新增曝光',source:'同城 / 话题'}
 ]
 return <><div className="relationSummary"><span>{isVideo?'视频—用户—视频关系':'账号—账号关系'}</span><b>{items.length} 个实体 · {isVideo?videoEvents.length:Math.max(items.length-1,1)} 个关键事件</b><p>系统综合推荐曝光、观看日志、分享行为、创作时间、评论互动与内容相似度生成。</p></div><div className="relationEntities">{items.map((item,index)=><div key={item.id}><i className={isVideo?'relationVideo':'avatar '+item.c}>{isVideo?<Play size={13}/>:item.name[0]}</i><span><b>{isVideo?item.title:item.name}</b><small>{isVideo?item.author:item.handle}</small></span>{index<items.length-1&&<ChevronRight/>}</div>)}</div><Box title={isVideo?'核心传播事件链':'核心传播路径'}>{isVideo?<div className="relationEventTimeline">{videoEvents.map((event,index)=><div className="relationEvent" key={event.time}><div className="eventRail"><i>{index+1}</i>{index<videoEvents.length-1&&<u/>}</div><article><header><time>{event.time}</time><em>{event.source}</em></header><div className="eventActor"><b>{event.user}</b><small>{event.handle}</small><span>{event.action}</span></div><h4>{event.content}</h4><p>{event.detail}</p>{index>0&&<strong>距上一步 +{['17分25秒','5分47秒','58分27秒','12分17秒','23分25秒'][index-1]}</strong>}</article></div>)}</div>:<div className="relationRoute"><span><b>01</b>内容互动建立关联</span><i/><span><b>02</b>{userX} 分享给 {userY}</span><i/><span><b>03</b>账号间形成转发、评论与内容共现</span><i/><span><b>04</b>进入新一轮推荐与搜索扩散</span></div>}</Box><Box title="关系证据"><div className="relationEvidence"><p><span>行为关系</span><b>{isVideo?'Feed 观看后 64 分钟出现衍生创作':'近 7 日互评、互转 28 次'}</b><em>高置信</em></p><p><span>内容关系</span><b>{isVideo?'视频 A / B 的 OCR、ASR 与画面综合相似度 91.6%':'共同发布相关内容 12 条'}</b><em>强关联</em></p><p><span>人物关系</span><b>{isVideo?userY+' 同时是视频 A 的观看/分享者与视频 B 的创作者':'互动账号存在共同设备与共同关注'}</b><em>已验证</em></p><p><span>流量关系</span><b>Feed 触达 → 群聊分享 → 衍生创作 → 评论扩散 → 同城推荐</b><em>已验证</em></p></div></Box><Box title="分析结论"><div className="relationConclusion"><Network size={16}/><p>所选实体存在清晰的传播承接关系。{isVideo?userX+' 投稿视频 A 后，'+userY+' 在 Feed 中完成观看并分享，随后创作视频 B；评论用户与同城账号继续放大视频 B，构成“曝光—分享—模仿创作—互动扩散”的完整链路。':'账号之间同时存在高频互动和内容共现，疑似属于同一传播协作圈层。'}</p></div></Box></>
}
function Detail({state,close}){let {type,item}=state;return <aside><div className="detailHead"><div><span>{type==='analysis'?'关系分析':type==='account'?'账号详情':type==='path'?'路径洞察':'视频详情'}</span><h2>{type==='analysis'?item.name:type==='account'?item.name:type==='path'?item.name:item.title}</h2></div><button onClick={close}><X size={18}/></button></div><div className="detailBody">{type==='analysis'?<RelationAnalysis data={item}/>:type==='account'?<AccountDetail a={item}/>:type==='path'?<PathDetail p={item}/>:<VideoDetail v={item}/>}</div></aside>}
function Info({n,v,c=''}){return <p className="info"><span>{n}</span><b className={c}>{v}</b></p>}
function Box({title,children}){return <section className="box"><h3>{title}</h3>{children}</section>}
function VideoDetail({v}){return <><div className="videoTop"><div className="bigThumb"><Play size={24} fill="currentColor"/><b>00:36</b></div><div><h3>{v.title}</h3><p>{v.author} <span>{v.handle}</span></p><footer><b><Eye size={13}/>{v.play}</b><b><MessageCircle size={13}/>{v.interaction}</b></footer></div></div><Box title="内容信息"><Info n="发布时间" v="2026-02-05 15:45:12"/><Info n="内容状态" v="持续扩散" c="safe"/><Info n="风险标签" v="政治隐喻 / 影射领导人" c="risk"/><Info n="传播层级" v={v.grade}/></Box><Box title="视频原文"><blockquote>“{v.title}。乌龟不可能凭自己爬上电线杆；如果它出现在那里，就该问是谁把它放上去的。”</blockquote></Box><Box title="AI 内容解析"><div className="parse"><span>OCR 文本</span><p>乌龟 · 电线杆 · 谁放上去 · 高位</p><span>ASR 摘要</span><p>借动物寓言暗示某位身居高位者能力与职位不匹配，并将质疑延伸至其背后的推举关系。</p></div><div className="sentiment"><span>情感倾向</span><div><i/><i/><i/></div><small>讽刺 58%　质疑 32%　中性 10%</small></div></Box><Box title="处置记录"><div className="timeline"><i/> <p><b>系统识别隐喻表达</b><span>02-05 16:02 · 命中政治影射信号</span></p><i/><p><b>加入事件聚合</b><span>02-05 16:08 · 相似度 93.6%</span></p></div></Box></>}
function AccountDetail({a}){return <><div className="profile"><i className={'avatar big '+a.c}>{a.name[0]}</i><div><h3>{a.name}<b>✓</b></h3><p>{a.handle}</p><em className={a.risk==='低风险'?'safeTag':''}>{a.risk}</em></div></div><StatsRow vals={[[a.fans,'粉丝'],['186','关联内容'],['7.8万','获赞']]}/><Box title="账号属性"><Info n="账号类型" v={a.auth}/><Info n="注册时长" v="2 年 8 个月"/><Info n="近 30 日活跃" v="34 条内容"/><Info n="设备聚类" v="D-02（关联 3 个账号）" c="risk"/></Box><Box title="关系证据"><div className="evidence">高频互动<b>近 7 日与 4 个账号互评、互转 28 次</b></div><div className="evidence">内容共现<b>与事件相关视频 12 条，语义相似度均值 82%</b></div><div className="evidence">设备关联<b>同设备登录记录 3 个账号</b></div></Box><Box title="研判建议"><div className="advice"><ShieldAlert size={16}/>存在跨账号高频互动与设备共现信号，建议纳入观察组并持续追踪。</div></Box></>}
function PathDetail({p}){return <><div className="pathTop"><i className="pathIcon pi0"><Play size={19}/></i><div><h3>{p.name}</h3><p>主传播入口 · 占总有效播放 60.3%</p></div></div><StatsRow vals={['3,814.2万','60.3%','1,984'].map((x,i)=>[x,['有效播放','路径占比','关联视频'][i]])}/><Box title="细分分发"><Info n="推荐页" v="41.7%"/><Info n="同城页" v="18.6%"/><Info n="关注页" v="12.1%"/><Info n="其他场景" v="27.6%"/></Box><Box title="路径洞察"><div className="advice"><Sparkles size={16}/>推荐页在隐喻视频发布后 3 小时达到峰值；“谁把它放上去”相关观点互动率高于整体均值 1.8 倍。</div></Box></>}
function StatsRow({vals}){return <div className="statsRow">{vals.map(x=><div key={x[1]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div>}
createRoot(document.getElementById('root')).render(<App />)
