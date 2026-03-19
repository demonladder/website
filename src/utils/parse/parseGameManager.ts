import { XMLParser } from 'fast-xml-parser';
import { keys } from './keys';

const xmlParser = new XMLParser({ preserveOrder: true });

type TextLeaf = { '#text': string };
type NumberLeaf = { '#text': number };

type KeyNode = { k: [TextLeaf] };
type IntegerNode = { i: [NumberLeaf] };
type RealNode = { r: [NumberLeaf] };
type StringNode = { s: [TextLeaf] };
type TrueNode = { t: [] };
type FalseNode = { f: [] };
export type DictNode = { d: (KeyNode | ValueNode)[] };

type ValueNode = IntegerNode | RealNode | StringNode | TrueNode | FalseNode | DictNode;
type NestedGmdValues = { [k: string]: string | number | boolean | NestedGmdValues | NestedGmdValues[] };

function parseData(data: ValueNode) {
    switch (Object.keys(data)[0]) {
        case 's':
            return (data as StringNode).s[0]['#text'];
        case 'i':
            return (data as IntegerNode).i[0]['#text'];
        case 'r':
            return (data as RealNode).r[0]['#text'];
        case 't':
            return true;
        case 'f':
            return false;
        case 'd':
            return parseDict((data as DictNode).d);
    }
}

function parseDict(dict: (KeyNode | ValueNode)[]) {
    const obj: NestedGmdValues = {};

    for (let i = 0; i < dict.length; i += 2) {
        let key = (dict[i] as KeyNode).k[0]['#text'];
        if (keys[key]) key = keys[key];

        const value = parseData(dict[i + 1] as ValueNode);
        if (!value) continue;
        obj[key] = value;
    }

    return obj;
}

interface GameManagerData {
    GLM_03: {
        k1: number;
        k18: number;
        k19?: number;
        k26: number;
    }[];
}

export function xmlToJson(dict: DictNode[]): GameManagerData {
    return parseDict(dict) as unknown as GameManagerData;
}

type XmlNode = { [k: string]: XmlNode[] };

export async function parseGameManager(data: Uint8Array): Promise<GameManagerData> {
    for (let i = 0; i < data.length; i++) data[i] ^= 11;

    // 2. Remove trailing null bytes
    let end = data.length;
    while (end > 0 && data[end - 1] === 0) end--;
    const trimmedData = data.slice(0, end);

    // 3. Decode base64url
    const text = new TextDecoder().decode(trimmedData);
    // @ts-expect-error - Uint8Array.fromBase64 is a newer feature missing from the types (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const bytes: Uint8Array = Uint8Array.fromBase64(text, { alphabet: 'base64url' });

    // 4. Decompress gzip
    const ds = new DecompressionStream('gzip');
    // @ts-expect-error - bytes is a TypedArray which is allowed to be passed to Response (https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#body)
    const decompressedStream = new Response(bytes).body!.pipeThrough(ds);
    const xml = await new Response(decompressedStream).text();

    // 5. Parse XML
    const elements = xmlParser.parse(xml) as XmlNode[];
    const plist = elements.at(1)?.plist;
    if (!plist) throw new GameManagerParseError('Invalid file format: missing plist element');
    const dict = plist.at(0)?.dict;
    if (!dict) throw new GameManagerParseError('Invalid file format: missing dict element');
    return xmlToJson(dict as unknown as DictNode[]);
}

export class GameManagerParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GameManagerParseError';
    }
}
