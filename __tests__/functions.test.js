import { test, expect } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/gendiff.js';
import { getFileContent, getFileFormats } from '../src/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const formatterStylish = 'stylish';
const formatterPlain = 'plain';
const formatterJson = 'json';

const rightOutputStylish = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      + setting3: {
            key: value
        }
      - setting3: true
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              + wow: so much
              - wow: too much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      + baz: bars
      - baz: bas
        foo: bar
      + nest: str
      - nest: {
            key: value
        }
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        fee: 100500
        deep: {
            id: {
                number: 45
            }
        }
    }
}`;

const rightOutputPlain = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to [complex value]
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From 'too much' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

const rightOutputJson = '[{"key":"common","children":[{"key":"follow","value":false,"type":"added"},{"key":"setting1","value":"Value 1","type":"unchanged"},{"key":"setting2","value":200,"type":"removed"},{"key":"setting3","oldValue":true,"newValue":{"key":"value"},"type":"changed"},{"key":"setting4","value":"blah blah","type":"added"},{"key":"setting5","value":{"key5":"value5"},"type":"added"},{"key":"setting6","children":[{"key":"doge","children":[{"key":"wow","oldValue":"too much","newValue":"so much","type":"changed"}],"type":"parent"},{"key":"key","value":"value","type":"unchanged"},{"key":"ops","value":"vops","type":"added"}],"type":"parent"}],"type":"parent"},{"key":"group1","children":[{"key":"baz","oldValue":"bas","newValue":"bars","type":"changed"},{"key":"foo","value":"bar","type":"unchanged"},{"key":"nest","oldValue":{"key":"value"},"newValue":"str","type":"changed"}],"type":"parent"},{"key":"group2","value":{"abc":12345,"deep":{"id":45}},"type":"removed"},{"key":"group3","value":{"fee":100500,"deep":{"id":{"number":45}}},"type":"added"}]';
const rightOutputJsonForIniParser = '[{"key":"common","children":[{"key":"follow","value":false,"type":"added"},{"key":"setting1","value":"Value 1","type":"unchanged"},{"key":"setting2","value":"200","type":"removed"},{"key":"setting3","oldValue":true,"newValue":{"key":"value"},"type":"changed"},{"key":"setting4","value":"blah blah","type":"added"},{"key":"setting5","value":{"key5":"value5"},"type":"added"},{"key":"setting6","children":[{"key":"doge","children":[{"key":"wow","oldValue":"too much","newValue":"so much","type":"changed"}],"type":"parent"},{"key":"key","value":"value","type":"unchanged"},{"key":"ops","value":"vops","type":"added"}],"type":"parent"}],"type":"parent"},{"key":"group1","children":[{"key":"baz","oldValue":"bas","newValue":"bars","type":"changed"},{"key":"foo","value":"bar","type":"unchanged"},{"key":"nest","oldValue":{"key":"value"},"newValue":"str","type":"changed"}],"type":"parent"},{"key":"group2","value":{"abc":"12345","deep":{"id":"45"}},"type":"removed"},{"key":"group3","value":{"fee":"100500","deep":{"id":{"number":"45"}}},"type":"added"}]';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const getContentsAndFormats = (path1, path2) => {
  const contents = getFileContent(getFixturePath(path1), getFixturePath(path2));
  const formats = getFileFormats(getFixturePath(path1), getFixturePath(path2));
  return [contents, formats];
};

const getContentAndFormatJson = getContentsAndFormats('./before.json', './after.json');
const getContentAndFormatYaml = getContentsAndFormats('./before.yaml', './after.yaml');
const getContentAndFormatIni = getContentsAndFormats('./before.ini', './after.ini');

test('output gendiff for stylish formatter', () => {
  const outputGendiffForJson = genDiff(...getContentAndFormatJson, formatterStylish);
  expect(outputGendiffForJson).toEqual(rightOutputStylish);

  const outputGendiffForYaml = genDiff(...getContentAndFormatYaml, formatterStylish);
  expect(outputGendiffForYaml).toEqual(rightOutputStylish);

  const outputGendiffForIni = genDiff(...getContentAndFormatIni, formatterStylish);
  expect(outputGendiffForIni).toEqual(rightOutputStylish);
});

test('output gendiff for plain formatter', () => {
  const outputGendiffForJson = genDiff(...getContentAndFormatJson, formatterPlain);
  expect(outputGendiffForJson).toEqual(rightOutputPlain);

  const outputGendiffForYaml = genDiff(...getContentAndFormatYaml, formatterPlain);
  expect(outputGendiffForYaml).toEqual(rightOutputPlain);

  const outputGendiffForIni = genDiff(...getContentAndFormatIni, formatterPlain);
  expect(outputGendiffForIni).toEqual(rightOutputPlain);
});

test('output gendiff for json formatter', () => {
  const outputGendiffForJson = genDiff(...getContentAndFormatJson, formatterJson);
  expect(outputGendiffForJson).toEqual(rightOutputJson);

  const outputGendiffForYaml = genDiff(...getContentAndFormatYaml, formatterJson);
  expect(outputGendiffForYaml).toEqual(rightOutputJson);

  const outputGendiffForIni = genDiff(...getContentAndFormatIni, formatterJson);
  expect(outputGendiffForIni).toEqual(rightOutputJsonForIniParser);
});
