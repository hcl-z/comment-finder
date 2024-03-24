# comment-finder
[![npm Package](https://img.shields.io/npm/v/comment-finder.svg?style=flat-square)](https://www.npmjs.org/package/comment-finder)
[![NPM Downloads](https://img.shields.io/npm/dm/comment-finder.svg)](https://npmjs.org/package/comment-finder)
[![Build Status](https://github.com/hcl-z/comment-finder/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/hcl-z/comment-finder/actions/npm-publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

a comment parser for code language

## Features 
- Support for Multiple Languages: While the library can automatically detect the language of the provided code snippet, you can also explicitly set the language to JavaScript, TypeScript, Python, and others.
- Custom Regular Expressions: The library allows users to define custom regular expressions for matching comments.
- Position Information: Optionally return the location of each comment within the source code.


## Install

```bash
npm install --save comment-finder
```

## Usage

```js
import { parse } from 'comment-finder'

parse({
    content:`
        // this is a log
    `,
    filter:[CommentType.singleLineComment]
})

/*
output:
[
  {
    match: '// this is a log',
    startLine: 0,
    endLine: 0,
    startColumn: 0,
    endColumn: 15,
    content: ' this is a log',
    type: 0
  }
]

*/
```

## Config
| Property | Type            | Description                                              | Optional |
| -------- | --------------- | -------------------------------------------------------- | -------- |
| content  | `string`        | 要解析的代码字符串                                       | No       |
| filter   | `CommentType[]` | 需要解析的注释类型，如果不指定，则会根据语言类型自动选择 | Yes      |
| regExp   | `IRegExp[]`     | 自定义正则匹配                                           | Yes      |
| needPos  | `boolean`       | 是否需要返回注释的位置信息                               | Yes      |
| language | `string`        | 代码的语言，如：JavaScript, TypeScript, Python 等        | Yes      |
| beautifyOutput | `boolean` | 是否美化注释内容后输出                                   | Yes     |
| mergeSingleLine | `boolean` | 是否将连行的单行注释合并成一条输出                                 | Yes     |

## License

MIT © [hcl-z](https://github.com/hcl-z)
