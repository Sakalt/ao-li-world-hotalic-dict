import { Word } from "./types/dict"

export const typeClass: any = {
    "名詞": "noun",
    "接頭辞": "prefix",
    "接尾辞": "suffix",
    "代名詞": "pronoun",
    "動詞": "verb",
    "形容詞": "adjective",
    "副詞": "adverb",
    "助詞": "particle",
    "助数詞": "quantifier",
    "感動詞": "interjection",
    "接続詞": "conjunction",
    "数詞": "numeral",
    "情詞": "modal",
    "前置詞": "preposition"
}

export function toPhunnum(num: string) {
    const PhunNum: any = {
        "0": "〇",
        "1": "〡",
        "2": "〢",
        "3": "〣",
        "4": "〤",
        "5": "〥",
        "6": "〦",
        "7": "〧",
        "8": "〨",
        "9": "〩",
        "a": "〹",
        "b": "〺",
        ".": "・",
    }

    return num.toString().split("").map(e => {
        return PhunNum[e]
    }).join("")
}

export const sendForm = async (form: any, action: string) => {
    const formData = new FormData()
    Object.keys(form).forEach((e: any) => {
        formData.append(e, form[e])
    })
    try {
        const options = {
            method: 'POST',
            body: formData,
        }

    const res = await fetch(action, options)

    if (res.status === 200) {
    return true
    }
    } catch (e) {
        console.log(e)
        return false
    }
    return false
}

export async function FetchDictData(url: string) {
    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("データの取得に失敗しました");
        }

        const data = await res.json();
        return data
    } catch (error) {
        console.error(error);
        throw error
    }
};

const isIncludes = (data: any[], entry: string, filter: string, rule: string) => {
    return data.some((m: any) => {
        return m.explanation.some((e: any) => {
            return searchWithRule(e[entry], filter, rule)
        })
    })
}

export function clipDict(dict: Word[], filter: string = "", type: string = "word", rule: string = "part", sort: string = "weqo") {
    let filtedWords = dict.filter((w: any) => {
        switch (type) {
            case "all":
                const searchBool = [
                    isIncludes(w.mean, "translate", filter, rule),
                    isIncludes(w.mean, "meaning", filter, rule),
                    isIncludes(w.append, "translate", filter, rule),
                    searchWithRule(w.pron, filter, rule),
                    searchWithRule(w.word, filter, rule),
                ]
                return searchBool.some(b => b)
            case "mean":
                return isIncludes(w.mean, "translate", filter, rule)
            case "pron":
                return searchWithRule(w.pron, filter, rule) || searchWithRule(w.latinPron, filter, rule)
            default:
                return searchWithRule(w[type], filter, rule) //mean以外の時はこっち
        }
    })

    filtedWords.sort((a: any, b: any) => {
        return sortWithRule(sort, a, b)
    })

    return filtedWords
}

export function clipForPage(dict: Word[], page: number, words: number) {
    return (
        dict.filter((a, idx) => {
            return Math.floor(idx / words) == page
        })
    )
}

function sortWithRule(sort: string, a: any, b: any) {
    switch (sort) {
        case "uni":
            if (a.word > b.word){
                return 1;
            } else if (a.word < b.word) {
                return -1;
            } else {
                return 0;
            }
        case "weqo":
            return weqoSort(a.pron, b.pron)
        default:
            return 1
    }
}

function searchWithRule(word: string, filter: string, rule: string){
    if (!word) { //undefined等を弾く
        return false
    }

    switch(rule){
        case "part":
            return word.includes(filter)
        case "start":
            return word.startsWith(filter)
        case "end":
            return word.endsWith(filter)
        case "perfect":
            return word == filter
        case "regular":
            try {
                const reg = new RegExp(filter)
                return reg.test(word)
            } catch (e) {
                return false
            }
            
    }
}

function weqoSort(a: string, b: string) {
    const aArr = a.split(" ")
    const bArr = b.split(" ")

    const check = new Array(Math.max(aArr.length, bArr.length)).fill(0)
    const result: boolean | null = check.reduce((pre: boolean | null, _, idx) => {
        if (pre === null) {
            return syllableWeqo(aArr[idx], bArr[idx])
        }
        return pre
    }, null)
    return result === null? 0: result? 1: -1 //resultがnullなら0、trueなら1、falseなら-1を返却
}

function syllableWeqo(a: string = "", b: string = "") {
    const rank = [
        ["k", "g", "q", "j", "t", "d", "c", "p", "b", "x", "s", "z", "f", "v", "n", "m", "l", "h", "y", "w", ""], //頭子音
        ["a", "e", "o", "i", "u", "ao", "ai", "ua", "uo"], //母音
        ["", "s", "ng", "n", "m", "l"], //末子音
        ["1", "2", "3"] //声調
    ]
    const aReg = a.match(/(.*?)([aiueo]+)(.*?)([123])/)
    const bReg = b.match(/(.*?)([aiueo]+)(.*?)([123])/)
    if (aReg === null && bReg === null) {return null}
    if (aReg === null) {return false}
    if (bReg === null) {return true}

    const aSyl = [aReg[1], aReg[2], aReg[3], aReg[4]]
    const bSyl = [bReg[1], bReg[2], bReg[3], bReg[4]]
    const result: boolean | null = rank.reduce((pre: boolean | null, r, idx) => {
        if (pre === null) {
            const aR = r.indexOf(aSyl[idx])
            const bR = r.indexOf(bSyl[idx])
            return aR == bR? null: aR > bR
        }
        return pre
    }, null)
    return result
}

export function getTotalPages(dict: any[], words: number) {
    return Math.ceil(dict.length / words)
}
