const CHAR_QUOTE = "\"";
const CHAR_EQUAL = "=";
const DASH_SINGLE = "-";
const DASH_DOUBLE = "--";
const REGEX_DASH_START = /^-+/;
const PREFIX_NO = "--no-";
const OPTIONS_DEFAULT: Options = {
	no: true
};

/**
 * Parse the given string / array of strings as an arguments list into a structure of arguments and options. The
 * function parses the data in the following way:
 * - If it's a string without leading dashes and the previous argument doesn't start with a dash, then it's considered
 *   as an argument (i.e. "arg1", "arg2" is `["arg1", "arg2"]`)
 * - If it's a string with a single leading dash, then it's considered as a flag array (i.e. "-abc" is `{a: true,
 *   b: true, c: true}`).
 * - If it's a single char with a single leading dash, then it's considered as a flag. If the next argument doesn't
 *   start with a dash, then the next argument is a value of the flag (i.e. "-a" is a `{a: true}`, "-a b" and "-a=b" is
 *   `{a: "b"}`)
 * - If it's a string with a double leading dash, then it's considered as a single option with optional value that
 *   goes after the option (i.e. "--user" is `{user: true}`, "--user name" is `{user: "name"}`, "--user=name" is
 *   `{user: "name"}`)
 * - If it's a "--" string, then all next strings are considered as arguments
 * @param args Arguments to parse.
 * @returns Parsed arguments.
 * @example
 * Parsing a string
 * ```ts
 * const data = parse("abc -d val1 -e=val2 -fg def --opt1 --opt2 val2 --opt3=val3 --opt4 \"a b c\" -- --opt5");
 * data == {
 * 	args: ["abc", "def", "--opt5"],
 * 	opts: {d: "val1", e: "val2", f: true, g: true, opt1: true, opt2: "val2", opt3: "val3", opt4: "a b c"}
 * }
 * ```
 * @example
 * Parsing an array
 * ```ts
 * const data = parse(["abc", "-d", "val1", "-e=val2", "-fg", "def", "--opt1", "--opt2", "val2", "--opt3=val3", "--opt4=\"a b c\"", "--", "--opt5"]);
 * data == {
 * 	args: ["abc", "def", "--opt5"],
 * 	opts: {d: "val1", e: "val2", f: true, g: true, opt1: true, opt2: "val2", opt3: "val3", opt4: "a b c"}
 * }
 * ```
 * @example
 * Using generic type inference
 * ```ts
 * const data = parse<"opt1" | "opt2">("...");
 * data.opts; // It could have "opt1" and "opt2" properties
 * ```
 */
export function parse<T extends string>(args: string | string[], options: Partial<Options> = OPTIONS_DEFAULT): ArgsInfo<T> {
	options = options === OPTIONS_DEFAULT ? OPTIONS_DEFAULT : {...OPTIONS_DEFAULT, ...options};
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
		else if (options.no && arg.startsWith(PREFIX_NO))
			result.opts[arg.replace(PREFIX_NO, "") as T] = false;
		else if (arg.startsWith(DASH_DOUBLE))
			result.opts[arg.replace(REGEX_DASH_START, "") as T] = true;
		else if (arg.startsWith(DASH_SINGLE))
			arg.replace(REGEX_DASH_START, "").split("").forEach(char => result.opts[char as T] = true);
		else if (prevArg.startsWith(DASH_DOUBLE) && (!options.no || !prevArg.startsWith(PREFIX_NO)) || prevArg.startsWith(DASH_SINGLE) && prevArg.length === 2)
			result.opts[prevArg.replace(REGEX_DASH_START, "") as T] = arg;
		else
			result.args.push(arg);
		prevArg = arg;
	}
	return result;
}

function split(args: string): string[] {
	const result: string[] = [];
	let isQuotes = false;
	let isEscape = false;
	let curArg = "";
	let prevChar = "";
	for (const char of args) {
		switch (char) {
			case " ":
			case "\t":
			case "\n":
			case "\r":
				if (isQuotes || isEscape) {
					curArg += char;
					continue;
				}
				if (curArg) {
					result.push(curArg);
					curArg = "";
				}
				isEscape = false;
				break;
			case "\"":
				if (isEscape)
					curArg += char;
				else
					isQuotes = !isQuotes;
				isEscape = false;
				break;
			case "\\":
				if (isEscape)
					curArg += char;
				isEscape = !isEscape;
				break;
			default:
				curArg += char;
				isEscape = false;
		}
		prevChar = char;
	}
	if (curArg)
		result.push(curArg);
	return result;
}

function reduce(prev: string[], cur: string): string[] {
	if (cur.startsWith(DASH_SINGLE)) {
		const [key, ...values] = cur.split(CHAR_EQUAL);
		const value = unquoteString(values.join(CHAR_EQUAL));
		prev.push(key);
		if (values.length)
			prev.push(value);
	} else {
		prev.push(cur);
	}
	return prev;
}

function unquoteString(string: string): string {
	return string.startsWith(CHAR_QUOTE) && string.endsWith(CHAR_QUOTE) ? string.slice(1, -1) : string;
}

type Options = {

	/**
	 * Consider options that start with "--no-" prefix as flags with `false` value.
	 * @defaultValue `true`.
	 * @example
	 * ```ts
	 * parse("--no-data", {no: false}).opts == {"no-data": true}
	 * parse("--no-data", {no: true}).opts == {data: false}
	 * ```
	 */
	no: boolean;
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
		[K in T]?: boolean | string;
	};
}
