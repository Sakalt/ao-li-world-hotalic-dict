import React, { useState, useEffect } from "react"
import { sendForm } from "./funcs"
import { Entry } from "./Entry"

const WordForm = () => {
    const form: any = {
        "entry.1936496141": "",
        "entry.1448219354": "",
        "entry.1819477296": ""
    }
    const formURL = "https://docs.google.com/forms/u/0/d/e/--/formResponse"
    const [submitted, setSubmitted] = useState({flag: false, result: false})
    
    const SubmitProcess = () => {
        const Process = async () => {
            const result = await sendForm(form, formURL)
        
            setSubmitted({flag: true, result: result})

            setTimeout(() => {
                window.location.reload()
            }, 3000) //3秒後に再読み込み
        }
        Process()
    }

    const changeData = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        form[e.target.name] = e.target.value
    }

    return (
        <>
        <p>
            こちらから造語を依頼できます。
        </p>
        <form className="wordForm">
            <div className="formName">単語 (必須)</div>
            <div className="formDesc">※複数依頼する場合には、単語ごとに改行して入力してください。</div>
            <textarea name="entry.1936496141" rows={5} className="inputForm" 
                onChange={changeData} required></textarea>

            <div className="formName">お名前 (任意)</div>
            <input type="text" name="entry.1448219354" className="inputForm" onChange={changeData}/>

            <div className="formName">コメント (任意)</div>
            <textarea name="entry.1819477296" rows={3} className="inputForm" onChange={changeData}></textarea>

            <button type="button" className="submit" onClick={SubmitProcess}>送信</button>
        </form>
        {submitted.flag? <p>依頼を送信しました。3秒後にページをリロードします。</p>: <></>}
        </>
    )
}

export const aboutData = [
    {
        name: "このサイトについて",
        content: (<>
        </>)
    },
    {
        name: "凡例",
        content: (<>
            <h2>書式</h2>
            <div>■見出し語■</div>
            <div><b>漢字転写</b> ⟨符号付きラテン文字転写⟩ ⟨数字付きラテン文字転写⟩ ⟨声字表記⟩</div>
            <div>【品詞1】[一] その品詞での語義1　[二] ‹タグ› その品詞での語義2...</div>
            <div>【品詞2】その品詞での語義　{">"}その品詞での語法</div>
            <div>【品詞3】その品詞での語義<br/>　[例文 漢字転写 発音<br/>　　例文和訳]</div>
            <div>　：</div>
            <div>【補遺1】[一] 補遺の内容1　[二] 補遺の内容2...</div>
            <div>【補遺2】補遺の内容</div>
            <div>　：</div>

            <h2>品詞</h2>
            <div>【名詞】</div>
            <div>【接頭辞】単語の頭に付いて新たな単語を形成するもの。</div>
            <div>【接尾辞】単語の末尾に付いて新たな単語を形成するもの。</div>
            <div>【代名詞】</div>
            <div>【動詞】</div>
            <div>【形容詞】</div>
            <div>【副詞】</div>
            <div>【助詞】</div>
            <div>【感動詞】</div>
            <div>【接続詞】</div>
            <div>【数詞】</div>
            <div>【助数詞】</div>
            <div>【情詞】</div>
            <div>【前置詞】</div>

            <h2>補遺</h2>
            <div>【語法】語の意味範囲や用法など。</div>
            <div>【類語】似た意味を持つ単語。</div>
            <div>【対義語】反対の意味を持つ単語。</div>
            <div>【関連語】上記2つには当てはまらないが、強い関連性を持つ単語。</div>
            <div>【世界観】文化など、単語が存在する背景。</div>
            <div>【文法】例外的な語順を用いる単語など、文法に関して特筆すべきこと。</div>
            <div>【改定】過去の単語改訂履歴のうち、重要なもの。</div>
            <div>【感想】辞書編纂者個人の感想。読む価値は乏しい。</div>

            <h2>タグ</h2>
            <div>〈数〉数学</div>
            <div>〈化〉化学</div>
            <div>〈生〉生物</div>
            <div>〈現〉現界にのみ存在する概念であり、使われない語。</div>
        </>)
    }
    /*,
    {
        name: "造語依頼",
        content: (<>
            <WordForm/>
        </>)
    }
    */
]
