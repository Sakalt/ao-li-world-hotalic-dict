import reactStringReplace from "react-string-replace";

import { Word, Link, Explanation, Desc, Example } from './types/dict';

import './App.css';
import './pagenate.css'

import {typeClass} from "./funcs"

import { FaAngleRight } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa6";

export const Entry = (props: {entry: Word}) => {
    const e = props.entry
    return (
        <div className="content">
        <div className="word">
            <div>
            <span className="phun">{e.word}</span>
            <span className="subWord">
                <span className="trans">{e.word}</span>
                <span className="latinPron">⟨{e.latinPron}⟩</span>
                <span className="pron">⟨{e.pron}⟩</span>
                <span className="weqoPron">⟨{e.pron}⟩</span>
            </span>
            </div>
            <span className="num">{e.num=="-"? "": "#"+e.num}</span>
        </div>
        <div className="wordDesc">
            <Mean data={e.mean}/>
            <Append data={e.append}/>
            {e.link? <WordLink data={e.link}/>: <></>}
        </div>
        </div>
    )
}

const Mean = (props: {data: Word["mean"]}) => {
    const descArr = props.data.map((a, idx) => 
        <EntryWrapper
        type={a.type}
        exp={a.explanation}
        class={typeClass[a.type]}
        func={MeanDesc}
        key={idx}
        />
    )
    return <div className='meanExp'>{descArr}</div>
}

const Append = (props: {data: Word["append"]}) => {
    const descArr = props.data.map((a, idx) => 
        <EntryWrapper
        type={a.type}
        exp={a.explanation}
        key={idx}
        func={AppendDesc}
        />
    )
    return <>{descArr}</>
}

const WordLink = (props: {data: Link[]}) => {
    const descArr = props.data.map((a, idx) => 
        <EntryWrapper
        type={a.type}
        exp={a.explanation}
        key={idx}
        func={LinkDesc}
        />
    )
    return <>{descArr}</>
}

const ExampleSentences = (props: {data: Example[]}) => {
    const examples = props.data
    return <>{examples.map((s, idx) => 
        <div className='exampleSentence' key={idx}>
        <div className='sentencePNRow'>
            <span className='sentencePN'>{s.pn}</span>
            <span className='sentencePNKanji'>{s.pn}</span>
            <span className='sentencePNPron'>⟨{s.pnPron}⟩</span>
        </div>
        <div className='sentenceJPRow'>
            <span className='sentenceIcon'><FaCaretRight /></span>
            <span className='sentenceJA'>{s.ja}</span>
        </div>
        </div>
    )}</>
}

const EntryWrapper = (props:
    {
        type: string,
        class?: string,
        exp: Explanation[] | string[],
        func: (props: any) => JSX.Element
    }) => {
        return (
        <div className="speech">
            <span className={`type ${props.class}`}>{props.type}</span>
            <div className="text"><props.func exp={props.exp}/></div>
        </div> //一つ一つの表示形式を指定するためpropsで関数を受け取る
        )
}

const toLink = (text: string) => {
    return reactStringReplace(text, /\[(.*?)\]/g, (match) => 
        (<a href={`/?rule=perfect&text=${match}`}>
        {match}
        </a>)
    )
}

const MeanDesc = (props: any) => {
    const nums = ["一","二","三","四","五","六","七","八","九","十"]
    const exp = props.exp

    const expData = 
        exp.map((r: Explanation, idx: number) => //rには品詞内のエントリが入る
        <div className='expRow' key={idx}>
            {exp.length > 1? //語義が二つ以上ある場合、先頭に番号を表示
                <span className='expNumContainer'>
                <span className='expNum'>{nums[idx]}</span>
                </span>
                : <></> }

            <span>
            {r.tag.map(t => <span className='expTag'>{`〈${t}〉`}</span>)}
            </span>

            <div className='expTexts'>
            <span>{r.translate}</span>
            <div className='expAppend'>
                {r.meaning?
                <span className='expMean'>
                    <span className='expMeanIcon'><FaAngleRight /></span>
                    <span className='expMeanText'>
                    {toLink(r.meaning)}
                    </span>
                </span>
                : <></>}
                {r.example.length > 0?
                <div className="example">
                    <ExampleSentences data={r.example}/>
                </div>
                :<></>}
            </div>
            </div>
        </div>
        )

    return <>{expData}</>
}

const AppendDesc = (props: any) => {
    const expData: string = props.exp[0].translate

    const linkProcessed = toLink(expData)
    return <>{linkProcessed}</>
}

const LinkDesc = (props: any) => {
    return (
        <span>
        {
        props.exp.map((l: string, idx: number) => {
            const linkElem = <a href={`/?rule=perfect&text=${l}`} key={idx}>{l}</a> //リンク作成
            return props.exp.length - 1 > idx? <>{linkElem}, </>: linkElem //末尾の要素以外は読点を付ける
        })
        }
        </span>
    )
}
