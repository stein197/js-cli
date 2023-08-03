import * as assert from "node:assert";
import * as arg from "../src/arg";

describe("arg.parse()", () => {
	it.skip("\"\" == []");
	it.skip("\"a b c\" == [\"a\", \"b\", \"c\"]");

	it.skip("\"-abc\" == {a: true, b: true, c: true}");
	it.skip("\"-a -b\" == {a: true, b: true, c: true}");
	it.skip("\"-abc string\" == {a: true, b: true, c: true} & [\"string\"]");
	it.skip("\"string -abc\" == {a: true, b: true, c: true} & [\"string\"]");
	it.skip("\"-a val1\" == {a: \"val1\"}");
	it.skip("\"-a val1 -b val2\" == {a: \"val1\", b: \"val2\"}");
	it.skip("\"-a=val1 -b=val2\" == {a: \"val1\", b: \"val2\"}");
	it.skip("\"-a=\" == {a: \"\"}");
	it.skip("\"-a= string\" == {a: \"\"} & [\"string\"]");
	it.skip("\"-a=\"a b c\"\" == {a: \"a b c\"}");
	it.skip("\"-a \"a b c\"\" == {a: \"a b c\"}");
	it.skip("\"-a=\"\"\" == {a: \"\"}");
	it.skip("\"-a \"\"\" == {a: \"\"}");

	it.skip("\"--abc --def\" == {abc: true, def: true}");
	it.skip("\"string --abc\" == {abc: true} & [\"string\"]");
	it.skip("\"--abc val1\" == {abc: \"val1\"}");
	it.skip("\"-abc val1 -def val2\" == {abc: \"val1\", def: \"val2\"}");
	it.skip("\"--abc=val1 --def=val2\" == {abc: \"val1\", def: \"val2\"}");
	it.skip("\"--abc=\" == {abc: \"\"}");
	it.skip("\"--abc= string\" == {abc: \"\"} & [\"string\"]");
	it.skip("\"--abc=\"a b c\"\" == {abc: \"a b c\"}");
	it.skip("\"--abc \"a b c\"\" == {abc: \"a b c\"}");
	it.skip("\"--abc=\"\"\" == {abc: \"\"}");
	it.skip("\"--abc \"\"\" == {abc: \"\"}");

	it.skip("\"-- --abc\" == [\"--abc\"]");
	it("Should correctly parse complex example", () => {
		const result = {
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
		assert.deepStrictEqual(arg.parse("abc -d val1 -e=val2 -fg def --opt1 --opt2 val2 --opt3=val3 --opt4 \"a b \\\" c\" -- --opt5"), result);
		assert.deepStrictEqual(arg.parse(["abc", "-d", "val1", "-e=val2", "-fg", "def", "--opt1", "--opt2", "val2", "--opt3=val3", "--opt4=\"a b \\\" c\"", "--", "--opt5"]), result);
	});
});
