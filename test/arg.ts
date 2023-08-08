import * as assert from "node:assert";
import * as arg from "../src/arg";

describe("arg.parse()", () => {
	it("\"\" == []", () => {
		const expected = {args: [], opts: {}};
		assert.deepStrictEqual(arg.parse(""), expected);
		assert.deepStrictEqual(arg.parse([]), expected);
	});
	it("\"a b c\" == [\"a\", \"b\", \"c\"]", () => {
		const expected = {args: ["a", "b", "c"], opts: {}};
		assert.deepStrictEqual(arg.parse("a b c"), expected);
		assert.deepStrictEqual(arg.parse(["a", "b", "c"]), expected);
	});
	it("\"a\\\"b\" == [\"a\\\"b\"]", () => {
		const expected = {args: ["a\"b"], opts: {}};
		assert.deepStrictEqual(arg.parse("\"a\\\"b\""), expected);
		assert.deepStrictEqual(arg.parse(["\"a\\\"b\""]), expected);
	});
	it("\"a\\\\\\\\b\" == [\"a\\\\b\"]", () => {
		const expected = {args: ["a\\\\b"], opts: {}};
		assert.deepStrictEqual(arg.parse("\"a\\\\\\\\b\""), expected);
		assert.deepStrictEqual(arg.parse(["\"a\\\\\\\\b\""]), expected);
	});
	it("\"-abc\" == {a: true, b: true, c: true}", () => {
		const expected = {args: [], opts: {a: true, b: true, c: true}};
		assert.deepStrictEqual(arg.parse("-abc"), expected);
		assert.deepStrictEqual(arg.parse(["-abc"]), expected);
	});
	it("\"-a -b -c\" == {a: true, b: true, c: true}", () => {
		const expected = {args: [], opts: {a: true, b: true, c: true}};
		assert.deepStrictEqual(arg.parse("-a -b -c"), expected);
		assert.deepStrictEqual(arg.parse(["-a", "-b", "-c"]), expected);
	});
	it("\"-abc string\" == {a: true, b: true, c: true} & [\"string\"]", () => {
		const expected = {args: ["string"], opts: {a: true, b: true, c: true}};
		assert.deepStrictEqual(arg.parse("-abc string"), expected);
		assert.deepStrictEqual(arg.parse(["-abc", "string"]), expected);
	});
	it("\"string -abc\" == {a: true, b: true, c: true} & [\"string\"]", () => {
		const expected = {args: ["string"], opts: {a: true, b: true, c: true}};
		assert.deepStrictEqual(arg.parse("string -abc"), expected);
		assert.deepStrictEqual(arg.parse(["string", "-abc"]), expected);
	});
	it("\"-a val1\" == {a: \"val1\"}", () => {
		const expected = {args: [], opts: {a: "val1"}};
		assert.deepStrictEqual(arg.parse("-a val1"), expected);
		assert.deepStrictEqual(arg.parse(["-a", "val1"]), expected);
	});
	it("\"-a val1 -b val2\" == {a: \"val1\", b: \"val2\"}", () => {
		const expected = {args: [], opts: {a: "val1", b: "val2"}};
		assert.deepStrictEqual(arg.parse("-a val1 -b val2"), expected);
		assert.deepStrictEqual(arg.parse(["-a", "val1", "-b", "val2"]), expected);
	});
	it("\"-a=val1 -b=val2\" == {a: \"val1\", b: \"val2\"}", () => {
		const expected = {args: [], opts: {a: "val1", b: "val2"}};
		assert.deepStrictEqual(arg.parse("-a=val1 -b=val2"), expected);
		assert.deepStrictEqual(arg.parse(["-a=val1", "-b=val2"]), expected);
	});
	it("\"-a=\" == {a: \"\"}", () => {
		const expected = {args: [], opts: {a: ""}};
		assert.deepStrictEqual(arg.parse("-a="), expected);
		assert.deepStrictEqual(arg.parse(["-a="]), expected);
	});
	it("\"-a= string\" == {a: \"\"} & [\"string\"]", () => {
		const expected = {args: ["string"], opts: {a: ""}};
		assert.deepStrictEqual(arg.parse("-a= string"), expected);
		assert.deepStrictEqual(arg.parse(["-a=", "string"]), expected);
	});
	it("\"-a=\"a b c\"\" == {a: \"a b c\"}", () => {
		const expected = {args: [], opts: {a: "a b c"}};
		assert.deepStrictEqual(arg.parse("-a=\"a b c\""), expected);
		assert.deepStrictEqual(arg.parse(["-a=\"a b c\""]), expected);
	});
	it("\"-a \"a b c\"\" == {a: \"a b c\"}", () => {
		const expected = {args: [], opts: {a: "a b c"}};
		assert.deepStrictEqual(arg.parse("-a \"a b c\""), expected);
		assert.deepStrictEqual(arg.parse(["-a", "a b c"]), expected);
	});
	it("\"-a=\"\"\" == {a: \"\"}", () => {
		const expected = {args: [], opts: {a: ""}};
		assert.deepStrictEqual(arg.parse("-a=\"\""), expected);
		assert.deepStrictEqual(arg.parse(["-a=\"\""]), expected);
	});
	it("\"-a \"\"\" == {a: \"\"}", () => {
		const expected = {args: [], opts: {a: ""}};
		assert.deepStrictEqual(arg.parse("-a \"\""), expected);
		assert.deepStrictEqual(arg.parse(["-a", "\"\""]), expected);
	});
	it("\"--abc --def\" == {abc: true, def: true}", () => {
		const expected = {args: [], opts: {abc: true, def: true}};
		assert.deepStrictEqual(arg.parse("--abc --def"), expected);
		assert.deepStrictEqual(arg.parse(["--abc", "--def"]), expected);
	});
	it("\"string --abc\" == {abc: true} & [\"string\"]", () => {
		const expected = {args: ["string"], opts: {abc: true}};
		assert.deepStrictEqual(arg.parse("string --abc"), expected);
		assert.deepStrictEqual(arg.parse(["string", "--abc"]), expected);
	});
	it("\"--abc val1\" == {abc: \"val1\"}", () => {
		const expected = {args: [], opts: {abc: "val1"}};
		assert.deepStrictEqual(arg.parse("--abc val1"), expected);
		assert.deepStrictEqual(arg.parse(["--abc", "val1"]), expected);
	});
	it("\"--abc=val1\" == {abc: \"val1\"}", () => {
		const expected = {args: [], opts: {abc: "val1"}};
		assert.deepStrictEqual(arg.parse("--abc=val1"), expected);
		assert.deepStrictEqual(arg.parse(["--abc=val1"]), expected);
	});
	it("\"--abc val1 --def val2\" == {abc: \"val1\", def: \"val2\"}", () => {
		const expected = {args: [], opts: {abc: "val1", def: "val2"}};
		assert.deepStrictEqual(arg.parse("--abc val1 --def val2"), expected);
		assert.deepStrictEqual(arg.parse(["--abc", "val1", "--def", "val2"]), expected);
	});
	it("\"--abc=val1 --def=val2\" == {abc: \"val1\", def: \"val2\"}", () => {
		const expected = {args: [], opts: {abc: "val1", def: "val2"}};
		assert.deepStrictEqual(arg.parse("--abc=val1 --def=val2"), expected);
		assert.deepStrictEqual(arg.parse(["--abc=val1", "--def=val2"]), expected);
	});
	it("\"--abc=\" == {abc: \"\"}", () => {
		const expected = {args: [], opts: {abc: ""}};
		assert.deepStrictEqual(arg.parse("--abc="), expected);
		assert.deepStrictEqual(arg.parse(["--abc="]), expected);
	});
	it("\"--abc= string\" == {abc: \"\"} & [\"string\"]", () => {
		const expected = {args: ["string"], opts: {abc: ""}};
		assert.deepStrictEqual(arg.parse("--abc= string"), expected);
		assert.deepStrictEqual(arg.parse(["--abc=", "string"]), expected);
	});
	it("\"--abc=\"a b c\"\" == {abc: \"a b c\"}", () => {
		const expected = {args: [], opts: {abc: "a b c"}};
		assert.deepStrictEqual(arg.parse("--abc=\"a b c\""), expected);
		assert.deepStrictEqual(arg.parse(["--abc=\"a b c\""]), expected);
	});
	it("\"--abc \"a b c\"\" == {abc: \"a b c\"}", () => {
		const expected = {args: [], opts: {abc: "a b c"}};
		assert.deepStrictEqual(arg.parse("--abc \"a b c\""), expected);
		assert.deepStrictEqual(arg.parse(["--abc", "a b c"]), expected);
	});
	it("\"--abc=\"\"\" == {abc: \"\"}", () => {
		const expected = {args: [], opts: {abc: ""}};
		assert.deepStrictEqual(arg.parse("--abc=\"\""), expected);
		assert.deepStrictEqual(arg.parse(["--abc=\"\""]), expected);
	});
	it("\"--abc \"\"\" == {abc: \"\"}", () => {
		const expected = {args: [], opts: {abc: ""}};
		assert.deepStrictEqual(arg.parse("--abc \"\""), expected);
		assert.deepStrictEqual(arg.parse(["--abc", ""]), expected);
	});
	it("\"-- --abc\" == [\"--abc\"]", () => {
		const expected = {args: ["--abc"], opts: {}};
		assert.deepStrictEqual(arg.parse("-- --abc"), expected);
		assert.deepStrictEqual(arg.parse(["--", "--abc"]), expected);
	});
	it("\"--abc \"\\\"\\\"\"\" == {abc: \"\\\"\\\"\"}", () => {
		const expected = {args: [], opts: {abc: "\"\""}};
		assert.deepStrictEqual(arg.parse("--abc \"\\\"\\\"\""), expected);
		assert.deepStrictEqual(arg.parse(["--abc", "\"\""]), expected);
	});
	it("Should correctly parse complex example", () => {
		const expected = {
			args: ["abc", "def", "--opt5"],
			opts: {
				d: "val1",
				e: "val2",
				f: true,
				g: true,
				opt1: true,
				opt2: "val2",
				opt3: "val3",
				opt4: "a b \" c"
			}
		};
		assert.deepStrictEqual(arg.parse("abc -d val1 -e=val2 -fg def --opt1 --opt2 val2 --opt3=val3 --opt4 \"a b \\\" c\" -- --opt5"), expected);
		assert.deepStrictEqual(arg.parse(["abc", "-d", "val1", "-e=val2", "-fg", "def", "--opt1", "--opt2", "val2", "--opt3=val3", "--opt4=\"a b \\\" c\"", "--", "--opt5"]), expected);
	});
	describe("Options", () => {
		describe("no", () => {
			it("no: true", () => {
				const expected = {args: ["val"], opts: {abc: false}};
				assert.deepStrictEqual(arg.parse("--no-abc val", {no: true}), expected);
				assert.deepStrictEqual(arg.parse(["--no-abc", "val"], {no: true}), expected);
				assert.deepStrictEqual(arg.parse("--no-abc=val", {no: true}), expected);
				assert.deepStrictEqual(arg.parse(["--no-abc=val"], {no: true}), expected);
			});
			it("no: false", () => {
				const expected = {args: [], opts: {"no-abc": "val"}};
				assert.deepStrictEqual(arg.parse("--no-abc val", {no: false}), expected);
				assert.deepStrictEqual(arg.parse(["--no-abc", "val"], {no: false}), expected);
				assert.deepStrictEqual(arg.parse("--no-abc=val", {no: false}), expected);
				assert.deepStrictEqual(arg.parse(["--no-abc=val"], {no: false}), expected);
			});
		});
	});
});
