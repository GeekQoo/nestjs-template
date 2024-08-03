import { IsOptional, IsString } from "class-validator";

export class SettingsGlobalDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    logo?: string;

    @IsString()
    @IsOptional()
    logoVertical?: string;

    @IsString()
    @IsOptional()
    beian?: string;

    @IsString()
    @IsOptional()
    policeBeian?: string;
}
