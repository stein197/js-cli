import * as assert from "node:assert";
import * as arg from "../src/arg";

describe("arg.parse()", () => {
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
