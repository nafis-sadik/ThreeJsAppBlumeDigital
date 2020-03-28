import test from "ava";
import { CopyMaterial } from "../..";

test("can be created", t => {

	const object = new CopyMaterial();

	t.truthy(object);

});
