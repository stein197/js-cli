const CHAR_QUOTE = "\"";
const CHAR_EQUAL = "=";
const DASH_SINGLE = "-";
const DASH_DOUBLE = "--";
const REGEX_DASH_START = /^-+/;

export function parse<T extends string>(args: string | string[]): ArgsInfo<T> {
	const argsArray = (Array.isArray(args) ? args : split(args)).reduce(reduce, []);
	const result: ArgsInfo<T> = {
		params: [],
		opts: {}
	};
	let wasDoubleDash = false;
	let prevArg = "";
	for (const arg of argsArray) {
		if (arg === DASH_DOUBLE) 
			wasDoubleDash = true;
		else if (wasDoubleDash)
			result.params.push(arg);
		else if (arg.startsWith(DASH_SINGLE))
			result.opts[arg.replace(REGEX_DASH_START, "") as T] = true;
		else if (!arg.startsWith(DASH_SINGLE) && prevArg.startsWith(DASH_SINGLE))
			result.opts[prevArg.replace(REGEX_DASH_START, "") as T] = arg;
		else
			result.params.push(arg);
		prevArg = arg;
	}
	return result;
}

function split(args: string): string[] {
	const result: string[] = [];
	let isInsideQuotes = false;
	let curArg = "";
	let prevChar = "";
	for (const char of args) {
		switch (char) {
			case " ":
			case "\t":
				if (isInsideQuotes) {
					curArg += char;
					continue;
				}
				if (curArg) {
					result.push(curArg);
					curArg = "";
				}
				break;
			case "\"":
				curArg += char;
				if (prevChar !== "\\")
					isInsideQuotes = !isInsideQuotes;
				break;
			case "\\":
				if (prevChar === "\\")
					curArg += char;
				break;
			default:
				curArg += char;
		}
		prevChar = char;
	}
	if (curArg)
		result.push(curArg)
	return result;
}

function reduce(prev: string[], cur: string): string[] {
	if (cur.startsWith(DASH_SINGLE)) {
		const isDoubleDash = cur.startsWith(DASH_DOUBLE);
		const [key, ...values] = cur.split(CHAR_EQUAL);
		const value = unquoteString(values.join(CHAR_EQUAL));
		if (isDoubleDash) {
			prev.push(key);
			if (value)
				prev.push(value);
		} else {
			const [firstOpt, ...restOpts] = key.replace(DASH_SINGLE, "").split("").map(char => DASH_SINGLE + char);
			prev.push(firstOpt);
			if (value)
				prev.push(value);
			prev.push(...restOpts);
		}
	} else {
		prev.push(cur);
	}
	return prev;
}

function unquoteString(data: string): string {
	return data.startsWith(CHAR_QUOTE) && data.endsWith(CHAR_QUOTE) ? data.slice(1, -1) : data;
}

type ArgsInfo<T extends string> = {
	params: string[];
	opts: {
		[K in T]?: true | string;
	};
}
