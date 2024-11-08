import { ExecutionContext } from "@nestjs/common";

export const getCurrentUserByContext = (ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user;