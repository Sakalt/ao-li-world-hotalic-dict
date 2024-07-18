import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { BrowserRouter, Route, Router, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

import { Word } from './types/dict';

import dictFile from "./output.json"

import './App.css';
import './pagenate.css'

import {clipDict, getTotalPages, clipForPage, FetchDictData} from "./funcs"
import { aboutData } from './About';
import { Entry } from './Entry';

import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

const fetchURL = "https://kaeru2193.github.io/Phun-Resources/dict/phun-dict.json"

const wordInOnePage = 30

const App = () => {
  const [main, setMain] = useState(<></>);

  useEffect(() => {
    const access = async () => {
      try {
        const json = await FetchDictData(fetchURL);

        setMain(
          <BrowserRouter>
            <Main text="栄" rule="perfect" dict={json.data} date={json.date}/>
          </BrowserRouter>
        )
      } catch (error) {
        setMain(
          <div>
            データ取得に失敗しました。
          </div>
        )
      }
    }

    access()
  }, []);

  return (
    main
  )
}

const Main = (props: any) => {
  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const type = query.get('type')
  const rule = query.get('rule')
  const text = query.get('text')
  const sort = query.get('sort')
  const page = Number(query.get('page'))

  const darkThemeCookie = Cookies.get('darkTheme')

  const [darkTheme, setDarkTheme] = useState(darkThemeCookie? true: false) //Cookieの有無でテーマ付与

  const dictData: Word[] = props.dict

  const [searchType, setType] = useState(type == undefined? "word": type)
  const [searchRule, setRule] = useState(rule == undefined? "part": rule)
  const [searchText, setText] = useState(text == undefined? "": text)
  const [sortRule, setSort] = useState(sort == undefined? "weqo": sort)
  const [presentPage, setPage] = useState(page == undefined || isNaN(page)? 0: page)

  const searchURL = `https://dict.kaeru2193.net/?type=${searchType}&rule=${searchRule}&text=${searchText}&sort=${sortRule}&page=${presentPage}`

  const lc = new Date(props.date)
  const lastChangedText = `${lc.getFullYear()}/${lc.getMonth() + 1}/${lc.getDate()}`

  const sideDisplayNum = window.innerWidth > 600? 2: 1 //画面サイズが小さい時はページ表示を減らす

  const filtedDict = clipDict(dictData, searchText, searchType, searchRule, sortRule)
  const dictInPage = clipForPage(filtedDict, presentPage, wordInOnePage)

  const totalPage = getTotalPages(filtedDict, wordInOnePage)

  const resetPage = () => {setPage(0)}

  const goTop = () => {window.scrollTo({top: 0});}
  const changePage = (data: any) => {
    let selectedPage = data['selected']
    goTop()
    setPage(selectedPage)
  }

  return (
    <div className={`mainContainer ${darkTheme? "dark-theme": ""}`}>
      <header>
        <div className='headerBox'>
          <div className="logobox">
            <div className="logo">
              <a href="/"><img className="logo" src="./assets/logo.svg"/></a>
            </div>
            <SelectTheme value={darkTheme} set={setDarkTheme}/>
          </div>
          
          <About data={aboutData}/>
        </div>
      </header>
      <main className="App">
    
        <Search reset={resetPage} text={[searchText, setText]} rule={[searchRule, setRule]} type={[searchType, setType]}/>

        <div className='topBar'>
          <span>検索結果: {filtedDict.length}件 {filtedDict.length != 0? `(${presentPage * wordInOnePage + 1}～${presentPage * wordInOnePage + dictInPage.length}件目)`: ""}</span>

          <div className='rightBarContainer'>
            <button className='searchCopy' onClick={() => {
              navigator.clipboard.writeText(searchURL);
            }}>検索用URLをコピー</button>

            <Sort reset={resetPage} sort={[sortRule, setSort]}/>
          </div>
        </div>

        <Dict dict={dictInPage}/>

        <ReactPaginate
          pageCount={totalPage} //総ページ数。今回は一覧表示したいデータ数 / 1ページあたりの表示数としてます。
          marginPagesDisplayed={sideDisplayNum} //先頭と末尾に表示するページの数。今回は2としたので1,2…今いるページの前後…後ろから2番目, 1番目 のように表示されます。
          pageRangeDisplayed={3} //上記の「今いるページの前後」の番号をいくつ表示させるかを決めます。
          forcePage={presentPage}
          onPageChange={changePage} //ページネーションのリンクをクリックしたときのイベント(詳しくは下で解説します)
          containerClassName='react-paginate' //ページネーションリンクの親要素のクラス名
          pageLinkClassName='page-link' //ページネーションのリンクのクラス名
          activeLinkClassName='active' //今いるページ番号のリンクのクラス名。
          previousLabel={<FaAngleLeft/>} //前のページ番号に戻すリンクのテキスト
          nextLabel={<FaAngleRight/>} //次のページに進むボタンのテキスト
          previousLinkClassName='previous'  //'<'のリンクのクラス名
          nextLinkClassName='next' //'>'のリンクのクラス名
          disabledLinkClassName='disabled'
          breakLabel='...' // ページがたくさんあるときに表示しない番号に当たる部分をどう表示するか
          breakLinkClassName='break' // 「…」の中のリンクにつけるクラス
          />
      </main>
      <footer>
        <div>最終辞書更新: {lastChangedText}</div>
        <div>© 2024 kaeru2193 Some rights reserved under CC BY-NC 4.0</div>
      </footer>
    </div>
  );
}

const SelectTheme = (props: any) => {
  return (
    <div className="themeBox">
      <label className="themeLabel">
        <input className="themeToggle" type='checkbox' defaultChecked={props.value} onChange={(event) => {
          props.set(event.target.checked)

          if (event.target.checked) { //Cookieの書き込み/削除処理
            Cookies.set('darkTheme', 'on')
          } else {
            Cookies.remove('darkTheme')
          }
        }}/>
        <div className='light'>
        </div>
        <div className='dark'>
        </div>
      </label>
    </div>
  )
}

const About = (props: any) => {
  return (
    <div className='aboutContainer'>
      {props.data.map((e: any) => (
        <AboutEntry name={e.name} content={e.content} key={e.name}/>
      ))}
    </div>
  )
} 

const AboutEntry = (props: any) => {
  return (
    <details className='about'>
      <summary>
        <span className='summaryInner'>
          {props.name}<span className='summaryIcon'>∧</span>
        </span>
      </summary>
      <div className="aboutContent">
        {props.content}
      </div>
    </details>
  )
}

const Sort = (props: any) => {
  const sortOption = [
    {value: "weqo", name: "声字順"},
    {value: "uni", name: "Unicode順"},
  ]

  return (
    <>
      <select
        id="sort"
        onChange={(event) => {
          props.reset()
          props.sort[1](event.target.value)
        }}
      >
        {sortOption.map((s, idx) => (
            <option
              value={s.value}
              key={idx}
            >
              {s.name}
            </option>
        ))}
      </select>
    </>
  )
}

const Search = (props: any) => {
  const ruleOption = [
    {value: "part", name: "部分一致"},
    {value: "start", name: "前方一致"},
    {value: "end", name: "後方一致"},
    {value: "perfect", name: "完全一致"},
    {value: "regular", name: "正規表現"},
  ]
  const typeOption = [
    {value: "word", name: "見出し語"},
    {value: "mean", name: "訳語"},
    {value: "pron", name: "発音"},
    {value: "all", name: "全文"},
    {value: "num", name: "字序 (Phun.)"},
  ]

  return (
    <div className='searchContainer'>
      <span className="search">
          <input id="input" type="text"
            value={props.text[0]}
            onChange={(event) => {
              props.reset()
              props.text[1](event.target.value)}}
          />
      </span>
      <div className="searchOption">
        <div id="searchrule">
          {ruleOption.map((s, idx) => (
            <label key={idx}>
              <input type="radio"
                checked={props.rule[0] == s.value}
                value={s.value}
                onChange={(event) => {
                  props.reset()
                  props.rule[1](event.target.value)
                }}
              />
              <span>{s.name}</span>
            </label>
          ))}
        </div>

        <div id="searchtype">
          {typeOption.map((s, idx) => (
            <label key={idx}>
              <input type="radio"
                checked={props.type[0] == s.value}
                value={s.value}
                onChange={(event) => {
                  props.reset()
                  props.type[1](event.target.value)
                }}
              />
              <span>{s.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

const Dict = (props: {dict: Word[]}) => {
  const dictArr = props.dict.map((w, idx) => <Entry entry={w} key={idx}/>)

  return <div className='contentBox'>{dictArr}</div>
}

export default App; 
