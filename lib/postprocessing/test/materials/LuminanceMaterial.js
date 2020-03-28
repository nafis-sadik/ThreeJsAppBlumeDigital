import test from "ava";
import { LuminanceMaterial } from "../..";

test("can be created", t => {

	const object = new LuminanceMaterial();

	t.truthy(object);

});
