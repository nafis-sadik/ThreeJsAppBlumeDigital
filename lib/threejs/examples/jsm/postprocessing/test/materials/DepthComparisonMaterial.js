import test from "ava";
import { DepthComparisonMaterial } from "../..";

test("can be created", t => {

	const object = new DepthComparisonMaterial();

	t.truthy(object);

});
