import test from "ava";
import { DepthMaskMaterial } from "../..";

test("can be created", t => {

	const object = new DepthMaskMaterial();

	t.truthy(object);

});
