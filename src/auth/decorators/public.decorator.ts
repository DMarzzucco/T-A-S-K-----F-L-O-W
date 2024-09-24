import { SetMetadata } from "@nestjs/common";
import { PUBLIC_KEY } from "src/constants/key-decorators";

export const PublicAcces = () => SetMetadata(PUBLIC_KEY, true);