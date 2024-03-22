import { CommentRegExpMap, CommentType, DEFAULTCOMMENTRE, languageCommentTypeMap } from "./const";


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
}

export interface CommentMatch {
    match: string;
    startLine?: number;
    endLine?: number;
    startColumn?: number;
    endColumn?: number;
    content?: string;
    type?: CommentType;
    regExpSource?: string;
}


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


const findAllMatches = (content: string, regex: IRegExp, config: ICommentParserConfig, extra?: Pick<CommentMatch, 'type' | 'regExpSource'>) => {
    let match;
    let matches = [];

    const { isSingleLine, regExp, callback } = regex;
    const { needPos = true } = config

    while ((match = regExp.exec(content)) !== null) {
        if (!needPos) {
            const current = {
                match: match[0],
                content: match?.[1],
                ...(extra || {})
            }

            if (!callback || callback(current, matches)) {
                matches.push(current);
            }
            continue;
        }

        // 计算行数和列数
        const lines = content.substring(0, match.index).split('\n');
        const lineNumber = lines.length;

        let startLine = lineNumber - 1;
        let startColumn = lines[lines.length - 1].length;

        let endLine, endColumn;

        if (isSingleLine) {
            endLine = startLine;
            endColumn = startColumn + match[0].length - 1;
        } else {
            const matchContentLines = match[0].split('\n');
            endLine = startLine + matchContentLines.length - 1;
            endColumn = matchContentLines[matchContentLines.length - 1].length;
        }

        const current = {
            match: match[0],
            startLine,
            endLine,
            startColumn,
            endColumn,
            content: match?.[1],
            ...(extra || {})
        }

        if (callback && !callback(current, matches)) {
            continue;
        }

        matches.push(current);
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
