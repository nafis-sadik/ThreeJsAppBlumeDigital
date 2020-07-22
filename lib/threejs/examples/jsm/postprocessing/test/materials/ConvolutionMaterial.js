import test from "ava";
import { ConvolutionMaterial } from "../..";

test("can be created", t => {

	const object = new ConvolutionMaterial();

	t.truthy(object);

});
