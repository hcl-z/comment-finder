import { parse, ICommentParserConfig, CommentType } from '../index';

describe('commentParser', () => {
  describe('parse', () => {
    it('should return an empty array when no comments are found', () => {
      const config: ICommentParserConfig = {
        content: 'This is a line of code without comments',
      };

      const result = parse(config);

      expect(result).toEqual([]);
    });

    it('should return a single comment match', () => {
      const config: ICommentParserConfig = {
        content: '// This is a single-line comment',
        filter: [CommentType.singleLineComment]
      };

      const result = parse(config);

      expect(result).toEqual([
        {
          match: '// This is a single-line comment',
          startLine: 0,
          endLine: 0,
          startColumn: 0,
          endColumn: 31,
          content: ' This is a single-line comment',
          type: 0
        }
      ]);
    });

    it('should return multiple comment matches', () => {
      const config: ICommentParserConfig = {
        content: `
         /* This is a
         multi-line comment */
        `
      };

      const result = parse(config);

      expect(result).toEqual([
        {
          match: '/* This is a\n         multi-line comment */',
          startLine: 1,
          endLine: 2,
          startColumn: 9,
          endColumn: 30,
          content: ' This is a\n         multi-line comment ',
          type: 1
        }
      ]);
    });
  });
});