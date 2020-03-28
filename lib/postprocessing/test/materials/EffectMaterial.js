import test from "ava";
import { EffectMaterial } from "../..";

test("can be created", t => {

	const object = new EffectMaterial(new Map(), null, null);

	t.truthy(object);

});
