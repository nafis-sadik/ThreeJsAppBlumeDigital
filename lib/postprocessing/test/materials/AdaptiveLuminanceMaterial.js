import test from "ava";
import { AdaptiveLuminanceMaterial } from "../..";

test("can be created", t => {

	const object = new AdaptiveLuminanceMaterial();

	t.truthy(object);

});