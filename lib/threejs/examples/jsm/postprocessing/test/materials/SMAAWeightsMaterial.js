import test from "ava";
import { SMAAWeightsMaterial } from "../..";

test("can be created", t => {

	const object = new SMAAWeightsMaterial();

	t.truthy(object);

});
