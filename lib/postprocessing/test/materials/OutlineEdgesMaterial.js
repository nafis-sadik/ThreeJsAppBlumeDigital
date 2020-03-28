import test from "ava";
import { OutlineEdgesMaterial } from "../..";

test("can be created", t => {

	const object = new OutlineEdgesMaterial();

	t.truthy(object);

});
