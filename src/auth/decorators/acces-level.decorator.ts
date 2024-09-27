import { SetMetadata } from "@nestjs/common";
import { ACCES_LEVEL_KEY } from "src/constants/key-decorators";
import { ACCES_LEVEL } from "src/constants/roles";

export const AccessLevel = (level:  keyof typeof ACCES_LEVEL) => SetMetadata(ACCES_LEVEL_KEY, level);