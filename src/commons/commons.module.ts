import { HttpModule } from "@nestjs/common";
import { HttpService } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { AuthenticationService } from "./services/authentication-service";


@Module({
  imports: [HttpModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService, HttpModule]
})
export class CommonsModule {}
