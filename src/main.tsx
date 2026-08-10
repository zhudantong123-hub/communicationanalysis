import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
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
const analysisDates=['06-29','06-30','07-01','07-02','07-03','07-04','07-05','07-06','07-07','07-08','07-09','07-10','07-11','07-12','07-13','07-14','07-15']
type AnalysisWindow={index:number|null,date:string,sourceId:string,chainTime:number,change:string,cause:string,path:string,governance:string,contentFocus:string,actorFocus:string}
const fullAnalysisWindow:AnalysisWindow={index:null,date:'06-29—07-15',sourceId:'feed',chainTime:6,change:'',cause:'',path:'',governance:'',contentFocus:'',actorFocus:''}
function getAnalysisWindow(index:number|null):AnalysisWindow{
 if(index===null)return fullAnalysisWindow
 const phases=index<=3
  ?{sourceId:'feed',change:'VV +24%，评论量 +11%，负向观点占比 +3pp',cause:'首发内容进入探索流量池，同城用户完成第一轮转发',path:'Feed → 探索流量池 → 视频完播 → 首轮扩散',governance:'核验首发内容与身份猜测评论',contentFocus:'首发事实核验簇',actorFocus:'首发账号与本地搬运账号'}
  :index<=7
  ?{sourceId:'feed',change:'VV +68%，评论量 +42%，负向观点占比 +19pp',cause:'新华社客户端发文，央视新闻跟进转载，责任讨论快速放大',path:'Feed → 内容消费 → 权威解读 → 评论发酵',governance:'优先处理失实剪辑与高赞引战评论',contentFocus:'权威解读与责任争议簇',actorFocus:'政媒号与法律类创作者'}
  :index<=11
  ?{sourceId:'search',change:'VV +83%，评论量 +57%，负向观点占比 +8pp',cause:'事件词进入热榜前三，搜索回流放大处罚争议',path:'搜索 → 事件词 → 视频点击 → 评论发酵',governance:'干预热榜联想词与处罚争议内容簇',contentFocus:'处罚争议与情绪二创簇',actorFocus:'热点搬运与高互动账号簇'}
  :{sourceId:'feed',change:'VV +39%，评论量 +61%，制度讨论占比 +9pp',cause:'揭阳公安发布情况通报，官媒集中转载并开放评论',path:'Feed → 官方通报 → 媒体解读 → 二次扩散',governance:'治理曲解通报内容和攻击性评论',contentFocus:'官方通报与制度讨论簇',actorFocus:'属地政务号与本地资讯账号群'}
 return {
  index,
  date:analysisDates[index],
  ...phases,
  chainTime:index<=2?1:index<=4?2:index<=6?3:index<=8?4:index<=11?5:6
 }
}
function GovernanceScope({context}:{context:AnalysisWindow}){
 if(context.index===null)return null
 return <section className="governanceScope">
  <div><span>当前拐点建议治理动作</span><b>{context.governance}</b></div>
  <dl>
   <div><dt>优先内容簇</dt><dd>{context.contentFocus}</dd></div>
   <div><dt>关注账号簇</dt><dd>{context.actorFocus}</dd></div>
   <div><dt>热点 / 搜索词</dt><dd>{context.sourceId==='search'?'“揭阳虐狗”及处罚争议联想词':'通报曲解词与身份猜测词'}</dd></div>
   <div><dt>建议新增策略</dt><dd>{context.sourceId==='search'?'降低异常搜索放大，提升权威结果首位率':'高风险内容降权，高赞引战评论复核'}</dd></div>
  </dl>
 </section>
}
function AnalysisFilterBar({timeContext,opinion,tab,onClearTime,onClearOpinion,onClearAll}:{timeContext:AnalysisWindow,opinion:string|null,tab:string,onClearTime:()=>void,onClearOpinion:()=>void,onClearAll:()=>void}){
 const hasTime=timeContext.index!==null
 const hasFilter=hasTime||Boolean(opinion)
 const timeSeed=hasTime?(timeContext.index||0)+1:0
 const titlePrefix=hasTime?`${timeContext.date} 窗口`:opinion?`“${opinion}”`:'全周期'
 const result:any=tab==='传播关系链'
  ?{title:`${titlePrefix}关系链`,items:[['核心内容簇',hasFilter?String(Math.max(1,Math.min(4,Math.ceil((timeSeed||6)/2)))):'4',hasFilter?'当前窗口命中':'全周期'],['可见视频',hasFilter?String(8+timeSeed*3):'24','视频链视图'],['关联账号',hasFilter?String(21+timeSeed*6):'82','账号链视图'],['贡献 VV',hasFilter?`${(96.4+timeSeed*31.7).toFixed(1)}万`:'6328.4万',hasFilter?'当前窗口增量':'累计播放']]}
  :{title:`${titlePrefix}结果`,items:[['命中视频',hasFilter?String(180+timeSeed*22):'2,846',hasFilter?'代表视频 8 条':'全量'],['贡献 VV',hasFilter?`${(82.6+timeSeed*18.7).toFixed(1)}万`:'6328.4万',hasFilter?'当前窗口增量':'累计播放'],['关联账号',hasFilter?String(36+timeSeed*3):'1,062',hasFilter?'较全周期收敛':'全量'],['风险内容占比',hasFilter?`${(24.6+timeSeed*1.5).toFixed(1)}%`:'28.4%','负向']]}
 return <section className={'analysisContextPanel'+(hasFilter?' active':'')} aria-live="polite"><div className={'analysisFilterBar'+(hasFilter?' active':'')} aria-label="下方模块分析筛选条件">
  <span>分析条件</span>
  <div className="analysisFilterChips">
   <button className={hasTime?'selected':''} disabled={!hasTime} onClick={hasTime?onClearTime:undefined} aria-label={hasTime?`移除时间筛选 ${timeContext.date}`:'时间范围：全周期'}>
    <Clock3 size={12}/><b>{hasTime?`${timeContext.date} 当日窗口`:'全周期'}</b>{hasTime&&<X size={11}/>}
   </button>
   <button className={opinion?'selected':''} disabled={!opinion} onClick={opinion?onClearOpinion:undefined} aria-label={opinion?`移除观点筛选 ${opinion}`:'观点范围：全部观点'}>
    <MessageCircle size={12}/><b>{opinion||'全部观点'}</b>{opinion&&<X size={11}/>}
   </button>
  </div>
  <em>{hasFilter?'下方各分析模块已按当前条件联动':'当前展示全周期、全部观点数据'}</em>
  {hasFilter&&<button className="clearAnalysisFilters" onClick={onClearAll}>清除全部</button>}
  </div><FilterResultSummary title={result.title} items={result.items}/></section>
}
function getOpinionFilterProfile(opinion:string|null){
 const text=opinion||''
 const seed=Array.from(text).reduce((sum,char)=>sum+char.charCodeAt(0),0)
 const positive=/立法|完善|理性|正向|保护/.test(text)
 const neutral=/监护|教育|网暴|核验|事实|中立/.test(text)
 const clusterId=/网暴|核验|事实|人肉/.test(text)?'source':/音频|二创|搬运/.test(text)?'audio':/立法|动物|监护|教育|责任/.test(text)?'topic':'opinion'
 const baseVideos=positive?112:neutral?86:148
 const baseVv=positive?318.6:neutral?226.4:438.2
 const baseAccounts=positive?31:neutral?24:46
 const baseRisk=positive?7.2:neutral?11.8:29.4
 return {
  seed,
  clusterId,
  tone:positive?'正向':neutral?'中立':'负向',
  matchedVideos:baseVideos+seed%37,
  vv:`${(baseVv+(seed%83)*2.1).toFixed(1)}万`,
  accounts:baseAccounts+seed%19,
  risk:`${(baseRisk+(seed%31)*.4).toFixed(1)}%`
 }
}
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
 const [analysisWindow,setAnalysisWindow]=useState<AnalysisWindow>(fullAnalysisWindow)
 useEffect(()=>{if(tab==='视频传播链'||tab==='账号关联链')setTab('传播关系链')},[tab])
 const select=(type,item)=>{setSelected({type,item});setDetailOpen(true)}
 const focusOpinion=(opinion:string|null)=>setActiveOpinion(opinion)
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
  <div className="layout full"><section className="left">
   <div className="artifactTabs"><button className={'chatPanelToggle '+(chatCollapsed?'collapsed':'')} onClick={()=>setChatCollapsed(value=>!value)} aria-label={chatCollapsed?'展开对话区域':'收起对话区域'}><ChevronRight size={16}/></button><button className={artifactOpen?'active':''} onClick={()=>setArtifactOpen(true)}><FileText size={14}/><span>{reportEvent}</span>{artifactOpen&&<X size={13} onClick={event=>{event.stopPropagation();setArtifactOpen(false)}}/>}</button><button className="newArtifactTab" onClick={()=>setArtifactOpen(true)} aria-label="打开当前事件报告">+</button></div>
   {artifactOpen?<>
   <div className="hero"><h1>{reportEvent==='揭阳虐狗事件'?'揭阳虐狗事件':reportEvent}</h1><p>{reportEvent==='揭阳虐狗事件'?'2026 年 2 月 5 日，广东揭阳一段疑似虐待犬只的现场视频被发布后，迅速经短视频搬运、评论区转述、热榜与搜索回流扩散至多个平台。围绕视频是否完整、涉事人员身份与责任认定等事实问题，网络讨论进一步延伸至未成年人教育与监护责任、虐待动物行为的法律规制、动物保护立法，以及对涉事者人肉搜索和网络暴力的边界。当地相关部门随后介入核查并持续回应；目前部分事实已经得到确认，但视频前后经过、个别网传身份信息及具体处置依据仍需以权威通报为准。':`AI 已围绕“${reportEvent}”完成内容聚合、传播趋势识别、观点聚类和账号关系分析。当前报告展示模拟的全链路研判结果，可继续通过左侧对话追加分析要求。`}</p></div>
   <InsightCommandCenter select={select} activeOpinion={activeOpinion} timeFilterIndex={analysisWindow.index} onOpinionSelect={focusOpinion} onTimeWindowChange={index=>setAnalysisWindow(getAnalysisWindow(index))}/>
   <nav>{([['传播数据统计',Sparkles],['传播关系链',GitBranch],['相关指令',Flag]] as [string, any][]).map(([n,Icon])=><button key={n} className={tab===n?'active':''} onClick={()=>setTab(n)}><Icon size={16}/>{n}</button>)}</nav>
   <AnalysisFilterBar timeContext={analysisWindow} opinion={activeOpinion} tab={tab} onClearTime={()=>setAnalysisWindow(fullAnalysisWindow)} onClearOpinion={()=>setActiveOpinion(null)} onClearAll={()=>{setAnalysisWindow(fullAnalysisWindow);setActiveOpinion(null)}}/>
   <div className="content">{tab==='传播数据统计'?<Stats open={open} setOpen={setOpen} select={select} activeOpinion={activeOpinion} onOpinionChange={setActiveOpinion} timeContext={analysisWindow} addToChat={(video:any,index:number)=>{setChatReference({...video,coverIndex:index%4});setChatCollapsed(false)}}/>:tab==='传播关系链'?<LinkedPropagationViews select={select} highlight={highlight} setHighlight={setHighlight} timeContext={analysisWindow} activeOpinion={activeOpinion} onTimeChange={index=>setAnalysisWindow(getAnalysisWindow(index))}/>:<><GovernanceScope context={analysisWindow}/><RelatedCommands eventName={reportEvent} timeContext={analysisWindow} activeOpinion={activeOpinion}/></>}</div>
   </>:<div className="artifactEmpty"><div><FileText size={28}/><h2>暂无打开的分析报告</h2><p>从左侧快捷分析打开当前事件，或输入新事件生成报告。</p><button onClick={()=>setArtifactOpen(true)}>打开当前事件报告</button></div></div>}
  </section>{detailOpen&&<Detail state={selected} close={()=>setDetailOpen(false)}/>}</div></div>
 </div>
}
function RelatedCommands({eventName,timeContext,activeOpinion}:{eventName:string,timeContext:AnalysisWindow,activeOpinion:string|null}){
 const [level,setLevel]=useState('全部')
 const commands=[
  {source:'北京网信办',level:'C',title:`单条加私处置任务（涉“${eventName}”媒体信息不予处置）`,summary:'【系统标题】单条加私　【任务内容】对相关隐喻解读视频进行定向观察，暂不扩大处置范围。',requirement:'视频自见',video:41,account:39,live:0,attachments:2,tone:'violet'},
  {source:'平台治理中心',level:'B',title:`针对“${eventName}”高热传播内容开展专项巡检`,summary:'【任务内容】聚焦高播放视频、异常搜索增长与高频互动账号，补充巡检证据并回传研判结果。',requirement:'专项巡检',video:18,account:12,live:2,attachments:0,tone:'blue'},
  {source:'公安部',level:'C',title:'要求对影射对象猜测及引战评论开展清评并对违规账号禁言 30 天',summary:'【任务内容】核查传播链中煽动对立、恶意影射和人身攻击内容，对明确违规内容执行清评。',requirement:'评论自见',video:6,account:24,live:0,attachments:1,tone:'dark'},
  {source:'属地网信办',level:'B',title:'关注事件跨平台搬运扩散，压降异常推荐并阻断恶意关联',summary:'【任务内容】跟踪首发、相似扩散及二创节点，对集中爆发的异常流量进行复核和处置。',requirement:'流量干预',video:27,account:16,live:1,attachments:1,tone:'green'}
 ]
 const opinionProfile=getOpinionFilterProfile(activeOpinion)
 const filterSeed=opinionProfile.seed+(timeContext.index===null?0:(timeContext.index+1)*29)
 const filteredCommands=(activeOpinion||timeContext.index!==null)
  ?[...commands].sort((a,b)=>((a.video*11+filterSeed)%37)-((b.video*11+filterSeed)%37)).slice(0,3)
  :commands
 const visible=level==='全部'?filteredCommands:filteredCommands.filter(item=>item.level===level)
 const summaryTitle=activeOpinion?`“${activeOpinion}”治理命中`:`${timeContext.date} 治理命中`
 return <section className="relatedCommands">
  {(activeOpinion||timeContext.index!==null)&&<FilterResultSummary title={summaryTitle} items={[
   ['匹配指令',String(filteredCommands.length),activeOpinion?'观点条件命中':'时间窗口命中'],
   ['待处置内容簇',String(3+filterSeed%4),`较全周期 -${2+filterSeed%3}`],
   ['待关注账号簇',String(2+filterSeed%3),`策略命中 ${4+filterSeed%4} 个`],
   ['优先级',opinionProfile.tone==='负向'?'高':'中',timeContext.index!==null?'当前拐点':'观点筛选']
  ]}/>}
  <div className="commandFilterBar"><label><Search size={15}/><input placeholder="搜索指令名称"/></label><div>{['全部','S级','A级','B级','C级'].map(item=><button key={item} className={level===item.replace('级','')||level===item?'active':''} onClick={()=>setLevel(item==='全部'?'全部':item.replace('级',''))}>{item}</button>)}</div><button className="commandSelect">指令类型 <ChevronDown size={13}/></button><button className="commandSelect">风险域 <ChevronDown size={13}/></button><button className="commandSelect">日期 <ChevronDown size={13}/></button></div><div className="commandList">{visible.map((item,index)=><article className="commandCard" key={item.title}><div className="commandCopy"><span>来源：<b>{item.source}</b></span><h3><i>{item.level}</i>{item.title}<em><u/>已下发</em></h3><p>{item.summary}</p><footer>指令要求：<b>{item.requirement}</b><small>下发时间 02-{6+index} {10+index}:20</small></footer></div><div className="commandMetrics">{[['视频',item.video,'最高播放'],['账号',item.account,'最高粉丝'],['直播间',item.live,'最高 PCU']].map(metric=><div key={metric[0]}><span>{metric[0]}</span><b>{metric[1]}</b><small>{metric[2]} -</small></div>)}</div><div className={'commandAttachments '+item.tone}>{item.attachments?Array.from({length:item.attachments}).map((_,i)=><button key={i} aria-label={'查看附件 '+(i+1)}><Play size={16} fill="currentColor"/><span>0:{8+i*4}</span></button>):<span>暂无附件</span>}</div></article>)}</div>
 </section>
}
function Metrics(){return <div className="metrics">{[['关联视频','2,846','+18.6%'],['累计播放','6,328.4万','+12.3%'],['互动总量','384.7万','+8.2%'],['涉事账号','1,062','+63'],['风险内容','128','4.5%']].map((x,i)=><div key={x[0]}><span>{x[0]} {i===4&&<TriangleAlert size={12}/>}</span><b>{x[1]}</b><em className={i===4?'warn':''}>{x[2]}</em></div>)}</div>}
function SourceBadge({type}:{type:'data'|'ai'}){return <small className={'sourceBadge '+type}>{type==='data'?'数据统计':'AI 研判'}</small>}
const videoOpinionOptions=[['未成年人处罚力度过轻','31%','negative'],['未成年身份不应成为免责盾牌','24%','negative'],['应追究家长监护与教育责任','17%','neutral'],['亟需补齐反虐待动物立法空白','16%','positive'],['处置后讨论逐步回归理性','7%','positive'],['反对人肉未成年人及无关人员','5%','neutral']] as const
function InsightCommandCenter({select,activeOpinion,timeFilterIndex,onOpinionSelect,onTimeWindowChange}:{select:(type:string,item:any)=>void,activeOpinion:string|null,timeFilterIndex:number|null,onOpinionSelect:(opinion:string|null)=>void,onTimeWindowChange:(index:number|null)=>void}){
 const [opinionScope,setOpinionScope]=useState<'视频'|'评论'>('视频')
 const [rightPanelTab,setRightPanelTab]=useState<'opinion'|'ai'>('opinion')
 const [activeSentiment,setActiveSentiment]=useState<'negative'|'positive'|'neutral'|null>(null)
 const [videoSentiment,setVideoSentiment]=useState<'negative'|'positive'|'neutral'|null>(null)
 const [commentSentiment,setCommentSentiment]=useState<'negative'|'positive'|'neutral'|null>(null)
 const [linkedOpinionFilter,setLinkedOpinionFilter]=useState<{scope:'视频'|'评论',tone:string}|null>(null)
 const [videoOpinionFocus,setVideoOpinionFocus]=useState<string|null>(null)
 const [commentOpinionFocus,setCommentOpinionFocus]=useState<string|null>(null)
 const linkedSentiment=activeOpinion==='正向情感'?'positive':activeOpinion==='中立情感'?'neutral':activeOpinion==='负向情感'?'negative':activeSentiment
 const [hoverTimeIndex,setHoverTimeIndex]=useState<number|null>(null)
 const [selectedTimeIndex,setSelectedTimeIndex]=useState<number|null>(null)
 const [selectedInsight,setSelectedInsight]=useState<number|null>(null)
 useEffect(()=>{setSelectedTimeIndex(timeFilterIndex);if(timeFilterIndex===null)setSelectedInsight(null)},[timeFilterIndex])
 const trendOpinionCatalog={
  视频:[
   ['未成年人处罚力度过轻','18%','negative'],
   ['未成年身份不应成为免责盾牌','15%','negative'],
   ['需要明确虐待动物的法律责任','14%','positive'],
   ['不应根据网传片段人肉涉事者','13%','positive'],
   ['家长和学校应承担教育责任','12%','neutral'],
   ['原视频是否经过剪辑仍待核验','10%','neutral'],
   ['官方通报回应了主要事实争议','8%','positive'],
   ['热榜传播放大情绪化追责','5%','negative'],
   ['后续讨论应回归制度建设','3%','positive'],
   ['应关注动物救助而非围攻个人','2%','positive']
  ],
  评论:[
   ['送专门学校与行为恶劣程度不匹配','16%','negative'],
   ['虐待流浪动物存在法律规制空白','15%','negative'],
   ['家长和学校应承担教育矫治责任','13%','neutral'],
   ['完善动物保护立法是长期解法','12%','positive'],
   ['反对公布未成年人个人信息','11%','positive'],
   ['未成年人也应承担相应责任','10%','negative'],
   ['现有处置力度低于公众预期','9%','negative'],
   ['应先核实原视频完整语境','6%','neutral'],
   ['官方通报仍需补充关键细节','5%','neutral'],
   ['高赞评论呼吁抵制网络暴力','3%','positive']
  ]
 } as const
 const opinionPool=trendOpinionCatalog[opinionScope]
 const selectedOpinion=opinionPool.find(item=>item[0]===activeOpinion)
 const selectedTone=selectedOpinion?.[2]
 const trendTimes=['06-29','06-30','07-01','07-02','07-03','07-04','07-05','07-06','07-07','07-08','07-09','07-10','07-11','07-12','07-13','07-14','07-15']
 const trendX=trendTimes.map((_,index)=>index*620/(trendTimes.length-1))
 const vvY=[185,176,164,146,118,96,73,58,48,96,122,105,120,92,110,139,161]
 const commentY=[195,191,184,174,157,139,146,127,108,72,88,62,45,68,91,117,143]
 const mainY=opinionScope==='视频'?vvY:commentY
 const videoOpinionRawSeries=[
  [8,9,10,12,14,17,20,24,28,30,31,30,28,25,22,20,18],
  [7,8,9,10,13,16,18,21,25,27,26,24,22,20,18,16,14],
  [6,7,8,9,10,11,12,13,14,15,17,20,22,24,25,26,27],
  [22,21,20,18,17,15,14,13,12,11,12,14,16,18,20,22,23],
  [8,9,10,11,15,18,19,18,17,16,15,14,13,12,11,10,9],
  [32,30,28,25,23,20,17,15,13,11,10,9,8,7,6,5,4],
  [1,1,1,2,2,2,3,3,3,4,5,8,14,24,28,30,31],
  [3,3,4,5,6,7,10,15,24,26,23,18,14,10,7,5,4],
  [3,3,3,3,3,4,4,4,4,5,6,8,10,14,18,21,24],
  [10,10,10,9,8,7,7,6,5,5,5,5,5,5,5,5,5]
 ]
 const commentOpinionRawSeries=[
  [6,7,8,10,12,15,19,23,28,31,30,28,24,20,17,15,13],
  [7,8,9,10,12,14,16,18,20,22,24,25,25,24,23,22,21],
  [8,9,10,12,15,18,21,22,21,20,19,18,17,16,15,14,13],
  [5,6,7,8,9,10,11,12,13,14,16,18,21,24,26,28,30],
  [18,18,17,16,15,14,13,12,11,10,11,13,16,20,22,23,24],
  [8,9,10,12,14,17,19,21,23,25,24,22,20,18,16,14,12],
  [7,8,9,10,11,13,16,20,26,29,31,30,27,24,21,18,15],
  [30,28,26,23,20,17,14,12,10,9,8,7,6,5,4,4,3],
  [1,1,1,1,2,2,2,3,3,4,5,8,14,24,26,27,28],
  [10,10,10,9,9,9,8,8,8,8,9,10,12,14,16,18,19]
 ]
 const normalizeOpinionSeries=(items:readonly (readonly [string,string,string])[],rawSeries:number[][])=>{
  const totals=trendTimes.map((_,timeIndex)=>rawSeries.reduce((sum,series)=>sum+series[timeIndex],0))
  return Object.fromEntries(items.map((item,itemIndex)=>[item[0],rawSeries[itemIndex].map((value,timeIndex)=>Math.round(value/totals[timeIndex]*100))]))
 }
 const opinionSeries={
  ...normalizeOpinionSeries(trendOpinionCatalog.视频,videoOpinionRawSeries),
  ...normalizeOpinionSeries(trendOpinionCatalog.评论,commentOpinionRawSeries)
 } as Record<string,number[]>
 const getTone=(scope:'视频'|'评论',name:string|null)=>name?trendOpinionCatalog[scope].find(item=>item[0]===name)?.[2]:undefined
 const videoFocusTone=getTone('视频',videoOpinionFocus)
 const relatedCommentName=videoOpinionFocus?trendOpinionCatalog.评论.find(item=>item[2]===videoFocusTone)?.[0]||null:null
 const effectiveCommentFocus=commentOpinionFocus||relatedCommentName
 const seriesToTrendY=(series:number[]|undefined)=>{if(!series)return null;const min=Math.min(...series);const max=Math.max(...series);const range=Math.max(1,max-min);return series.map(value=>190-(value-min)/range*142)}
 const focusedVideoY=seriesToTrendY(videoOpinionFocus?opinionSeries[videoOpinionFocus]:undefined)
 const focusedCommentY=seriesToTrendY(effectiveCommentFocus?opinionSeries[effectiveCommentFocus]:undefined)
 const renderedVideoY=focusedVideoY||vvY
 const renderedCommentY=focusedCommentY||commentY
 const sentimentShares=opinionScope==='视频'
  ?{positive:[52,51,50,48,46,43,40,37,33,29,26,23,21,19,18,17,16],neutral:[30,30,29,29,28,27,26,25,24,23,22,21,20,19,19,18,18]}
  :{positive:[43,42,41,39,37,34,31,28,25,22,20,18,17,16,15,14,13],neutral:[34,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,20]}
 const positiveY=mainY.map((y,index)=>210-(210-y)*sentimentShares.positive[index]/100)
 const neutralY=mainY.map((y,index)=>210-(210-y)*(sentimentShares.positive[index]+sentimentShares.neutral[index])/100)
 const commentSentimentShares={positive:[43,42,41,39,37,34,31,28,25,22,20,18,17,16,15,14,13],neutral:[34,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,20]}
 const commentPositiveY=commentY.map((y,index)=>210-(210-y)*commentSentimentShares.positive[index]/100)
 const commentNeutralY=commentY.map((y,index)=>210-(210-y)*(commentSentimentShares.positive[index]+commentSentimentShares.neutral[index])/100)
 const makeLine=(ys:number[])=>ys.map((y,index)=>`${index?'L':'M'}${trendX[index]} ${Math.round(y)}`).join(' ')
 const makeArea=(top:number[],bottom:number[])=>`${makeLine(top)} ${bottom.map((y,reverseIndex)=>{const index=bottom.length-1-reverseIndex;return `L${trendX[index]} ${Math.round(bottom[index])}`}).join(' ')} Z`
 const insightSets={
  视频:[
   {index:4,short:'新华社评论 · 传播加速',title:'新华社客户端发布评论《未成年人保护不是责任豁免》',detail:'07-03 09:20，新华社客户端发布事件评论；央视新闻、央广网随后跟进转载，权威解读连续进入推荐流，带动传播规模持续上升。',impact:'当日传播 VV 较前日 +68%，次日继续增长 37%',evidence:'发文后 2 小时新增 VV 96.4 万；此后 48 小时官媒解读视频累计新增 VV 286.7 万，推荐流贡献 64%'},
   {index:8,short:'抖音热榜第 3 · 负向反超',title:'“揭阳虐狗”升至抖音热榜第 3 位',detail:'07-07 10:10，事件词进入抖音热榜前三，大量用户通过热榜和搜索进入责任争议视频。',impact:'传播 VV 达到全周期峰值，负向观点升至 44%',evidence:'热榜入口带来搜索回流 +126%，争议解读视频新增 VV 186.7 万'},
   {index:13,short:'揭阳公安通报 · 二次扩散',title:'揭阳市公安局官方账号发布《情况通报》',detail:'07-12 08:30，揭阳公安公布阶段性调查与处置进展，人民日报客户端、南方日报等媒体跟进解读。',impact:'传播 VV 出现次高峰，制度讨论占比 +9pp',evidence:'通报相关视频 3 小时新增 VV 82.4 万，媒体账号贡献 61%'}
  ],
  评论:[
   {index:5,short:'央视新闻提问 · 评论 +41%',title:'央视新闻发布跟进视频并置顶责任讨论',detail:'07-04 14:05，央视新闻发布事件跟进视频，并置顶“未成年人应承担何种责任”的讨论提问。',impact:'评论量较前日 +41%，责任追问类评论升至 45%',evidence:'置顶提问获赞 1.2 万，带动 3,800 条回复，二级评论占比 63%'},
   {index:9,short:'热榜第 3 回流 · 处罚争议',title:'抖音热榜第 3 位带动用户集中回流评论区',detail:'07-08 11:40，热榜用户进入新华社、央视新闻及高播放事件视频评论区，讨论集中在处罚尺度。',impact:'评论量达到首个峰值，处罚争议占比升至 32%',evidence:'热榜入口贡献新增评论 38%，前三条高赞评论扩散 2.4 倍'},
   {index:12,short:'揭阳公安开放评论 · 峰值',title:'揭阳公安《情况通报》视频置顶并开放评论',detail:'07-11 18:30，揭阳公安官方账号置顶通报视频，讨论从事实求证转向责任落实与制度建设。',impact:'评论量达到全周期峰值，立法讨论占比 +7pp',evidence:'通报发布 4 小时新增评论 12.6 万，官方账号评论区贡献 47%'}
  ]
 } as const
 const activeInsights=insightSets[opinionScope]
 const peakNodes=activeInsights.map((insight,peakIndex)=>({x:trendX[insight.index],y:mainY[insight.index],insight,peakIndex}))
 const guideTimeIndex=hoverTimeIndex??selectedTimeIndex
 const displayedOpinions=opinionPool.map(item=>{
  const series=opinionSeries[item[0]]
  const share=guideTimeIndex===null?Number.parseFloat(item[1]):series[guideTimeIndex]
  const growth=guideTimeIndex===null?series[series.length-1]-series[0]:guideTimeIndex===0?0:share-series[guideTimeIndex-1]
  const comparison=guideTimeIndex===null?'较期初':guideTimeIndex===0?'首日':'较前日'
  const sortShare=share
  const sortGrowth=growth
  return {name:item[0],share,tone:item[2],growth,comparison,sortShare,sortGrowth}
 }).sort((a,b)=>b.sortShare-a.sortShare).slice(0,5)
 const buildScopeOpinions=(scope:'视频'|'评论')=>trendOpinionCatalog[scope].map(item=>{const series=opinionSeries[item[0]];const share=guideTimeIndex===null?Number.parseFloat(item[1]):series[guideTimeIndex];const growth=guideTimeIndex===null?series[series.length-1]-series[0]:guideTimeIndex===0?0:share-series[guideTimeIndex-1];return {name:item[0],share,tone:item[2],growth}}).sort((a,b)=>b.share-a.share).slice(0,5)
 const videoDisplayedOpinions=buildScopeOpinions('视频')
 const commentDisplayedOpinions=buildScopeOpinions('评论')
 const selectedContribution=selectedOpinion?opinionSeries[selectedOpinion[0]]:null
 const selectedContributionPath=selectedContribution?.map((share,index)=>`${index?'L':'M'}${trendX[index]} ${Math.round(210-(210-mainY[index])*share/100)}`).join(' ')
 const selectedContributionY=guideTimeIndex!==null&&selectedContribution?Math.round(210-(210-mainY[guideTimeIndex])*selectedContribution[guideTimeIndex]/100):null
 const sentimentRatio={negative:.55,positive:.23,neutral:.22}
 const metricRatio=selectedOpinion?(selectedTimeIndex===null?Number.parseFloat(selectedOpinion[1]):selectedContribution?.[selectedTimeIndex]||0)/100:linkedSentiment?sentimentRatio[linkedSentiment]:1
 const metricLabel=selectedOpinion?'观点相关':linkedSentiment?'情绪汇总':'全量'
 const trendMetrics=[['视频量',Math.round(2846*metricRatio).toLocaleString(),metricLabel],['VV 量',(6328.4*metricRatio).toFixed(1)+'万',selectedOpinion?'观点贡献':linkedSentiment?'情绪贡献':'累计播放'],['评论量',(72.1*metricRatio).toFixed(1)+'万',metricLabel],['点赞量',(248.6*metricRatio).toFixed(1)+'万',metricLabel],['关联账号',Math.round(1062*metricRatio).toLocaleString(),metricLabel]]
 const toggleSentiment=(tone:'negative'|'positive'|'neutral')=>{const label=tone==='positive'?'正向情感':tone==='neutral'?'中立情感':'负向情感';setActiveSentiment(tone);onOpinionSelect(activeOpinion===label?null:label)}
 const toggleScopedSentiment=(scope:'video'|'comment',tone:'negative'|'positive'|'neutral')=>scope==='video'?setVideoSentiment(current=>current===tone?null:tone):setCommentSentiment(current=>current===tone?null:tone)
 const selectScopedOpinion=(scope:'视频'|'评论',name:string,tone:string)=>{
  setOpinionScope(scope);setSelectedInsight(null)
  if(scope==='视频'){
   const clearing=videoOpinionFocus===name
   setVideoOpinionFocus(clearing?null:name);setCommentOpinionFocus(null);setLinkedOpinionFilter(clearing?null:{scope:'视频',tone})
   onOpinionSelect(clearing?null:name)
  }else{
   const clearing=commentOpinionFocus===name
   setCommentOpinionFocus(clearing?null:name)
   onOpinionSelect(clearing?(videoOpinionFocus||null):name)
  }
 }
 const handleChartMove=(event:ReactMouseEvent<HTMLDivElement>)=>{const rect=event.currentTarget.getBoundingClientRect();const ratio=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));const nextIndex=Math.round(ratio*(trendTimes.length-1));setHoverTimeIndex(current=>current===nextIndex?current:nextIndex)}
 const handleChartClick=(event:ReactMouseEvent<HTMLDivElement>)=>{if((event.target as HTMLElement).closest('button,header'))return;const rect=event.currentTarget.getBoundingClientRect();const nextIndex=Math.round(Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width))*(trendTimes.length-1));setSelectedTimeIndex(current=>current===nextIndex?null:nextIndex);setSelectedInsight(null);onTimeWindowChange(selectedTimeIndex===nextIndex?null:nextIndex)}
 const selectedInsightItem=selectedInsight===null?null:activeInsights[selectedInsight]
 const selectedInsightNode=selectedInsight===null?null:peakNodes[selectedInsight]
 const comparisonRows=[
  {name:'未成年人处罚力度过轻',video:18,comment:36,tone:'negative',judgement:'评论放大'},
  {name:'未成年身份不应成为免责盾牌',video:15,comment:22,tone:'negative',judgement:'评论放大'},
  {name:'需要明确虐待动物的法律责任',video:14,comment:15,tone:'positive',judgement:'观点共振'},
  {name:'不应根据网传片段人肉涉事者',video:13,comment:21,tone:'positive',judgement:'评论衍生'},
  {name:'家长和学校应承担教育责任',video:12,comment:18,tone:'neutral',judgement:'评论放大'}
 ]
 const displayedComparisonRows=comparisonRows.map((item,index)=>{const time=guideTimeIndex??16;const video=Math.max(3,Math.round(item.video+(time-16)*([.55,.42,-.35,.28,.18][index])));const comment=Math.max(3,Math.round(item.comment+(time-16)*([.82,.58,-.22,.46,.31][index])));return {...item,video,comment,judgement:comment-video>=6?'评论放大':Math.abs(comment-video)<=2?'观点共振':'评论衍生'}})
 return <section className="commandCenter">
  <div className="trendGrid">
   <div className="trendPanel">
    <div className="panelTitle opinionCompareTitle"><div><b>视频 / 评论观点变化趋势</b><small>同时观察内容供给与用户反馈，识别评论放大、观点共振和评论衍生</small></div><span>全周期 · 日粒度</span></div>
    <div className="trendChart" onMouseMove={handleChartMove} onMouseLeave={()=>setHoverTimeIndex(null)} onClick={handleChartClick}>
     <div className="dualOpinionCharts">
      <div className={'dualOpinionRow video '+(videoOpinionFocus?'opinionFocused':'')}><header><div className="rowScopeLabel"><b>视频观点</b><small>{videoOpinionFocus?`已聚焦 · ${videoOpinionFocus}`:'内容表达 · 传播 VV'}</small></div><div className="sentimentStackLegend videoLegend">{([['positive','正向'],['neutral','中立'],['negative','负向']] as const).map(([tone,label])=><button key={tone} aria-pressed={videoSentiment===tone} className={videoSentiment===tone?'selected '+tone:tone} onPointerDown={()=>toggleScopedSentiment('video',tone)}><i/>{label}</button>)}</div></header><svg className={'sentimentStack '+(videoSentiment||'all')} viewBox="0 0 620 210" preserveAspectRatio="none"><path role="button" tabIndex={0} aria-label="视频正向观点" className="stackArea positive" onClick={()=>toggleScopedSentiment('video','positive')} d={makeArea(positiveY,positiveY.map(()=>210))}/><path role="button" tabIndex={0} aria-label="视频中立观点" className="stackArea neutral" onClick={()=>toggleScopedSentiment('video','neutral')} d={makeArea(neutralY,positiveY)}/><path role="button" tabIndex={0} aria-label="视频负向观点" className="stackArea negative" onClick={()=>toggleScopedSentiment('video','negative')} d={makeArea(vvY,neutralY)}/>{focusedVideoY&&<path className="opinionFocusArea video" d={makeArea(focusedVideoY,focusedVideoY.map(()=>210))}/>}<path className={'line vvLine '+(focusedVideoY?'baseline':'')} d={makeLine(vvY)}/>{focusedVideoY&&<path className="line focusedOpinionLine video" d={makeLine(focusedVideoY)}/>} {guideTimeIndex!==null&&<line className={'hoverTimeGuide '+(hoverTimeIndex===null?'pinned':'preview')} x1={trendX[guideTimeIndex]} y1="25" x2={trendX[guideTimeIndex]} y2="210"/>}</svg></div>
      <div className={'dualOpinionRow comment '+(effectiveCommentFocus?'opinionFocused':'')}><header><div className="rowScopeLabel"><b>评论观点</b><small>{commentOpinionFocus?`已聚焦 · ${commentOpinionFocus}`:videoOpinionFocus?`关联反馈 · ${relatedCommentName}`:'用户反馈 · 评论量'}</small></div><div className="sentimentStackLegend commentLegend">{([['positive','正向'],['neutral','中立'],['negative','负向']] as const).map(([tone,label])=><button key={tone} aria-pressed={commentSentiment===tone} className={commentSentiment===tone?'selected '+tone:tone} onPointerDown={()=>toggleScopedSentiment('comment',tone)}><i/>{label}</button>)}</div></header><svg className={'sentimentStack '+(commentSentiment||'all')} viewBox="0 0 620 210" preserveAspectRatio="none"><path role="button" tabIndex={0} aria-label="评论正向观点" className="stackArea positive" onClick={()=>toggleScopedSentiment('comment','positive')} d={makeArea(commentPositiveY,commentPositiveY.map(()=>210))}/><path role="button" tabIndex={0} aria-label="评论中立观点" className="stackArea neutral" onClick={()=>toggleScopedSentiment('comment','neutral')} d={makeArea(commentNeutralY,commentPositiveY)}/><path role="button" tabIndex={0} aria-label="评论负向观点" className="stackArea negative" onClick={()=>toggleScopedSentiment('comment','negative')} d={makeArea(commentY,commentNeutralY)}/>{focusedCommentY&&<path className="opinionFocusArea comment" d={makeArea(focusedCommentY,focusedCommentY.map(()=>210))}/>}<path className={'line commentVolumeLine '+(focusedCommentY?'baseline':'')} d={makeLine(commentY)}/>{focusedCommentY&&<path className="line focusedOpinionLine comment" d={makeLine(focusedCommentY)}/>} {guideTimeIndex!==null&&<line className={'hoverTimeGuide '+(hoverTimeIndex===null?'pinned':'preview')} x1={trendX[guideTimeIndex]} y1="25" x2={trendX[guideTimeIndex]} y2="210"/>}</svg></div>
     </div>
     <div className="dualAiOverlay">{insightSets.视频.map((insight,index)=><button key={'video-'+insight.short} className={'video point'+index+' '+(opinionScope==='视频'&&selectedInsight===index?'active':'')} style={{left:(trendX[insight.index]/620*100)+'%',top:28+renderedVideoY[insight.index]/210*180}} aria-label={`视频 AI 洞察：${insight.title}`} aria-expanded={opinionScope==='视频'&&selectedInsight===index} onClick={event=>{event.stopPropagation();setOpinionScope('视频');setSelectedTimeIndex(insight.index);setSelectedInsight(current=>opinionScope==='视频'&&current===index?null:index);onTimeWindowChange(insight.index)}}><span>AI · {insight.short}</span></button>)}{insightSets.评论.map((insight,index)=><button key={'comment-'+insight.short} className={'comment point'+index+' '+(opinionScope==='评论'&&selectedInsight===index?'active':'')} style={{left:(trendX[insight.index]/620*100)+'%',top:238+renderedCommentY[insight.index]/210*180}} aria-label={`评论 AI 洞察：${insight.title}`} aria-expanded={opinionScope==='评论'&&selectedInsight===index} onClick={event=>{event.stopPropagation();setOpinionScope('评论');setSelectedTimeIndex(insight.index);setSelectedInsight(current=>opinionScope==='评论'&&current===index?null:index);onTimeWindowChange(insight.index)}}><span>AI · {insight.short}</span></button>)}{selectedInsightItem&&<div className={'dualAiInsightCard '+(opinionScope==='评论'?'comment':'video')} style={{left:(trendX[selectedInsightItem.index]/620*100)+'%',top:opinionScope==='视频'?28+renderedVideoY[selectedInsightItem.index]/210*180:238+renderedCommentY[selectedInsightItem.index]/210*180}} role="status" onClick={event=>event.stopPropagation()}><button aria-label="关闭 AI 洞察" onClick={()=>setSelectedInsight(null)}><X size={11}/></button><span>AI 洞察 · {opinionScope} · {trendTimes[selectedInsightItem.index]}</span><b>{selectedInsightItem.title}</b><p>{selectedInsightItem.detail}</p><dl><div><dt>指标变化</dt><dd>{selectedInsightItem.impact}</dd></div><div><dt>判断依据</dt><dd>{selectedInsightItem.evidence}</dd></div></dl></div>}</div>
     {trendX.map((x,index)=><button key={trendTimes[index]} className={'timePointMarker'+(selectedTimeIndex===index?' selected':'')+(hoverTimeIndex===index?' hovering':'')} style={{left:(x/620*100)+'%',top:(mainY[index]/210*185)+'px'}} aria-label={`${trendTimes[index]}，${opinionScope==='视频'?'传播 VV':'评论量'}时间点${selectedTimeIndex===index?'，已定位':''}`} aria-pressed={selectedTimeIndex===index} onMouseEnter={()=>setHoverTimeIndex(index)} onFocus={()=>setHoverTimeIndex(index)} onBlur={()=>setHoverTimeIndex(null)} onClick={()=>{const next=selectedTimeIndex===index?null:index;setHoverTimeIndex(null);setSelectedTimeIndex(next);setSelectedInsight(null);onTimeWindowChange(next)}}/>)}
     {selectedContributionY!==null&&guideTimeIndex!==null&&<i className={'opinionPointMarker '+selectedTone} style={{left:(trendX[guideTimeIndex]/620*100)+'%',top:(selectedContributionY/210*185)+'px'}}/>}
     {peakNodes.map(({x,y,insight,peakIndex})=><button key={insight.short} className={'peakMarker signalMarker ai peak'+peakIndex+(selectedInsight===peakIndex?' active':'')} style={{left:(x/620*100)+'%',top:(y/210*185)+'px'}} aria-label={`AI 分析：${insight.title}`} aria-expanded={selectedInsight===peakIndex} onClick={()=>{setHoverTimeIndex(null);setSelectedTimeIndex(insight.index);setSelectedInsight(current=>current===peakIndex?null:peakIndex);onTimeWindowChange(insight.index)}}><span><i/>AI · {insight.short}</span></button>)}
     {selectedInsightItem&&selectedInsightNode&&<div className={'chartInsightPopover peak'+selectedInsight} style={{left:(selectedInsightNode.x/620*100)+'%',top:(selectedInsightNode.y/210*185)+'px'}} role="status" onMouseMove={event=>event.stopPropagation()}>
      <button className="chartInsightClose" aria-label="关闭 AI 分析" onClick={()=>setSelectedInsight(null)}><X size={12}/></button>
      <span>AI 分析 · {trendTimes[selectedInsightItem.index]} · 触发事件</span>
      <b>{selectedInsightItem.title}</b>
      <p>{selectedInsightItem.detail}</p>
      <div><em>指标变化</em><strong>{selectedInsightItem.impact}</strong><em>判断依据</em><strong>{selectedInsightItem.evidence}</strong></div>
     </div>}
     <div className="trendLabels dailyRange"><span>06-29</span><span>07-03</span><span>07-07</span><span>07-11</span><span>07-15</span></div>
    </div>
   </div>
   <aside className="coreOpinionPanel flatOpinionPanel">
    <div className="opinionPeriod"><span>{guideTimeIndex===null?'时间周期':'当前时间'}</span><b>{guideTimeIndex===null?`${trendTimes[0]} — ${trendTimes[trendTimes.length-1]}`:trendTimes[guideTimeIndex]}</b>{selectedTimeIndex!==null&&<button onClick={()=>{setSelectedTimeIndex(null);setSelectedInsight(null);onTimeWindowChange(null)}}>恢复全周期</button>}</div>
    {([['视频',videoDisplayedOpinions],['评论',commentDisplayedOpinions]] as const).map(([scope,items])=>{const linkedFromVideo=scope==='评论'&&Boolean(videoOpinionFocus);return <section key={scope} className={'flatOpinionGroup '+(opinionScope===scope?'active':'')}><header><button onClick={()=>{setOpinionScope(scope);setSelectedInsight(null)}}><span><b>{scope}观点</b><SourceBadge type="ai"/></span></button><span>{linkedFromVideo?'视频观点关联反馈':guideTimeIndex===null?'全周期占比':`${trendTimes[guideTimeIndex]} · 较前日`}</span></header><div>{items.map((item,index)=>{const selected=scope==='视频'?videoOpinionFocus===item.name:commentOpinionFocus===item.name;const linked=Boolean(linkedFromVideo&&item.tone===videoFocusTone);const dimmed=Boolean(linkedFromVideo&&!linked);return <button key={item.name} className={(selected?'selected ':'')+(linked?'linked ':'')+(dimmed?'dimmed':'')} onClick={()=>selectScopedOpinion(scope,item.name,item.tone)}><i>{index+1}</i><span>{item.name}</span><em className={item.tone}>{item.tone==='negative'?'负向':item.tone==='positive'?'正向':'中立'}</em><b>{item.share}%<small>{linked?'关联':guideTimeIndex===null?'':`${item.growth>=0?'+':''}${item.growth}pp`}</small></b></button>})}</div></section>})}
   </aside>
  </div>
  <div className="trendMetricCards">{trendMetrics.map(item=><article key={item[0]}><span>{item[0]}</span><b>{item[1]}</b><em>{item[2]}</em></article>)}</div>
 </section>
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
function InteractiveSankey({select,onVideoFilter,activeVideoFilter,activeOpinion,preferredSource}:{select:(type:string,item:any)=>void,onVideoFilter:(keyword:string|null)=>void,activeVideoFilter:string|null,activeOpinion:string|null,preferredSource:string}){
 const [sourceId,setSourceId]=useState(preferredSource)
 const canvasRef=useRef<HTMLDivElement>(null)
 const [canvasWidth,setCanvasWidth]=useState(1000)
 const [linkGeometry,setLinkGeometry]=useState<any>(null)
 const source:any=trafficTree.find(item=>item.id===sourceId) || trafficTree[0]
 const analysisBase=channelAnalysis[source.id]
 const [feedLayerId,setFeedLayerId]=useState('m1')
 const chooseSource=(item)=>{setSourceId(item.id);setFeedLayerId('m1');onVideoFilter(null)}
 useEffect(()=>{setSourceId(preferredSource);setFeedLayerId('m1');onVideoFilter(null)},[preferredSource])
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
 const channelBenchmarks:any={feed:{current:60.3,base:58,previous:72,decision:'推荐仍是主渠道，但贡献正在下降'},search:{current:19.1,base:12,previous:8,decision:'高于基线 7.1pp，存在搜索回流'},message:{current:6.8,base:4.5,previous:3.9,decision:'群聊分享偏高，需定位高分享视频'},profile:{current:4.9,base:7.2,previous:5.1,decision:'主页回访低于基线，暂不优先'},local:{current:3.1,base:6.4,previous:3.5,decision:'同城影响有限，保持观察'}}
 const benchmark=channelBenchmarks[source.id]||{current:Number.parseFloat(source.share),base:5,previous:4,decision:'当前渠道未发现显著异常'}
 const benchmarkItems=[trafficTree[0],trafficTree[1],trafficTree[2],trafficTree[3],trafficTree[5]]
 return <div className="hierSankey channelSankey"><div className="sankeyHead"><div><b>传播渠道决策</b><span>当前事件 vs 同类事件大盘基线；点击渠道继续定位内容和主体</span></div><div className="pathCrumb"><span>{source.name}</span><ChevronRight/><b>{dimensionLabel}</b></div></div><div className="channelBenchmarkStrip">{benchmarkItems.map(item=>{const data=channelBenchmarks[item.id];const delta=data.current-data.base;return <button key={item.id} className={source.id===item.id?'selected':''} onClick={()=>chooseSource(item)}><span>{item.name}<em>{delta>=0?'+':''}{delta.toFixed(1)}pp</em></span><b>{data.current}%</b><small>大盘基线 {data.base}%</small><i><u style={{width:Math.min(100,data.current/75*100)+'%'}}/><u className="base" style={{left:Math.min(98,data.base/75*100)+'%'}}/></i></button>})}<div className="channelDecisionCard"><Sparkles size={14}/><span><small>当前判断</small><b>{benchmark.decision}</b><em>上一阶段 {benchmark.previous}% · 建议继续查看该渠道承载观点与关键视频</em></span></div></div><div ref={canvasRef} className={'flowCanvas twoLevel '+(source.id==='feed'?'feedThreeLevel allFeedTargets':'')}><svg viewBox={`0 0 ${canvasWidth} 500`} preserveAspectRatio="none">{source.children.map((item,i)=>{const start=measuredSource||{x:firstRight,y:sourceY},end=measuredSecond(i)||{x:secondLeft,y:secondY[i]};return <g key={'s-'+item.id}><path className="active" d={`M${start.x} ${start.y} C${start.x+(end.x-start.x)*.42} ${start.y} ${start.x+(end.x-start.x)*.58} ${end.y} ${end.x} ${end.y}`} style={{strokeWidth:Math.max(7,item.value/source.value*42)}}/><text className="flowLinkLabel" x={(start.x+end.x)/2} y={(start.y+end.y)/2-5}>{(item.value/source.value*100).toFixed(1)}%</text></g>})}{feedThirdItems.map(({parent,parentIndex,item},allIndex)=>{const start=linkGeometry?.secondRight?.[parentIndex]||{x:secondRight,y:secondY[parentIndex]},end=measuredThird(allIndex)||{x:thirdLeft,y:thirdNodeY(allIndex)};return <path key={parent.id+'-'+item[0]} className={'tertiary '+parent.id} d={`M${start.x} ${start.y} C${start.x+(end.x-start.x)*.42} ${start.y} ${start.x+(end.x-start.x)*.58} ${end.y} ${end.x} ${end.y}`} style={{strokeWidth:Math.max(2,item[1]/source.value*18)}}/>})}</svg><div className="flowColumn levelOne"><h4>一级 · 流量渠道（单选）</h4>{trafficTree.map(item=><button key={item.id} className={source.id===item.id?'selected':''} aria-pressed={source.id===item.id} onClick={()=>chooseSource(item)}><span>{item.name}<small>{item.share}</small></span><b>{item.value.toLocaleString()}万</b></button>)}</div><div className="flowColumn levelTwo"><h4>二级 · {dimensionLabel}</h4>{source.children.map(item=><button key={item.id}><span>{item.name}<small>{(item.value/source.value*100).toFixed(1)}%</small></span><b>{item.value.toLocaleString()}万</b></button>)}</div>{source.id==='feed'&&<div className="flowColumn levelThree actionColumn"><h4>三级 · 业务归属</h4><div className="feedGroupTotals">{source.children.map(item=><span key={item.id} className={item.id}><i/>{item.name.replace('流量','')}<b>{(item.value/source.value*100).toFixed(1)}%</b></span>)}</div>{feedThirdItems.map(({parent,item})=><button key={parent.id+'-'+item[0]} onClick={()=>onVideoFilter(item[0])}><span><i className={'feedGroupDot '+parent.id}/>{item[0]}<small>{(item[1]/parent.value*100).toFixed(2)}%</small></span><b>{item[1].toLocaleString()}万</b></button>)}</div>}</div>{source.id==='feed'&&<MultiObjectiveContribution/>}<div className="channelAnalysis"><div className="analysisTitle"><div><b>{analysis.title}</b><span>{analysis.dimension}</span></div><div><em>{source.name} 流量 {source.value.toLocaleString()}万</em><span>数据范围：近 7 天</span></div></div><div className="analysisTable"><div className="analysisRow head"><span>类型</span><b>分析项</b><em>{source.id==='search'?'搜索次数':'流量'}</em><i>渠道占比</i><u>关键指标</u></div>{analysis.rows.map((row,index)=><button className={'analysisRow '+(activeVideoFilter===row[1]?'selected':'')} aria-pressed={activeVideoFilter===row[1]} key={row[1]} onClick={()=>onVideoFilter(row[1])}><span>{row[0]}</span><b><small>{index+1}</small>{row[1]}</b><em>{row[2]}</em><i>{row[3]}</i><u>{row[4]}</u><ChevronRight/></button>)}</div><div className="analysisInsight"><b>决策动线</b><span>基线异常 → 查看承载观点 → 定位关键视频与账号 → 进入传播关系链核验证据。</span></div></div><div className="sankeyFoot"><span>当前选中渠道</span><b>{source.name}</b><em>全站流量占比 {source.share}</em><i>点击分析层或分析项可筛选下方代表视频</i></div></div>
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
function Stats({open,setOpen,select,addToChat,activeOpinion,onOpinionChange,timeContext}){
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
 const opinionProfile=getOpinionFilterProfile(activeOpinion)
 const timeSeed=timeContext.index===null?0:timeContext.index+1
 const hasAnalysisFilter=Boolean(activeOpinion)||timeContext.index!==null
 const summaryTitle=activeOpinion?`“${activeOpinion}”传播结果`:`${timeContext.date} 窗口结果`
 return <>{hasAnalysisFilter&&<FilterResultSummary title={summaryTitle} items={[
  ['命中视频',String(activeOpinion?opinionProfile.matchedVideos:184+timeSeed*17),`代表视频 ${filteredVideos.length} 条`],
  ['贡献 VV',activeOpinion?opinionProfile.vv:`${(82.6+timeSeed*18.7).toFixed(1)}万`,timeContext.index!==null?'当前窗口增量':'观点贡献'],
  ['关联账号',String(activeOpinion?opinionProfile.accounts:21+timeSeed*4),`较全周期 -${38-timeSeed}`],
  ['风险内容占比',activeOpinion?opinionProfile.risk:`${12+timeSeed*2.4}%`,opinionProfile.tone]
 ]}/>}<InteractiveSankey select={select} activeVideoFilter={videoFilter} onVideoFilter={setVideoFilter} activeOpinion={activeOpinion} preferredSource={timeContext.sourceId}/>
 <div className="dataToolbar"><div>{['近 24 小时','近 7 天','全部周期'].map(item=><button key={item} className={period===item?'selected':''} onClick={()=>setPeriod(item)}>{item}</button>)}</div></div><div className="sankey"><div className="sLabels"><span>内容发布</span><span>主要入口</span><span>细分场景</span><span>用户行为</span></div><div className="chart"><svg viewBox="0 0 1000 230" preserveAspectRatio="none"><path className="p1" d="M82 24 C210 24 230 24 314 24 L314 100 C220 96 188 86 82 76Z"/><path className="p2" d="M82 82 C210 94 236 110 314 110 L314 153 C210 149 184 137 82 120Z"/><path className="p3" d="M82 128 C210 145 240 161 314 165 L314 196 C210 191 190 180 82 164Z"/><path className="p4" d="M82 173 C210 191 240 202 314 204 L314 224 C200 218 180 210 82 205Z"/><path className="p1" d="M365 24 C480 24 500 24 600 24 L600 82 C490 76 450 85 365 100Z"/><path className="p1 low" d="M365 51 C480 67 500 104 600 105 L600 135 C490 130 442 118 365 100Z"/><path className="p2" d="M365 110 C490 113 520 124 600 125 L600 159 C490 159 440 154 365 153Z"/><path className="p3" d="M365 165 C490 168 520 178 600 180 L600 205 C490 204 440 201 365 196Z"/><path className="p1" d="M650 24 C750 24 790 26 913 26 L913 75 C780 74 730 70 650 82Z"/><path className="p2" d="M650 105 C750 108 790 112 913 112 L913 149 C780 145 725 139 650 135Z"/><path className="p3" d="M650 125 C750 134 790 165 913 165 L913 194 C780 188 725 170 650 159Z"/></svg><span className="node origin">关联视频<b>2,846</b></span><button className="node feed" onClick={()=>select('path',{name:'Feed 推荐'})}>Feed 推荐<b>60.3%</b></button><span className="node search">站内搜索<b>19.1%</b></span><span className="node profile">个人主页<b>12.6%</b></span><span className="node share">分享回流<b>8.0%</b></span><span className="node rec">推荐页<b>41.7%</b></span><span className="node local">同城页<b>18.6%</b></span><span className="node hot">热榜<b>13.9%</b></span><span className="node key">关键词<b>8.2%</b></span><span className="node views">有效播放<b>6,328.4万</b></span><span className="node acts">互动行为<b>384.7万</b></span><span className="node trans">转发传播<b>58.2万</b></span></div></div>
 <div className="paths">{paths.map((p,i)=><div key={p.id} className={open.includes(p.id)?'open':''}><button className="pathTrigger" aria-expanded={open.includes(p.id)} onClick={()=>togglePath(p.id)}><i className={'pathIcon pi'+i}><Play size={13}/></i><b>{p.name}</b><span>{p.plays}</span><em>{p.ratio}</em><u><i style={{width:p.ratio}}/></u><ChevronDown size={16}/></button>{open.includes(p.id)&&<article className="pathExpanded"><div className="pathSummary"><p>细分流量场景 <b>{p.scenes}</b></p><p>路径洞察 <b>{p.insight}</b></p></div><div className="pathDetailGrid"><section><h4>流量场景明细</h4>{p.breakdown.map(row=><div className="breakdown" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><em>{row[2]}</em></div>)}</section><section><h4>观点聚合</h4><p className="viewMix">{p.views}</p>{p.id==='search'&&<><h4 className="keywordTitle">相关搜索词</h4><div className="keywords">{Object.keys(searchResults).map(word=><button key={word} className={activeKeyword===word?'selected':''} onClick={()=>setActiveKeyword(word)}>{word}</button>)}</div></>}<div className="related"><h4>{p.id==='search'?'“'+activeKeyword+'”关联内容':'关联站内内容'}</h4>{(p.id==='search'?searchResults[activeKeyword]:p.contents).map((content,index)=><button key={content} onClick={()=>select('path',{name:content})}><span>{index+1}</span>{content}<ChevronRight size={13}/></button>)}</div></section></div><button className="insightButton" onClick={()=>select('path',{name:p.name})}>查看路径洞察<ChevronRight size={14}/></button></article>}</div>)}</div>
 <div id="filtered-video-results" className={(videoFilter||activeOpinion||accountType!=='全部')?'isFiltered':''}><Section title="热点观点与代表视频" desc={activeOpinion?`已按观点“${activeOpinion}”筛选，当前展示 ${filteredVideos.length} 条代表视频`:videoFilter?`已按分析项“${videoFilter}”筛选，共 ${filteredVideos.length} 条代表视频`:accountType!=='全部'?`已筛选 ${accountType}，当前展示 ${filteredVideos.length} 条代表视频`:'基于统计数据汇总代表视频，AI 辅助完成文案、OCR 和 ASR 语义聚合'} action={(videoFilter||activeOpinion)?<button className="videoFilterChip" onClick={()=>{setVideoFilter(null);onOpinionChange(null)}}><ScanLine size={12}/>{activeOpinion||videoFilter}<X size={12}/></button>:null} source="data"/><div className="videoOpinionFilters"><span>观点筛选</span>{videoOpinionOptions.map(item=><button key={item[0]} className={`${item[2]} ${activeOpinion===item[0]?'selected':''}`} onClick={()=>onOpinionChange(activeOpinion===item[0]?null:item[0])}>{item[0]} <b>{item[1]}</b></button>)}</div><div className="videoAccountFilters"><span>账号类型</span>{['全部','B号','C号'].map(item=><button key={item} className={accountType===item?'selected':''} onClick={()=>setAccountType(item)}>{item}</button>)}</div><div className="cards videoListGrid">{filteredVideos.map((v,i)=><VideoCard key={v.id} v={v} i={i} select={select} addToChat={addToChat}/>)}</div></div></>
}
function Section({title,desc,action,source}:{title:string,desc:string,action:any,source?:'data'|'ai'}){return <div className="section"><div><h2>{title}{source&&<SourceBadge type={source}/>}</h2><p>{desc}</p></div>{action}</div>}
function FilterResultSummary({title,items}:{title:string,items:[string,string,string][]}){
 return <div className="filterResultSummary" aria-live="polite">
  <div><ScanLine size={14}/><span><small>筛选结果</small><b>{title}</b></span></div>
  {items.map(([label,value,change])=><p key={label}><span>{label}</span><b>{value}</b><em>{change}</em></p>)}
 </div>
}
function ChainTimeline({value,onChange,total,label}:{value:number,onChange:(value:number)=>void,total:number,label:string}){
 const points=analysisDates
 const stageDates=[0,2,4,6,8,11,16]
 const displayValue=stageDates[value]??value
 const [playing,setPlaying]=useState(false)
 useEffect(()=>{if(!playing)return;if(displayValue>=points.length-1){setPlaying(false);return}const timer=window.setTimeout(()=>onChange(displayValue+1),900);return()=>window.clearTimeout(timer)},[playing,displayValue,onChange])
 const togglePlay=()=>{if(playing){setPlaying(false);return}if(displayValue>=points.length-1)onChange(0);setPlaying(true)}
 return <div className="chainTimeline"><div className="timelineMeta"><span><Clock3 size={13}/>{label}</span><b>{points[displayValue]}</b><em>已出现 {total} 个实体</em><button className={playing?'timelinePlay playing':'timelinePlay'} onClick={togglePlay} aria-label={playing?'暂停时间轴':'播放时间轴'}>{playing?<Pause size={13} fill="currentColor"/>:<Play size={13} fill="currentColor"/>}<span>{playing?'暂停':'播放'}</span></button></div><div className="timelineTrack"><input type="range" min="0" max={points.length-1} step="1" value={displayValue} onChange={event=>{setPlaying(false);onChange(Number(event.target.value))}}/><div className="timelineTicks">{points.map((point,index)=><button key={point} className={index<=displayValue?'reached':''} onClick={()=>{setPlaying(false);onChange(index)}}><i/><span>{point}</span></button>)}</div></div><small>与上方趋势图使用同一日期轴；选择日期后自动定位链路扩散状态</small></div>
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
function EventMainChain(){
 const views=['内容','账号','互动','风险'],turns=['站内首发','风险首发','Feed 起量','评论放大','群聊外溢']
 const [view,setView]=useState('内容'),[focusTurn,setFocusTurn]=useState<number|null>(null),[selectedNode,setSelectedNode]=useState<string|null>(null),[detailTab,setDetailTab]=useState('视频列表')
 const [detailVideo,setDetailVideo]=useState<any>(null)
 const nodes:any[]=[
  {id:'source',kind:'实体对象',title:'站内首发视频',attr:'现场原始画面 · VID 824913',risk:42,metrics:['VV 18.6万','账号 1','转载 0'],reason:'提供事件原始素材，暂未形成明确风险表达。',action:'保全原始证据'},
  {id:'riskVideo',kind:'实体对象',title:'风险首发视频',attr:'“救援不及时” · VID 825074',risk:91,metrics:['VV 286万','完播 78%','互动 12%'],reason:'首次将现场画面解释为“救援不及时”，成为风险叙事源头。',action:'切断推荐'},
  {id:'feed',kind:'归因对象',title:'Feed 推荐起量',attr:'冷启动 → 二轮扩量',risk:86,metrics:['增量 +180%','TOP 0.3%','曝光 168万'],reason:'冷启动数据超过同档位 P90，触发连续扩量。',action:'回滚推荐流量'},
  {id:'opinion',kind:'归因对象',title:'指责型观点簇',attr:'“救援不及时”语义簇',risk:89,metrics:['视频 84','评论 326','覆盖 61%'],reason:'指责表达被视频标题、字幕与评论反复复述。',action:'召回视频 · 定位评论'},
  {id:'comment',kind:'集合对象',title:'高赞评论簇',attr:'37 条核心评论',risk:88,metrics:['点赞 12.6万','增长 +370%','回访 4.8万'],reason:'高赞排序让风险表达持续占据评论区首屏。',action:'折叠高赞评论'},
  {id:'search',kind:'集合对象',title:'搜索词簇',attr:'“揭阳 救援不及时”',risk:82,metrics:['搜索 8.2万','涨幅 +46%','视频 126'],reason:'评论表达转化为搜索需求并产生持续回流。',action:'干预搜索词'},
  {id:'remix',kind:'集合对象',title:'同画面二创内容簇',attr:'126 个相似视频',risk:84,metrics:['相似度 91%','VV 98.4万','账号 73'],reason:'原画面被裁剪、配音和字幕改写后批量复用。',action:'批量召回相似视频'},
  {id:'group',kind:'集合对象',title:'群聊承接簇',attr:'17 个风险群',risk:87,metrics:['桥接用户 9','分享 8.4K','回流 23.6万'],reason:'桥接用户把二创内容带入多个群聊并形成回流。',action:'定位桥接用户'},
  {id:'riskSurface',kind:'归因对象',title:'外溢风险面',attr:'推荐 × 搜索 × 社交',risk:93,metrics:['覆盖 412.8万','残余 VV 30%','对象 382'],reason:'风险扩散为跨内容、互动和社交场景的复合风险。',action:'生成联合处置单'}
 ]
 const edges:any[]=[
  ['风险演化','原始现场画面被加入指责性解释','语义风险 +49分','风险表达首次出现时召回'],
  ['推荐放量','冷启动数据超过 P90，进入连续推荐','VV 增量 +180%','切断推荐并冻结扩量'],
  ['观点扩散','推荐曝光把视频叙事转化为稳定观点','观点覆盖 61%','生成语义规则定位承载视频'],
  ['观点传导','相同观点进入高赞区并获得排序优势','重合度 78% · 高赞 37条 · 评论 +370%','折叠评论并召回承载视频'],
  ['搜索回流','评论表达被用户转化为主动搜索','搜索 8.2w · 涨幅 46%','干预风险搜索词'],
  ['内容相似','风险首发画面被裁剪配音再次投稿','画面相似 91% · 下游 126个视频','批量召回相似内容'],
  ['群聊桥接','二创视频通过桥接用户进入群聊','17个风险群 · 9个桥接用户 · 分享 8.4k','定位桥接用户和供货账号'],
  ['风险汇聚','推荐、搜索与群聊共同形成残余传播','残余 VV 30%','执行跨场景联合处置']
 ]
 const turnSegments=[[0,1],[1,2],[2,3],[3,5],[6,8]]
 const videosMock=[{title:'现场视频：救援人员迟迟未到？',id:'825074',time:'06-29 16:18',account:'揭阳现场',vv:'286万',risk:91,match:'96%',role:'风险首发',stage:'二轮扩量',status:'推荐已切断'},{title:'同一现场多角度记录，救援是否及时',id:'825311',time:'06-29 17:02',account:'民生视角',vv:'96.4万',risk:86,match:'91%',role:'核心二创',stage:'主池放量',status:'待召回'},{title:'“救援不及时”说法引发争议',id:'825842',time:'06-29 18:26',account:'本地热讯',vv:'82.7万',risk:84,match:'88%',role:'观点放大',stage:'二轮扩量',status:'审核中'}]
 const commentsMock=[['救援这么久都没来，谁负责？','VID 825074','3.8万','89','94%','已折叠'],['不是没人救，是根本不重视','VID 825311','2.6万','86','91%','待处置'],['现场这么多人为什么没人管','VID 825842','1.9万','82','87%','审核中']]
 const searchMock=[['揭阳 救援不及时','8.2万','+46%','126','88','已干预'],['揭阳现场视频','5.6万','+32%','84','76','监控中'],['救援人员为什么没到','3.1万','+28%','51','81','待干预']]
 const viewCopy:any={内容:{metric:'相似度 91%',reason:'关注画面复用、字幕改写和二创扩散',action:'召回相似视频'},账号:{metric:'关联账号 73',reason:'关注供货账号、桥接账号和共设备关系',action:'封禁供货账号'},互动:{metric:'集中度 68%',reason:'关注完播、互动率和异常账号集中度',action:'清理异常互动'},风险:{metric:'传导层级 5',reason:'关注风险分、传导层级和下游覆盖',action:'生成联合处置单'}}
 const tabs=['视频列表','评论列表','搜索词','关联账号','处置建议'],nodeIndex=selectedNode?nodes.findIndex(node=>node.id===selectedNode):-1
 const focused=(index:number)=>focusTurn===null||turnSegments[focusTurn].includes(index)||turnSegments[focusTurn].includes(index-1)
 const openNode=(node:any)=>{setSelectedNode(node.id);setDetailVideo(null);setDetailTab(node.id==='comment'?'评论列表':node.id==='search'?'搜索词':'视频列表')}
 return <div className="eventMainChain"><Section title="事件传播主链路图" desc="默认展示站内扩散全景；点击拐点聚焦放大机制，点击关键簇下钻承载对象" action={<div className="mainChainViewSwitch">{views.map(item=><button key={item} className={view===item?'selected':''} onClick={()=>setView(item)}>{item}视角</button>)}</div>}/>
  <div className="mainChainTimeline"><header><b>VV 趋势与关键拐点</b><span>{focusTurn===null?'全景主链路':'聚焦：'+turns[focusTurn]}</span><button className={focusTurn===null?'selected':''} onClick={()=>setFocusTurn(null)}>查看全景</button></header><div className="miniVvTrend"><svg viewBox="0 0 1000 72" preserveAspectRatio="none"><path className="area" d="M20 62 C120 61 155 57 220 49 S310 15 390 29 S505 10 590 17 S690 39 755 31 S870 51 980 56 L980 68 L20 68Z"/><path d="M20 62 C120 61 155 57 220 49 S310 15 390 29 S505 10 590 17 S690 39 755 31 S870 51 980 56"/></svg>{turns.map((item,index)=><button key={item} className={focusTurn===index?'selected':''} style={{left:`${[8,27,48,69,89][index]}%`,top:`${[48,28,13,31,47][index]}px`}} onClick={()=>setFocusTurn(focusTurn===index?null:index)}><i/><span>{item}</span></button>)}</div></div>
  <div className="mainChainWorkbench"><div className="mainChainCanvas"><div className="mainChainPath">{nodes.map((node,index)=><div key={node.id} className={'chainStep '+(!focused(index)?'dimmed ':'')+(selectedNode===node.id?'selected ':'')+(node.id==='riskSurface'?'riskSurface ':'')}><button className="chainObjectCard" onClick={()=>openNode(node)}><header><span>{node.kind}</span><em>风险 {node.risk}</em></header><b>{node.title}</b><small>{node.attr}</small><div className="chainMetrics"><span>{node.metrics[0]}</span><span>{node.metrics[1]}</span><span>{viewCopy[view].metric}</span></div><p>{view==='内容'?node.reason:viewCopy[view].reason}</p><footer>{node.kind==='归因对象'&&node.id==='opinion'?'召回承载视频 · 定位高赞评论 · 生成语义规则':view==='内容'?node.action:viewCopy[view].action}</footer></button>{index<edges.length&&<button className="chainMechanism" onClick={()=>setFocusTurn(Math.min(4,Math.floor(index/2)))}><b>{edges[index][0]}</b><span>{view==='内容'?edges[index][1]:viewCopy[view].reason}</span><em>{edges[index][2]}</em><small>{edges[index][3]}</small><i>→</i></button>}</div>)}</div></div>
   <aside className="mainChainInspector">{detailVideo?<SingleVideoWhyHot video={detailVideo} onBack={()=>setDetailVideo(null)}/>:selectedNode?<><header><span>{nodes[nodeIndex].kind}</span><b>{nodes[nodeIndex].title}</b><small>{nodes[nodeIndex].attr} · 风险 {nodes[nodeIndex].risk}</small></header>{nodes[nodeIndex].id==='riskSurface'?<RiskSurfaceReport/>:<><nav>{tabs.map(tab=><button key={tab} className={detailTab===tab?'selected':''} onClick={()=>setDetailTab(tab)}>{tab}</button>)}</nav><CarrierObjectsTable tab={detailTab} videos={videosMock} comments={commentsMock} searches={searchMock} onVideo={setDetailVideo}/></>}</>:focusTurn!==null?<TurningPointInsight name={turns[focusTurn]} index={focusTurn}/>:<MainChainOverview/>}</aside>
  </div>
 </div>
}
function MainChainOverview(){return <div className="mainOverview"><header><span>全景研判</span><b>风险由推荐起量，经评论与搜索放大，最终向群聊外溢</b></header><dl><div><dt>核心风险源</dt><dd>VID 825074</dd></div><div><dt>累计覆盖</dt><dd>412.8万 VV</dd></div><div><dt>关键拐点</dt><dd>5 个</dd></div><div><dt>可处置对象</dt><dd>382 个</dd></div></dl><h4>建议处置顺序</h4><ol><li>切断风险首发视频推荐</li><li>批量召回 126 个相似视频</li><li>折叠 37 条高赞风险评论</li><li>干预 3 个风险搜索词</li><li>定位 9 个群聊桥接用户</li></ol></div>}
function TurningPointInsight({name,index}:{name:string,index:number}){const data=[['风险叙事尚未形成，是最低成本的证据保全窗口','在首次风险表达前拦截可减少 94% 后续曝光'],['“救援不及时”首次绑定现场画面并成为传播母本','此处召回预计减少 86% 后续曝光'],['完播率 78%、互动率 12%，超过同档位 P90，触发推荐扩量','冷启动结束前切断可减少 72% 曝光'],['观点重合度 78%，37 条高赞评论推动评论增长 370%','排序形成前干预可减少 48% 搜索回流'],['17 个风险群由 9 个桥接用户连接，站内回流持续','群聊外溢前拦截可减少 30% 残余 VV']][index];return <div className="turnInsight"><header><span>关键拐点</span><b>{name}</b></header><section><h4>为什么重要</h4><p>{data[0]}</p></section><section><h4>为什么放大</h4><p>{index<2?'风险解释改变了原始内容的传播性质。':'分发与互动信号叠加，使风险进入下一传播阶段。'}</p></section><strong>{data[1]}</strong><button>生成拐点处置方案</button></div>}
function CarrierObjectsTable({tab,videos,comments,searches,onVideo}:{tab:string,videos:any[],comments:any[],searches:any[],onVideo:(video:any)=>void}){if(tab==='视频列表')return <div className="carrierTable"><div className="tableTitle"><b>承载视频</b><span>共 84 条 · 展示风险贡献 Top 3</span></div>{videos.map(v=><button key={v.id} onClick={()=>onVideo(v)}><b>{v.title}</b><small>{v.id} · {v.time} · @{v.account}</small><span>{v.vv} VV</span><em>风险 {v.risk} · 匹配 {v.match}</em><u>{v.role} · {v.stage} · {v.status}</u></button>)}</div>;if(tab==='评论列表')return <div className="denseDataTable"><header><span>评论内容 / 承载视频</span><span>指标</span><span>状态</span></header>{comments.map((r:any)=><div key={r[0]}><span><b>{r[0]}</b><small>{r[1]}</small></span><span>{r[2]}赞<br/>风险 {r[3]} · 匹配 {r[4]}</span><em>{r[5]}</em></div>)}</div>;if(tab==='搜索词')return <div className="denseDataTable"><header><span>搜索词</span><span>流量 / 风险</span><span>状态</span></header>{searches.map((r:any)=><div key={r[0]}><span><b>{r[0]}</b><small>点击视频 {r[3]} 个</small></span><span>{r[1]} · {r[2]}<br/>风险 {r[4]}</span><em>{r[5]}</em></div>)}</div>;if(tab==='关联账号')return <div className="actionList"><h4>关联账号 Top 3</h4><p><b>@揭阳现场</b><span>风险首发 · 供货账号 · 风险 91</span></p><p><b>@本地热讯</b><span>二创扩散 · 共设备 D-07 · 风险 86</span></p><p><b>@群聊搬运站</b><span>桥接用户 · 连接 7 个群 · 风险 88</span></p></div>;return <div className="actionList"><h4>可执行处置</h4>{['切断风险首发视频推荐','批量召回相似视频','折叠高赞评论','干预风险搜索词','封禁供货账号','定位群聊桥接用户'].map(item=><p key={item}><b>{item}</b><button>生成指令</button></p>)}</div>}
function SingleVideoWhyHot({video,onBack}:{video:any,onBack:()=>void}){return <div className="singleWhyHot"><button className="back" onClick={onBack}>← 返回承载对象</button><header><span>单视频为什么火</span><b>{video.title}</b><small>VID {video.id} · @{video.account} · 风险 {video.risk}</small></header><div className="videoSpark"><i/><i/><i/><i/><i/><i/><span>发布</span><span>冷启动</span><span>首轮</span><span>二轮</span><span>主池</span><span>长尾</span></div><dl><div><dt>风险检出</dt><dd>06-29 17:32</dd></div><div><dt>处置生效</dt><dd>06-29 20:18</dd></div><div><dt>门槛依据</dt><dd>完播 78% · 互动 12% · TOP 0.3%</dd></div><div><dt>后续放大</dt><dd>搜索热度 +320% · 触发热榜收录</dd></div></dl><p>处置生效时已进入二轮扩量；推荐切断后，搜索和社交仍贡献 30% 残余 VV。</p><strong>建议拦截阶段：冷启动试投结束前</strong><button className="primaryAction">生成单视频处置单</button></div>}
function RiskSurfaceReport(){return <div className="riskReport"><header><span>风险面报告</span><b>推荐、搜索与社交共同形成外溢风险</b></header><dl><div><dt>形成路径</dt><dd>风险视频 → 评论 → 搜索 / 二创 → 群聊</dd></div><div><dt>覆盖对象</dt><dd>382 个视频 · 96 个账号 · 17 个群</dd></div><div><dt>风险解释</dt><dd>单点召回无法消除搜索和群聊带来的残余传播</dd></div><div><dt>可处置对象</dt><dd>视频 126 · 评论 37 · 搜索词 3 · 账号 12</dd></div></dl><h4>建议动作</h4>{['切断推荐','批量召回相似视频','折叠高赞评论','干预搜索词','封禁供货账号','定位桥接用户'].map(item=><button key={item}>{item}<span>生成指令 →</span></button>)}</div>}

function LinkedPropagationViews({select,highlight,setHighlight,timeContext,activeOpinion,onTimeChange}:{select:(type:string,item:any)=>void,highlight:boolean,setHighlight:(value:boolean)=>void,timeContext:AnalysisWindow,activeOpinion:string|null,onTimeChange:(value:number)=>void}){
 return <div className="linkedPropagationViews"><RelationDecisionExplorer select={select} timeContext={timeContext} activeOpinion={activeOpinion} onTimeChange={onTimeChange}/></div>
}

function RelationDecisionExplorer({select,timeContext,activeOpinion,onTimeChange}:{select:(type:string,item:any)=>void,timeContext:AnalysisWindow,activeOpinion:string|null,onTimeChange:(value:number)=>void}){
 type RelationView='传播承接'|'设备聚合'|'群聊聚合'
 const [view,setView]=useState<RelationView>('传播承接')
 const [timeIndex,setTimeIndex]=useState(timeContext.chainTime)
 const [nodeTypes,setNodeTypes]=useState<string[]>(['全部'])
 const [knowledgeTag,setKnowledgeTag]=useState('全部')
 const [selectedId,setSelectedId]=useState('recommend')
 const [zoom,setZoom]=useState(.43)
 useEffect(()=>setTimeIndex(timeContext.chainTime),[timeContext.index,timeContext.chainTime])
 const viewConfig:any={
  传播承接:{question:'内容从哪里来，经过谁，传到哪里？',decision:'优先切断“搜索回流 → 搬运账号群”路径，可减少约 31% 后续风险曝光。',tags:['全部','首发','推荐放大','搜索回流','分享扩散','跨圈','长尾']},
  设备聚合:{question:'是否存在同设备、多账号协同投稿或跨账号发评？',decision:'D-07 关联 10 个账号，43 分钟内连续发布 28 条相似内容，建议优先核查 6 个供货账号。',tags:['全部','同设备多账号','短时切换','连续投稿','跨账号发评','新注册账号','高裂变设备']},
  群聊聚合:{question:'哪些群聊推动传播，谁在连接多个群并造成站内回流？',decision:'G-8F21 通过 4 个桥接用户连接 7 个群，贡献 148.7 万回流 VV，需优先定位桥接用户。',tags:['全部','首发群','高频分享群','跨群账号','高风险群','负向评论集中','站内回流异常']}
 }
 const nodes:any[]=[
  {id:'source',kind:'视频',title:'首发现场视频',meta:'13:46 · 328.6万 VV',role:'传播源头',x:80,y:250,tone:'normal',arrival:0,views:['传播承接'],tags:['首发'],item:videos[0]},
  {id:'head',kind:'账号',title:'头部解读账号',meta:'责任猜测 · 风险 82',role:'首次放大',x:285,y:115,tone:'warning',arrival:2,views:['传播承接'],tags:['推荐放大'],item:accounts[1]},
  {id:'recommend',kind:'渠道',title:'Feed 推荐扩量',meta:'T+20 · 高于 P90',role:'关键拐点',x:475,y:245,tone:'warning',arrival:2,views:['传播承接'],tags:['推荐放大']},
  {id:'search',kind:'渠道',title:'搜索热榜回流',meta:'占比 31% · 基线 12%',role:'异常渠道',x:665,y:385,tone:'risk',arrival:3,views:['传播承接'],tags:['搜索回流']},
  {id:'repost',kind:'账号',title:'搬运账号群',meta:'18个账号 · 投稿42条',role:'风险承接',x:845,y:250,tone:'risk',arrival:5,views:['传播承接'],tags:['分享扩散','跨圈'],item:accounts[4]},
  {id:'longTail',kind:'账号',title:'长尾账号群',meta:'仍贡献14%新增 VV',role:'长尾扩散',x:1030,y:360,tone:'warning',arrival:6,views:['传播承接'],tags:['长尾'],item:accounts[5]},

  {id:'deviceD07',kind:'设备',title:'异常设备簇 D-07',meta:'10个账号 · 风险 91',role:'疑似供货中心',x:125,y:250,tone:'risk',arrival:1,views:['设备聚合'],tags:['同设备多账号','短时切换','连续投稿','高裂变设备']},
  {id:'deviceAccounts',kind:'账号',title:'关联账号簇',meta:'10个账号 · 6个高风险',role:'同主体疑似',x:390,y:130,tone:'risk',arrival:2,views:['设备聚合'],tags:['同设备多账号','新注册账号'],item:accounts[4]},
  {id:'devicePosts',kind:'视频',title:'连续投稿内容簇',meta:'43分钟 · 28条视频',role:'批量供货',x:390,y:375,tone:'warning',arrival:3,views:['设备聚合'],tags:['连续投稿','高裂变设备'],item:videos[1]},
  {id:'crossComment',kind:'账号',title:'跨账号发评簇',meta:'涉及16条高热视频',role:'互动助推',x:685,y:130,tone:'warning',arrival:4,views:['设备聚合'],tags:['跨账号发评','短时切换'],item:accounts[2]},
  {id:'deviceSpread',kind:'视频',title:'相似内容扩散簇',meta:'OCR 91% · 186.4万 VV',role:'裂变结果',x:685,y:375,tone:'risk',arrival:4,views:['设备聚合'],tags:['连续投稿','高裂变设备'],item:videos[2]},
  {id:'deviceTail',kind:'账号',title:'外围承接账号',meta:'+22个关联账号',role:'二度扩散',x:990,y:250,tone:'warning',arrival:5,views:['设备聚合'],tags:['同设备多账号','新注册账号'],item:accounts[5]},

  {id:'sharedVideo',kind:'视频',title:'高频分享视频簇',meta:'12条视频 · 93.6万 VV',role:'群聊输入',x:110,y:250,tone:'warning',arrival:1,views:['群聊聚合'],tags:['首发群','高频分享群'],item:videos[0]},
  {id:'groupA',kind:'群聊',title:'群聊 G-8F21',meta:'148.7万回流 VV · 风险 88',role:'核心扩散群',x:390,y:130,tone:'risk',arrival:2,views:['群聊聚合'],tags:['首发群','高频分享群','高风险群']},
  {id:'groupB',kind:'群聊',title:'群聊 G-3C09',meta:'94.9万回流 VV · 负向 82%',role:'风险讨论群',x:390,y:380,tone:'risk',arrival:3,views:['群聊聚合'],tags:['高风险群','负向评论集中']},
  {id:'groupBridge',kind:'账号',title:'跨群桥接用户',meta:'4人 · 连接7个群',role:'群间桥梁',x:690,y:250,tone:'risk',arrival:4,views:['群聊聚合'],tags:['跨群账号','站内回流异常'],item:accounts[5]},
  {id:'groupNetwork',kind:'群聊',title:'外围群聊网络',meta:'7个群 · 继续转发126次',role:'群间裂变',x:920,y:120,tone:'warning',arrival:5,views:['群聊聚合'],tags:['高频分享群','跨群账号']},
  {id:'groupReturn',kind:'渠道',title:'站内搜索回流',meta:'回流占比 34.6%',role:'二次放大',x:975,y:385,tone:'risk',arrival:5,views:['群聊聚合'],tags:['站内回流异常','负向评论集中']}
 ]
 const edges:any[]=[
  {from:'source',to:'head',views:['传播承接'],tag:'内容转述',tone:'warning'},
  {from:'source',to:'recommend',views:['传播承接'],tag:'推荐放大',tone:'warning'},
  {from:'head',to:'recommend',views:['传播承接'],tag:'热度触发',tone:'warning'},
  {from:'recommend',to:'search',views:['传播承接'],tag:'搜索回流',tone:'risk'},
  {from:'search',to:'repost',views:['传播承接'],tag:'分享扩散',tone:'risk'},
  {from:'repost',to:'longTail',views:['传播承接'],tag:'长尾',tone:'warning'},
  {from:'deviceD07',to:'deviceAccounts',views:['设备聚合'],tag:'共同设备',tone:'risk'},
  {from:'deviceD07',to:'devicePosts',views:['设备聚合'],tag:'连续投稿',tone:'warning'},
  {from:'deviceAccounts',to:'crossComment',views:['设备聚合'],tag:'跨账号发评',tone:'warning'},
  {from:'devicePosts',to:'deviceSpread',views:['设备聚合'],tag:'相似裂变',tone:'risk'},
  {from:'crossComment',to:'deviceTail',views:['设备聚合'],tag:'互动承接',tone:'warning'},
  {from:'deviceSpread',to:'deviceTail',views:['设备聚合'],tag:'二度扩散',tone:'risk'},
  {from:'sharedVideo',to:'groupA',views:['群聊聚合'],tag:'首次分享',tone:'warning'},
  {from:'sharedVideo',to:'groupB',views:['群聊聚合'],tag:'群内转发',tone:'risk'},
  {from:'groupA',to:'groupBridge',views:['群聊聚合'],tag:'跨群分享',tone:'risk'},
  {from:'groupB',to:'groupBridge',views:['群聊聚合'],tag:'桥接用户',tone:'risk'},
  {from:'groupBridge',to:'groupNetwork',views:['群聊聚合'],tag:'群间裂变',tone:'warning'},
  {from:'groupBridge',to:'groupReturn',views:['群聊聚合'],tag:'站内回流',tone:'risk'},
  {from:'groupNetwork',to:'groupReturn',views:['群聊聚合'],tag:'搜索回流',tone:'risk'}
 ]
 const typeOptions=['全部','视频','账号','设备','群聊','渠道']
 const toggleType=(type:string)=>setNodeTypes(current=>type==='全部'?['全部']:current.includes(type)?(current.filter(item=>item!==type).length?current.filter(item=>item!==type):['全部']):[...current.filter(item=>item!=='全部'),type])
 const visibleNodes=nodes.filter(node=>node.views.includes(view)&&node.arrival<=timeIndex&&(nodeTypes.includes('全部')||nodeTypes.includes(node.kind))&&(knowledgeTag==='全部'||node.tags.includes(knowledgeTag)))
 const visibleIds=new Set(visibleNodes.map(node=>node.id))
 const visibleEdges=edges.filter(edge=>edge.views.includes(view)&&visibleIds.has(edge.from)&&visibleIds.has(edge.to)&&(knowledgeTag==='全部'||edge.tag===knowledgeTag||nodes.find(node=>node.id===edge.from)?.tags.includes(knowledgeTag)||nodes.find(node=>node.id===edge.to)?.tags.includes(knowledgeTag)))
 const points=Object.fromEntries(nodes.map(node=>[node.id,[node.x,node.y]]))
 const selected=nodes.find(node=>node.id===selectedId)||nodes[0]
 const chooseView=(next:RelationView)=>{setView(next);setKnowledgeTag('全部');setNodeTypes(['全部']);setSelectedId(next==='设备聚合'?'deviceD07':next==='群聊聚合'?'groupA':'recommend')}
 const openNode=(node:any)=>{setSelectedId(node.id);if(node.item)select(node.kind==='视频'?'video':'account',node.item)}
 const current=viewConfig[view]
 const stageLabels=view==='设备聚合'?['设备中心','关联账号','异常行为','扩散结果']:view==='群聊聚合'?['内容输入','核心群聊','桥接用户','站内回流']:['传播源头','首次放大','异常承接','长尾扩散']
 return <div className="relationDecisionExplorer">
  <div className="relationDecisionHead"><div><b>传播关系链 <SourceBadge type="ai"/></b><span>{current.question}</span></div><div className="relationDecisionSummary"><Sparkles size={14}/><span><small>当前决策</small><b>{current.decision}</b></span></div></div>
  <ChainTimeline value={timeIndex} onChange={value=>{setTimeIndex(value);onTimeChange(value)}} total={visibleNodes.length} label="关系形成时间"/>
  <div className="relationViewToolbar"><div className="relationProblemTabs" role="tablist" aria-label="关系问题视图">{(Object.keys(viewConfig) as RelationView[]).map(item=><button key={item} role="tab" aria-selected={view===item} className={view===item?'selected':''} onClick={()=>chooseView(item)}>{item}</button>)}</div><div className="tools"><button><Search size={14}/>查找节点</button><button onClick={()=>setZoom(value=>Math.max(.36,Number((value-.05).toFixed(2))))} aria-label="缩小画布"><ZoomOut size={15}/></button><button onClick={()=>setZoom(value=>Math.min(.63,Number((value+.05).toFixed(2))))} aria-label="放大画布"><ZoomIn size={15}/></button></div></div>
  <div className="relationTags"><div><span>节点类型</span>{typeOptions.map(item=><button key={item} className={nodeTypes.includes(item)?'selected':''} onClick={()=>toggleType(item)}>{item}</button>)}</div><div><span>知识下钻</span>{current.tags.map((item:string)=><button key={item} className={knowledgeTag===item?'selected':''} onClick={()=>setKnowledgeTag(item)}>{item}</button>)}</div></div>
  <div className="relationBreadcrumb"><span>事件全景</span><ChevronRight size={12}/><span>{view}</span>{knowledgeTag!=='全部'&&<><ChevronRight size={12}/><b>{knowledgeTag}</b></>}<em>显示 {visibleNodes.length} 个节点 · {visibleEdges.length} 条高置信关系</em></div>
  <div className="relationWorkspace">
   <div className="relationMap"><div className="relationStageLabels">{stageLabels.map(item=><span key={item}>{item}</span>)}</div><div className="relationMapScene" style={{transform:`scale(${zoom})`}}><svg viewBox="0 0 1100 520" preserveAspectRatio="none">{visibleEdges.map(edge=>{const a=points[edge.from],b=points[edge.to];return <g key={edge.from+edge.to}><path className={edge.tone+(selectedId===edge.from||selectedId===edge.to?' active':'')} d={`M${a[0]} ${a[1]} C${(a[0]+b[0])/2} ${a[1]},${(a[0]+b[0])/2} ${b[1]},${b[0]} ${b[1]}`}/><text x={(a[0]+b[0])/2} y={(a[1]+b[1])/2-5}>{edge.tag}</text></g>})}</svg>{nodes.map(node=><button key={node.id} className={'relationMapNode '+node.kind+' '+node.tone+(visibleIds.has(node.id)?'':' hidden')+(selectedId===node.id?' selected':'')} style={{left:node.x,top:node.y}} onClick={()=>openNode(node)}><i>{node.kind==='视频'?<Play size={14}/>:node.kind==='账号'?<Users size={14}/>:node.kind==='设备'?<ScanLine size={14}/>:node.kind==='群聊'?<MessageCircle size={14}/>:node.kind==='渠道'?<Zap size={14}/>:<Network size={14}/>}</i><span><b>{node.title}</b><small>{node.meta}</small><em>{node.role}</em></span></button>)}</div><div className="relationMapLegend"><span><i/>确定关系</span><span><i/>辅助关系</span><small>点击节点查看证据；Tag 只点亮命中异常，不会丢失底层实体</small></div></div>
   <aside className="relationInspector"><div className="relationMiniMap"><span>全景位置</span><i className={'p '+selected.tone} style={{left:(selected.x/1100*100)+'%',top:(selected.y/520*100)+'%'}}/></div><header><small>{selected.kind} · {selected.role}</small><b>{selected.title}</b><span>{selected.meta}</span></header><dl><div><dt>判断依据</dt><dd>{selected.tags.slice(0,3).join(' · ')}</dd></div><div><dt>全局关系</dt><dd>输入 {edges.filter(edge=>edge.to===selected.id).length} 条 · 输出 {edges.filter(edge=>edge.from===selected.id).length} 条</dd></div><div><dt>风险状态</dt><dd>{selected.tone==='risk'?'高风险，建议优先核查':selected.tone==='warning'?'传播异常，需持续观察':'正常承接关系'}</dd></div></dl><section><b>跨层关系摘要</b><p>当前节点仍保留在事件全景中的位置，与其他关系簇的输入、输出关系不会因下钻而丢失。</p></section><button onClick={()=>setKnowledgeTag(selected.tags[0])}>按“{selected.tags[0]}”继续下钻</button></aside>
  </div>
 </div>
}

function CombinedChain({select,timeContext,activeOpinion,onTimeChange,relationshipTabs}:{select:(type:string,item:any)=>void,timeContext:AnalysisWindow,activeOpinion:string|null,onTimeChange:(value:number)=>void,relationshipTabs:any}){
 const [timeIndex,setTimeIndex]=useState(timeContext.chainTime),[zoom,setZoom]=useState(1),[focus,setFocus]=useState('recommend')
 useEffect(()=>setTimeIndex(timeContext.chainTime),[timeContext.index,timeContext.chainTime])
 const nodes=[
  {id:'source',kind:'video',stage:0,title:'首发视频',meta:'13:46 · 现场记录',role:'传播源头',x:70,y:255,tone:'normal',arrival:0,item:videos[0]},
  {id:'local',kind:'account',stage:1,title:'本地资讯号',meta:'消防救援进展',role:'事实补充',x:285,y:390,tone:'normal',arrival:1,item:accounts[3]},
  {id:'head',kind:'account',stage:1,title:'头部账号 A',meta:'转述 · 责任猜测',role:'叙事偏移',x:310,y:135,tone:'warning',arrival:2,item:accounts[1]},
  {id:'recommend',kind:'mechanism',stage:1,title:'推荐流入口',meta:'最早拐点 · T+20',role:'流量放大',x:500,y:250,tone:'warning',arrival:2},
  {id:'localCircle',kind:'cluster',stage:2,title:'本地资讯圈',meta:'事实信息为主',role:'跨圈传播',x:690,y:105,tone:'normal',arrival:3},
  {id:'hotCircle',kind:'cluster',stage:2,title:'社会热点圈',meta:'风险叙事成形',role:'观点放大',x:720,y:285,tone:'risk',arrival:4},
  {id:'funCircle',kind:'cluster',stage:2,title:'泛娱乐圈',meta:'戏谑二创',role:'内容变体',x:655,y:455,tone:'warning',arrival:4},
  {id:'longTail',kind:'account',stage:3,title:'长尾账号群 α',meta:'事实与猜测混合',role:'长尾扩散',x:975,y:105,tone:'warning',arrival:5,item:accounts[5]},
  {id:'repost',kind:'account',stage:3,title:'搬运账号群',meta:'风险话术复制',role:'风险承接',x:1010,y:285,tone:'risk',arrival:5,item:accounts[4]},
  {id:'discussion',kind:'cluster',stage:3,title:'评论衍生话题',meta:'处罚尺度争议',role:'持续发酵',x:955,y:450,tone:'risk',arrival:6}
 ]
 const edges=[['source','head','warning'],['source','local','normal'],['source','recommend','warning'],['head','recommend','warning'],['head','hotCircle','risk'],['local','hotCircle','risk'],['local','funCircle','warning'],['recommend','localCircle','warning'],['recommend','hotCircle','risk'],['recommend','funCircle','warning'],['localCircle','longTail','warning'],['localCircle','repost','risk'],['hotCircle','longTail','risk'],['hotCircle','repost','risk'],['funCircle','discussion','risk']]
 const visible=nodes.filter(node=>node.arrival<=timeIndex)
 const visibleIds=new Set(visible.map(node=>node.id))
 const points=Object.fromEntries(nodes.map(node=>[node.id,[node.x,node.y]]))
 const changeZoom=(step:number)=>setZoom(value=>Math.max(.8,Math.min(1.2,Number((value+step).toFixed(1)))))
 const openNode=(node:any)=>{setFocus(node.id);if(node.item)select(node.kind==='video'?'video':'account',node.item)}
 return <><Section title="综合传播链" desc="以关键视频、账号、分发机制与传播圈层还原事件全链路" action={null}/>
  <div className="linkedChainControls">{relationshipTabs}<div className="tools"><button><Search size={14}/>查找节点</button><button onClick={()=>changeZoom(-.1)} aria-label="缩小综合画布"><ZoomOut size={15}/></button><button onClick={()=>changeZoom(.1)} aria-label="放大综合画布"><ZoomIn size={15}/></button></div></div>
  <ChainTimeline value={timeIndex} onChange={value=>{setTimeIndex(value);onTimeChange(value)}} total={visible.length} label="综合扩散时间"/>
  <div className="combinedCanvas boardCanvas"><div className="combinedStageLabels"><span>源头</span><span>关键放大</span><span>跨圈传播</span><span>长尾扩散</span></div><div className="combinedScene" style={{transform:`scale(${zoom})`}}>
   <svg className="combinedEdges" viewBox="0 0 1120 560" preserveAspectRatio="none">{edges.map(([from,to,tone])=>{const a=points[from],b=points[to];if(!visibleIds.has(from)||!visibleIds.has(to))return null;return <path key={from+to} className={tone+(focus===from||focus===to?' active':'')} d={`M ${a[0]} ${a[1]} C ${(a[0]+b[0])/2} ${a[1]}, ${(a[0]+b[0])/2} ${b[1]}, ${b[0]} ${b[1]}`}/>})}</svg>
   {nodes.map(node=><button key={node.id} className={'combinedNode '+node.kind+' '+node.tone+(node.arrival>timeIndex?' entityFuture':'')+(focus===node.id?' selected':'')} style={{left:node.x,top:node.y}} onClick={()=>openNode(node)}><i>{node.kind==='video'?<Play size={15} fill="currentColor"/>:node.kind==='account'?<Users size={15}/>:node.kind==='mechanism'?<Zap size={16}/>:<Network size={15}/>}</i><b>{node.title}</b><small>{node.meta}</small><em>{node.role}</em></button>)}
  </div><div className="combinedLegend"><span><i className="normal"/>正常传播</span><span><i className="warning"/>叙事偏移</span><span><i className="risk"/>风险扩散</span><small>实线：高置信传播关系</small></div></div>
  <div className="combinedInsight"><Sparkles size={15}/><span><b>AI 洞察 · 最早风险拐点：推荐流入口</b><small>内容叙事由“现场记录”偏移为“责任猜测”，并在 T+20 分钟进入跨圈放大。</small></span><button onClick={()=>setFocus('recommend')}>定位节点</button></div>
 </>
}

function VideoChain({select,timeContext,activeOpinion,onTimeChange,relationshipTabs}:{select:(type:string,item:any)=>void,timeContext:AnalysisWindow,activeOpinion:string|null,onTimeChange:(value:number)=>void,relationshipTabs?:any}){
 const [zoom,setZoom]=useState(.78),[relations,setRelations]=useState(['文本相似','OCR 相似','ASR 相似'])
 const [selectedEntities,setSelectedEntities]=useState<string[]>([])
 const [timeIndex,setTimeIndex]=useState(6)
 const [expandedCluster,setExpandedCluster]=useState<string|null>(null)
 const boardRef=useRef<HTMLDivElement>(null)
 const {pan,setPan,handlers:panHandlers}=useCanvasPan()
 useEffect(()=>{setTimeIndex(timeContext.chainTime);setExpandedCluster(null);setSelectedEntities([])},[timeContext.index,timeContext.chainTime])
 const relationOptions=['文本相似','OCR 相似','ASR 相似','同作者投稿','互粉作者','相同话题']
 const clusterThemes=[
  ['揭阳现场','疑似虐狗原视频，涉事情况待核实'],['事实核验站','原视频剪辑痕迹与完整语境核验'],['城市观察站','多平台搬运版本的时间线对照'],['民生视角','涉事行为责任如何认定'],['本地资讯台','属地回应与事件进展汇总'],
  ['动物保护观察','反虐待动物立法讨论升温'],['法律观察室','未成年人责任与监护边界'],['公共议题社','处罚尺度是否符合公众预期'],['新华社客户端','未成年人保护不是责任豁免'],['央视新闻','事件责任讨论与事实边界'],['理性讨论组','反对网络暴力与身份曝光'],['制度观察','从个案讨论动物保护机制'],
  ['音频核验室','原视频环境音与发布时间核验'],['同音频聚合','相同音轨带动批量二创'],['热点搬运号','情绪化配乐放大处罚争议'],['二创观察站','字幕改写推动观点再传播'],['信息核查局','网传音频与原始素材比对'],
  ['高赞评论观察','处罚过轻观点进入高赞区'],['责任讨论组','家长与学校教育责任讨论'],['动物保护倡议','完善动物保护立法的呼声'],['反网暴观察','反对人肉未成年人及无关人员'],['通报解读社','官方通报发布后的观点转向'],['舆情观察团','评论区负向观点持续扩散'],['制度建设组','讨论逐步回归长期制度建设']
 ]
 const chainVideos=clusterThemes.map(([author,title],index)=>({...videos[index%videos.length],id:'chain-'+index,author,title,play:(328.6-index*9.7).toFixed(1)+'万'}))
 const videoClusters=[
  {id:'source',name:'风险首发与相似视频簇',summary:'首发内容及文本、OCR 相似搬运版本',indices:[1,2,3,4],plays:'531.1万',risk:'风险分 86',x:715,y:35,w:450,h:285,c:'violet'},
  {id:'topic',name:'题材 / 话题内容簇',summary:'责任、处罚尺度和动物保护议题',indices:[5,6,7,8,9,10,11],plays:'335.5万',risk:'贡献 31.7%',x:35,y:35,w:450,h:295,c:'blue'},
  {id:'audio',name:'音频 / 二创内容簇',summary:'同音频、改写字幕与情绪化二创',indices:[12,13,14,15,16],plays:'227.8万',risk:'相似度 91%',x:715,y:390,w:450,h:290,c:'orange'},
  {id:'opinion',name:'风险观点簇',summary:'处罚争议、高赞评论与制度讨论',indices:[17,18,19,20,21,22,23],plays:'173.5万',risk:'风险分 78',x:35,y:390,w:470,h:290,c:'cyan'}
 ]
 const videoArrival=[0,2,1,4,3,1,5,2,6,4,3,6,2,5,3,6,4,1,4,2,6,3,5,6]
 const activeCluster=videoClusters.find(cluster=>cluster.id===expandedCluster)
 const opinionProfile=getOpinionFilterProfile(activeOpinion)
 const opinionFilterCluster=activeOpinion?videoClusters.find(cluster=>cluster.id===opinionProfile.clusterId):null
 const opinionVideoSet=new Set<number>(activeOpinion?[0,...(opinionFilterCluster?.indices||[])]:chainVideos.map((_,index)=>index))
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
 const visibleVideoCount=videoArrival.filter((arrival,index)=>arrival<=timeIndex&&opinionVideoSet.has(index)).length
 const openCluster=(id:string)=>{
  const viewportWidth=boardRef.current?.clientWidth||920
  const fittedZoom=Math.max(.58,Math.min(.74,(viewportWidth-36)/1100))
  setExpandedCluster(id);setSelectedEntities([]);setZoom(Number(fittedZoom.toFixed(2)))
  setPan({x:Math.max(18,(viewportWidth-1100*fittedZoom)/2),y:4})
 }
 return <><Section title="视频传播链路" desc="以首发视频为中心，展示视频与视频之间的相似、引用和二次传播关系" action={<div className="tools"><button><Search size={14}/>查找视频</button><button onClick={()=>changeZoom(-.1)} aria-label="缩小画布"><ZoomOut size={15}/></button><button onClick={()=>changeZoom(.1)} aria-label="放大画布"><ZoomIn size={15}/></button></div>}/>
 {(activeOpinion||timeContext.index!==null)&&<FilterResultSummary title={activeOpinion?`“${activeOpinion}”内容承接链`:`${timeContext.date} 内容承接链`} items={[
  ['命中内容簇',activeOpinion?'1':String(Math.max(1,Math.min(videoClusters.length,timeIndex-1))),activeOpinion?(opinionFilterCluster?.name||'风险观点簇'):'当前时间窗口'],
  ['命中视频',String(activeOpinion?(opinionFilterCluster?.indices.length||0):visibleVideoCount),`当前可见 ${visibleVideoCount} 个`],
  ['贡献 VV',activeOpinion?(opinionFilterCluster?.plays||opinionProfile.vv):`${(46.8+timeIndex*37.4).toFixed(1)}万`,`传播贡献 ${activeOpinion?26+opinionProfile.seed%18:18+timeIndex*7}%`],
 ['风险分',String(activeOpinion?64+opinionProfile.seed%25:42+timeIndex*6),activeOpinion?`${opinionProfile.tone}观点`:'当前窗口']
 ]}/>}
 <div className="linkedChainControls">{relationshipTabs}<div className="tools"><button><Search size={14}/>查找视频</button><button onClick={()=>changeZoom(-.1)} aria-label="缩小画布"><ZoomOut size={15}/></button><button onClick={()=>changeZoom(.1)} aria-label="放大画布"><ZoomIn size={15}/></button></div></div>
 <ChainTimeline value={timeIndex} onChange={value=>{setTimeIndex(value);onTimeChange(value)}} total={visibleVideoCount} label="视频扩散时间"/><div className="chips">关系筛选：{relationOptions.map(item=><button key={item} className={relations.includes(item)?'on':''} onClick={()=>toggleRelation(item)}>{item}</button>)}</div>{selectedEntities.length>=2&&<div className="entityAnalysisBar"><span>已选择 <b>{selectedEntities.length}</b> 个视频</span><button onClick={analyze}><Network size={14}/>传播链路分析</button><button className="clearSelection" onClick={()=>setSelectedEntities([])}>清空</button></div>}<div className="canvas boardCanvas videoRelationshipBoard pannableCanvas" ref={boardRef} {...panHandlers}><div className="zoomHud"><span>缩放 {Math.round(zoom*100)}%</span><button onClick={()=>{setZoom(.78);setPan({x:0,y:0})}}>重置视图</button></div><div className="boardScene" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}}><div className="stages"><span>首发视频</span><i/><span>直接衍生视频</span><i/><span>二次传播视频</span></div>{!activeCluster&&<div className="videoOpinionSurfaces">{videoClusters.map(cluster=><div key={cluster.id} className={'opinionClusterSurface '+cluster.c+(activeOpinion&&cluster.id!==opinionFilterCluster?.id?' filterDimmed':'')} style={{left:cluster.x,top:cluster.y,width:cluster.w,height:cluster.h}}><span>{cluster.name}</span><small>{cluster.indices.length} 个视频 · {cluster.plays}</small><em>{cluster.risk}</em></div>)}</div>}<VideoDynamicLinks pos={pos} arrival={videoArrival} timeIndex={timeIndex} cluster={opinionFilterCluster?{...opinionFilterCluster,indices:[0,...opinionFilterCluster.indices]}:null}/>{chainVideos.map((v,i)=><button key={v.id} className={'videoNode relationVideoNode'+(i===0?' originVideo':'')+(selectedEntities.includes(v.id)?' entitySelected':'')+(videoArrival[i]>timeIndex?' entityFuture':'')+(activeOpinion&&!opinionVideoSet.has(i)?' filterDimmed':'')} style={{left:pos[i][0],top:pos[i][1]}} onClick={()=>select('video',v)}><i className={'miniThumb m'+(i%4)}><Play size={12} fill="currentColor"/></i><span><b>{v.author}</b><em>{v.title.slice(0,16)}…</em><small>{v.play} 播放</small></span><i className="entityCheck" role="checkbox" aria-checked={selectedEntities.includes(v.id)} onClick={event=>{event.stopPropagation();toggleEntity(v.id)}}>{selectedEntities.includes(v.id)?'✓':''}</i>{i===0?<u>首发中心</u>:<u>{i%3===0?'同话题':i%3===1?'OCR 相似 '+(90-i)+'%':'文本相似 '+(95-i)+'%'}</u>}</button>)}</div><div className="miniMap"/><p className="canvasTip">{activeOpinion?`已聚焦“${activeOpinion}”：仅高亮承接该观点的内容簇与传播连线`:'首发视频位于画布中心 · 每个视频严格归入对应观点簇 · 连线从中心向四周放射'}</p></div><div className="legend">观点簇：紫 · 职位争议　蓝 · 隐喻解读　橙 · 对象猜测　青 · 权力来源　　━ 强关联　┅ 弱关联</div></>}
function AccountChain({select,highlight,setHighlight,timeContext,activeOpinion,onTimeChange,relationshipTabs}:{select:(type:string,item:any)=>void,highlight:boolean,setHighlight:(value:boolean)=>void,timeContext:AnalysisWindow,activeOpinion:string|null,onTimeChange:(value:number)=>void,relationshipTabs?:any}){
 const [focusTier,setFocusTier]=useState('全部'),[showEvidence,setShowEvidence]=useState(true)
 const [accountZoom,setAccountZoom]=useState(1)
 const [selectedEntities,setSelectedEntities]=useState<string[]>([])
 const [timeIndex,setTimeIndexState]=useState(6)
 const setTimeIndex=(value:number)=>setTimeIndexState(value)
 useEffect(()=>{setTimeIndexState(timeContext.chainTime);setSelectedEntities([])},[timeContext.index,timeContext.chainTime])
 const {pan:accountPan,handlers:accountPanHandlers}=useCanvasPan()
 useEffect(()=>{const board=document.querySelector<HTMLElement>('.intelBoard');if(!board)return;board.classList.add('pannableCanvas');board.style.setProperty('--pan-x',accountPan.x+'px');board.style.setProperty('--pan-y',accountPan.y+'px');const down=(event:MouseEvent)=>accountPanHandlers.onMouseDown(event),move=(event:MouseEvent)=>accountPanHandlers.onMouseMove(event),up=(event:MouseEvent)=>accountPanHandlers.onMouseUp(event),leave=(event:MouseEvent)=>accountPanHandlers.onMouseLeave(event);board.addEventListener('mousedown',down);board.addEventListener('mousemove',move);board.addEventListener('mouseup',up);board.addEventListener('mouseleave',leave);return()=>{board.removeEventListener('mousedown',down);board.removeEventListener('mousemove',move);board.removeEventListener('mouseup',up);board.removeEventListener('mouseleave',leave)}},[accountPan.x,accountPan.y])
 useEffect(()=>{const board=document.querySelector<HTMLElement>('.intelBoard');if(!board)return;board.style.transform=`scale(${accountZoom})`;board.style.transformOrigin='center top';return()=>{board.style.transform='';board.style.transformOrigin=''}},[accountZoom])
 useEffect(()=>{const board=document.querySelector<HTMLElement>('.intelBoard');if(!board)return;const buttons=Array.from(board.querySelectorAll<HTMLButtonElement>('.account'));const svg=board.querySelector<SVGSVGElement>('.accountLinks');if(!svg)return;const clear=()=>{buttons.forEach(button=>button.classList.remove('relationOrigin','relationHit'));svg.querySelector('.hoverLinks')?.remove()};const showRelations=(origin:HTMLButtonElement)=>{clear();origin.classList.add('relationOrigin');const targets=buttons.filter(button=>button!==origin&&!button.classList.contains('dimmed')).sort(()=>Math.random()-.5).slice(0,2+Math.floor(Math.random()*3));targets.forEach(button=>button.classList.add('relationHit'));const group=document.createElementNS('http://www.w3.org/2000/svg','g');group.setAttribute('class','hoverLinks');const boardRect=board.getBoundingClientRect();const scale=Math.min(boardRect.width/800,boardRect.height/500);const offsetX=(boardRect.width-800*scale)/2;const offsetY=(boardRect.height-500*scale)/2;const point=(button:HTMLButtonElement)=>{const rect=button.getBoundingClientRect();return{x:(rect.left+rect.width/2-boardRect.left-offsetX)/scale,y:(rect.top+rect.height/2-boardRect.top-offsetY)/scale}};const from=point(origin);targets.forEach(target=>{const to=point(target);const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',String(from.x));line.setAttribute('y1',String(from.y));line.setAttribute('x2',String(to.x));line.setAttribute('y2',String(to.y));group.appendChild(line)});svg.appendChild(group)};const handlers=buttons.map(button=>({button,handler:()=>showRelations(button)}));handlers.forEach(({button,handler})=>button.addEventListener('mouseenter',handler));board.addEventListener('mouseleave',clear);return()=>{handlers.forEach(({button,handler})=>button.removeEventListener('mouseenter',handler));board.removeEventListener('mouseleave',clear);clear()}},[focusTier,showEvidence])
 const direct=[...accounts.slice(1),{id:'a6',name:'隐喻观察室',handle:'@metaphor-watch',risk:'需关注',fans:'16.4万',auth:'文化作者',c:'cyan',edge:'话题共现'},{id:'a7',name:'民生求证',handle:'@verify-life',risk:'需关注',fans:'11.2万',auth:'优质作者',c:'orange',edge:'高频互动'}]
 const secondary=[{id:'b0',name:'城市记录者',handle:'@city-log',risk:'低风险',fans:'6.8万',auth:'普通用户',c:'blue',edge:'互粉关系'},{id:'b1',name:'俗语档案馆',handle:'@idiom-file',risk:'低风险',fans:'9.4万',auth:'文化作者',c:'green',edge:'内容共现'},{id:'b2',name:'公共表达课',handle:'@public-talk',risk:'低风险',fans:'14.6万',auth:'知识作者',c:'violet',edge:'话题共现'},{id:'b3',name:'热点追踪号',handle:'@hot-track',risk:'需关注',fans:'7.1万',auth:'普通用户',c:'pink',edge:'频繁互动'},{id:'b4',name:'本地见闻',handle:'@local-view',risk:'低风险',fans:'5.6万',auth:'本地资讯',c:'cyan',edge:'互粉关系'},{id:'b5',name:'冷知识放映厅',handle:'@cold-facts',risk:'低风险',fans:'18.2万',auth:'知识作者',c:'green',edge:'内容共现'},{id:'b6',name:'晚间速报',handle:'@night-news',risk:'需关注',fans:'8.9万',auth:'普通用户',c:'orange',edge:'话题共现'},{id:'b7',name:'舆情观察团',handle:'@opinion-group',risk:'需关注',fans:'12.7万',auth:'时事作者',c:'blue',edge:'高频互动'},{id:'b8',name:'事实核验',handle:'@fact-check',risk:'低风险',fans:'10.3万',auth:'优质作者',c:'violet',edge:'互粉关系'},{id:'b9',name:'同城消息',handle:'@city-news',risk:'需关注',fans:'6.1万',auth:'本地资讯',c:'pink',edge:'内容共现'}]
 const network=[{...accounts[0],tier:'origin',edge:'首发作者'},...direct.map(a=>({...a,tier:'direct',edge:'互动关联'})),...secondary.map(a=>({...a,tier:'secondary',edge:'内容共现'}))]
 const pos=[[400,255],[358,69],[437,76],[402,133],[542,116],[620,128],[580,187],[568,286],[642,300],[608,360],[378,378],[460,388],[424,448],[184,292],[264,307],[221,367],[166,137],[241,181]]
 const clusters=[{name:'政媒号 · 3号 / 贡献VV 26%',x:400,y:104,w:176,h:128,tone:'violet',indices:[1,2,3]},{name:'专业创作者 · 3号 / 风险率 4%',x:574,y:160,w:226,h:174,tone:'blue',indices:[4,5,6]},{name:'搬运账号簇 · 3号 / 投稿 18条',x:610,y:338,w:248,h:206,tone:'cyan',indices:[7,8,9]},{name:'营销号 · 3号 / 策略命中',x:414,y:420,w:202,h:136,tone:'violet',indices:[10,11,12]},{name:'同城账号簇 · 3号 / 贡献VV 11%',x:215,y:333,w:236,h:188,tone:'orange',indices:[13,14,15]},{name:'共设备账号簇 · 2号 / 风险率 23%',x:184,y:166,w:142,h:118,tone:'green',indices:[16,17]}]
 const accountArrival=[0,2,1,4,2,5,3,1,6,4,2,5,3,6,4,1,5,3]
 const opinionProfile=getOpinionFilterProfile(activeOpinion)
 const opinionAccountMap:any={
  source:[0,1,2,3,13,14,15],
  topic:[0,1,2,3,4,5,6],
  audio:[0,7,8,9,10,11,12],
  opinion:[0,4,5,6,7,8,9,16,17]
 }
 const opinionAccountSet=new Set<number>(activeOpinion?(opinionAccountMap[opinionProfile.clusterId]||opinionAccountMap.opinion):network.map((_,index)=>index))
 const toggleEntity=(id:string)=>setSelectedEntities(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
 const analyze=()=>{const items=network.filter(item=>selectedEntities.includes(item.id));select('analysis',{entityType:'account',items,name:'账号传播链路分析'})}
 const visibleAccountCount=accountArrival.filter((arrival,index)=>arrival<=timeIndex&&opinionAccountSet.has(index)).length
 const visibleClusterCount=clusters.filter(cluster=>cluster.indices.some(index=>accountArrival[index]<=timeIndex&&opinionAccountSet.has(index))).length
 const evidenceData=activeOpinion
  ?[['关联账号',String(opinionProfile.accounts),`当前可见 ${visibleAccountCount}`],['异常设备聚类',String(1+opinionProfile.seed%3),`涉及账号 ${4+opinionProfile.seed%5}`],['高频互动群组',String(2+opinionProfile.seed%4),`${opinionProfile.tone}观点`],['关系置信度',`${82+opinionProfile.seed%15}.4%`,'筛选后评分']]
  :timeContext.index!==null
  ?[['关联账号',String(visibleAccountCount*4+7),`当前可见 ${visibleAccountCount}`],['异常设备聚类',String(Math.max(1,Math.ceil(timeIndex/2))),`涉及账号 ${Math.max(2,timeIndex+1)}`],['高频互动群组',String(Math.max(1,timeIndex-1)),timeContext.date],['关系置信度',`${74+timeIndex*3}.4%`,'窗口内评分']]
  :[['关联账号','82','直接关系 18'],['异常设备聚类','3','涉及账号 7'],['高频互动群组','5','近 7 日内'],['关系置信度','87.4%','综合评分']]
 return <><Section title="账号关联网络" desc="首发账号居中，圈层大小按群体规模与关系强度分布，相邻传播群允许重叠" action={<div className="switcher">账号关系高亮 <button className={highlight?'switch on':'switch'} onClick={()=>setHighlight(!highlight)}><i/></button><HelpCircle size={14}/></div>}/>
 {(activeOpinion||timeContext.index!==null)&&<FilterResultSummary title={activeOpinion?`“${activeOpinion}”推动主体`:`${timeContext.date} 推动主体`} items={[
  ['命中账号',String(activeOpinion?opinionProfile.accounts:visibleAccountCount*4+7),`画布核心 ${visibleAccountCount} 个`],
  ['账号圈层',String(visibleClusterCount),`全量 ${clusters.length} 个`],
  ['贡献 VV',activeOpinion?opinionProfile.vv:`${(35.7+timeIndex*29.6).toFixed(1)}万`,activeOpinion?`占筛选观点 ${54+opinionProfile.seed%27}%`:'当前窗口贡献'],
 ['历史风险率',activeOpinion?opinionProfile.risk:`${(9.8+timeIndex*2.3).toFixed(1)}%`,activeOpinion?`${opinionProfile.tone}传播主体`:'窗口内账号']
 ]}/>}
 <div className="linkedChainControls">{relationshipTabs}<div className="tools"><button><Search size={14}/>查找账号</button><button onClick={()=>setAccountZoom(value=>Math.max(.8,Number((value-.1).toFixed(1))))} aria-label="缩小账号画布"><ZoomOut size={15}/></button><button onClick={()=>setAccountZoom(value=>Math.min(1.2,Number((value+.1).toFixed(1))))} aria-label="放大账号画布"><ZoomIn size={15}/></button></div></div>
 <div className="caseFilters"><span>调查视图</span>{['全部','直接关联','二度关联'].map(item=><button key={item} className={focusTier===item?'selected':''} onClick={()=>setFocusTier(item)}>{item}</button>)}<button className={showEvidence?'selected':''} onClick={()=>setShowEvidence(!showEvidence)}>{showEvidence?'隐藏证据标签':'显示证据标签'}</button></div>{selectedEntities.length>=2&&<div className="entityAnalysisBar"><span>已选择 <b>{selectedEntities.length}</b> 个账号</span><button onClick={analyze}><Network size={14}/>传播链路分析</button><button className="clearSelection" onClick={()=>setSelectedEntities([])}>清空</button></div>}<div className="accountCanvas intelBoard"><div className="boardHud"><span>案件板 · 圈层研判</span><b>{visibleClusterCount} 个圈层 · 当前可见 {visibleAccountCount} 个账号</b></div><div className="rings"><i/><i/><i/></div>{clusters.map((cluster,index)=>{const clusterMatched=cluster.indices.some(i=>opinionAccountSet.has(i));return <div key={cluster.name} className={'accountCluster cluster'+index+' '+cluster.tone+(cluster.indices.some(i=>accountArrival[i]<=timeIndex)?'':' entityFuture')+(activeOpinion&&!clusterMatched?' filterDimmed':'')} style={{left:'calc(50% + '+(cluster.x-400)+'px)',top:'calc(50% + '+(cluster.y-255)+'px)',width:cluster.w,height:cluster.h}}><span>{cluster.name}</span></div>})}<span className="layer l1">首发账号</span><span className="layer l2">直接关联 · {activeOpinion?Math.max(2,visibleAccountCount-3):18}</span><span className="layer l3">二度关联 · {activeOpinion?Math.max(1,visibleAccountCount-5):64}</span><svg className="accountLinks" viewBox="0 0 800 500"><circle cx="400" cy="255" r="138"/><circle className="muted" cx="400" cy="255" r="208"/></svg>{network.map((a,i)=><button key={a.id} className={'account '+a.tier+(accountArrival[i]>timeIndex?' entityFuture dimmed':'')+(selectedEntities.includes(a.id)?' entitySelected':'')+(highlight&&a.tier!=='origin'?' hi':'')+(focusTier!=='全部'&&a.tier!==(focusTier==='直接关联'?'direct':focusTier==='二度关联'?'secondary':'origin')?' dimmed':'')+(activeOpinion&&!opinionAccountSet.has(i)?' filterDimmed dimmed':'')} style={{left:'calc(50% + '+(pos[i][0]-400)+'px)',top:'calc(50% + '+(pos[i][1]-255)+'px)'}} onClick={()=>select('account',a)}><i className={'avatar '+a.c}>{a.name[0]}</i><i className="entityCheck" role="checkbox" aria-checked={selectedEntities.includes(a.id)} onClick={event=>{event.stopPropagation();toggleEntity(a.id)}}>{selectedEntities.includes(a.id)?'✓':''}</i><b>{a.name}</b><span>{a.tier==='origin'?'首发作者':a.tier==='direct'?'直接关联':'二度关联'}</span>{showEvidence&&a.tier!=='origin'&&<em>{a.edge}</em>}</button>)}<div className="boardHint">{activeOpinion?`已聚焦“${activeOpinion}”：仅高亮推动该观点扩散的账号与圈层`:'拖动下方时间轴查看账号圈层形成过程 · 悬停头像查看关系'}</div></div><ChainTimeline value={timeIndex} onChange={value=>{setTimeIndex(value);onTimeChange(value)}} total={visibleAccountCount} label="账号扩散时间"/>{highlight&&<div className="highlight"><ShieldAlert size={16}/><b>已高亮 {activeOpinion?visibleAccountCount:17} 个关联账号</b><span>直接关联 {activeOpinion?Math.max(2,visibleAccountCount-3):7} · 二度关联 {activeOpinion?Math.max(1,visibleClusterCount-1):10} · 高频互动 {activeOpinion?Math.max(1,visibleClusterCount-1):4}</span><button>查看证据链 <ChevronRight size={14}/></button></div>}<div className="evidenceGrid">{evidenceData.map(x=><div key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><em>{x[2]}</em></div>)}</div></>}
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
function Detail({state,close}){let {type,item}=state;return <div className="detailModal" role="dialog" aria-modal="true" aria-label={type==='video'?'视频详情':'分析详情'} onMouseDown={event=>{if(event.target===event.currentTarget)close()}}><aside><div className="detailHead"><button className="detailBack" onClick={close}>← 返回</button><div><span>{type==='analysis'?'关系分析':type==='account'?'账号详情':type==='path'?'路径洞察':'视频详情'}</span><h2>{type==='analysis'?item.name:type==='account'?item.name:type==='path'?item.name:item.title}</h2></div><button className="detailClose" onClick={close} aria-label="关闭详情"><X size={18}/></button></div><div className="detailBody">{type==='analysis'?<RelationAnalysis data={item}/>:type==='account'?<AccountDetail a={item}/>:type==='path'?<PathDetail p={item}/>:<VideoDetail v={item}/>}</div></aside></div>}
function Info({n,v,c=''}){return <p className="info"><span>{n}</span><b className={c}>{v}</b></p>}
function Box({title,children}){return <section className="box"><h3>{title}</h3>{children}</section>}
function RecommendationDecisionAnalysis(){
 const stages=[
  {name:'发布入库',start:0,end:.5,color:'#525861',total:'0',share:'0%',metrics:'内容理解完成 · 机器审核通过',cause:'现场视频完成内容理解与安全审核，进入投稿库。'},
  {name:'冷启动试投',start:.5,end:2,color:'#39757b',total:'1.5K',share:'0.3%',metrics:'完播率 78% · 点赞率 8.2% · TOP 0.3%',cause:'10 个关联账号在冷启动期间快速点赞、分享，综合分被推至同档位 TOP 0.3%。'},
  {name:'首轮推荐',start:2,end:4,color:'#4f9784',total:'21K',share:'5.1%',metrics:'完播率 76% · 分享率 3.1% · 评论率 3%',cause:'高完播与集中互动共同触发自动 boost，视频进入事件兴趣队列。'},
  {name:'二轮扩量',start:4,end:5.5,color:'#b18336',total:'78K',share:'18.9%',metrics:'点赞率 8.7% · 分享率 3.4% · P90',cause:'互动持续优于同档位 P90，系统扩大事件与同城人群覆盖。'},
  {name:'主池放量',start:5.5,end:8,color:'#bd5c45',total:'238K',share:'57.7%',metrics:'评论率 11% · 搜索热度 +320% · 热榜收录',cause:'搜索热度飙升并触发热榜收录，热推队列追加 boost；18:42 大 V 转发再带来 15K VV。'},
  {name:'长尾推荐',start:8,end:168,color:'#6f655c',total:'412.8K',share:'18.0%',metrics:'搜索 22% · 社交 3% · 残余高度 30%',cause:'精准分发已切断，但搜索回流与社交分享继续贡献残余曝光并缓慢衰减。'}
 ]
 const vv48=[.3,.6,1.2,4.5,15,28,42,34,28,22,18,15,12,9,7,5.5,4.5,3.8,3.2,2.8,2.5,2.1,1.7,1.3,1,.9,.78,.69,.61,.55,.49,.44,.4,.36,.33,.3,.28,.26,.24,.22,.2,.18,.16,.14,.12,.1,.09,.08,.07]
 const vv=[...vv48,...Array.from({length:120},(_,index)=>{
  const hour=index+49
  return Math.max(.01,.07*Math.exp(-(hour-48)/30)+.06*Math.exp(-Math.pow((hour-72)/18,2))+.035*Math.exp(-Math.pow((hour-120)/24,2)))
 })]
 const metrics:any={
  completion:{label:'完播率',color:'#6ba47d',values:vv.map((_,i)=>Math.max(48,78-i*.38+(i<6?i*1.3:0)))},
  like:{label:'点赞率',color:'#5b9ea6',values:vv.map((_,i)=>Math.max(2.4,8.2-i*.11+(i<7?i*.08:0)))},
  comment:{label:'评论率',color:'#d4a347',values:vv.map((_,i)=>i===6?11:i===7?8.4:Math.max(1.1,2.2+i*.09-(i>10?(i-10)*.07:0)))},
  share:{label:'分享率',color:'#c7644f',values:vv.map((_,i)=>Math.max(.7,1.2+(i<9?i*.25:(17-i)*.08)))}
 }
 const transitions=[
  {hour:0,stageIndex:0,time:'06-29 15:45',label:'发布',title:'发布入库',vv:'0',comments:'0',likes:'0',shares:'0',completion:'—',interaction:'—',rank:'待评估',detail:'内容理解完成 · 机器审核通过',reasons:['内容理解与机器审核均已完成','未命中内容安全与推荐限制项'],outcome:'视频进入投稿库，开始冷启动测试。'},
  {hour:2,stageIndex:2,time:'06-29 17:45',label:'冷启动通过',title:'首轮推荐',vv:'21K',comments:'860',likes:'1.72K',shares:'651',completion:'78%',interaction:'12%',rank:'TOP 0.3%',detail:'完播率 78% · 互动率 12% · 分享 651',reasons:['完播率 78%、互动率 12%，持续高于冷启动基线','10 个关联账号集中点赞与分享，形成首轮扩散信号'],outcome:'视频通过冷启动，进入首轮推荐。'},
  {hour:4,stageIndex:3,time:'06-29 19:45',label:'持续优于 P90',title:'二轮扩量',vv:'78K',comments:'3.4K',likes:'6.8K',shares:'2.4K',completion:'76%',interaction:'11.4%',rank:'同档位 P90',detail:'完播率 76% · 互动率 11.4% · 持续优于同档位 P90',reasons:['完播率 76%、互动率 11.4%，连续优于同档位 P90','同城互动同步上升，事件兴趣人群仍在扩大'],outcome:'系统扩大事件兴趣与同城覆盖，进入二轮扩量。'},
  {hour:5.5,stageIndex:4,time:'06-29 21:15',label:'热榜收录',title:'主池放量',vv:'238K',comments:'18.6K',likes:'21.2K',shares:'8.7K',completion:'72%',interaction:'13.8%',rank:'TOP 0.1%',detail:'完播率 72% · 互动率 13.8% · 搜索热度飙升 320%',reasons:['搜索热度上涨 320%，触发热榜收录','完播率 72%、互动率 13.8%，能够承接新增流量'],outcome:'热推队列追加分发，视频进入主推荐池。'},
  {hour:6.8,stageIndex:4,time:'06-29 22:33',label:'大 V 转发',title:'主池放量',vv:'286K',comments:'24.3K',likes:'27.9K',shares:'15.2K',completion:'69%',interaction:'14.2%',rank:'分享增量 TOP 1%',detail:'完播率 69% · 互动率 14.2% · 分享 15.2K',reasons:['大 V 转发带来 15.2K 分享，互动率升至 14.2%','社交分享与站外回流持续补充 VV'],outcome:'主池放量周期因此被延长。'}
 ]
 const singleChannelTotals=[239.4,90.8,28.1,20.2,13.6,12.8,7.9]
 const singleChannelRanges:any={feed:[2,8],search:[5.5,16],message:[6,18],profile:[8,24],otherProfile:[8,24],local:[4,12],following:[8,24]}
 const channels=trafficTree.map((source,index)=>{
  const total=singleChannelTotals[index]
  const scale=total/source.value
  return {...source,value:total,share:total/412.8*100,range:singleChannelRanges[source.id],children:source.children.map(child=>({...child,value:child.value*scale,children:child.children.map(item=>[String(item[0]),Number(item[1])*scale] as [string,number])}))}
 })
 const intercepts=[
  {name:'冷启动试投阶段拦截',reduce:'82%',difficulty:'高',detail:'需前置风险识别能力',range:[0,2]},
  {name:'首轮推荐前拦截',reduce:'65%',difficulty:'中',detail:'已有冷启动数据可判断',range:[.5,2]},
  {name:'二轮扩量前拦截',reduce:'34%',difficulty:'低',detail:'已有处置能力但时效不足',range:[2,4]}
 ]
 const [selectedTransition,setSelectedTransition]=useState<number|null>(1)
 const [activeChannelIndex,setActiveChannelIndex]=useState(0)
 const [activeChannelLayerIndex,setActiveChannelLayerIndex]=useState(0)
 const singleFlowRef=useRef<HTMLDivElement>(null)
 const chartRef=useRef<HTMLDivElement>(null)
 const [singleFlowGeometry,setSingleFlowGeometry]=useState<any>(null)
 const [singleFlowSize,setSingleFlowSize]=useState({width:960,height:380})
 const [chartWidth,setChartWidth]=useState(760)
 const [metricVisibility,setMetricVisibility]=useState<any>({completion:false,like:false,comment:false,share:false})
 const width=chartWidth,height=270,plotTop=30,plotBottom=206,chartRenderHeight=270
 const plotLeft=40,plotRight=width-20,plotWidth=plotRight-plotLeft
 const timelineAnchors:[number,number][]=[[0,plotLeft],[12,plotLeft+plotWidth*.58],[24,plotLeft+plotWidth*.67],[48,plotLeft+plotWidth*.75],[72,plotLeft+plotWidth*.82],[120,plotLeft+plotWidth*.91],[168,plotRight]]
 const xForHour=(hour:number)=>{
  const endIndex=Math.max(1,timelineAnchors.findIndex(anchor=>hour<=anchor[0]))
  const [startHour,startX]=timelineAnchors[endIndex-1]
  const [endHour,endX]=timelineAnchors[endIndex]
  return startX+(hour-startHour)/(endHour-startHour)*(endX-startX)
 }
 const xTicks=[{hour:0,date:'06-29',time:'15:45'},{hour:4,date:'06-29',time:'19:45'},{hour:8,date:'06-29',time:'23:45'},{hour:12,date:'06-30',time:'03:45'},{hour:24,date:'06-30',time:'15:45'},{hour:48,date:'07-01',time:'15:45'},{hour:72,date:'07-02',time:'15:45'},{hour:120,date:'07-04',time:'15:45'},{hour:168,date:'07-06',time:'15:45'}]
 const yForVv=(value:number)=>plotBottom-value/45*(plotBottom-plotTop)
 const metricY=(value:number)=>plotBottom-value/100*(plotBottom-plotTop)
 const curveYForHour=(hour:number)=>{
  const start=Math.floor(hour),end=Math.min(Math.ceil(hour),vv.length-1)
  if(start===end)return yForVv(vv[start])
  const fraction=hour-start
  let t=fraction
  for(let iteration=0;iteration<6;iteration++){
   const x=1.5*t-1.5*t*t+t*t*t
   const derivative=1.5-3*t+3*t*t
   t=Math.max(0,Math.min(1,t-(x-fraction)/derivative))
  }
  const eased=3*t*t-2*t*t*t
  return yForVv(vv[start]+(vv[end]-vv[start])*eased)
 }
 const smoothPath=(values:number[],y:(value:number)=>number)=>{
  const points=values.map((value,index)=>[xForHour(index),y(value)])
  return points.reduce((path,point,index)=>{
   if(index===0)return `M${point[0]} ${point[1]}`
   const previous=points[index-1],midX=(previous[0]+point[0])/2
   return `${path} C${midX} ${previous[1]} ${midX} ${point[1]} ${point[0]} ${point[1]}`
  },'')
 }
 const vvPath=smoothPath(vv,yForVv)
 const areaPath=`${vvPath} L${xForHour(168)} ${plotBottom} L${xForHour(0)} ${plotBottom} Z`
 const activeTransition=transitions[selectedTransition??0]
 const activeChannel=channels[activeChannelIndex]
 const activeChannelLayer=activeChannel.children[activeChannelLayerIndex]||activeChannel.children[0]
 const singleDimensionLabel=activeChannel.id==='feed'?'内容 / 广告 / 交易流量':activeChannel.id==='search'?'搜索词':activeChannel.id==='message'?'群聊 / 私聊':activeChannel.id==='local'?'同城城市':'入口场景'
 const singleThirdLabel=activeChannel.id==='feed'?'业务归属':activeChannel.id==='search'?'搜索结果类型':activeChannel.id==='message'?'会话内入口':activeChannel.id==='local'?'同城场景':'内容入口'
 const formatSingleVv=(value:number)=>`${value>=100?value.toFixed(1):value.toFixed(2)}K`
 useEffect(()=>{
  const chart=chartRef.current
  if(!chart)return
  const update=()=>setChartWidth(Math.max(520,Math.round(chart.clientWidth-24)))
  update()
  const observer=new ResizeObserver(update)
  observer.observe(chart)
  return ()=>observer.disconnect()
 },[])
 useEffect(()=>{
  const canvas=singleFlowRef.current
  if(!canvas)return
  const update=()=>{
   const canvasRect=canvas.getBoundingClientRect()
   const point=(element:Element|null,edge:'left'|'right')=>{
    if(!element)return null
    const rect=element.getBoundingClientRect()
    return {x:(edge==='right'?rect.right:rect.left)-canvasRect.left,y:rect.top+rect.height/2-canvasRect.top}
   }
   const selectedSource=canvas.querySelector('.levelOne button[aria-pressed="true"]')
   const secondButtons=Array.from(canvas.querySelectorAll('.levelTwo button'))
   const selectedSecond=canvas.querySelector('.levelTwo button[aria-pressed="true"]')
   const thirdButtons=Array.from(canvas.querySelectorAll('.levelThree button'))
   setSingleFlowSize({width:canvas.clientWidth||960,height:canvas.clientHeight||380})
   setSingleFlowGeometry({
    source:point(selectedSource,'right'),
    second:secondButtons.map(item=>point(item,'left')),
    selectedSecond:point(selectedSecond,'right'),
    third:thirdButtons.map(item=>point(item,'left'))
   })
  }
  update()
  const observer=new ResizeObserver(update)
  observer.observe(canvas)
  return ()=>observer.disconnect()
 },[activeChannelIndex,activeChannelLayerIndex])
 const singleCurve=(start:any,end:any)=>{
  const firstControl=start.x+(end.x-start.x)*.42
  const secondControl=start.x+(end.x-start.x)*.58
  return `M${start.x} ${start.y} C${firstControl} ${start.y} ${secondControl} ${end.y} ${end.x} ${end.y}`
 }
  return <div className="recommendationDecisionAnalysis recommendationForensics">
  <section className="recommendationHero">
   <header><div><h3>视频推荐链路</h3></div></header>
   <div className="forensicLegend"><span className="vvLegend"><i/>VV 增量（K/h）</span>{Object.entries(metrics).map(([key,item]:any)=><button key={key} className={metricVisibility[key]?'on':''} onClick={()=>setMetricVisibility((current:any)=>({...current,[key]:!current[key]}))}><i style={{background:item.color}}/>{item.label}</button>)}<small>左轴 VV 增量 · 右轴互动率</small></div>
   <div className="forensicWorkbench">
    <div ref={chartRef} className="forensicChart">
     <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet" aria-label="发布后一周 VV 增量与互动指标趋势">
     {[0,10,20,30,40].map(value=><g key={value}><line className="forensicGrid" x1={plotLeft} x2={plotRight} y1={yForVv(value)} y2={yForVv(value)}/><text className="axisText" x="4" y={yForVv(value)+3}>{value}K</text></g>)}
     {xTicks.map(tick=><g key={tick.hour}><line className="xTickGuide" x1={xForHour(tick.hour)} x2={xForHour(tick.hour)} y1={plotBottom} y2={plotBottom+5}/><text className="axisText xLabel" x={xForHour(tick.hour)} y="229"><tspan x={xForHour(tick.hour)}>{tick.date}</tspan><tspan className="xTime" x={xForHour(tick.hour)} dy="10">{tick.time}</tspan></text></g>)}
     <text className="axisText axisTitle" x={plotLeft} y="16">VV 增量（K/h）</text><text className="axisText axisTitle right" x={plotRight} y="16">互动率（%）</text>
     {stages.slice(1).map(stage=><line key={stage.name} className="stageSeparator" x1={xForHour(stage.start)} x2={xForHour(stage.start)} y1={plotTop} y2={plotBottom}/>)}
     <path className="forensicArea" d={areaPath}/><path className="forensicVvLine" d={vvPath}/>
     {Object.entries(metrics).map(([key,item]:any)=>metricVisibility[key]&&<path key={key} className="metricLine" style={{stroke:item.color}} d={smoothPath(item.values,metricY)}/>)}
     </svg>
     <div className="transitionPointLayer">{transitions.map((transition,index)=>{const top=curveYForHour(transition.hour);return <button key={transition.label} aria-label={`${transition.label}，查看阶段概述`} className={'transitionPoint'+(selectedTransition===index?' selected':'')} style={{left:`${xForHour(transition.hour)/width*100}%`,top:`${top/height*chartRenderHeight}px`}} onClick={()=>setSelectedTransition(index)}><i/><span className="transitionLabel">{transition.label}</span><span className="transitionTooltip"><b>{transition.title}</b>{transition.detail}</span></button>})}</div>
    </div>
    <aside className="forensicAttribution" aria-live="polite">
     <header><h3>{activeTransition.title}</h3><p>{activeTransition.time} · {activeTransition.label}</p></header>
     <div className="attributionCause"><div className="reasonList"><b>原因：</b><ol>{activeTransition.reasons.map(reason=><li key={reason}>{reason}</li>)}</ol></div><p className="reasonOutcome"><b>结果：</b><span>{activeTransition.outcome}</span></p></div>
     <div className="attributionMetricMatrix">
      <strong>阶段指标</strong>
      <div><span>当前 VV</span><b>{activeTransition.vv}</b><span>完播率</span><b>{activeTransition.completion}</b></div>
      <div><span>评论</span><b>{activeTransition.comments}</b><span>互动率</span><b>{activeTransition.interaction}</b></div>
      <div><span>点赞</span><b>{activeTransition.likes}</b><span>分享</span><b>{activeTransition.shares}</b></div>
     </div>
    </aside>
   </div>
   <div className="singleChannelSankey hierSankey">
    <div className="sankeyHead"><div><b>渠道传播路径</b><span>当前视频口径 · 总 VV 412.8K；层级定义与事件渠道分析一致</span></div><div className="pathCrumb"><span>{activeChannel.name}</span><ChevronRight/><b>{singleDimensionLabel}</b></div></div>
    <div ref={singleFlowRef} className="singleChannelFlow">
     <svg viewBox={`0 0 ${singleFlowSize.width} ${singleFlowSize.height}`} preserveAspectRatio="none">{activeChannel.children.map((item,index)=>{const start=singleFlowGeometry?.source||{x:230,y:58+activeChannelIndex*39};const end=singleFlowGeometry?.second?.[index]||{x:385,y:92+index*76};return <path key={'c'+item.id} className="active" d={singleCurve(start,end)} style={{strokeWidth:Math.max(5,item.value/activeChannel.value*24)}}/>})}{activeChannelLayer.children.map((item,index)=>{const start=singleFlowGeometry?.selectedSecond||{x:575,y:92+activeChannelLayerIndex*76};const end=singleFlowGeometry?.third?.[index]||{x:730,y:58+index*37};return <path key={'r'+item[0]} className="tertiary" d={singleCurve(start,end)} style={{strokeWidth:Math.max(2,item[1]/activeChannel.value*16)}}/>})}</svg>
     <div className="singleFlowColumn levelOne"><h4>一级 · 流量渠道（单选）</h4>{channels.map((channel,index)=><button key={channel.name} className={activeChannelIndex===index?'selected':''} aria-pressed={activeChannelIndex===index} onClick={()=>{setActiveChannelIndex(index);setActiveChannelLayerIndex(0)}}><span>{channel.name}<small>{channel.share.toFixed(1)}%</small></span><b>{formatSingleVv(channel.value)}</b></button>)}</div>
     <div className="singleFlowColumn levelTwo"><h4>二级 · {singleDimensionLabel}</h4>{activeChannel.children.map((item,index)=><button key={item.id} className={activeChannelLayerIndex===index?'selected':''} aria-pressed={activeChannelLayerIndex===index} onClick={()=>setActiveChannelLayerIndex(index)}><span>{item.name}<small>{(item.value/activeChannel.value*100).toFixed(1)}%</small></span><b>{formatSingleVv(item.value)}</b></button>)}</div>
     <div className="singleFlowColumn levelThree"><h4>三级 · {singleThirdLabel}</h4>{activeChannelLayer.children.map(item=><button key={item[0]}><span>{item[0]}<small>{(item[1]/activeChannelLayer.value*100).toFixed(1)}%</small></span><b>{formatSingleVv(item[1])}</b></button>)}</div>
    </div>
   </div>
  </section>
 </div>
}
function VideoDetail({v}){
 const [detailTab,setDetailTab]=useState<'投稿信息'|'流量分析'|'治理信息'>('流量分析')
 return <><div className="videoTop videoDetailHero"><div className="bigThumb"><Play size={24} fill="currentColor"/><b>00:36</b></div><div><em>{v.grade} · 单视频下钻</em><h3>{v.title}</h3><p>{v.author} <span>{v.handle}</span></p><footer><b><Eye size={13}/>{v.play}</b><b><MessageCircle size={13}/>{v.interaction}</b><b><Clock3 size={13}/>发布于 06-29 15:45</b></footer></div></div><nav className="videoDetailTabs">{(['投稿信息','流量分析','治理信息'] as const).map(tab=><button key={tab} className={detailTab===tab?'selected':''} onClick={()=>setDetailTab(tab)}>{tab}</button>)}</nav>{detailTab==='投稿信息'?<><Box title="内容信息"><Info n="发布时间" v="2026-06-29 15:45:12"/><Info n="内容状态" v="持续扩散" c="safe"/><Info n="内容标签" v="社会事件 / 动物保护"/><Info n="传播层级" v={v.grade}/></Box><Box title="视频原文"><blockquote>“{v.title}。相关现场信息仍在核实，请理性讨论并避免传播未经证实的细节。”</blockquote></Box><Box title="AI 内容解析"><div className="parse"><span>OCR 文本</span><p>揭阳 · 动物保护 · 现场核实 · 理性讨论</p><span>ASR 摘要</span><p>视频记录疑似虐待动物场景，围绕涉事者责任与动物保护立法形成讨论。</p></div></Box></>:detailTab==='流量分析'?<RecommendationDecisionAnalysis/>:<><Box title="治理状态"><Info n="审核结果" v="通过"/><Info n="推荐状态" v="限制长尾推荐" c="risk"/><Info n="风险标签" v="争议事件 / 负向评论聚集" c="risk"/><Info n="处置策略" v="二轮扩量前增加风险观点复核"/></Box><Box title="治理记录"><div className="timeline"><i/><p><b>机器审核通过</b><span>06-29 15:45:16 · 未命中明确违规</span></p><i/><p><b>首轮推荐后风险分上升</b><span>06-29 15:56:32 · 负向评论开始聚集</span></p><i/><p><b>人工复核触发</b><span>06-29 17:20:11 · 主池放量后触发，介入偏晚</span></p></div></Box></>}</>
}
function LegacyVideoDetail({v}){
 const [detailTab,setDetailTab]=useState<'投稿信息'|'流量分析'|'治理信息'>('流量分析')
 const replay=[
  ['发布入库','15:45:12','完成内容理解与安全审核','0','原创度 96%'],
  ['冷启动试投','15:45:18','进入 300 人探索流量池','300','完播率 72.4%'],
  ['首轮推荐','15:48:06','互动表现高于同类基线','1.8万','互动率 8.7%'],
  ['二轮扩量','16:05:40','进入事件与同城兴趣队列','42.6万','分享率 3.2%'],
  ['主池放量','17:10:22','多目标排序持续获得曝光','328.6万','负反馈 0.41%']
 ]
 return <><div className="videoTop videoDetailHero"><div className="bigThumb"><Play size={24} fill="currentColor"/><b>00:36</b></div><div><em>{v.grade} · 单视频下钻</em><h3>{v.title}</h3><p>{v.author} <span>{v.handle}</span></p><footer><b><Eye size={13}/>{v.play}</b><b><MessageCircle size={13}/>{v.interaction}</b><b><Clock3 size={13}/>发布于 06-29 15:45</b></footer></div></div><nav className="videoDetailTabs">{(['投稿信息','流量分析','治理信息'] as const).map(tab=><button key={tab} className={detailTab===tab?'selected':''} onClick={()=>setDetailTab(tab)}>{tab}</button>)}</nav>{detailTab==='投稿信息'?<><Box title="内容信息"><Info n="发布时间" v="2026-06-29 15:45:12"/><Info n="内容状态" v="持续扩散" c="safe"/><Info n="内容标签" v="社会事件 / 动物保护"/><Info n="传播层级" v={v.grade}/></Box><Box title="视频原文"><blockquote>“{v.title}。相关现场信息仍在核实，请理性讨论并避免传播未经证实的细节。”</blockquote></Box><Box title="AI 内容解析"><div className="parse"><span>OCR 文本</span><p>揭阳 · 动物保护 · 现场核实 · 理性讨论</p><span>ASR 摘要</span><p>视频记录疑似虐待动物场景，围绕涉事者责任与动物保护立法形成讨论。</p></div></Box></>:detailTab==='流量分析'?<><div className="singleVideoMetrics">{[['累计曝光','412.8万','进入主推荐池'],['有效播放',v.play,'播放转化 79.6%'],['互动总量',v.interaction,'高于同类 1.7 倍'],['推荐周期','25小时','当前进入长尾']].map(item=><article key={item[0]}><span>{item[0]}</span><b>{item[1]}</b><em>{item[2]}</em></article>)}</div><Box title="推荐链路还原"><div className="recommendReplayHead"><div><Sparkles size={15}/><b>单视频推荐 Case</b><span>从投稿入库到主池放量，按真实推荐阶段模拟还原</span></div><em>链路置信度 92.6%</em></div><div className="recommendReplay">{replay.map((step,index)=><article key={step[0]} className={'stage'+index}><div className="replayRail"><i>{index+1}</i>{index<replay.length-1&&<u/>}</div><div><header><b>{step[0]}</b><time>{step[1]}</time></header><p>{step[2]}</p><footer><span>累计曝光 <strong>{step[3]}</strong></span><em>{step[4]}</em></footer></div></article>)}</div></Box><Box title="推荐决策证据"><div className="recommendEvidence">{[['内容质量','原创内容，画面与语义信息完整','通过'],['用户反馈','完播、评论和分享连续高于同类基线','正向'],['队列承接','探索池 → 事件兴趣池 → 同城池 → 主推荐池','4 级'],['治理信号','存在争议性讨论，未触发流量熔断','观察']].map(item=><p key={item[0]}><span>{item[0]}</span><b>{item[1]}</b><em>{item[2]}</em></p>)}</div></Box></>:<><Box title="治理状态"><Info n="审核结果" v="通过"/><Info n="推荐状态" v="正常推荐" c="safe"/><Info n="风险标签" v="争议事件 / 需持续观察" c="risk"/><Info n="处置策略" v="不处置，保留人工巡检"/></Box><Box title="治理记录"><div className="timeline"><i/><p><b>机器审核通过</b><span>06-29 15:45:16 · 未命中明确违规</span></p><i/><p><b>加入事件观察</b><span>06-29 16:08:32 · 观点分化持续上升</span></p><i/><p><b>人工复核完成</b><span>06-30 09:20:11 · 保持正常推荐</span></p></div></Box></>}</>
}
function AccountDetail({a}){return <><div className="profile"><i className={'avatar big '+a.c}>{a.name[0]}</i><div><h3>{a.name}<b>✓</b></h3><p>{a.handle}</p><em className={a.risk==='低风险'?'safeTag':''}>{a.risk}</em></div></div><StatsRow vals={[[a.fans,'粉丝'],['186','关联内容'],['7.8万','获赞']]}/><Box title="账号属性"><Info n="账号类型" v={a.auth}/><Info n="注册时长" v="2 年 8 个月"/><Info n="近 30 日活跃" v="34 条内容"/><Info n="设备聚类" v="D-02（关联 3 个账号）" c="risk"/></Box><Box title="关系证据"><div className="evidence">高频互动<b>近 7 日与 4 个账号互评、互转 28 次</b></div><div className="evidence">内容共现<b>与事件相关视频 12 条，语义相似度均值 82%</b></div><div className="evidence">设备关联<b>同设备登录记录 3 个账号</b></div></Box><Box title="研判建议"><div className="advice"><ShieldAlert size={16}/>存在跨账号高频互动与设备共现信号，建议纳入观察组并持续追踪。</div></Box></>}
function PathDetail({p}){return <><div className="pathTop"><i className="pathIcon pi0"><Play size={19}/></i><div><h3>{p.name}</h3><p>主传播入口 · 占总有效播放 60.3%</p></div></div><StatsRow vals={['3,814.2万','60.3%','1,984'].map((x,i)=>[x,['有效播放','路径占比','关联视频'][i]])}/><Box title="细分分发"><Info n="推荐页" v="41.7%"/><Info n="同城页" v="18.6%"/><Info n="关注页" v="12.1%"/><Info n="其他场景" v="27.6%"/></Box><Box title="路径洞察"><div className="advice"><Sparkles size={16}/>推荐页在隐喻视频发布后 3 小时达到峰值；“谁把它放上去”相关观点互动率高于整体均值 1.8 倍。</div></Box></>}
function StatsRow({vals}){return <div className="statsRow">{vals.map(x=><div key={x[1]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div>}
const appRoot=(globalThis as any).__propagationAnalysisRoot||createRoot(document.getElementById('root')!)
;(globalThis as any).__propagationAnalysisRoot=appRoot
appRoot.render(<App />)
