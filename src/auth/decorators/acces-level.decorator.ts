import { SetMetadata } from "@nestjs/common";
import { ACCES_LEVEL_KEY } from "../../constants/key-decorators";
import { ACCES_LEVEL } from "../../constants/roles";

export const AccessLevel = (level:  keyof typeof ACCES_LEVEL) => SetMetadata(ACCES_LEVEL_KEY, level);