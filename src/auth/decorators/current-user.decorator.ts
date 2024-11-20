import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { getCurrentUserByContext } from "../../constants/getUserbyContext.constants";

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) =>
        getCurrentUserByContext(ctx)
)