const CHAR_QUOTE = "\"";
const CHAR_EQUAL = "=";
const DASH_SINGLE = "-";
const DASH_DOUBLE = "--";
const REGEX_DASH_START = /^-+/;

/**
 * Parse the given string / array of strings as an arguments list into a structure of arguments and options. The
 * function parses the data in the following way:
 * - If it's a string without leading dashes, then it's considered as an argument (i.e. "param1", "param2")
 * - If it's a string with a single leading dash, then it's considered as a shorthand option (i.e. "-abc" as a "-a",
 *   "-b" and "-c")
 * - If it's a string with a double leading dash, then it's considered as a single option with optional value that
 *   goes after the option (i.e. "--user", "--user name", "--user=name")
 * - If it's a "--" string, then all next strings are considered as arguments
 * @param args Arguments to parse.
 * @returns Parsed arguments.
 * @example
 * Parsing a string
 * ```ts
 * const data = parse("abc -d val1 -e=val2 -fg val3 --opt1 --opt2 val2 --opt3=val3 -- --opt4");
 * data == {
 * 	args: ["abc", "val3", "--opt4"],
 * 	opts: {d: "val1", e: "val2", f: true, g: true, opt1: true, opt2: "val2", opt3: "val3"}
 * }
 * ```
 * @example
 * Parsing an array
 * ```ts
 * const data = parse(["abc", "-d", "val1", "-e=val2", "-fg", "val3", "--opt1", "--opt2", "val2", "--opt3=val3", "--", "--opt4"]);
 * data == {
 * 	args: ["abc", "val3", "--opt4"],
 * 	opts: {d: "val1", e: "val2", f: true, g: true, opt1: true, opt2: "val2", opt3: "val3"}
 * }
 * ```
 * @example
 * Using generic type inference
 * ```ts
 * const data = parse<"opt1" | "opt2">("...");
 * data.opts; // It could have "opt1" and "opt2" properties
 * ```
 */
export function parse<T extends string>(args: string | string[]): ArgsInfo<T> {
	const argsArray = (Array.isArray(args) ? args : split(args)).reduce(reduce, []);
	const result: ArgsInfo<T> = {
		args: [],
		opts: {}
	};
	let wasDoubleDash = false;
	let prevArg = "";
	for (const arg of argsArray) {
		if (arg === DASH_DOUBLE) 
			wasDoubleDash = true;
		else if (wasDoubleDash)
			result.args.push(arg);
		else if (arg.startsWith(DASH_SINGLE))
			result.opts[arg.replace(REGEX_DASH_START, "") as T] = true;
		else if (!arg.startsWith(DASH_SINGLE) && prevArg.startsWith(DASH_SINGLE))
			result.opts[prevArg.replace(REGEX_DASH_START, "") as T] = arg;
		else
			result.args.push(arg);
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

	/**
	 * An array of positional arguments.
	 */
	args: string[];

	/**
	 * A map of options.
	 */
	opts: {
		[K in T]?: true | string;
	};
}
