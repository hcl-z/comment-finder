import { CommentType } from "./const";
import { CommentMatchPos } from "./parse";

function hasUndefinedValue(obj: Record<string, any>) {
    return Object.values(obj).some(value => value === undefined);
}

export const getPosDetail = (content: string, match: string, index: number, isSingleLine: boolean) => {
    // 计算行数和列数
    const lines = content.substring(0, index).split('\n');
    const lineNumber = lines.length;

    let startLine = lineNumber - 1;
    let startColumn = lines[lines.length - 1].length;

    let endLine, endColumn;

    if (isSingleLine) {
        endLine = startLine;
        endColumn = startColumn + match.length - 1;
    } else {
        const matchContentLines = match.split('\n');
        endLine = startLine + matchContentLines.length - 1;
        endColumn = matchContentLines[matchContentLines.length - 1].length;
    }

    return {
        startLine,
        startColumn,
        endLine,
        endColumn
    }
}

// content 格式化输出
export const beautify = (content: string, type?: CommentType) => {
    const lines = content.split('\n');

    const newLines = lines.reduce((lines, line) => {
        const trimedLine = line.trim();
        if (!trimedLine) {
            return lines
        }
        if (type === CommentType.docComment && trimedLine.startsWith('*')) {
            return [...lines, trimedLine.replace(/^\*\s+/, '')]
        }
        return [...lines, trimedLine]
    }, [] as string[])

    return newLines.join('\n')
}


export const getContentFromPos = (content: string, pos: CommentMatchPos) => {
    if (hasUndefinedValue(pos)) {
        return ''
    }
    const lines = content.split('\n');
    const { startLine, startColumn, endLine, endColumn } = pos
    return lines.slice(startLine, endLine! + 1).map(line => line.substring(startColumn!, endColumn! + 1)).join('\n')
}