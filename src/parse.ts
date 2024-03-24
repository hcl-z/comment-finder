import { CommentRegExpMap, CommentType, DEFAULTCOMMENTRE, languageCommentTypeMap } from "./const";
import { beautify, getContentFromPos, getPosDetail } from "./utils";


export interface IRegExp {
    /**
     * 正则表达式
     */
    regExp: RegExp;
    /**
     * 是否为单行注释 default: false
     */
    isSingleLine?: boolean;

    /**
     * 每次匹配到一个结果后就会触发的回调
     * @param current 当前匹配到的结果
     * @param list 之前匹配到的结果
     * @returns 如果返回 true，则将结果添加到返回结果中，否则不添加
     */
    callback?: (current: CommentMatch, list: CommentMatch[]) => boolean;

}

export interface ICommentParserConfig {
    /**
     * 代码的语言，如：JavaScript, TypeScript, Python 等
     */
    language?: string;
    /**
     * 需要解析的注释类型，如果不指定，则会根据语言类型自动选择
     */
    filter?: CommentType[];
    /**
     * 要解析的代码字符串
     */
    content: string;
    /**
     * 是否需要返回注释的位置信息
     */
    needPos?: boolean;
    /**
     * 自定义正则匹配
     */
    regExp?: IRegExp[];
    /**
    * 是否美化注释内容
    */
    beautifyOutput?: boolean;
    /**
     * 连行的单行注释合并成一条输出
     */
    mergeSingleLine?: boolean;
}

export interface CommentMatchPos {
    startLine?: number;
    endLine?: number;
    startColumn?: number;
    endColumn?: number;
}
export interface CommentMatch extends CommentMatchPos {
    match: string;
    content?: string;
    type?: CommentType;
    regExpSource?: string;
}

type CommentExtraType = Pick<CommentMatch, 'type' | 'regExpSource'>

// 获取注释正则匹配
const getCommentTypeList = (config: ICommentParserConfig) => {
    const { language, filter } = config;
    let expList: CommentType[] = [];
    if (filter) {
        filter.forEach((item) => {
            if (CommentRegExpMap?.[item]) {
                expList.push(item)
            }
        })
    } else if (language) {
        let commentTypeList = languageCommentTypeMap?.[language.toLocaleLowerCase() as keyof typeof languageCommentTypeMap] || DEFAULTCOMMENTRE
        expList.push(...commentTypeList)

    } else {
        expList.push(...DEFAULTCOMMENTRE)
    }
    return expList;
}


const findAllMatches = (content: string, regex: IRegExp, config: ICommentParserConfig, extra?: CommentExtraType) => {
    let match;
    let matches = [];


    const { isSingleLine = false, regExp, callback } = regex;
    const { needPos = true, beautifyOutput = false, mergeSingleLine } = config

    let prevMatch: (CommentMatch & CommentExtraType) | null = null;

    while ((match = regExp.exec(content)) !== null) {
        const needStore = mergeSingleLine && isSingleLine
        const _content = beautifyOutput ? beautify(match[1], extra?.type) : match[1]
        const pos = (needPos || needStore) ? getPosDetail(content, match[0], match.index, isSingleLine) : null

        const current: CommentMatch = {
            match: match[0],
            content: _content,
            ...(extra || {}),
            ...(pos || {})
        }

        if (callback && !callback(current, matches)) {
            continue;
        }

        if (!needStore) {
            matches.push(current);
            continue
        }

        if (prevMatch
            && (prevMatch?.type === extra?.type || prevMatch?.regExpSource === extra?.regExpSource)
            && current?.startLine !== undefined && prevMatch?.endLine !== undefined
            && current.startLine === prevMatch?.endLine + 1
        ) {
            // update Last single match
            current.startLine = prevMatch?.startLine
            current.startColumn = prevMatch?.startColumn
            current.match = getContentFromPos(content, current)
            current.content = prevMatch.content + '/n' + current.content

            matches[matches.length - 1] = current
        } else {
            matches.push(current);
        }

        prevMatch = { ...current, ...extra };
    }
    return matches;
}

export const parse = (config: ICommentParserConfig) => {
    const { content, regExp = [] } = config
    const commentTypeList = getCommentTypeList(config)

    const matchs = regExp.reduce((list, regex) => {
        // 正则校验
        if (!(regex.regExp instanceof RegExp)) {
            return list;
        }
        return [...list, ...findAllMatches(content, regex, config, { regExpSource: regex.regExp.source })]
    }, [] as CommentMatch[])

    return commentTypeList.reduce((list, type) => {
        let regExp = CommentRegExpMap[type];
        if (!regExp) {
            return list;
        }
        return [...list, ...findAllMatches(content, regExp, config, { type })]
    }, matchs)
}
