import { IRegExp } from "./parse"

/**
 * An enum representing different types of comments.
 */
export enum CommentType {
    /**
     * Single line comment. //
     */
    singleLineComment,
    /**
     * block comment. /* *\/ 
     */
    blockComment,
    /**
     * Hash comment. #
     */
    hashComment,
    /**
     * XML comment. <!-- -->
     */
    xmlComment,
    /**
     * Documentation comment.  /** *\/
     */
    docComment,
    /**
     * Begin and end comment. begin= ... end=
     */
    beginAndEndComment,

    /**
     *  Three same quotation marks comment. '''...''',"""..."""
     */
    tripleQuotationComment,

    /**
     * Three slash marks comment. /// 
     */
    tripleSlashComment


}


export const DEFAULTCOMMENTRE = [CommentType.singleLineComment, CommentType.blockComment, CommentType.docComment]


export const CommentRegExpMap: Record<CommentType, IRegExp> = {
    [CommentType.singleLineComment]: { regExp: /\/\/(.*$)/gm, isSingleLine: true },
    [CommentType.blockComment]: { regExp: /\/\*([\s\S]*?)\*\//g, isSingleLine: false },
    [CommentType.hashComment]: { regExp: /#(.*$)/gm, isSingleLine: true },
    [CommentType.docComment]: { regExp: /\/\*\*([\s\S]*?)\*\//gm, isSingleLine: false },
    [CommentType.beginAndEndComment]: { regExp: /begin=(.*)end=/gm, isSingleLine: false },
    [CommentType.xmlComment]: { regExp: /<!--([\s\S]*?)-->/gm, isSingleLine: false },
    [CommentType.tripleQuotationComment]: {
        regExp: /\'\'\'([\s\S]*?)\'\'\'|\"\"\"([\s\S]*?)\"\"\"/gm, isSingleLine: false,
    },
    [CommentType.tripleSlashComment]: { regExp: /\/\/\/(.*$)/gm, isSingleLine: true }

}

export const languageCommentTypeMap =
{
    "python": [CommentType.hashComment, CommentType.tripleQuotationComment],
    "bash": [CommentType.hashComment],
    "r": [CommentType.hashComment],
    "c": [CommentType.blockComment],
    "scala": [CommentType.singleLineComment, CommentType.blockComment, CommentType.docComment],
    "rust": [CommentType.singleLineComment, CommentType.blockComment, CommentType.docComment],
    "ruby": [CommentType.singleLineComment, CommentType.beginAndEndComment],
    "go": [CommentType.singleLineComment, CommentType.blockComment],
    "objective-c": [CommentType.singleLineComment, CommentType.blockComment],
    "xml": [CommentType.xmlComment]
}
