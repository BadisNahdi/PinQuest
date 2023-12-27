import { createParamDecorator } from "@nestjs/common";

export const User_ = createParamDecorator((data, req) => {
    return req.user;
  });