import { Module } from "@nestjs/common";
import { NetdiskService } from "./netdisk.service";
import { NetdiskController } from "./netdisk.controller";

@Module({
    imports: [],
    controllers: [NetdiskController],
    providers: [NetdiskService]
})
export class NetdiskModule {}
