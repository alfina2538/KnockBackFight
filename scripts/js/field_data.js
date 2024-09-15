import { world } from "@minecraft/server";
import { FieldRanges } from "./field_point";
export class FieldData {
    static *GetEnabledPoint() {
        if (this.enabled_point.length > 0) {
            this.enabled_point = [];
        }
        for (let x = FieldRanges.XStart; x <= FieldRanges.XEnd; x++) {
            for (let z = FieldRanges.ZStart; z <= FieldRanges.ZEnd; z++) {
                for (let y = 270; y >= 240; y--) {
                    const dim = world.getDimension("overworld");
                    const block = dim.getBlock({ x: x, y: y, z: z });
                    if (block !== undefined && !block.isAir) {
                        this.enabled_point.push({ x: x, y: y + 3, z: z });
                        break;
                    }
                    yield;
                }
            }
        }
        world.sendMessage("load end");
    }
}
FieldData.enabled_point = [];
