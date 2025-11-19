import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [TasksModule, WorkspacesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
