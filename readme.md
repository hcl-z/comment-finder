# comment-finder
[![Build Status](https://travis-ci.org/hcl-z/comment-finder.svg?branch=master)](https://travis-ci.org/hcl-z/comment-finder) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/hcl-z/comment-finder/issues) [![HitCount](http://hits.dwyl.io/hcl-z/comment-finder.svg)](http://hits.dwyl.io/hcl-z/comment-finder) [![npm](https://img.shields.io/npm/v/comment-finder.svg)](https://www.npmjs.com/package/comment-finder) [![npm](https://img.shields.io/npm/l/comment-finder.svg)](https://www.npmjs.com/package/comment-finder)

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

## License

MIT © [hcl-z](https://github.com/hcl-z)
