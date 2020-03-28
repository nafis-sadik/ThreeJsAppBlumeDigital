import test from "ava";
import { ColorEdgesMaterial } from "../..";

test("can be created", t => {

	const object = new ColorEdgesMaterial();

	t.truthy(object);

});
