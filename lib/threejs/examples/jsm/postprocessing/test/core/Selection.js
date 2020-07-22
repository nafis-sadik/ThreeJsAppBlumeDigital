import test from "ava";
import { Selection } from "../..";

test("can be instantiated", t => {

	const object = new Selection();

	t.truthy(object);

});
